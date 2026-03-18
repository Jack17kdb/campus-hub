import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const { verifyEmail } = useAuthStore()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus('error')
        return
      }
      const success = await verifyEmail(token)
      setStatus(success ? 'success' : 'error')
    }
    run()
  }, [token])

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
              Email Verification
            </h2>
            <p className="text-sm font-semibold text-gray-900">
              Verifying your KIST institutional email
            </p>

            <div className="flex items-center w-full mt-4">
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
              <p className="px-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
                Verify Account
              </p>
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
            </div>
          </div>

          <div className="w-full max-w-sm text-center">
            {status === 'verifying' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm text-gray-500">Verifying your email address...</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Email verified!</h3>
                  <p className="text-sm text-gray-500">
                    Your account is now fully activated. You can use all KIST Hub features.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 rounded-full bg-black w-full mt-2 cursor-pointer active:scale-95 transition-all duration-300">
                  <FaEnvelope className="text-white" />
                  <Link to="/home" className="px-4 py-2 text-white text-sm cursor-pointer">
                    Go to Home
                  </Link>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimesCircle className="text-red-500 text-3xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Verification failed</h3>
                  <p className="text-sm text-gray-500">
                    This link is invalid or has expired. Verification links are valid for 24 hours.
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm text-center">
                    <Link to="/login" className="font-semibold hover:text-blue-400 hover:underline transition-all duration-300">
                      Back to Sign In
                    </Link>
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Log in and a new verification email can be sent from your profile.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VerifyEmail
