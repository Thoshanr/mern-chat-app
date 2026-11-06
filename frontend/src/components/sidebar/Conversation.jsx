import React from 'react';
import useConversation from '../../zustand/useConversation.js';
import { useSocketContext } from '../../context/useSocketContext.js';

const Conversation = ({ conversation, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <button type="button" className={`contact-row ${isSelected ? 'is-selected' : ''}`} aria-pressed={isSelected} onClick={() => setSelectedConversation(conversation)}>
      <span className={`contact-avatar ${isOnline ? 'is-online' : ''}`}>
        <img src={conversation.profilePic} alt="" />
      </span>
      <span className="contact-name">{conversation.fullName}</span>
      <span className="contact-emoji" aria-hidden="true">{emoji}</span>
    </button>
  );
};
export default Conversation;
