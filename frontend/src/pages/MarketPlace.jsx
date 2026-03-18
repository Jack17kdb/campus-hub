import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'
import { motion } from 'motion/react'
import { useItemStore } from '../store/itemStore.js'

const categories = [
  'All',
  'Textbooks',
  'Electronics',
  'Hostel Gear',
  'Lab Equipment',
  'Documents',
  'Personal Items',
  'Clothing',
  'Others',
]

const MarketPlace = () => {
  const navigate = useNavigate();
  const { items, getItems, getItemsByCategory, isFetchingItems } = useItemStore()
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(15)

  useEffect(() => {
    const isSmall = window.innerWidth < 640
    setVisibleCount(isSmall ? 8 : 18)
    getItems()
  }, [])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    if (category === 'All') {
      getItems()
    } else {
      getItemsByCategory(category)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-2"
    >
      <Navbar />

      <div className="mx-auto mt-20 max-w-7xl px-4">
        <h1 className="mb-6 text-2xl font-semibold">Marketplace</h1>

        <div className="mb-8 flex flex-wrap justify-around gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-1.5 text-sm cursor-pointer transition ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isFetchingItems && (
          <div className="text-center text-gray-500">Loading items...</div>
        )}

        {!isFetchingItems && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items && items.filter((item) => item.intention === 'selling').slice(0, visibleCount).map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/item/${item._id}`)}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <img
                  src={item.image}
                  className="h-44 w-full object-cover"
                />

                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
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
                    {item.owner?.username} • {item.owner?.studentId ? new DOMParser().parseFromString(item.owner.studentId, 'text/html').body.textContent : ''}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-orange-500">
                      KES {item.price}
                    </span>

                    <button type='button' onClick={() => navigate(`/item/${item._id}`)} className="rounded-full border px-3 py-1 text-xs hover:bg-gray-200 cursor-pointer">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MarketPlace
