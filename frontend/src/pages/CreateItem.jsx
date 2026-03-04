import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'motion/react'
import { useItemStore } from '../store/itemStore.js'

const CreateItem = () => {
  const [intention, setIntention] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const [userData, setUserData] = useState({
    title: '',
    description: '',
    image: null,
    intention: '',
    price: 0,
    category: '',
    status: ''
  })

  const { createItem, isCreatingItems } = useItemStore()

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      intention,
      price: intention === 'returning' ? 0 : prev.price
    }))
  }, [intention])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
       setUserData({ ...userData, image: reader.result });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createItem(userData);
    setUserData({
        title: '',   
        description: '',
        image: null,
        intention: '',
        price: 0,
        category: '',
        status: ''
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gray-100 py-2"
    >
      <Navbar />

      <div className="mx-auto mt-28 max-w-4xl px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-2xl font-semibold">Create Item</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium">Intention</label>
              <select
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:border-orange-400"
              >
                <option value="">Select intention</option>
                <option value="selling">Selling</option>
                <option value="returning">Returning (Lost & Found)</option>
              </select>
            </div>

            {intention && (
              <>
                <input
                  placeholder="Title"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-orange-400"
                  value={userData.title}
                  onChange={(e) => setUserData({ ...userData, title: e.target.value })}
                />

                <textarea
                  rows="4"
                  placeholder="Description"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:border-orange-400"
                  value={userData.description}
                  onChange={(e) =>
                    setUserData({ ...userData, description: e.target.value })
                  }
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border px-4 py-2 cursor-pointer"
                />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    className="mx-auto mt-4 h-48 w-48 rounded-xl object-cover shadow-md"
                  />
                )}
              </>
            )}

            {intention === 'selling' && (
              <>
                <select
                  className="w-full rounded-lg border px-4 py-2"
                  value={userData.category}
                  onChange={(e) => setUserData({ ...userData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  <option>Textbooks</option>
                  <option>Electronics</option>
                  <option>Hostel Gear</option>
                  <option>Lab Equipment</option>
                  <option>Documents</option>
                  <option>Personal Items</option>
                  <option>Clothing</option>
                  <option>Others</option>
                </select>

                <select
                  className="w-full rounded-lg border px-4 py-2"
                  value={userData.status}
                  onChange={(e) => setUserData({ ...userData, status: e.target.value })}
                >
                  <option>Available</option>
                  <option>Sold</option>
                </select>

                <input
                  type="number"
                  placeholder="Price"
                  className="w-full rounded-lg border px-4 py-2"
                  value={userData.price}
                  onChange={(e) =>
                    setUserData({ ...userData, price: Number(e.target.value) })
                  }
                />
              </>
            )}

            {intention === 'returning' && (
              <>
                <select
                  className="w-full rounded-lg border px-4 py-2"
                  value={userData.category}
                  onChange={(e) => setUserData({ ...userData, category: e.target.value })}
                >
                  <option>IDs</option>
                  <option>Keys</option>
                  <option>Wallets</option>
                  <option>Gadgets</option>
                  <option>Bags</option>
                </select>

                <select
                  className="w-full rounded-lg border px-4 py-2"
                  value={userData.status}
                  onChange={(e) => setUserData({ ...userData, status: e.target.value })}
                >
                  <option>Lost</option>
                  <option>Found</option>
                </select>

                <input
                  type="number"
                  value={0}
                  disabled
                  className="w-full rounded-lg border border-gray-600 bg-gray-100 px-4 py-2"
                />
              </>
            )}

            {intention && (
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isCreatingItems}
                  className="rounded-full bg-orange-500 px-6 py-2 text-white cursor-pointer"
                >
                  Create Item
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default CreateItem
