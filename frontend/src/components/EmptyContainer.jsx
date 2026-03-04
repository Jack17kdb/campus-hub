import React from 'react'
import { MessageCircle, Users, ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'

const EmptyContainer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8"
    >
      <div className="max-w-md mx-auto text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15
          }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <MessageCircle className="text-orange-500" size={64} strokeWidth={1.5} />
          </div>
          
          {/* Floating circles */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              x: [-5, 5, -5]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-md"
          >
            <Users className="text-blue-500" size={24} />
          </motion.div>
        </motion.div>

        {/* Main Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Welcome to Messages! 👋
          </h3>
          <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
            Select a conversation from the sidebar to start chatting with your friends
          </p>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 text-left bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Real-time messaging</p>
              <p className="text-xs text-gray-500">Send and receive messages instantly</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">📸</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Share images</p>
              <p className="text-xs text-gray-500">Send photos with your messages</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">🔒</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Secure & private</p>
              <p className="text-xs text-gray-500">Your conversations are safe with us</p>
            </div>
          </div>
        </motion.div>

        {/* Mobile Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 md:hidden"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <ArrowLeft size={16} />
            <span>Swipe left to see conversations</span>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-100 rounded-full opacity-50 blur-2xl -z-10" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-3xl -z-10" />
      </div>
    </motion.div>
  )
}

export default EmptyContainer
