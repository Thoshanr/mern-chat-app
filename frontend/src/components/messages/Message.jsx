import React from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import useConversation from '../../zustand/useConversation.js';
import { extractTime } from '../../utils/extractTime.js';

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;

  return (
    <div className={`chat ${fromMe ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar"><div className="w-10 rounded-full"><img src={profilePic} alt="" /></div></div>
      <div className={`chat-bubble ${fromMe ? 'sent' : 'received'} ${message.shouldShake ? 'shake' : ''}`}>{message.message}</div>
      <div className="chat-footer">{formattedTime}</div>
    </div>
  );
};
export default Message;
