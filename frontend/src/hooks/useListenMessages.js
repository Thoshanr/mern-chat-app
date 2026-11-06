import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSocketContext } from '../context/useSocketContext.js';
import useConversation from '../zustand/useConversation.js';
import { playChatSound } from '../utils/chatSounds.js';

const useListenMessages = () => {
  const {socket} = useSocketContext();
  useEffect(() => {
    if (!socket) return undefined;
    const syncSelectedConversation = async () => {
      const conversationId = useConversation.getState().selectedConversation?._id;
      if (!conversationId) return;
      try {
        const response = await fetch(`/api/messages/${conversationId}`);
        const data = await response.json();
        if (!response.ok || data.error) throw new Error(data.error || 'Could not refresh this conversation.');
        if (useConversation.getState().selectedConversation?._id === conversationId) {
          useConversation.getState().setMessages(data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    const onNewMessage = (newMessage) => {
      const state = useConversation.getState();
      const activeConversation = state.selectedConversation?._id;
      const isOpen = activeConversation === newMessage.senderId;
      if (isOpen) {
        const alreadyPresent = state.messages.some((message) => message._id === newMessage._id);
        if (!alreadyPresent) state.setMessages([...state.messages, { ...newMessage, shouldShake: true }]);
      } else {
        state.incrementUnread(newMessage.senderId);
        toast('New message received', { icon: '✉️', id: `new-message-${newMessage._id}` });
      }
      playChatSound('receive');
    };
    socket.on('newMessage', onNewMessage);
    socket.on('connect', syncSelectedConversation);
    if (socket.connected) void syncSelectedConversation();
    return () => {
      socket.off('newMessage', onNewMessage);
      socket.off('connect', syncSelectedConversation);
    };
  }, [socket]);
}

export default useListenMessages
