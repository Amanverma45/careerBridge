import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi"
import logo from "./Images/lgo.png"

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
    // <nav className="sticky top-2 z-50 w-[90%] md:w-[90%] max-w-[1300px] h-20 mx-auto bg-[#0f172a]/60 backdrop-blur-md border-border-slate-700 rounded-tl-[60px] rounded-br-[60px] shadow-none text-white">
    <nav className="sticky top-2 z-50 w-full md:w-[90%] max-w-[1300px] h-20 mx-auto bg-[#0f172a]/85      backdrop-blur-md rounded-none md:rounded-tl-[60px] md:rounded-br-[60px] shadow-xl text-white">

      <div className="px-6 md:px-15 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1 min-w-0">
          <img
            src={logo}
            className="h-14 md:h-16 w-auto shrink-0"
          />

          <span className="text-xl md:text-2xl font-bold text-white">
            CareerBridge
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">

          {!token && (
            <>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-6 py-2 rounded-xl text-sm font-semibold bg-[#2E7D32] text-white hover:bg-[#256728] transition-all duration-200 shadow-md shadow-indigo-500/20 active:scale-95"
              >
                Signup
              </Link>
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
              className="flex items-center text-white gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 font-semibold hover:bg-rose-500 hover:text-white transition"
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
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-[#2E7D32]">

          {!token && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} className="nav-link">Home</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="nav-link">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary">Signup</Link>
            </>
          )}

          {token && user?.role === "user" && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="nav-link">Dashboard</Link>
              <Link to="/jobs" onClick={() => setMenuOpen(false)} className="btn-primary">Jobs</Link>
            </>
          )}

          {token && user?.role === "recruiter" && (
            <>
              <Link to="/addJobs" onClick={() => setMenuOpen(false)} className="nav-link">Add Jobs</Link>
              <Link to="/recruiterdashboard" onClick={() => setMenuOpen(false)} className="nav-link">Dashboard</Link>
            </>
          )}

          {token && (
            <button
              onClick={() => {
                localStorage.clear()
                navigate('/')
              }}
              className="px-4 py-2 rounded-lg bg-rose-50 text-white"
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