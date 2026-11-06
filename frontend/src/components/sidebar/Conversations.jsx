import React from 'react';
import Conversation from './Conversation.jsx';
import useGetConversations from '../../hooks/useGetConversations.js';
import { getRandomEmoji } from '../../utils/emojis.js';

const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  return (
    <div className="contact-list" aria-label="Contacts">
      {conversations.map((conversation, idx) => (
        <Conversation key={conversation._id} conversation={conversation} emoji={getRandomEmoji()} lastIdx={idx === conversations.length - 1} />
      ))}
      {loading ? <span className="loading loading-spinner mx-auto" aria-label="Loading contacts" /> : null}
      {!loading && conversations.length === 0 ? <p className="chat-peer-status" style={{ padding: '8px 10px' }}>No contacts yet. Create another account to start a chat.</p> : null}
    </div>
  );
};
export default Conversations;
