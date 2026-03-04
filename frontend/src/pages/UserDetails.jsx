import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar.jsx'
import { useAuthStore } from '../store/authStore.js'
import { useItemStore } from '../store/itemStore.js'
import { useChatStore } from '../store/chatStore.js'

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user, getUserById, isFetchingUserById } = useAuthStore()
  const { items, getItems, isFetchingItems } = useItemStore()
  const { setSelectedUser } = useChatStore()

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    if (id) getUserById(id)
  }, [id])

  const userItems =
    items?.filter((item) => item.owner?._id === user?._id) || []

  const handleMessageClick = () => {
    if (user) {
      setSelectedUser(user);
      navigate('/chat');
    }
  }

  if (isFetchingUserById) {
    return (
      <div className="min-h-screen bg-gray-100 py-2">
        <Navbar />
        <div className="mt-32 text-center text-gray-500">
          Loading user profile...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-2">
        <Navbar />
        <div className="mt-32 text-center text-gray-500">
          User not found
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 py-2 mt-12"
    >
      <Navbar />

      <div className="relative mx-auto mt-6 max-w-6xl px-4">
        <div className="h-72 w-full overflow-hidden rounded-2xl">
          <img
            src="/kist.jpg"
            className="h-full w-full object-cover brightness-75"
          />
        </div>

        <div className="relative mx-auto -mt-20 max-w-4xl rounded-2xl bg-white px-8 pb-8 pt-24 shadow-lg text-center md:text-left">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {user.username}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.studentId}</p>
            </div>

            <button
              onClick={handleMessageClick}
              className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 cursor-pointer"
            >
              message {user.username}
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 top-40 -translate-x-1/2">
          <div className="rounded-full bg-white p-1 shadow-lg">
            <img
              src={user.profilePic || '/default.jpeg'}
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 bg-gray-200 px-4 py-4">
        <p className="text-xl font-semibold text-gray-800">
          {user.username}'s Listings
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {isFetchingItems ? (
          <div className="text-center text-gray-500">
            Loading listings...
          </div>
        ) : userItems.length === 0 ? (
          <div className="text-center text-gray-500">
            No listings yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {userItems.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  className="h-32 w-full object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-semibold line-clamp-1">
                      {item.title}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        item.status === 'Available'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.intention === 'selling'
                      ? `KES ${item.price}`
                      : 'Lost & Found'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default UserDetails
