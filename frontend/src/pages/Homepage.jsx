import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuthStore } from '../store/authStore.js'
import { useItemStore } from '../store/itemStore.js'

const Homepage = () => {
  const { authUser } = useAuthStore()
  const { items, getItems, isFetchingItems } = useItemStore()
  const navigate = useNavigate()
  const [visibleMarketplaceItems, setVisibleMarketplaceItems] = useState(4)
  const [visibleLostAndFoundItems, setVisibleLostAndFoundItems] = useState(4)

  useEffect(() => {
    getItems()
  }, [])

  const marketplaceItems = items?.filter((item) => item.intention === 'selling') || []
  const lostAndFoundItems = items?.filter((item) => item.intention === 'returning') || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gray-100 py-2"
    >
      <Navbar />

      <div className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
          <div className="h-[320px] md:h-auto">
            <img
              src="/blockA.jpeg"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center bg-blue-900 px-8 py-10 text-white md:px-12">
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
              Welcome Back to <br /> KIST Hub!
            </h1>

            <p className="mb-8 max-w-md text-sm text-blue-100">
              Find what you need, share it don’t. <br />
              Your campus, simplified.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/marketplace")}
                className="rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold transition hover:bg-orange-600 cursor-pointer"
              >
                EXPLORE SOMETHING
              </button>

              <button
                onClick={() => navigate("/lostandfound")}
                className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-blue-900 transition hover:bg-gray-100 cursor-pointer"
              >
                Lost & Found
              </button>
            </div>

            <p className="mt-8 text-xs text-blue-200">
              Logged in as <span className="font-semibold">{authUser.email}</span>
            </p>
          </div>
        </div>

        {/* Marketplace Preview */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Marketplace Preview</h2>
            <button
              onClick={() => navigate("/marketplace")}
              className="text-sm text-orange-500 hover:underline cursor-pointer"
            >
              View More
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {marketplaceItems.slice(0, visibleMarketplaceItems).map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md w-3/4"
              >
                <img
                  src={item.image}
                  className="h-32 w-full object-cover"
                />
                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <h2 className="text-sm font-semibold line-clamp-1">
                      {item.title}
                    </h2>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    <span
                      onClick={() => item.owner && navigate(`/user/${item.owner._id}`)}
                      className="cursor-pointer font-medium text-blue-600 hover:underline"
                    >
                      {item.owner?.username}
                    </span>
                    {' '}• KES {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lost & Found Preview */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lost & Found Preview</h2>
            <button
              onClick={() => navigate("/lostandfound")}
              className="text-sm text-orange-500 hover:underline cursor-pointer"
            >
              View More
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {lostAndFoundItems.slice(0, visibleLostAndFoundItems).map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md w-3/4"
              >
                <img
                  src={item.image}
                  className="h-32 w-full object-cover"
                />
                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <h2 className="text-sm font-semibold line-clamp-1">
                      {item.title}
                    </h2>
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    <span
                      onClick={() => item.owner && navigate(`/user/${item.owner._id}`)}
                      className="cursor-pointer font-medium text-blue-600 hover:underline"
                    >
                      {item.owner?.username}
                    </span>
                    {' '}• {item.location || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default Homepage
