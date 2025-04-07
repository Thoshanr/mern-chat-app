import React, { useRef } from 'react'
import Message from './Message.jsx'
import '../../../src/App.css'
import useGetMessages from '../../hooks/useGetMessages.js'
import MessageSkeleton from '../skeletons/MessageSkeleton.jsx'
import { useEffect } from 'react'
import useListenMessages from '../../hooks/useListenMessages.js'
const Messages = () => {
  const {messages, loading} = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();
  
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth"});
    },20);
  }, [messages]);

  return (
    <div className='px-4 flex-1 overflow-auto scrollbar-track-rounded'>
       {!loading && 
       messages.length > 0 && 
       messages.map((message) => (
        <div key={message._id}
           ref = {lastMessageRef}
        >
          <Message  message={message} />
        </div>
       ))}
       
       {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />) }

       {!loading && messages.length === 0 && (
        <p className='text-center text-gray-400'>Send a message to start the conversation</p>
       )}
    </div>
  )
}

export default Messages;