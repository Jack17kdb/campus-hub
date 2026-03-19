import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ArrowDownLeft, Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { usePaymentStore } from '../store/paymentStore.js'

const StatusBadge = ({ status }) => {
  const map = {
    Success: { icon: <CheckCircle size={12} />, cls: 'bg-green-100 text-green-600' },
    Failed:  { icon: <XCircle size={12} />,    cls: 'bg-red-100 text-red-500' },
    Pending: { icon: <Clock size={12} />,       cls: 'bg-yellow-100 text-yellow-600' },
  }
  const { icon, cls } = map[status] || map['Pending']
  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {icon} {status}
    </span>
  )
}

const PaymentsPage = () => {
  const { payments, getPaymentsByType, filterPayments, isFetchingPayments, isFilteringPayments } = usePaymentStore()
  const [activeTab, setActiveTab] = useState('sent')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getPaymentsByType(activeTab)
  }, [activeTab])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.trim()) {
      filterPayments(val.trim())
    } else {
      getPaymentsByType(activeTab)
    }
  }

  const isLoading = isFetchingPayments || isFilteringPayments

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-100 py-2"
    >
      <Navbar />

      <div className="mx-auto mt-20 max-w-3xl px-4">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Payment History</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {['sent', 'received'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery('') }}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium transition cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'sent'
                ? <ArrowUpRight size={14} />
                : <ArrowDownLeft size={14} />
              }
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-5">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by phone, amount or status..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center text-gray-500 mt-16">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            No {activeTab} payments found.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {payments.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
              >
                {/* Item image */}
                <img
                  src={p.itemId?.image || '/default.jpeg'}
                  className="h-14 w-14 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {p.itemId?.title || 'Unknown item'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeTab === 'sent'
                      ? `To: ${p.receiverId?.username || '—'}`
                      : `From: ${p.senderId?.username || '—'}`
                    }
                    {p.phone ? ` • ${p.phone}` : ''}
                  </p>
                  {p.receiptNumber && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Receipt: {p.receiptNumber}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString([], {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-sm font-bold text-gray-800">
                    KES {p.amount?.toLocaleString()}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PaymentsPage
