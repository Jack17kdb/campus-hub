import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Phone, CheckCircle, XCircle, Loader } from 'lucide-react'
import { usePaymentStore } from '../store/paymentStore.js'
import { useAuthStore } from '../store/authStore.js'

const MpesaModal = ({ item, onClose }) => {
  const { authUser } = useAuthStore()
  const { initiateStkPush, isInitiatingPayment, stkStatus, setStkStatus } = usePaymentStore()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  // Reset status when modal opens
  useEffect(() => {
    setStkStatus(null)
    return () => setStkStatus(null)
  }, [])

  const validatePhone = (p) => /^(07|01)\d{8}$/.test(p.trim())

  const handlePay = async () => {
    setError('')
    if (!validatePhone(phone)) {
      setError('Enter a valid Safaricom number e.g. 0712345678')
      return
    }
    await initiateStkPush({
      receiverId: item.owner?._id || item.ownerId,
      itemId: item._id,
      phone: phone.trim(),
      amount: item.price,
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">M</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Pay with M-Pesa</h3>
                <p className="text-xs text-gray-400">Lipa na M-Pesa</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-5">
            {/* Item summary */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-5">
              <img
                src={item.image}
                className="h-14 w-14 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                <p className="text-lg font-bold text-orange-500 mt-0.5">
                  KES {item.price?.toLocaleString()}
                </p>
              </div>
            </div>

            {stkStatus === 'pending' ? (
              /* Waiting state */
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <Loader size={32} className="text-green-500 animate-spin" />
                <p className="text-sm font-medium text-gray-800">Waiting for payment...</p>
                <p className="text-xs text-gray-500">
                  Check your phone <span className="font-medium">{phone}</span> and enter your M-Pesa PIN to complete.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
                >
                  Done / Close
                </button>
              </div>
            ) : stkStatus === 'failed' ? (
              /* Failed state */
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <XCircle size={32} className="text-red-500" />
                <p className="text-sm font-medium text-gray-800">Payment failed</p>
                <p className="text-xs text-gray-500">Please try again or use a different number.</p>
                <button
                  onClick={() => setStkStatus(null)}
                  className="mt-2 rounded-full bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-700 transition cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : (
              /* Input state */
              <>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Your M-Pesa Phone Number
                </label>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-gray-300 bg-gray-100 focus-within:ring-2 focus-within:ring-green-400 mb-1">
                  <Phone size={15} className="text-gray-400 shrink-0" />
                  <input
                    type="tel"
                    placeholder="0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    maxLength={10}
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500 mb-3 px-1">{error}</p>
                )}

                <p className="text-xs text-gray-400 mb-5 px-1">
                  An STK push will be sent to this number. Enter your PIN to confirm.
                </p>

                <button
                  onClick={handlePay}
                  disabled={isInitiatingPayment}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition disabled:opacity-60 cursor-pointer"
                >
                  {isInitiatingPayment ? (
                    <>
                      <Loader size={15} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    `Pay KES ${item.price?.toLocaleString()}`
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MpesaModal
