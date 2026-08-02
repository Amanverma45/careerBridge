import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaBriefcase, 
  FaSpinner 
} from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  useEffect(() => {
    if (!user?._id) {
      setLoading(false)
      return
    }

    const fetchApplied = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`
        )
        setAppliedJobs(response.data)
      } catch (err) {
        console.error("FETCH APPLIED ERROR:", err)
        setError("Could not load your job applications. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplied()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A"
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase()
    if (s === 'shortlisted' || s === 'accepted') {
      return (
        <span className="flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 rounded-full text-[9px] sm:text-xs font-black capitalize select-none shrink-0">
          <FaCheckCircle className="text-[8px] sm:text-[10px]" /> {s}
        </span>
      )
    }
    if (s === 'rejected') {
      return (
        <span className="flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1 bg-rose-50 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 rounded-full text-[9px] sm:text-xs font-black capitalize select-none shrink-0">
          <FaTimesCircle className="text-[8px] sm:text-[10px]" /> {s}
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1 bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 rounded-full text-[9px] sm:text-xs font-black capitalize select-none shrink-0">
        <FaHourglassHalf className="text-[8px] sm:text-[10px]" /> under review
      </span>
    )
  }

  const getCardBorder = (status) => {
    const s = (status || 'pending').toLowerCase()
    if (s === 'shortlisted' || s === 'accepted') return 'border-t-emerald-500'
    if (s === 'rejected') return 'border-t-rose-500'
    return 'border-t-amber-500'
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 p-4 sm:p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Back navigation & Header */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 active:scale-95 transition cursor-pointer shrink-0"
            aria-label="Go back"
          >
            <HiArrowLeft className="text-base" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-855 dark:text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">
              Applied Jobs
            </h1>
            <p className="text-slate-400 dark:text-slate-500 mt-1.5 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              Track and monitor the status of all your submitted job applications.
            </p>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
            <FaSpinner className="animate-spin text-4xl text-brand-primary" />
            <span className="text-sm font-bold text-slate-400">Loading your applications...</span>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-950/20 p-8 rounded-3xl text-center shadow-sm max-w-lg mx-auto">
            <p className="text-sm font-bold text-rose-550 dark:text-rose-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition"
            >
              Retry Connection
            </button>
          </div>
        ) : appliedJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-16 rounded-[2rem] text-center shadow-sm max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 bg-slate-555/5 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-3xl mx-auto">
              <FaBriefcase />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-850 dark:text-white">No Applications Yet</h2>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 leading-relaxed">
                You haven't submitted any job applications. Browse through available listings and apply to get started.
              </p>
            </div>
            <button 
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-md transition text-xs cursor-pointer active:scale-95"
            >
              Explore Open Jobs
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            appliedJobs.length > 1 
              ? 'grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-2xl mx-auto'
          }`}>
            {appliedJobs.map((app) => {
              const job = app.jobId || {}
              return (
                <div
                  key={app._id}
                  className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${getCardBorder(app.status)} p-4 sm:p-6 rounded-[1.5rem] sm:rounded-3xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between`}
                >
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* Card Header Stacked */}
                    <div className="space-y-2">
                      <h2 className="text-sm sm:text-lg font-black text-slate-800 dark:text-white leading-snug break-words">
                        {job.title || "Unknown Position"}
                      </h2>
                      <div className="flex">
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-[10.5px] sm:text-xs font-semibold text-brand-primary break-words">
                        {job.company || "Unknown Company"}
                      </p>
                    </div>

                    {/* Salary & Details */}
                    <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                      {job.location && (
                        <p className="flex items-center gap-1.5 truncate">
                          <FaMapMarkerAlt className="text-slate-400 shrink-0" /> {job.location}
                        </p>
                      )}
                      {job.jobType && (
                        <p className="flex items-center gap-1.5 truncate">
                          <FaBriefcase className="text-slate-400 shrink-0" /> {job.jobType}
                        </p>
                      )}
                      {job.salary && (
                        <p className="flex items-center gap-0.5 text-brand-secondary font-bold text-xs sm:text-sm pt-1 truncate">
                          <FaRupeeSign className="text-[10px] sm:text-xs shrink-0" /> {job.salary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 sm:mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-3 sm:pt-4 flex justify-between items-center text-[9px] sm:text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <FaCalendarAlt className="shrink-0" /> Applied:
                    </span>
                    <span className="font-semibold text-slate-655 dark:text-slate-400 truncate">
                      {formatDate(app.appliedAt)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default AppliedJobs