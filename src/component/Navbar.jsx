import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi"
import logo from "./Images/logo.png"

function Navbar() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  // Session expire
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime")

    if (loginTime) {
      const now = Date.now()
      if (now - loginTime > 3600000) {
        localStorage.clear()
        navigate("/login")
      }
    }
  }, [navigate])

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 text-white">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2 min-w-0">
          <img src={logo} className="h-8 md:h-9 w-auto shrink-0" />
          <span className="text-lg md:text-xl font-bold truncate">
            CareerBridge
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">

          {!token && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary">Signup</Link>
            </>
          )}

          {token && user?.role === "user" && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/jobs" className="btn-primary">Jobs</Link>
            </>
          )}

          {token && user?.role === "recruiter" && (
            <>
              <Link to="/addJobs" className="nav-link">Add Jobs</Link>
              <Link to="/recruiterdashboard" className="nav-link">Dashboard</Link>
            </>
          )}

          {token && (
            <button
              onClick={() => {
                localStorage.clear()
                navigate('/')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
            >
              Logout <HiOutlineLogout />
            </button>
          )}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-[#0f172a]">

          {!token && (
            <>
              <Link to="/" onClick={()=>setMenuOpen(false)} className="nav-link">Home</Link>
              <Link to="/login" onClick={()=>setMenuOpen(false)} className="nav-link">Login</Link>
              <Link to="/signup" onClick={()=>setMenuOpen(false)} className="btn-primary">Signup</Link>
            </>
          )}

          {token && user?.role === "user" && (
            <>
              <Link to="/dashboard" onClick={()=>setMenuOpen(false)} className="nav-link">Dashboard</Link>
              <Link to="/jobs" onClick={()=>setMenuOpen(false)} className="btn-primary">Jobs</Link>
            </>
          )}

          {token && user?.role === "recruiter" && (
            <>
              <Link to="/addJobs" onClick={()=>setMenuOpen(false)} className="nav-link">Add Jobs</Link>
              <Link to="/recruiterdashboard" onClick={()=>setMenuOpen(false)} className="nav-link">Dashboard</Link>
            </>
          )}

          {token && (
            <button
              onClick={() => {
                localStorage.clear()
                navigate('/')
              }}
              className="px-4 py-2 rounded-lg bg-rose-500 text-white"
            >
              Logout
            </button>
          )}
        </div>
      )}

    </nav>
  )
}

export default Navbar