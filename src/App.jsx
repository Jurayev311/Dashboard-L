import React, { useEffect } from 'react'
import './App.css'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Category from './pages/dashboard/Category';
import Discount from './pages/dashboard/Discount';
import Sizes from './pages/dashboard/Sizes';
import Colors from './pages/dashboard/Colors';
import Faq from './pages/dashboard/Faq';
import Contact from './pages/dashboard/Contact';
import Team from './pages/dashboard/Team';
import News from './pages/dashboard/News';
import Products from './pages/dashboard/Products';

function App() {
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate("/dashboard/products")
    } else {
      navigate('/')
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='products' element={<Products />}/>
          <Route path='category' element={<Category />}/>
          <Route path='discount' element={<Discount />}/>
          <Route path='sizes' element={<Sizes />}/>
          <Route path='colors' element={<Colors />}/>
          <Route path='faq' element={<Faq />}/>
          <Route path='contact' element={<Contact />}/>
          <Route path='team' element={<Team />}/>
          <Route path='news' element={<News />}/>
        </Route>

      </Routes>

      <Toaster position='top-right' />
    </>
  )
}

export default App
