import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAiStore = create((set, get) => ({
    messages: [],       // { role: 'user' | 'assistant', content: string }
    isThinking: false,

    sendMessage: async (userInput) => {
        if (!userInput.trim()) return;

        // Append user message immediately for instant UI feedback
        const userMessage = { role: 'user', content: userInput };
        set({ messages: [...get().messages, userMessage], isThinking: true });

        try {
            const res = await axiosInstance.post('/agent', { user_input: userInput });
            const assistantMessage = { role: 'assistant', content: res.data.answer };
            set({ messages: [...get().messages, assistantMessage] });
        } catch (error) {
            toast.error('KistBot is unavailable right now. Try again shortly.');
            // Remove the user message if the request failed so it doesn't hang
            set({ messages: get().messages.filter(m => m !== userMessage) });
        } finally {
            set({ isThinking: false });
        }
    },

    clearMessages: () => set({ messages: [] }),
}));
