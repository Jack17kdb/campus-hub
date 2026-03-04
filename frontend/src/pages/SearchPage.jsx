import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useItemStore } from '../store/itemStore.js'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const navigate = useNavigate()
  const { items, searchItems, isSearching } = useItemStore()

  useEffect(() => {
    if (query) {
      searchItems(query)
    }
  }, [query])

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <Navbar />

      <div className="mx-auto mt-20 max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Search Results
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing results for{' '}
            <span className="font-medium text-orange-500">
              “{query}”
            </span>
          </p>
        </div>

        {/* States */}
        {isSearching ? (
          <div className="mt-24 text-center text-gray-500">
            Searching items...
          </div>
        ) : items.length === 0 ? (
          <div className="mt-24 text-center text-gray-500">
            No items matched your search.
          </div>
        ) : (
          /* Results */
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-36 w-full object-cover"
                />

                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
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

                  <p className="mb-2 text-xs text-gray-500">
                    <span
                      onClick={() => navigate(`/user/${item.owner?._id}`)}
                      className="cursor-pointer font-medium hover:underline"
                    >
                      {item.owner?.username}
                    </span>
                  </p>

                  <p className="text-sm font-semibold text-orange-500">
                    {item.intention === 'selling'
                      ? `KES ${item.price}`
                      : item.location || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
