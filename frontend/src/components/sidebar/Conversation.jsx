import React from 'react';
import useConversation from '../../zustand/useConversation.js';
import { useSocketContext } from '../../context/useSocketContext.js';
import { getAnimeAvatar } from '../../utils/getAnimeAvatar.js';

const Conversation = ({ conversation, emoji }) => {
  const { selectedConversation, setSelectedConversation, unreadByConversation, markConversationRead } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);
  const unreadCount = unreadByConversation[conversation._id] || 0;

  return (
    <button type="button" className={`contact-row ${isSelected ? 'is-selected' : ''}`} aria-pressed={isSelected} onClick={() => { setSelectedConversation(conversation); markConversationRead(conversation._id); }}>
      <span className={`contact-avatar ${isOnline ? 'is-online' : ''}`}>
        <img src={getAnimeAvatar(conversation)} alt={`${conversation.fullName}'s anime avatar`} />
      </span>
      <span className="contact-name">{conversation.fullName}</span>
      {unreadCount > 0 ? <span className="unread-badge" aria-label={`${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`}>{unreadCount > 9 ? '9+' : unreadCount}</span> : <span className="contact-emoji" aria-hidden="true">{emoji}</span>}
    </button>
  );
};
export default Conversation;
