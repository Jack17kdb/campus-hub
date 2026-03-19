import React, { useEffect, useState } from 'react'
import { Search, MessageCircle, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useChatStore } from '../store/chatStore.js'
import { useAuthStore } from '../store/authStore.js'
import SidebarSkeleton from './SidebarSkeleton.jsx'

const Contacts = () => {
  const {
    getRecentChats,
    conversations,
    selectedUser,
    isUsersLoading,
    setSelectedUser,
  } = useChatStore()

  const { authUser, onlineUsers } = useAuthStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    getRecentChats()
  }, [])

  if (isUsersLoading) return <SidebarSkeleton />

  const filteredChats = conversations.filter((chat) =>
    chat.contactInfo?.username?.toLowerCase().includes(search.toLowerCase())
  )

  // Check if a user is online
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (hours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col bg-white"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={authUser?.profilePic || '/default.jpeg'}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Users size={12} />
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="p-2 bg-orange-100 rounded-full">
            <MessageCircle className="text-orange-500" size={20} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {filteredChats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="text-gray-300" size={40} />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {search ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-xs text-gray-400">
                {search ? 'Try a different search term' : 'Start chatting with your friends!'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredChats.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedUser({
                    _id: user._id,
                    username: user.contactInfo?.username,
                    profilePic: user.contactInfo?.profilePic,
                    studentId: user.contactInfo?.studentId,
                    isOnline: isUserOnline(user._id)
                  })}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 ${
                    selectedUser?._id === user._id
                      ? 'bg-orange-50 border-l-4 border-l-orange-500'
                      : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.contactInfo?.profilePic || '/default.jpeg'}
                      alt={user.contactInfo?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {isUserOnline(user._id) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
                      >
                        <motion.span
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 bg-green-400 rounded-full"
                        />
                      </motion.span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.contactInfo?.username}
                      </p>
                      {user.lastMessageTime && (
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                          {formatTime(user.lastMessageTime)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500 truncate flex-1">
                        {user.lastMessage || 'Tap to start chatting'}
                      </p>
                      {user.unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        >
                          {user.unreadCount > 99 ? '99+' : user.unreadCount}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Contacts