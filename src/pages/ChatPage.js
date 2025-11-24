import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api'; 
import './ChatPage.css';

const fetchConversations = async () => {
  const { data } = await api.get('/messages/conversations/');
  return data;
};

const fetchUserDetails = async (userId) => {
  const { data } = await api.get(`/users/${userId}/`);
  return data;
};

const fetchChatHistory = async (userId) => {
  if (!userId) return [];
  const { data } = await api.get(`/messages/chat-history/${userId}/`);
  return data;
};

function ChatPage() {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatPartners, setChatPartners] = useState([]); 
  const [listingContext, setListingContext] = useState(null);
  
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // 1. Load Initial Conversations
  const { data: existingConversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    onSuccess: (data) => {
        console.log("API Returned Conversations:", data);
        setChatPartners(data);
        
        // REMOVED: Auto-selection logic. 
        // Now defaults to "Select a conversation" if accessed directly.
    },
    onError: (err) => {
        console.error("ChatPage: Failed to fetch conversations", err);
    }
  });

  // 2. Handle Redirect from "Chat with Vendor" button
  useEffect(() => {
    const initChat = async () => {
      // Case A: We came from a "Chat with Vendor" button
      if (location.state?.startChatWith) {
        const vendorId = location.state.startChatWith;
        
        // Handle Listing Context (if available)
        if (location.state.listingContext) {
            setListingContext(location.state.listingContext);
            setMessageInput(`Hi, I'm interested in your listing: ${location.state.listingContext.title}`);
        }

        // Check if vendor is already in our list (compare as strings)
        const existingPartner = chatPartners.find(u => String(u.id) === String(vendorId));
        
        if (existingPartner) {
          setSelectedUser(existingPartner);
        } else {
          // If not in list, fetch details and add to list
          try {
            const newPartner = await fetchUserDetails(vendorId);
            setChatPartners(prev => {
              // Prevent duplicates
              if (prev.find(u => String(u.id) === String(newPartner.id))) return prev;
              return [newPartner, ...prev];
            });
            setSelectedUser(newPartner);
          } catch (error) {
            console.error("Could not fetch vendor details", error);
          }
        }
        // Clear state so refresh doesn't re-trigger this
        window.history.replaceState({}, document.title);
      } 
    };

    // Only run if we have partners loaded OR if we are trying to start a new chat
    if (chatPartners.length > 0 || location.state?.startChatWith) {
       initChat();
    }
  }, [location.state, chatPartners]);

  // 3. Load Chat History when a user is selected
  const { data: historyMessages, isLoading: loadingHistory } = useQuery({
    queryKey: ['chatHistory', selectedUser?.id],
    queryFn: () => fetchChatHistory(selectedUser?.id),
    enabled: !!selectedUser, // Only run if a user is selected
  });

  // 4. WebSocket Setup
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem('access_token');
    const wsProtocol = BASE_URL.startsWith('https') ? 'wss' : 'ws';
    const wsHost = BASE_URL.replace(/^https?:\/\//, ''); 
    const wsUrl = `${wsProtocol}://${wsHost}/ws/chat/?token=${token}`;

    console.log("Connecting to WebSocket:", wsUrl);

    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => console.log('WebSocket Connected');

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimeMessages((prev) => [...prev, data]);
      
      // Update Sidebar logic
      const otherUserId = String(data.sender_id) === String(currentUser.id) ? data.receiver_id : data.sender_id;
      
      setChatPartners(prevPartners => {
        if (prevPartners.find(u => String(u.id) === String(otherUserId))) return prevPartners;
        
        fetchUserDetails(otherUserId).then(newUser => {
            setChatPartners(prev => {
                if (prev.find(u => String(u.id) === String(newUser.id))) return prev;
                return [newUser, ...prev];
            });
        });
        return prevPartners;
      });
    };

    newSocket.onclose = () => console.log('WebSocket Disconnected');
    
    setSocket(newSocket);
    return () => newSocket.close();
  }, [currentUser]);

  useEffect(() => {
    setRealtimeMessages([]);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historyMessages, realtimeMessages, selectedUser]);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !selectedUser) return;

    const messagePayload = {
      message: messageInput,
      receiver_id: selectedUser.id,
    };

    socket.send(JSON.stringify(messagePayload));
    setMessageInput('');
    setListingContext(null); // Clear context after first message
    
    // Force refresh conversation list to ensure persistence
    setTimeout(() => {
        queryClient.invalidateQueries(['conversations']);
    }, 1000);
  };

  // Merge Database History + Realtime Messages
  const displayMessages = [
    ...(historyMessages || []), 
    ...realtimeMessages.filter(msg => 
      (String(msg.sender_id) === String(selectedUser?.id) && String(msg.receiver_id) === String(currentUser.id)) || 
      (String(msg.sender_id) === String(currentUser.id) && String(msg.receiver_id) === String(selectedUser?.id))
    )
  ];

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Messages</h3>
        </div>
        <div className="user-list">
          {loadingConversations && chatPartners.length === 0 ? (
            <div style={{padding: 20}}>Loading...</div>
          ) : chatPartners.length === 0 ? (
            <div style={{padding: 20, color: '#777'}}>No active chats.</div>
          ) : (
            chatPartners.map(u => (
              <div 
                key={u.id} 
                className={`user-list-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="user-avatar">
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-name">{u.username}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-header">
              Chatting with {selectedUser.username}
            </div>
            
            <div className="chat-messages">
              {listingContext && (
                  <div className="listing-context-bubble">
                      <div className="context-title">Inquiry: {listingContext.title}</div>
                      <div className="context-sub">You are starting a chat about this item.</div>
                  </div>
              )}
              {loadingHistory && <div>Loading history...</div>}
              {displayMessages.map((msg, index) => {
                const senderId = msg.sender_id || (msg.sender && msg.sender.id);
                const isMyMessage = String(senderId) === String(currentUser.id);
                return (
                  <div key={index} className={`message-bubble ${isMyMessage ? 'message-sent' : 'message-received'}`}>
                    <div className="message-sender">{isMyMessage ? 'You' : selectedUser.username}</div>
                    {msg.content}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input-form">
              <input type="text" className="message-input" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
              <button type="submit" className="send-button" disabled={!messageInput.trim()}>Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
             {/* SVG Icon */}
             <svg style={{width: '60px', height: '60px', color: '#ccc', marginBottom: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             <h3>Select a conversation</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;