import React from 'react'
import Services from './Services.jsx'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const handleExplore = () => {
    if (token) {
      navigate('/jobs')
    } else {
      window.dispatchEvent(new Event("open-login"))
    }
  }

  const handleDashboardRedirect = () => {
    if (user?.role === "recruiter") {
      navigate('/recruiterdashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
      <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] overflow-hidden flex flex-col items-center justify-center px-6 transition-colors duration-300">

        <div className="absolute left-[-10%] w-[35%] h-[35%] rounded-full bg-brand-secondary/10 dark:bg-brand-secondary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-brand-primary/10 dark:bg-brand-primary/5 blur-[120px]" />

        <div className="mb-6 px-5 py-2 rounded-full border border-brand-secondary/20 dark:border-brand-secondary/10 bg-white dark:bg-slate-800 text-brand-secondary text-sm font-medium tracking-wide shadow-sm">
          Your next career move starts here
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold text-center mb-6 tracking-tight text-slate-800 dark:text-white leading-tight">
          Bridge the Gap to <br />
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Your Dream Career
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-350 max-w-2xl text-center text-lg md:text-xl leading-relaxed mb-10">
          Discover verified opportunities, connect with trusted employers, and build a successful career with confidence through CareerBridge.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95 shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
          >
            Explore Jobs
          </button>

          {token ? (
            <button
              onClick={handleDashboardRedirect}
              className="w-full sm:w-auto px-8 py-4 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-semibold rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95 shadow-teal-500/10 hover:shadow-lg hover:shadow-teal-500/20 cursor-pointer"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-register")); }}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-brand-primary dark:hover:border-brand-primary text-slate-700 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Bottom Text */}
        <div className="mt-16 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">
          Connecting Talent With Opportunity
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full h-[1.5px] bg-slate-200 dark:bg-slate-800" />
      </div>

      <Services />
    </>
  )
}

export default Home