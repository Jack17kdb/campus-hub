import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FaLock, FaShieldAlt } from 'react-icons/fa'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const { resetPassword, isResetingPassword } = useAuthStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    const success = await resetPassword(password, token)
    if (success) {
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    }
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
              Set New Password
            </h2>
            <p className="text-sm font-semibold text-gray-900">
              Choose a strong password for your account
            </p>

            <div className="flex items-center w-full mt-4">
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
              <p className="px-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
                New Password
              </p>
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
            </div>
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-green-500 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Password updated!</h3>
              <p className="text-sm text-gray-500">
                Redirecting you to login in a moment...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center">
              <div className="flex flex-col w-full max-w-sm gap-3">

                {/* New password */}
                <div className="flex items-center w-full gap-3 px-4 py-2 rounded-full border border-gray-300 bg-gray-200 focus-within:ring-2 focus-within:ring-blue-400">
                  <FaLock className="text-gray-500 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={password}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isResetingPassword}
                    required
                  />
                  {showPassword
                    ? <EyeOff className="text-gray-500 hover:text-blue-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                    : <Eye className="text-gray-500 hover:text-blue-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                  }
                </div>

                {/* Confirm password */}
                <div className="flex items-center w-full gap-3 px-4 py-2 rounded-full border border-gray-300 bg-gray-200 focus-within:ring-2 focus-within:ring-blue-400">
                  <FaLock className="text-gray-500 shrink-0" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirm}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={isResetingPassword}
                    required
                  />
                  {showConfirm
                    ? <EyeOff className="text-gray-500 hover:text-blue-400 cursor-pointer" onClick={() => setShowConfirm(false)} />
                    : <Eye className="text-gray-500 hover:text-blue-400 cursor-pointer" onClick={() => setShowConfirm(true)} />
                  }
                </div>

                {/* Password hint */}
                <p className="text-xs text-gray-400 px-1">
                  Min. 8 characters with uppercase, lowercase, and a number.
                </p>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500 px-1"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 rounded-full bg-black w-full max-w-sm mt-6 cursor-pointer active:scale-95 transition-all duration-300">
                <FaShieldAlt className="text-white" />
                <button type="submit" disabled={isResetingPassword} className="px-4 py-2 text-white cursor-pointer disabled:opacity-60">
                  {isResetingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              <p className="mt-4 text-sm text-center">
                Remember it now?{' '}
                <Link to="/login" className="font-semibold hover:text-blue-400 hover:underline transition-all duration-300">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ResetPassword
