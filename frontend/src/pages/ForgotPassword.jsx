import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { forgotPassword, isSendingPasswordResetEmail } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    await forgotPassword({ email })
    setSent(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-white rounded-2xl overflow-hidden">
        <div className="hidden md:block">
          <img src="/kist.jpg" className="w-full h-full object-cover brightness-75" />
        </div>

        <div className="flex flex-col items-center justify-center w-full px-6 py-8 sm:px-10">
          <div className="flex flex-col items-center gap-2 mb-6 text-center w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-700">
              Forgot Password?
            </h2>
            <p className="text-sm font-semibold text-gray-900">
              Enter your institutional email and we'll send you a reset link
            </p>

            <div className="flex items-center w-full mt-4">
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
              <p className="px-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
                Reset Password
              </p>
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
            </div>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Check your inbox</h3>
              <p className="text-sm text-gray-500 mb-6">
                We sent a reset link to <span className="font-medium text-gray-800">{email}</span>. It expires in 1 hour.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-semibold hover:text-blue-400 hover:underline transition-all duration-300"
              >
                Didn't receive it? Send again
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center">
              <div className="flex flex-col w-full max-w-sm gap-3">
                <div className="flex items-center w-full gap-3 px-4 py-2 rounded-full border border-gray-300 bg-gray-200 focus-within:ring-2 focus-within:ring-blue-400">
                  <FaEnvelope className="text-gray-500 shrink-0" />
                  <input
                    type="email"
                    placeholder="Enter Your Institutional Email"
                    value={email}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSendingPasswordResetEmail}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-full bg-black w-full max-w-sm mt-6 cursor-pointer active:scale-95 transition-all duration-300">
                <FaPaperPlane className="text-white" />
                <button type="submit" disabled={isSendingPasswordResetEmail} className="px-4 py-2 text-white cursor-pointer disabled:opacity-60">
                  {isSendingPasswordResetEmail ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <p className="mt-4 text-sm text-center">
                Remembered your password?{' '}
                <Link to="/login" className="font-semibold hover:text-blue-400 hover:underline transition-all duration-300">
                  Sign In
                </Link>
              </p>

              <p className="mt-2 text-sm text-center">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold hover:text-blue-400 hover:underline transition-all duration-300">
                  Sign Up
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ForgotPassword
