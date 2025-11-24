import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
  
  // Consolidated Chat List State
  const [extraChatPartners, setExtraChatPartners] = useState([]); 
  
  const [listingContext, setListingContext] = useState(null);
  
  // FIX 1: Ref attached to the container, not a dummy div
  const chatContainerRef = useRef(null);
  const queryClient = useQueryClient();

  // 1. Load Initial Conversations
  const { data: apiConversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  const allChatPartners = React.useMemo(() => {
      const combined = [...apiConversations, ...extraChatPartners];
      const unique = [];
      const map = new Map();
      for (const item of combined) {
          if(!map.has(item.id)){
              map.set(item.id, true);
              unique.push(item);
          }
      }
      return unique;
  }, [apiConversations, extraChatPartners]);


  // 2. Handle Redirect from "Chat with Vendor" button
  useEffect(() => {
    const initChat = async () => {
      if (location.state?.startChatWith) {
        const vendorId = location.state.startChatWith;
        
        if (location.state.listingContext) {
            setListingContext(location.state.listingContext);
            setMessageInput(`Hi, I'm interested in your listing: ${location.state.listingContext.title}`);
        }

        const existingPartner = allChatPartners.find(u => String(u.id) === String(vendorId));
        
        if (existingPartner) {
          setSelectedUser(existingPartner);
        } else {
          try {
            const newPartner = await fetchUserDetails(vendorId);
            setExtraChatPartners(prev => [...prev, newPartner]);
            setSelectedUser(newPartner);
          } catch (error) {
            console.error("Could not fetch vendor details", error);
          }
        }
        window.history.replaceState({}, document.title);
      } 
    };

    if (location.state?.startChatWith) {
       initChat();
    }
  }, [location.state, allChatPartners]); 

  // 3. Load Chat History
  const { data: historyMessages, isLoading: loadingHistory } = useQuery({
    queryKey: ['chatHistory', selectedUser?.id],
    queryFn: () => fetchChatHistory(selectedUser?.id),
    enabled: !!selectedUser, 
  });

  // 4. WebSocket Setup
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem('access_token');
    const wsProtocol = BASE_URL.startsWith('https') ? 'wss' : 'ws';
    const wsHost = BASE_URL.replace(/^https?:\/\//, ''); 
    const wsUrl = `${wsProtocol}://${wsHost}/ws/chat/?token=${token}`;

    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => console.log('WebSocket Connected');

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimeMessages((prev) => [...prev, data]);
      
      const otherUserId = String(data.sender_id) === String(currentUser.id) ? data.receiver_id : data.sender_id;
      const alreadyInList = allChatPartners.some(u => String(u.id) === String(otherUserId));
      
      if (!alreadyInList) {
        fetchUserDetails(otherUserId).then(newUser => {
            setExtraChatPartners(prev => [...prev, newUser]);
        });
      }
    };

    newSocket.onclose = () => console.log('WebSocket Disconnected');
    setSocket(newSocket);
    return () => newSocket.close();
  }, [currentUser, allChatPartners]);

  useEffect(() => {
    setRealtimeMessages([]);
  }, [selectedUser]);

  // FIX 2: Use useLayoutEffect or useEffect to scroll container
  // This prevents the "whole page" jump by only modifying the container's scroll position
  useEffect(() => {
    if (chatContainerRef.current) {
        const scrollHeight = chatContainerRef.current.scrollHeight;
        const height = chatContainerRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        
        // Only scroll if we are near bottom or it's initial load (simple version: always scroll to bottom on new message)
        chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
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
    setListingContext(null); 
    
    setTimeout(() => {
        queryClient.invalidateQueries(['conversations']);
    }, 1000);
  };

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
          {loadingConversations && allChatPartners.length === 0 ? (
            <div style={{padding: 20}}>Loading...</div>
          ) : allChatPartners.length === 0 ? (
            <div style={{padding: 20, color: '#777'}}>No active chats.</div>
          ) : (
            allChatPartners.map(u => (
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

      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-header">
              Chatting with {selectedUser.username}
            </div>
            
            {/* FIX 3: Attached ref to this scrolling container */}
            <div className="chat-messages" ref={chatContainerRef}>
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
              {/* Removed the dummy ref div */}
            </div>
            <form onSubmit={handleSendMessage} className="message-input-form">
              <input type="text" className="message-input" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
              <button type="submit" className="send-button" disabled={!messageInput.trim()}>Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
             <svg style={{width: '60px', height: '60px', color: '#ccc', marginBottom: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             <h3>Select a conversation</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;