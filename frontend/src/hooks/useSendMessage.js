import { useState } from 'react';
import useConversation from '../zustand/useConversation.js';
import toast from 'react-hot-toast';
import { playChatSound } from '../utils/chatSounds.js';

const useSendMessage = () => {
  
    const [loading, setLoading] = useState(false);
    const selectedConversation = useConversation((state) => state.selectedConversation);

    const sendMessage = async (message) => {
        if (!selectedConversation?._id) return false;
        const conversationId = selectedConversation._id;
        setLoading(true);
        try {
            const res = await fetch(`/api/messages/send/${conversationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message})
            });

            const data = await res.json();
            if(data.error) {
                throw new Error(data.error);
            }

            const currentState = useConversation.getState();
            if (currentState.selectedConversation?._id === conversationId) {
                const currentMessages = currentState.messages;
                if (!currentMessages.some((current) => current._id === data._id)) {
                    currentState.setMessages([...currentMessages, data]);
                }
            }
            playChatSound('send');
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }
    return {sendMessage, loading };

}

export default useSendMessage
