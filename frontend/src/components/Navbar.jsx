import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaSearch, FaBars, FaTimes, FaArrowLeft, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { MessageCircle, Bot } from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'
import { useItemStore } from '../store/itemStore.js'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { logout, authUser } = useAuthStore()
  const { searchItems, isSearching } = useItemStore()
  const navigate = useNavigate()
  const profileDropdownRef = useRef(null)

  const navLinkStyles = ({ isActive }) =>
    `text-md font-medium transition-colors ${
      isActive
        ? 'text-orange-500'
        : 'text-gray-700 hover:text-orange-500'
    }`

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchItems(searchQuery)
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
      setSearchMode(false)
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {!searchMode ? (
          <>
            <div className="flex items-center gap-9">
              <h2 className="text-lg font-semibold">Kist Hub</h2>

              <div className="hidden gap-9 md:flex">
                <NavLink to="/home" className={navLinkStyles}>Home</NavLink>
                <NavLink to="/marketplace" className={navLinkStyles}>MarketPlace</NavLink>
                <NavLink to="/lostandfound" className={navLinkStyles}>LostandFound</NavLink>
                <NavLink to="/create" className={navLinkStyles}>Create</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => setSearchMode(true)}
                className="md:hidden text-gray-500 hover:text-black"
              >
                <FaSearch className="text-lg cursor-pointer" />
              </button>

              <div className="hidden md:flex">
                <form onSubmit={handleSearch} className="flex items-center rounded-full bg-gray-100 px-4 py-1.5 focus-within:bg-white">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-32 bg-transparent text-sm outline-none md:w-48"
                  />
                  <button type="submit">
                    <FaSearch className="text-sm text-gray-400 hover:text-orange-500" />
                  </button>
                </form>
              </div>

              <NavLink to="/chat">
                <MessageCircle className="cursor-pointer text-gray-500 transition hover:text-black" />
              </NavLink>

              <NavLink to="/kistbot" title="KistBot AI Assistant">
                <Bot className="cursor-pointer text-gray-500 transition hover:text-orange-500" />
              </NavLink>

              <div ref={profileDropdownRef} className="relative">
                <img
                  src={authUser.profilePic || "/default.jpeg"}
                  className="h-8 w-8 cursor-pointer rounded-full object-contain"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                />
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <FaUser /> Profile
                      </NavLink>
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false) }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setOpen(!open)}
                className="md:hidden text-gray-700 cursor-pointer"
              >
                {open ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex w-full items-center gap-3">
            <button
              onClick={() => setSearchMode(false)}
              className="text-gray-600 hover:text-black"
            >
              <FaArrowLeft />
            </button>

            <form onSubmit={handleSearch} className="flex flex-1 items-center rounded-full bg-gray-100 px-4 py-1.5">
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
              <button type="submit">
                <FaSearch className="text-sm text-gray-400" />
              </button>
            </form>
          </div>
        )}
      </div>

      {open && !searchMode && (
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-4 md:hidden">
          <NavLink to="/home" className={navLinkStyles} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/marketplace" className={navLinkStyles} onClick={() => setOpen(false)}>
            MarketPlace
          </NavLink>
          <NavLink to="/lostandfound" className={navLinkStyles} onClick={() => setOpen(false)}>
            LostandFound
          </NavLink>
          <NavLink to="/create" className={navLinkStyles} onClick={() => setOpen(false)}>
            Create
          </NavLink>
        </div>
      )}
    </nav>
  )
}

export default Navbar
