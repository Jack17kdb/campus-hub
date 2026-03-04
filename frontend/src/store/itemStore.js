import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useItemStore = create((set) => ({
    items: [],
    item: null,
    isFetchingItems: false,
    isCreatingItems: false,
    isDeletingItems: false,
    isFetchingItemDetails: false,
    isUpdatingStatus: false,
    isSearching: false,

    createItem: async(data) => {
        try {
            set({ isCreatingItems: true });
            await axiosInstance.post("/item/create", data);
            toast.success("Item created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isCreatingItems: false });
        }
    },

    getItems: async() => {
        try {
            set({ isFetchingItems: true });
            const res = await axiosInstance.get("/item/items");
            set({ items: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFetchingItems: false });
        }
    },

    getItemsByCategory: async( category ) => {
        try {
            set({ isFetchingItems: true });
            const res = await axiosInstance.get(`/item/items?category=${category}`);
            set({ items: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFetchingItems: false });
        }
    },

    getItemById: async(itemId) => {
        try {
            set({ isFetchingItemDetails: true });
            const res = await axiosInstance.get(`/item/${itemId}`);
            set({ item: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFetchingItemDetails: false });
        }
    },

    searchItems: async(query) => {
        try {
            set({ isSearching: true });
            const res = await axiosInstance.get(`/item/search?query=${query}`);
            set({ items: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSearching: false });
        }
    },

    updateItemStatus: async(id, status) => {
        try {
            set({ isUpdatingStatus: true });
            const res = await axiosInstance.put(`/item/${id}/status`, { status });
            set({ item: res.data });
            toast.success("Status updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingStatus: false });
        }
    },

    deleteItem: async(id) => {
        try {
            set({ isDeletingItems: true });
            await axiosInstance.delete(`/item/${id}`);
            toast.success("Item deleted successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isDeletingItems: false });
        }
    },
}));
