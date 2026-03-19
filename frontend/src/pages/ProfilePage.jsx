import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useItemStore } from '../store/itemStore.js';
import { usePaymentStore } from '../store/paymentStore.js';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    Success: { icon: <CheckCircle size={11} />, cls: 'bg-green-100 text-green-600' },
    Failed:  { icon: <XCircle size={11} />,    cls: 'bg-red-100 text-red-500' },
    Pending: { icon: <Clock size={11} />,       cls: 'bg-yellow-100 text-yellow-600' },
  }
  const { icon, cls } = map[status] || map['Pending']
  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {icon} {status}
    </span>
  )
}

const ProfilePage = () => {
  const { items, getItems, isFetchingItems } = useItemStore();
  const { authUser } = useAuthStore();
  const { payments, getPaymentsByType, isFetchingPayments } = usePaymentStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    getItems();
    getPaymentsByType('sent');
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

      {/* Cover + profile card */}
      <div className="relative mx-auto mt-6 max-w-6xl px-4">
        <div className="h-72 w-full overflow-hidden rounded-2xl">
          <img src="/kist.jpg" alt="Cover" className="h-full w-full object-cover brightness-75" />
        </div>

        <div className="relative mx-auto -mt-20 max-w-4xl rounded-2xl bg-white px-8 pb-8 pt-24 shadow-lg">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">{authUser.username}</h1>
              <p className="text-sm text-gray-500">{authUser.email}</p>
              <p className="text-sm text-gray-500">{authUser.studentId}</p>
              {!authUser.isVerified && (
                <span className="inline-block mt-2 rounded-full bg-yellow-100 px-3 py-0.5 text-xs text-yellow-600">
                  Email not verified
                </span>
              )}
            </div>

            <button
              onClick={() => navigate('/profile-edit')}
              className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-orange-600 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Floating avatar */}
        <div className="absolute left-1/2 top-40 -translate-x-1/2">
          <div className="rounded-full bg-white p-1 shadow-lg">
            <img
              src={authUser.profilePic || '/default.jpeg'}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-6xl px-4 mt-8">
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          {['listings', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 text-sm font-medium capitalize transition border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab === 'listings' ? `My Listings (${userItems.length})` : 'Payments'}
            </button>
          ))}
        </div>

        {/* Listings tab */}
        {activeTab === 'listings' && (
          isFetchingItems ? (
            <div className="text-center text-gray-500">Loading your listings...</div>
          ) : userItems.length === 0 ? (
            <div className="text-center text-gray-500">You have no listings yet.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-10">
              {userItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/item/${item._id}`)}
                  className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md cursor-pointer"
                >
                  <img src={item.image} className="h-32 w-full object-cover" />
                  <div className="p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <h2 className="text-sm font-semibold line-clamp-1">{item.title}</h2>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        item.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">{item.intention}</p>
                    {item.intention === 'selling' && (
                      <p className="text-xs font-semibold text-orange-500 mt-0.5">KES {item.price?.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Payments tab */}
        {activeTab === 'payments' && (
          <div className="pb-10">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => navigate('/payments')}
                className="text-sm text-orange-500 hover:underline cursor-pointer"
              >
                View full history →
              </button>
            </div>
            {isFetchingPayments ? (
              <div className="text-center text-gray-500">Loading payments...</div>
            ) : payments.length === 0 ? (
              <div className="text-center text-gray-500">No payment history yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {payments.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                    <img src={p.itemId?.image || '/default.jpeg'} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{p.itemId?.title || 'Unknown item'}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-bold text-gray-800">KES {p.amount?.toLocaleString()}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
