import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Send, Trash2, Bot, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { useAiStore } from '../store/aiStore.js'
import { useAuthStore } from '../store/authStore.js'

const SUGGESTIONS = [
  'Is anyone selling a scientific calculator?',
  'I lost a black wallet near the cafeteria',
  'What textbooks are available for donation?',
  'Show me electronics under KES 5000',
  'Has anyone found a student ID card?',
  'What time does the library close?',
]

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex items-end gap-2 max-w-[80%]">
      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
        <Bot size={16} className="text-orange-500" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  </div>
)

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-gray-800' : 'bg-orange-100'
        }`}>
          {isUser
            ? <span className="text-white text-xs font-semibold">You</span>
            : <Bot size={16} className="text-orange-500" />
          }
        </div>

        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-gray-900 text-white rounded-br-sm'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
        }`}>
          {message.content}
        </div>
      </div>
    </motion.div>
  )
}

const AiPage = () => {
  const { messages, isThinking, sendMessage, clearMessages } = useAiStore()
  const { authUser } = useAuthStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isThinking) return
    const text = input.trim()
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await sendMessage(text)
  }

  const handleSuggestion = (text) => {
    setInput(text)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextChange = (e) => {
    setInput(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
    }
  }

  const isEmpty = messages.length === 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-100"
    >
      <Navbar />

      <div className="fixed top-16 left-0 right-0 bottom-0 flex flex-col max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 flex items-center gap-1.5">
                KistBot
                <Sparkles size={14} className="text-orange-500" />
              </h1>
              <p className="text-xs text-gray-500">AI Campus Assistant — Marketplace & Lost and Found</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition px-3 py-1.5 rounded-full hover:bg-red-50 cursor-pointer"
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto pb-4">
          {isEmpty ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full gap-6 text-center px-4"
            >
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <Bot size={36} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">How can I help you?</h2>
                <p className="text-sm text-gray-500 max-w-sm">
                  Ask me to find items on the marketplace, check the lost and found board, or answer campus questions.
                </p>
              </div>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition cursor-pointer shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Message list */
            <div className="space-y-4 py-2">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}
                {isThinking && <TypingIndicator key="typing" />}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-4 px-4 py-3">
          <form onSubmit={handleSend} className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about items, lost and found, or campus info..."
              disabled={isThinking}
              rows={1}
              className="flex-1 bg-transparent text-sm outline-none resize-none min-h-[24px] max-h-[120px] text-gray-800 placeholder-gray-400 disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isThinking}
              whileTap={{ scale: 0.92 }}
              className={`p-2.5 rounded-full transition shrink-0 cursor-pointer ${
                input.trim() && !isThinking
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </motion.button>
          </form>
        </div>

      </div>
    </motion.div>
  )
}

export default AiPage
