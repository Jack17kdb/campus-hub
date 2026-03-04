import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : '/';

export const useAuthStore = create((set, get) => ({
    user: null,
    authUser: null,
    socket: null,
    onlineUsers: [],
    isCheckingAuth: true,
    isSigningUp: false,
    isSigningIn: false,
    isSendingPasswordResetEmail: false,
    isResetingPassword: false,
    isUpdatingPic: false,
    isFetchingUserById: false,
    isDeletingAccount: false,

    checkAuth: async() => {
        try {
            set({ isCheckingAuth: true });
            const res = await axiosInstance.get('/auth/checkAuth');
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error Checking Authentication", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signingUp: async(data) => {
        try {
            set({ isSigningUp: true });
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data });
            toast.success("Signup complete, check email from verification");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    signingIn: async(data) => {
        try {
            set({ isSigningIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Login successfull");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isSigningIn: false });
        }
    },

    verifyEmail: async(token) => {
        try {
            await axiosInstance.get(`/auth/verify-email?token=${token}`);
            toast.success("Email verification complete");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    },

    forgotPassword: async(data) => {
        try {
            set({ isSendingPasswordResetEmail: true });
            await axiosInstance.post("/auth/forgot-password", data);
            toast.success("Password reset email sent! Check your inbox.");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isSendingPasswordResetEmail: false });
        }
    },

    resetPassword: async(password, token) => {
        try {
            set({ isResetingPassword: true });
            await axiosInstance.post(`/auth/reset-password?token=${token}`, { password });
            toast.success(
                "Password reset successfully! You can now login with your new password."
            );
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isResetingPassword: false });
        }
    },

    updatePic: async(data) => {
        try {
            set({ isUpdatingPic: true });
            const res = await axiosInstance.put("/auth/update-pic", data);
            set({ authUser: res.data });
            toast.success("Profile picture updated");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isUpdatingPic: false });
        }
    },

    getUserById: async(id) => {
        try {
            set({ isFetchingUserById: true });
            const res = await axiosInstance.get(`/auth/${id}`);
            set({ user: res.data });
        } catch(error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingUserById: false });
        }
    },

    deleteAccount: async () => {
        try {
            await axiosInstance.delete("/auth/delete-account");
            set({authUser: null});
            toast.success("Account deleted successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });

        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket?.disconnect();
    },
}));