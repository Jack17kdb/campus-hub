import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { useChatStore } from '../store/chatStore.js'
import { useAuthStore } from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import Contacts from '../components/Contacts.jsx'
import Chat from '../components/Chat.jsx'
import ChatBar from '../components/ChatBar.jsx'
import EmptyContainer from '../components/EmptyContainer.jsx'

const ChatPage = () => {
  const { selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const [showMobileChat, setShowMobileChat] = useState(false)

  // Show mobile chat if user is selected (e.g., from UserDetails page)
  useEffect(() => {
    if (selectedUser) {
      setShowMobileChat(true)
    }
  }, [selectedUser])

  // Check if selected user is online
  const isSelectedUserOnline = selectedUser && onlineUsers.includes(selectedUser._id)

  const handleBackToContacts = () => {
    setShowMobileChat(false)
    setSelectedUser(null)
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-16 left-0 right-0 bottom-0 flex bg-gray-50 overflow-hidden"
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex w-full h-full">
          {/* Contacts Sidebar */}
          <div className="w-80 lg:w-96 border-r border-gray-200 bg-white">
            <Contacts />
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center gap-3 shadow-sm">
                  <div className="relative">
                    <img
                      src={selectedUser.profilePic || '/default.jpeg'}
                      alt={selectedUser.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {isSelectedUserOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {selectedUser.username}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isSelectedUserOnline ? (
                        <span className="text-green-600 font-medium">● Online</span>
                      ) : (
                        'Offline'
                      )}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <Chat />

                {/* Input Bar */}
                <ChatBar />
              </>
            ) : (
              <EmptyContainer />
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full h-full">
          {!showMobileChat ? (
            <Contacts />
          ) : (
            <div className="flex flex-col h-full bg-white">
              {/* Mobile Chat Header */}
              <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center gap-3 shadow-sm">
                <button
                  onClick={handleBackToContacts}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition"
                >
                  <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <div className="relative">
                  <img
                    src={selectedUser?.profilePic || '/default.jpeg'}
                    alt={selectedUser?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isSelectedUserOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {selectedUser?.username}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isSelectedUserOnline ? (
                      <span className="text-green-600 font-medium">● Online</span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <Chat />

              {/* Input Bar */}
              <ChatBar />
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default ChatPage