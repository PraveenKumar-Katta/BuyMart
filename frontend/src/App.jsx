import { useState } from 'react'
import './App.css'
import Signup from './pages/signup'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import Product from './components/product'
import Cart from './components/Cart'
import LandingPage from './pages/LandingPage'
import Profile from './pages/Profile'
import CategoryItems from './pages/CategoryItems'

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/" element={<LandingPage />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Home/>} />
      <Route path='/dashboard/product/:id' element={<Product/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/profile' element={<Profile/>}/>
      <Route path="/category/:id" element={<CategoryItems />} />
    </Routes>
    </>
  )
}

export default App
