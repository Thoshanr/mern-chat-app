import React, { useEffect } from 'react';
import Message from './Message.jsx';
import useGetMessages from '../../hooks/useGetMessages.js';
import MessageSkeleton from '../skeletons/MessageSkeleton.jsx';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useEffect(() => {
    const timer = window.setTimeout(() => document.getElementById('latest-message')?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 30);
    return () => window.clearTimeout(timer);
  }, [messages]);

  return (
    <div className="message-list" aria-live="polite">
      {!loading && messages.map((message, index) => <div id={index === messages.length - 1 ? 'latest-message' : undefined} key={message._id}><Message message={message} /></div>)}
      {loading && [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)}
      {!loading && messages.length === 0 && <p className="chat-peer-status" style={{ textAlign: 'center', padding: '18px' }}>This is the start of something good. Say hello ✨</p>}
    </div>
  );
};
export default Messages;
