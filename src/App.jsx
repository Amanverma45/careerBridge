import React from 'react'
import Navbar from "./component/Navbar.jsx"
import Home from './component/Home.jsx'
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import About from './component/About.jsx'
import Job from './component/Job.jsx'
import Footer from './component/Footer.jsx'
import Welcome from './component/Welcome.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'
import ProtectedRoute from './component/ProtectedRoute.jsx'
import Profile from './component/Profile.jsx'
import AppliedJobs from './component/AppliedJobs.jsx'
import RecruiterDashboard from './component/RecruiterDashboard.jsx'
import AddJob from './component/AddJob.jsx'
import Applicants from './component/Applicants.jsx'
import Resume from './component/Resume.jsx'
import SavedJobs from './component/SavedJobs.jsx'
import { Toaster } from 'react-hot-toast'
import OTP from './component/OTP.jsx'
import Privacy from './component/Privacy.jsx'
import Terms from './component/Terms.jsx'

import { HiX } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const { pathname } = useLocation()

  // Reset scroll on path change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Global listeners to open/close auth and profile modals
  useEffect(() => {
    const openLogin = () => {
      setIsLoginOpen(true)
      setIsRegisterOpen(false)
      setIsProfileOpen(false)
    }
    const openRegister = () => {
      setIsRegisterOpen(true)
      setIsLoginOpen(false)
      setIsProfileOpen(false)
    }
    const openProfile = () => {
      setIsProfileOpen(true)
      setIsLoginOpen(false)
      setIsRegisterOpen(false)
    }
    const openTerms = () => {
      setIsTermsOpen(true)
    }
    const openPrivacy = () => {
      setIsPrivacyOpen(true)
    }
    window.addEventListener("open-login", openLogin)
    window.addEventListener("open-register", openRegister)
    window.addEventListener("open-profile", openProfile)
    window.addEventListener("open-terms", openTerms)
    window.addEventListener("open-privacy", openPrivacy)
    return () => {
      window.removeEventListener("open-login", openLogin)
      window.removeEventListener("open-register", openRegister)
      window.removeEventListener("open-profile", openProfile)
      window.removeEventListener("open-terms", openTerms)
      window.removeEventListener("open-privacy", openPrivacy)
    }
  }, [])

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<ProtectedRoute role="user"><Job /></ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute role="user"><Welcome /></ProtectedRoute>} />
          <Route path="/welcome" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/appliedJobs" element={<ProtectedRoute role="user"><AppliedJobs /></ProtectedRoute>} />
          <Route path="/savedJobs" element={<ProtectedRoute role="user"><SavedJobs /></ProtectedRoute>} />
          <Route path="/addJobs" element={<ProtectedRoute role="recruiter"><AddJob /></ProtectedRoute>} />
          <Route path="/recruiterdashboard" element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/applicants/:jobId" element={<ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute role="user"><Resume /></ProtectedRoute>} />
          <Route path="/verify-otp" element={<OTP />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
      <Footer />

      {/* Auth Modals Overlay */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-50"
              aria-label="Close modal"
            >
              <HiX className="text-xl stroke-[3px]" />
            </button>
            <Login isModal={true} onClose={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-50"
              aria-label="Close modal"
            >
              <HiX className="text-xl stroke-[3px]" />
            </button>
            <Signup isModal={true} onClose={() => setIsRegisterOpen(false)} />
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <Profile isModal={true} onClose={() => setIsProfileOpen(false)} />
          </div>
        </div>
      )}

      {/* Terms Modals Overlay */}
      {isTermsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsTermsOpen(false)}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <HiX className="text-xl stroke-[3px]" />
            </button>
            <Terms isModal={true} />
          </div>
        </div>
      )}

      {/* Privacy Modals Overlay */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <HiX className="text-xl stroke-[3px]" />
            </button>
            <Privacy isModal={true} />
          </div>
        </div>
      )}
    </>
  )
}
export default App;