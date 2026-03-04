import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useItemStore } from '../store/itemStore.js';

const ProfilePage = () => {
  const { items, getItems, isFetchingItems } = useItemStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getItems();
  }, []);

  const userItems = items?.filter((item) => item.owner?._id === authUser?._id) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gray-100 py-2 mt-12"
    >
      <Navbar />

      <div className="relative mx-auto mt-6 max-w-6xl px-4">
        <div className="h-72 w-full overflow-hidden rounded-2xl">
          <img
            src="/kist.jpg"
            alt="Cover"
            className="h-full w-full object-cover brightness-75"
          />
        </div>

        <div className="relative mx-auto -mt-20 max-w-4xl rounded-2xl bg-white px-8 pb-8 pt-24 shadow-lg">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                {authUser.username}
              </h1>
              <p className="text-sm text-gray-500">
                {authUser.email}
              </p>
              <p className="text-sm text-gray-500">
                {authUser.studentId}
              </p>
            </div>

            <button
              onClick={() => navigate("/profile-edit")}
              className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-orange-600 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 top-40 -translate-x-1/2">
          <div className="rounded-full bg-white p-1 shadow-lg">
            <img
              src={authUser.profilePic || "/default.jpeg"}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 bg-gray-200 px-4 py-4">
        <p className="text-xl font-semibold text-gray-800">My Listings</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {isFetchingItems ? (
          <div className="text-center text-gray-500">Loading your listings...</div>
        ) : userItems.length === 0 ? (
          <div className="text-center text-gray-500">You have no listings yet.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {userItems.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
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
                    {item.intention === 'selling' ? `KES ${item.price}` : item.location || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
