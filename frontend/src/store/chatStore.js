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
        const { selectedUser, messages, conversations } = get();
        try {
            const res = await axiosInstance.post(`/chat/sendmessages/${selectedUser._id}`, messageData);
            const newMessage = res.data;

            // Add message to current thread
            set({ messages: [...messages, newMessage] });

            // Update conversations list locally — move this contact to top with latest message
            const existingIndex = conversations.findIndex(c => c._id === selectedUser._id);
            const updatedConvo = {
                _id: selectedUser._id,
                lastMessage: newMessage.text || '📷 Image',
                lastMessageTime: newMessage.createdAt,
                unreadCount: 0,
                contactInfo: {
                    username: selectedUser.username,
                    profilePic: selectedUser.profilePic,
                    studentId: selectedUser.studentId,
                }
            };

            let updatedConversations;
            if (existingIndex > -1) {
                updatedConversations = [
                    updatedConvo,
                    ...conversations.filter((_, i) => i !== existingIndex)
                ];
            } else {
                updatedConversations = [updatedConvo, ...conversations];
            }

            set({ conversations: updatedConversations });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },

    deleteMessages: async(id) => {
        const { messages } = get();
        try {
            set({ isDeletingMessages: true });
            await axiosInstance.delete(`/chat/deletemessages/${id}`);
            // Remove from local state only — no extra API call
            set({ messages: messages.filter(msg => msg._id !== id) });
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
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
