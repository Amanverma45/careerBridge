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

      {/* Mobile Drawer Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-[280px] max-w-[80vw] bg-white/98 dark:bg-slate-950/98 border-l border-slate-200/85 dark:border-slate-850 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col justify-between ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
            <Link to="/" onClick={() => setMenuOpen(false)} className="inline-flex items-center shrink-0 select-none">
              <svg width="170" height="42" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cb-grad-drawer" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <g transform="translate(10, 10)">
                  <path d="M 5 35 A 18 18 0 0 1 35 35" stroke="url(#cb-grad-drawer)" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 0 37 L 40 37" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="20" cy="12" r="4.5" fill="#F59E0B" className="animate-logo-dot" />
                </g>
                <text x="60" y="40" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#2563EB">
                  Career<tspan fill="#14B8A6">Bridge</tspan>
                </text>
              </svg>
            </Link>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white active:scale-90 transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <HiX />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 text-slate-800 dark:text-slate-200">
            {!token && (
              <>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                    isActive('/')
                      ? 'bg-brand-secondary/10 text-brand-secondary border-l-4 border-brand-secondary'
                      : 'text-slate-650 dark:text-slate-350 hover:text-brand-secondary dark:hover:text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                    isActive('/about')
                      ? 'bg-brand-secondary/10 text-brand-secondary border-l-4 border-brand-secondary'
                      : 'text-slate-655 dark:text-slate-350 hover:text-brand-secondary dark:hover:text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  About
                </Link>

                <button
                  onClick={() => { setMenuOpen(false); window.dispatchEvent(new Event("open-login")); }}
                  className={`flex items-center px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 text-left w-full cursor-pointer ${
                    isActive('/login')
                      ? 'bg-brand-secondary/10 text-brand-secondary border-l-4 border-brand-secondary'
                      : 'text-slate-655 dark:text-slate-350 hover:text-brand-secondary dark:hover:text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => { setMenuOpen(false); window.dispatchEvent(new Event("open-register")); }}
                  className="mt-2 flex items-center justify-center px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md active:scale-95 transition-all w-full cursor-pointer"
                >
                  Register
                </button>
              </>
            )}

            {token && (
              <>
                <Link
                  to={user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard"}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                    isActive(user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard")
                      ? 'bg-brand-secondary/10 text-brand-secondary border-l-4 border-brand-secondary'
                      : 'text-slate-655 dark:text-slate-350 hover:text-brand-secondary dark:hover:text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  Dashboard
                </Link>

                {user?.role === "recruiter" && (
                  <Link
                    to="/addJobs"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                      isActive('/addJobs')
                        ? 'bg-brand-secondary/10 text-brand-secondary border-l-4 border-brand-secondary'
                        : 'text-slate-655 dark:text-slate-350 hover:text-brand-secondary dark:hover:text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    Add Jobs
                  </Link>
                )}

                <button
                  onClick={() => { setMenuOpen(false); window.dispatchEvent(new Event("open-profile")); }}
                  className={`flex items-center px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 text-left w-full cursor-pointer ${
                    isActive('/profile')
                      ? 'bg-brand-secondary/10 text-brand-secondary border-l-4 border-brand-secondary'
                      : 'text-slate-655 dark:text-slate-350 hover:text-brand-secondary dark:hover:text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  Profile
                </button>

                {user?.role === "user" && (
                  <Link
                    to="/jobs"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 flex items-center justify-center px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md active:scale-95 transition-all"
                  >
                    Jobs
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Drawer Footer (Logout button if authenticated) */}
        {token && (
          <div className="p-4 sm:p-6 border-t border-slate-200/80 dark:border-slate-800/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border border-rose-300 dark:border-rose-900/30 text-rose-600 dark:text-rose-455 bg-rose-50/50 dark:bg-rose-950/10 hover:bg-rose-600 hover:text-white rounded-xl font-semibold text-sm sm:text-base active:scale-95 transition-all duration-200"
            >
              Logout <HiOutlineLogout className="text-base sm:text-lg" />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar