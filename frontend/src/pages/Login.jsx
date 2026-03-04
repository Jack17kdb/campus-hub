import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [ userData, setUserData ] = useState({
    email: "",
    password: ""
  });
  const { signingIn, isSigningIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signingIn(userData);
  };

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
          <img
            src="/kist.jpg"
            className="w-full h-full object-cover brightness-75"
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full px-6 py-8 sm:px-10">
          <div className="flex flex-col items-center gap-2 mb-6 text-center w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-700">
              Hi, welcome back
            </h2>
            <p className="text-sm font-semibold text-gray-900">
              Please fill in your details to log in
            </p>

            <div className="flex items-center w-full mt-4">
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
              <p className="px-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
                Enter Credentials
              </p>
              <div className="flex-1 h-1 bg-gray-400 rounded-lg" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-center'>
            <div className="flex flex-col w-full max-w-sm gap-3">
              <div className="flex items-center w-full gap-3 px-4 py-2 rounded-full border border-gray-300 bg-gray-200 focus-within:ring-2 focus-within:ring-blue-400">
                <FaEnvelope className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Your Email"
                  value={userData.email}
                  className="w-full bg-transparent outline-none"
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                />
              </div>

              <div className="flex items-center w-full gap-3 px-4 py-2 rounded-full border border-gray-300 bg-gray-200 focus-within:ring-2 focus-within:ring-blue-400">
                <FaLock className="text-gray-500 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Your Password"
                  value={userData.password}
                  className="w-full bg-transparent outline-none"
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                />
                {showPassword ? (
                  <EyeOff
                    className="text-gray-500 hover:text-blue-400 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="text-gray-500 hover:text-blue-400 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

          <a
            href="/forgot-password"
            className="text-sm font-semibold mt-4 self-end hover:text-blue-400 hover:underline transition-all duration-300"
          >
            Forgot Password?
          </a>

          <div className="flex items-center justify-center gap-2 rounded-full bg-black w-full max-w-sm mt-6 cursor-pointer active:scale-95 transition-all duration-300">
            <FaSignInAlt className="text-white" />
            <button type="submit" className="px-4 py-2 text-white cursor-pointer">
              {isSigningIn ? "signing in...." : "Sign In"}
            </button>
          </div>

          <p className="mt-4 text-sm text-center">
            Don’t have an account?{' '}
            <a
              href="/register"
              className="font-semibold hover:text-blue-400 hover:underline transition-all duration-300"
            >
              Sign Up
            </a>
          </p>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
