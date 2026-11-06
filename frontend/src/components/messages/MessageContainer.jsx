import React, { useEffect } from 'react';
import Messages from './Messages.jsx';
import MessageInput from './MessageInput.jsx';
import { TiMessages } from 'react-icons/ti';
import useConversation from '../../zustand/useConversation.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useSocketContext } from '../../context/useSocketContext.js';

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  useEffect(() => () => setSelectedConversation(null), [setSelectedConversation]);

  if (!selectedConversation) return <NoChatSelected />;
  const isOnline = onlineUsers.includes(selectedConversation._id);

  return (
    <section className="message-panel" aria-label={`Chat with ${selectedConversation.fullName}`}>
      <header className="chat-header">
        <img src={selectedConversation.profilePic} alt="" />
        <div>
          <div className="chat-peer-name">{selectedConversation.fullName}</div>
          <div className={`chat-peer-status ${isOnline ? 'online' : ''}`}>{isOnline ? '● Online now' : '○ Away'}</div>
        </div>
      </header>
      <Messages />
      <MessageInput />
    </section>
  );
};

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <section className="message-panel">
      <div className="empty-state">
        <div className="empty-state-card">
          <div className="empty-state-icon"><TiMessages /></div>
          <h1 className="empty-state-title">Hey {authUser?.fullName || 'there'} ✨</h1>
          <p>Pick someone from your contacts and make their day.</p>
        </div>
      </div>
    </section>
  );
};

export default MessageContainer;
