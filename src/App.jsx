import React from 'react'
import Navbar from "./component/Navbar.jsx"
import Home from './component/Home.jsx'
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import Footer from './component/Footer.jsx'
import Welcome from './component/Welcome.jsx'
import { Route,Routes } from 'react-router-dom'
function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/welcome" element={<Welcome/>}/>
        </Routes>
      </div>
      <Footer/>
    </>
  )
}
export default App;