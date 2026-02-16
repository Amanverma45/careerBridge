import React from 'react'
import Navbar from "./component/Navbar.jsx"
import Home from './component/Home.jsx'
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import Job from './component/Job.jsx'
import Footer from './component/Footer.jsx'
import Welcome from './component/Welcome.jsx'
import { Route,Routes } from 'react-router-dom'
import ProtectedRoute from './component/ProtectedRoute.jsx'
import Profile from './component/Profile.jsx'

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/job" element={<ProtectedRoute><Job/></ProtectedRoute>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<ProtectedRoute><Welcome/></ProtectedRoute>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </div>
      <Footer/>
    </>
  )
}
export default App;