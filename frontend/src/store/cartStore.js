import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
    cartItems: [],
    isFetchingCart: false,
    isAddingToCart: false,
    isRemovingFromCart: false,

    getCartItems: async () => {
        try {
            set({ isFetchingCart: true });
            const res = await axiosInstance.get('/cart');
            set({ cartItems: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching cart');
        } finally {
            set({ isFetchingCart: false });
        }
    },

    addToCart: async (itemId) => {
        try {
            set({ isAddingToCart: true });
            await axiosInstance.post(`/cart/${itemId}`);
            toast.success('Item added to cart');
            await get().getCartItems();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding to cart');
        } finally {
            set({ isAddingToCart: false });
        }
    },

    removeFromCart: async (cartId) => {
        try {
            set({ isRemovingFromCart: true });
            await axiosInstance.delete(`/cart/${cartId}`);
            set({ cartItems: get().cartItems.filter(c => c._id !== cartId) });
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error removing from cart');
        } finally {
            set({ isRemovingFromCart: false });
        }
    },
}));
