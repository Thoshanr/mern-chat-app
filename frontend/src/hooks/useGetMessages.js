import React, { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation.js';
import toast from 'react-hot-toast';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false); 
    const messages = useConversation((state) => state.messages);
    const setMessages = useConversation((state) => state.setMessages);
    const selectedConversation = useConversation((state) => state.selectedConversation);

    useEffect(() => {
        const controller = new AbortController();
        const getMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/messages/${selectedConversation._id}`, { signal: controller.signal });
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setMessages(data);
            } catch (error) {
                if (error.name !== 'AbortError') toast.error(error.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        if(selectedConversation?._id) getMessages();
        return () => controller.abort();
    }, [selectedConversation?._id, setMessages]);

    return {messages, loading}
}

export default useGetMessages
