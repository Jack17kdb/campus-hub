import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { useCartStore } from '../store/cartStore.js'
import MpesaModal from '../components/MpesaModal.jsx'

const CartPage = () => {
  const navigate = useNavigate()
  const { cartItems, getCartItems, removeFromCart, isFetchingCart, isRemovingFromCart } = useCartStore()
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    getCartItems()
  }, [])

  const total = cartItems.reduce((sum, c) => sum + (c.itemId?.price || 0), 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-100 py-2"
    >
      <Navbar />

      <div className="mx-auto mt-20 max-w-4xl px-4">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">My Cart</h1>

        {isFetchingCart ? (
          <div className="text-center text-gray-500 mt-24">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center mt-24 gap-4 text-center"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow">
              <ShoppingCart size={36} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 cursor-pointer transition"
            >
              Browse Marketplace
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Items list */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <AnimatePresence>
                {cartItems.map((cartItem) => (
                  <motion.div
                    key={cartItem._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4 md:p-6 shadow-sm"
                  >
                    <img
                      src={cartItem.itemId?.image || '/default.jpeg'}
                      className="h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => navigate(`/item/${cartItem.itemId?._id}`)}
                    />

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => navigate(`/item/${cartItem.itemId?._id}`)}
                        className="text-sm md:text-base font-semibold text-gray-800 line-clamp-1 cursor-pointer hover:text-orange-500 transition"
                      >
                        {cartItem.itemId?.title || 'Item unavailable'}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                        {cartItem.itemId?.price
                          ? `KES ${cartItem.itemId.price.toLocaleString()}`
                          : 'Price unavailable'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cartItem.itemId?.price > 0 && (
                        <button
                          onClick={() => setSelectedItem(cartItem)}
                          className="rounded-full bg-orange-500 px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white hover:bg-orange-600 transition cursor-pointer"
                        >
                          Pay
                        </button>
                      )}
                      <button
                        onClick={() => removeFromCart(cartItem._id)}
                        disabled={isRemovingFromCart}
                        className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-6 shadow-sm sticky top-24">
                <h2 className="text-base font-semibold text-gray-800 mb-4">Order Summary</h2>

                <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.length})</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Donations / Free items</span>
                    <span>KES 0</span>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">KES {total.toLocaleString()}</span>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Pay each item individually using M-Pesa by clicking the Pay button on each item.
                </p>

                <button
                  onClick={() => navigate('/payments')}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  View Payment History
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* M-Pesa Modal */}
      {selectedItem && (
        <MpesaModal
          item={selectedItem.itemId}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </motion.div>
  )
}

export default CartPage
