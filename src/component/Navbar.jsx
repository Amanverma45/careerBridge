import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { HiOutlineLogout, HiMenu, HiX, HiSun, HiMoon } from "react-icons/hi"

function Navbar() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

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

  // Sync theme with HTML tag
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }

  const isActive = (path) => location.pathname === path

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 70) {
        setIsScrolled(true)
      } else if (currentScrollY < 15) {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ease-in-out ${
      isScrolled 
        ? "w-full h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800/80 shadow-md rounded-none text-slate-800 dark:text-white" 
        : "w-full sm:w-[95%] md:w-[90%] max-w-[1300px] h-16 sm:h-20 sm:top-4 mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b sm:border border-slate-200/60 dark:border-slate-850 rounded-none sm:rounded-2xl md:rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-slate-850 dark:text-white"
    }`}>
      <div className="h-full px-3 xs:px-4 sm:px-6 md:px-10 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <Link to="/" className="inline-flex items-center shrink-0 select-none group">
          <svg width="220" height="55" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 sm:w-56 h-auto">
            <defs>
              <linearGradient id="cb-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <g transform="translate(10, 10)">
              <path d="M 5 35 A 18 18 0 0 1 35 35" stroke="url(#cb-grad)" strokeWidth="5" strokeLinecap="round" fill="none" className="transition-all duration-500" />
              <path d="M 0 37 L 40 37" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" className="transition-all duration-350 group-hover:stroke-brand-secondary" />
              <circle cx="20" cy="12" r="4.5" fill="#F59E0B" className="animate-logo-dot" />
            </g>
            <text x="60" y="40" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#2563EB">
              Career<tspan fill="#14B8A6">Bridge</tspan>
            </text>
          </svg>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {!token && (
            <>
              <Link
                to="/"
                className={`relative px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group ${
                  isActive('/') ? 'text-brand-secondary' : 'text-slate-650 hover:text-brand-secondary dark:text-slate-300 dark:hover:text-brand-secondary'
                }`}
              >
                Home
                <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-secondary transition-all duration-300 ${
                  isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>

              <Link
                to="/about"
                className={`relative px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group ${
                  isActive('/about') ? 'text-brand-secondary' : 'text-slate-655 hover:text-brand-secondary dark:text-slate-300 dark:hover:text-brand-secondary'
                }`}
              >
                About
                <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-secondary transition-all duration-300 ${
                  isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>

              <button
                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-login")); }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700/80 hover:border-brand-primary dark:hover:border-brand-primary rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Login
              </button>

              <button
                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-register")); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Register
              </button>
            </>
          )}

          {token && (
            <>
              <Link
                to={user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard"}
                className={`relative px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group ${
                  isActive(user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard") ? 'text-brand-secondary' : 'text-slate-655 hover:text-brand-secondary dark:text-slate-300 dark:hover:text-brand-secondary'
                }`}
              >
                Dashboard
                <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-secondary transition-all duration-300 ${
                  isActive(user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard") ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>

              {user?.role === "user" && (
                <Link
                  to="/savedJobs"
                  className={`relative px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group ${
                    isActive('/savedJobs') ? 'text-brand-secondary' : 'text-slate-655 hover:text-brand-secondary dark:text-slate-300 dark:hover:text-brand-secondary'
                  }`}
                >
                  Saved Jobs
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-secondary transition-all duration-300 ${
                    isActive('/savedJobs') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )}

              {user?.role === "user" && (
                <Link
                  to="/jobs"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                >
                  Jobs
                </Link>
              )}

              {user?.role === "recruiter" && (
                <Link
                  to="/addJobs"
                  className={`relative px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group ${
                    isActive('/addJobs') ? 'text-brand-secondary' : 'text-slate-655 hover:text-brand-secondary dark:text-slate-300 dark:hover:text-brand-secondary'
                  }`}
                >
                  Add Jobs
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-secondary transition-all duration-300 ${
                    isActive('/addJobs') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )}

              <button
                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-profile")); }}
                className={`relative px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group cursor-pointer ${
                  isActive('/profile') ? 'text-brand-secondary' : 'text-slate-655 hover:text-brand-secondary dark:text-slate-300 dark:hover:text-brand-secondary'
                }`}
              >
                Profile
                <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-secondary transition-all duration-300 ${
                  isActive('/profile') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <HiSun className="text-xl text-amber-500 animate-pulse-slow" /> : <HiMoon className="text-xl text-slate-650" />}
          </button>

          {token && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-rose-200 dark:border-rose-900/30 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 font-semibold text-sm hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              Logout <HiOutlineLogout className="text-base" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 active:scale-90 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <HiSun className="text-lg text-amber-500" /> : <HiMoon className="text-lg text-slate-650" />}
          </button>
          
          <button
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-lg sm:text-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:scale-90 transition-all z-55"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Top Dropdown Menu */}
      <div
        className={`absolute top-[calc(100%+2px)] left-0 right-0 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/60 dark:border-slate-800 shadow-xl rounded-2xl transition-all duration-300 ease-out origin-top z-50 overflow-hidden ${
          menuOpen ? 'scale-y-100 opacity-100 visible h-auto' : 'scale-y-95 opacity-0 invisible h-0 pointer-events-none'
        }`}
      >
        {!token ? (
          <div className="p-4 flex flex-col gap-4">
            {/* 2x2 Grid of Links */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-350 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive('/about')
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-655 dark:text-slate-350 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                About
              </Link>
            </div>

            {/* Login & Register Buttons Side-by-Side */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setMenuOpen(false); window.dispatchEvent(new Event("open-login")); }}
                className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer border-none"
              >
                Login
              </button>
              <button
                onClick={() => { setMenuOpen(false); window.dispatchEvent(new Event("open-register")); }}
                className="py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm active:scale-95 cursor-pointer border-none"
              >
                Register
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {/* 2x2 Grid of Dashboard Options */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to={user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard"}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive(user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard")
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-655 dark:text-slate-350 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>

              <button
                onClick={() => { setMenuOpen(false); window.dispatchEvent(new Event("open-profile")); }}
                className={`flex items-center justify-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer border-none ${
                  isActive('/profile')
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-655 dark:text-slate-350 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Profile
              </button>

              {user?.role === "recruiter" && (
                <Link
                  to="/addJobs"
                  onClick={() => setMenuOpen(false)}
                  className={`col-span-2 flex items-center justify-center py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                    isActive('/addJobs')
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-655 dark:text-slate-350 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Add Jobs
                </Link>
              )}

              {user?.role === "user" && (
                <Link
                  to="/savedJobs"
                  onClick={() => setMenuOpen(false)}
                  className={`col-span-2 flex items-center justify-center py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                    isActive('/savedJobs')
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-655 dark:text-slate-355 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Saved Jobs
                </Link>
              )}

              {user?.role === "user" && (
                <Link
                  to="/jobs"
                  onClick={() => setMenuOpen(false)}
                  className="col-span-2 flex items-center justify-center py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                >
                  Jobs Explorer
                </Link>
              )}
            </div>

            {/* Logout Button */}
            <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 border border-rose-300 dark:border-rose-900/30 text-rose-600 dark:text-rose-455 bg-rose-50/50 dark:bg-rose-950/10 hover:bg-rose-600 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Logout <HiOutlineLogout className="text-base" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar