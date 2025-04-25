import React, { useEffect } from 'react'
import './App.css'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate("/dashboard")
    } else {
      navigate('/')
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />

      </Routes>

      <Toaster position='top-right' />
    </>
  )
}

export default App
