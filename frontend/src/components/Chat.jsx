import React, { useEffect, useRef, useState } from 'react'
import { Check, CheckCheck, Trash2, X, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useChatStore } from '../store/chatStore.js'
import { useAuthStore } from '../store/authStore.js'
import MessageSkeleton from './MessageSkeleton.jsx'

const Chat = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading, deleteMessages, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()
  const bottomRef = useRef(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id)
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handleClickOutside = () => setSelectedMessage(null)
    if (selectedMessage) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [selectedMessage])

  if (isMessagesLoading) return <MessageSkeleton />

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const groupMessagesByDate = (messages) => {
    const groups = {}
    messages.forEach((msg) => {
      const date = formatMessageDate(msg.createdAt)
      if (!groups[date]) groups[date] = []
      groups[date].push(msg)
    })
    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  const handleDeleteMessage = async (messageId, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this message?')) {
      await deleteMessages(messageId)
      setSelectedMessage(null)
    }
  }

  const handleMessageClick = (messageId, isMine, e) => {
    e.stopPropagation()
    if (isMine) {
      setSelectedMessage(selectedMessage === messageId ? null : messageId)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      <AnimatePresence mode="wait">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">No messages yet</p>
              <p className="text-gray-400 text-xs">Start the conversation!</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Separator */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center my-6"
                >
                  <span className="px-4 py-1.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full shadow-sm">
                    {date}
                  </span>
                </motion.div>

                {/* Messages */}
                <div className="space-y-3">
                  {msgs.map((msg, index) => {
                    const isMine = msg.senderId === authUser?._id

                    return (
                      <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`group relative max-w-[85%] sm:max-w-[75%] md:max-w-[60%] ${
                            isMine ? 'order-2' : 'order-1'
                          }`}
                          onClick={(e) => handleMessageClick(msg._id, isMine, e)}
                        >
                          {/* Message Bubble */}
                          <div
                            className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all ${
                              isMine
                                ? 'bg-orange-500 text-white rounded-br-sm hover:bg-orange-600'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm hover:shadow-md'
                            } ${selectedMessage === msg._id ? 'ring-2 ring-orange-300' : ''}`}
                          >
                            {/* Image */}
                            {msg.image && (
                              <div className="mb-2 relative group/image">
                                <img
                                  src={msg.image}
                                  alt="attachment"
                                  className="rounded-lg max-h-60 w-full object-cover cursor-pointer hover:opacity-90 transition"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setImagePreview(msg.image)
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition flex items-center justify-center rounded-lg">
                                  <ZoomIn className="text-white opacity-0 group-hover/image:opacity-100 transition" size={24} />
                                </div>
                              </div>
                            )}

                            {/* Text */}
                            {msg.text && (
                              <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                                {msg.text}
                              </p>
                            )}

                            {/* Time and Status */}
                            <div
                              className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                                isMine ? 'text-white/80' : 'text-gray-500'
                              }`}
                            >
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {isMine && (
                                <span>
                                  {msg.isRead ? (
                                    <CheckCheck size={14} className="text-blue-200" />
                                  ) : (
                                    <Check size={14} />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete Button */}
                          <AnimatePresence>
                            {isMine && selectedMessage === msg._id && (
                              <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                onClick={(e) => handleDeleteMessage(msg._id, e)}
                                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 active:scale-95 transition z-10"
                              >
                                <Trash2 size={14} />
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setImagePreview(null)}
          >
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <X className="text-white" size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chat
