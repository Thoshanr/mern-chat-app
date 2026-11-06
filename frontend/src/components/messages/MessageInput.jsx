import React, { useState } from 'react';
import { BsSend } from 'react-icons/bs';
import useSendMessage from '../../hooks/useSendMessage.js';
import { primeChatAudio } from '../../utils/chatSounds.js';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { loading, sendMessage } = useSendMessage();
  const handleSubmit = async (event) => {
    event.preventDefault();
    primeChatAudio();
    const text = message.trim();
    if (!text || loading) return;
    if (await sendMessage(text)) setMessage('');
  };
  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input className="message-field" type="text" aria-label="Write a message" placeholder="Write something kind…" value={message} onChange={(event) => setMessage(event.target.value)} />
      <button type="submit" className="send-button" aria-label="Send message" disabled={loading || !message.trim()}>
        {loading ? <span className="loading loading-spinner" /> : <BsSend />}
      </button>
    </form>
  );
};
export default MessageInput;
