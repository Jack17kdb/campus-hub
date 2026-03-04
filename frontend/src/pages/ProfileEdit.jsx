import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { Camera } from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'

const ProfileEdit = () => {
  const { authUser, deleteAccount, isDeletingAccount, updatePic, isUpdatingPic } = useAuthStore()
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      updatePic({"profilePic": reader.result})
    }
  }

  const handleDeletion = async () => {
    await deleteAccount()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <Navbar />

      <div className="mx-auto mt-20 max-w-3xl px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-2xl font-semibold">Edit Profile</h1>

          <div className="mb-12 flex justify-center">
            <label className="relative cursor-pointer">
              <img
                src={authUser.profilePic || '/default.jpeg'}
                className={`h-32 w-32 rounded-full object-cover ring-4 ring-orange-400 ${isUpdatingPic ? 'opacity-60' : ''}`}
              />

              <div className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600">
                <Camera size={18} />
              </div>

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border px-6 py-2 cursor-pointer hover:bg-gray-300 transition duration-200"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleDeletion}
              className="rounded-full border border-red-500 px-6 py-2 text-red-500 hover:bg-red-100 cursor-pointer transition duration-200"
            >
              {isDeletingAccount ? 'Deleting account...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit
