import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const usePaymentStore = create((set, get) => ({
    payment: null,
    payments: [],
    isFetchingPayment: false,
    isFetchingPayments: false,
    isInitiatingPayment: false,
    isFilteringPayments: false,
    stkStatus: null,   // null | 'pending' | 'success' | 'failed'

    // Initiate STK push
    initiateStkPush: async ({ receiverId, itemId, phone, amount }) => {
        try {
            set({ isInitiatingPayment: true, stkStatus: 'pending' });
            const res = await axiosInstance.post('/mpesa/pay', {
                receiverId,
                itemId,
                phone,
                amount,
            });
            toast.success('Check your phone — M-Pesa prompt sent!');
            return res.data;
        } catch (error) {
            set({ stkStatus: 'failed' });
            toast.error(error.response?.data?.error || 'Payment initiation failed');
            return null;
        } finally {
            set({ isInitiatingPayment: false });
        }
    },

    // Poll payment status by checkoutRequestID via getPayment
    getPaymentById: async (id) => {
        try {
            set({ isFetchingPayment: true });
            const res = await axiosInstance.get(`/payment/${id}`);
            set({ payment: res.data });
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching payment');
            return null;
        } finally {
            set({ isFetchingPayment: false });
        }
    },

    // Get sent or received payments
    getPaymentsByType: async (type) => {
        try {
            set({ isFetchingPayments: true });
            const res = await axiosInstance.get(`/payment/type/${type}`);
            set({ payments: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching payments');
        } finally {
            set({ isFetchingPayments: false });
        }
    },

    // Filter payments by phone / amount / status
    filterPayments: async (query) => {
        try {
            set({ isFilteringPayments: true });
            const res = await axiosInstance.get(`/payment/filter?query=${encodeURIComponent(query)}`);
            set({ payments: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error filtering payments');
        } finally {
            set({ isFilteringPayments: false });
        }
    },

    setStkStatus: (status) => set({ stkStatus: status }),
    clearPayments: () => set({ payments: [], payment: null }),
}));
