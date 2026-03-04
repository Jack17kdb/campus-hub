import React, { useRef, useState } from 'react'
import { Camera, Send, X, Smile } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import EmojiPicker from 'emoji-picker-react'
import { useChatStore } from '../store/chatStore.js'
import toast from 'react-hot-toast'

const ChatBar = () => {
  const { sendMessages, selectedUser } = useChatStore()

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileRef = useRef(null)
  const textareaRef = useRef(null)
  const emojiPickerRef = useRef(null)

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() && !image) return
    if (!selectedUser) {
      toast.error('Please select a user first')
      return
    }

    setIsSending(true)
    try {
      await sendMessages({ text: text.trim(), image })
      setText('')
      setImage(null)
      setImagePreview(null)
      if (fileRef.current) fileRef.current.value = ''
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const pickImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleTextChange = (e) => {
    setText(e.target.value)
    // Auto-resize textarea
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(e)
    }
  }

  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji
    const textarea = textareaRef.current
    const cursorPosition = textarea?.selectionStart || text.length
    
    const newText = 
      text.slice(0, cursorPosition) + 
      emoji + 
      text.slice(cursorPosition)
    
    setText(newText)
    
    // Auto-resize after adding emoji
    setTimeout(() => {
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
        // Move cursor after emoji
        textarea.focus()
        const newCursorPosition = cursorPosition + emoji.length
        textarea.setSelectionRange(newCursorPosition, newCursorPosition)
      }
    }, 0)
  }

  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest('.emoji-trigger')
      ) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  return (
    <div className="bg-white border-t border-gray-200 relative">
      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pt-3 border-b border-gray-100"
          >
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-lg border-2 border-orange-200"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 mb-3">Image ready to send</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            ref={emojiPickerRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 z-50"
          >
            <div className="shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={320}
                height={400}
                searchPlaceHolder="Search emoji..."
                previewConfig={{ showPreview: false }}
                skinTonesDisabled
                lazyLoadEmojis
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={send} className="p-3 sm:p-4 flex items-center justify-center gap-2 sm:gap-3">
        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
          onChange={pickImage}
          disabled={isSending}
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isSending}
          className="p-2.5 sm:p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition flex-shrink-0 disabled:opacity-50 cursor-pointer"
          title="Attach image"
        >
          <Camera size={20} className="text-gray-600" />
        </button>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={isSending}
          className={`emoji-trigger p-2.5 sm:p-3 rounded-full transition flex-shrink-0 disabled:opacity-50 cursor-pointer ${
            showEmojiPicker 
              ? 'bg-orange-100 text-orange-500' 
              : 'hover:bg-gray-100 active:bg-gray-200 text-gray-600'
          }`}
          title="Add emoji"
        >
          <Smile size={20} />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            className="w-full px-4 py-2.5 sm:py-3 bg-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition resize-none disabled:opacity-50 min-h-[44px] max-h-[120px]"
            rows="1"
          />
          
          {/* Character count for mobile */}
          {text.length > 500 && (
            <span className={`absolute bottom-2 right-3 text-[10px] ${text.length > 1000 ? 'text-red-500' : 'text-gray-400'}`}>
              {text.length}/1000
            </span>
          )}
        </div>

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={(!text.trim() && !image) || isSending}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full flex-shrink-0 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            text.trim() || image
              ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
              : 'bg-gray-300'
          }`}
        >
          {isSending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Send size={18} className="text-white" />
            </motion.div>
          ) : (
            <Send size={18} className="text-white" />
          )}
        </motion.button>
      </form>
    </div>
  )
}

export default ChatBar