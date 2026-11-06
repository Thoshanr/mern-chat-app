import {create} from 'zustand'


const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation : (selectedConversation) => set({selectedConversation}),
    messages: [],
    setMessages : (messages) => set({messages}),
    unreadByConversation: {},
    markConversationRead: (conversationId) => set((state) => {
        const next = { ...state.unreadByConversation };
        delete next[conversationId];
        return { unreadByConversation: next };
    }),
    incrementUnread: (conversationId) => set((state) => ({
        unreadByConversation: {
            ...state.unreadByConversation,
            [conversationId]: (state.unreadByConversation[conversationId] || 0) + 1,
        },
    })),
}));

export default useConversation;
