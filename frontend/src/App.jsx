import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Homepage from './pages/Homepage.jsx';
import MarketPlace from './pages/MarketPlace.jsx';
import LostAndFound from './pages/LostAndFound.jsx';
import ChatPage from './pages/ChatPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CreateItem from './pages/CreateItem.jsx';
import ProfileEdit from './pages/ProfileEdit.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import UserDetails from './pages/UserDetails.jsx';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore.js'
import { useEffect, useState } from 'react';
import InstallPrompt from './components/InstallPrompt.jsx';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={!authUser ? <Register /> : <Navigate to='/home' />} />
          <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/home' />} />
          <Route path='/forgot-password' element={!authUser ? <ForgotPassword /> : <Navigate to='/home' />} />
          <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to='/home' />} />
          <Route path='/home' element={authUser ? <Homepage /> : <Navigate to='/login' />} />
          <Route path='/marketplace' element={authUser ? <MarketPlace /> : <Navigate to='/login' />} />
          <Route path='/lostandfound' element={authUser ? <LostAndFound /> : <Navigate to='/login' />} />
          <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to='/login' />} />
          <Route path='/search' element={authUser ? <SearchPage /> : <Navigate to='/login' />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
          <Route path='/create' element={authUser ? <CreateItem /> : <Navigate to='/login' />} />
          <Route path='/profile-edit' element={authUser ? <ProfileEdit /> : <Navigate to='/login' />} />
          <Route path='/item/:id' element={authUser ? <ItemDetails /> : <Navigate to='/login' />} />
          <Route path='/user/:id' element={authUser ? <UserDetails /> : <Navigate to='/login' />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
      <InstallPrompt />
    </>
  )
}

export default App
