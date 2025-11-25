import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';
import './ChatPage.css';

/* ---------- API helpers ---------- */
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

/* ---------- Component ---------- */
function ChatPage() {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [extraChatPartners, setExtraChatPartners] = useState([]);
  const [listingContext, setListingContext] = useState(null);
  const [socket, setSocket] = useState(null);

  const chatContainerRef = useRef(null);

  /* ---------- Queries ---------- */
  const { data: apiConversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  // Merge conversations from API with any "extra" partners we discovered via realtime events.
  const allChatPartners = React.useMemo(() => {
    const combined = [...apiConversations, ...extraChatPartners];
    const unique = [];
    const seen = new Map();
    for (const item of combined) {
      if (!seen.has(item.id)) {
        seen.set(item.id, true);
        unique.push(item);
      }
    }
    return unique;
  }, [apiConversations, extraChatPartners]);

  const { data: historyMessages, isLoading: loadingHistory } = useQuery({
    queryKey: ['chatHistory', selectedUser?.id],
    queryFn: () => fetchChatHistory(selectedUser?.id),
    enabled: !!selectedUser,
  });

  /* ---------- Effects ---------- */
  // If page was opened via "startChatWith" (e.g., from a listing), select or fetch that user
  useEffect(() => {
    const initChat = async () => {
      if (!location.state?.startChatWith) return;

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
        } catch (err) {
          console.error('Could not fetch vendor details', err);
        }
      }

      // Remove the navigation state so refreshing doesn't re-trigger
      window.history.replaceState({}, document.title);
    };

    initChat();
  }, [location.state, allChatPartners]);

  // WebSocket: connect when a user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem('access_token');
    const wsProtocol = BASE_URL.startsWith('https') ? 'wss' : 'ws';
    const wsHost = BASE_URL.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}://${wsHost}/ws/chat/?token=${token}`;

    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => console.log('WebSocket Connected');
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setRealtimeMessages(prev => [...prev, data]);

        // If sender/receiver isn't in the current partner list, fetch and add them
        const otherUserId = String(data.sender_id) === String(currentUser.id)
          ? data.receiver_id
          : data.sender_id;

        if (!allChatPartners.some(u => String(u.id) === String(otherUserId))) {
          fetchUserDetails(otherUserId).then(newUser => {
            setExtraChatPartners(prev => [...prev, newUser]);
          }).catch(err => {
            // Non-fatal: we still want to display the message even if fetching user failed
            console.warn('Failed to fetch user from realtime message', err);
          });
        }
      } catch (err) {
        console.error('Invalid WS message', err);
      }
    };

    newSocket.onclose = () => console.log('WebSocket Disconnected');

    setSocket(newSocket);
    return () => newSocket.close();
  }, [currentUser, allChatPartners]);

  // Clear realtime buffer when switching selected conversation
  useEffect(() => {
    setRealtimeMessages([]);
  }, [selectedUser]);

  // Auto-scroll chat container to the bottom when messages change
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const scrollHeight = el.scrollHeight;
    const height = el.clientHeight;
    const maxScrollTop = scrollHeight - height;
    el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }, [historyMessages, realtimeMessages, selectedUser]);

  /* ---------- Handlers ---------- */
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

    // Refresh conversation list shortly after sending (keeps UI in sync)
    setTimeout(() => queryClient.invalidateQueries(['conversations']), 1000);
  };

  // Build the final display list: server history + relevant realtime messages
  const displayMessages = [
    ...(historyMessages || []),
    ...realtimeMessages.filter(msg =>
      (String(msg.sender_id) === String(selectedUser?.id) && String(msg.receiver_id) === String(currentUser.id)) ||
      (String(msg.sender_id) === String(currentUser.id) && String(msg.receiver_id) === String(selectedUser?.id))
    )
  ];

  /* ---------- Render ---------- */
  return (
    <div className="chat-container">

      {/* Sidebar: list of conversations */}
      <div className="chat-sidebar">
        <div className="sidebar-header"><h3>Messages</h3></div>

        <div className="user-list">
          {loadingConversations && allChatPartners.length === 0 ? (
            <div style={{ padding: 20 }}>Loading...</div>
          ) : allChatPartners.length === 0 ? (
            <div style={{ padding: 20, color: '#777' }}>No active chats.</div>
          ) : (
            allChatPartners.map(u => (
              <div
                key={u.id}
                className={`user-list-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="user-avatar">{(u.username || 'U').charAt(0).toUpperCase()}</div>
                <div className="user-name">{u.username}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main chat window */}
      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-header">Chatting with {selectedUser.username}</div>

            <div className="chat-messages" ref={chatContainerRef}>
              {listingContext && (
                <div className="listing-context-bubble">
                  <div className="context-title">Inquiry: {listingContext.title}</div>
                  <div className="context-sub">You are starting a chat about this item.</div>
                </div>
              )}

              {loadingHistory && <div>Loading history...</div>}

              {displayMessages.map((msg, idx) => {
                const senderId = msg.sender_id || (msg.sender && msg.sender.id);
                const isMyMessage = String(senderId) === String(currentUser.id);
                return (
                  <div key={idx} className={`message-bubble ${isMyMessage ? 'message-sent' : 'message-received'}`}>
                    <div className="message-sender">{isMyMessage ? 'You' : selectedUser.username}</div>
                    <div className="message-content">{msg.content}</div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button type="submit" className="send-button" disabled={!messageInput.trim()}>Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <svg style={{ width: 60, height: 60, color: '#ccc', marginBottom: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3>Select a conversation</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
