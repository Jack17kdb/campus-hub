import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './authStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    conversations: [],
    selectedUser: null,
    isMessagesLoading: false,
    isUsersLoading: false,
    isDeletingMessages: false,

    getRecentChats: async() => {
        try {
            set({ isUsersLoading: true });
            const res = await axiosInstance.get("/chat/getchatusers");
            set({ conversations: res.data });
        } catch(error) {
            toast.error(error.response?.data?.message || "Error fetching chats");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async(id) => {
        try {
            set({ isMessagesLoading: true });
            const res = await axiosInstance.get(`/chat/getmessages/${id}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessages: async(messageData) => {
        const { selectedUser, messages, getRecentChats } = get();
        try {
            const res = await axiosInstance.post(`/chat/sendmessages/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
            
            await getRecentChats();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },

    deleteMessages: async(id) => {
        const { messages, getRecentChats } = get();
        try {
            set({ isDeletingMessages: true });
            await axiosInstance.delete(`/chat/deletemessages/${id}`);
            
            set({ messages: messages.filter(msg => msg._id !== id) });
            
            await getRecentChats();
            
            toast.success("Message deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting message");
        } finally {
            set({ isDeletingMessages: false });
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
