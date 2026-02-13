import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { HiOutlineLogout } from "react-icons/hi"
import logo from "./Images/logo.png"

function Navbar() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 text-white px-6 py-3 flex items-center justify-between">

      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="CareerBridge Logo"
          className="h-12 w-auto"
        />
        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
          CareerBridge
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!token && (
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              Signup
            </Link>
          </div>
        )}

        {token && (
          <>
            <Link to="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all">Dashboard</Link>
            <Link to="/job" className="px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">Jobs</Link>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                navigate('/')
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 group shadow-lg shadow-rose-500/10"
            >
              <span className="text-sm font-bold">Logout</span>
              <HiOutlineLogout className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar