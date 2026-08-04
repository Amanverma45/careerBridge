import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaRupeeSign, 
  FaSpinner, 
  FaBookmark,
  FaRegBookmark 
} from "react-icons/fa"
import { HiArrowLeft } from "react-icons/hi"

let savedJobsCache = null;

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState(savedJobsCache || [])
  const [loading, setLoading] = useState(!savedJobsCache)
  const [error, setError] = useState(null)
  const [exitingIds, setExitingIds] = useState([])

  const navigate = useNavigate()
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  useEffect(() => {
    if (!user?._id) {
      setLoading(false)
      return
    }

    const fetchSaved = async () => {
      try {
        if (!savedJobsCache) {
          setLoading(true)
        }
        const response = await axios.get(
          `/api/savedJobs/${user._id}`
        )
        const fetchedSaved = response.data || []
        setSavedJobs(fetchedSaved)
        savedJobsCache = fetchedSaved
      } catch (err) {
        console.error("FETCH SAVED JOBS ERROR:", err)
        setError("Could not load your saved jobs. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSaved()
  }, [])

  useEffect(() => {
    if (!loading && window.initScrollAnimations) {
      setTimeout(() => {
        window.initScrollAnimations()
      }, 50)
    }
  }, [loading])

  const handleUnsave = async (jobId) => {
    if (!user?._id) return

    try {
      // Trigger smooth exit transition
      setExitingIds(prev => [...prev, jobId])

      setTimeout(async () => {
        try {
          await axios.post("/api/toggleSaveJob", {
            userId: user._id,
            jobId
          })
          setSavedJobs(prev => {
            const updated = prev.filter(job => job._id !== jobId)
            savedJobsCache = updated
            return updated
          })
          setExitingIds(prev => prev.filter(id => id !== jobId))
          toast.success("Job removed from saved list")
        } catch (error) {
          // Rollback transition on failure
          setExitingIds(prev => prev.filter(id => id !== jobId))
          toast.error("Failed to remove job")
        }
      }, 400) // 400ms transition delay for layout fade out

    } catch (error) {
      console.error("Unsave error:", error)
    }
  }

  const getCardBorder = (job) => {
    if (job.isPremium) return "border-t-amber-500 shadow-md shadow-amber-500/5"
    return "border-t-brand-primary"
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 p-4 sm:p-6 md:p-10 transition-colors duration-300 animate-fade-in">
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
              Saved Jobs
            </h1>
            <p className="text-slate-405 dark:text-slate-505 mt-1.5 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              Review and manage the job postings you have bookmarked.
            </p>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
            <FaSpinner className="animate-spin text-4xl text-brand-primary" />
            <span className="text-sm font-bold text-slate-400">Loading your saved jobs...</span>
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
        ) : savedJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-16 rounded-[2rem] text-center shadow-sm max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 bg-slate-555/5 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-3xl mx-auto">
              <FaBookmark className="text-slate-350" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-850 dark:text-white">No Saved Jobs</h2>
              <p className="text-slate-400 dark:text-slate-505 text-xs mt-1 leading-relaxed">
                You haven't bookmarked any jobs yet. Browse available job postings and click the heart icon to save them.
              </p>
            </div>
            <button 
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-md transition text-xs cursor-pointer active:scale-95 border-none"
            >
              Explore Open Jobs
            </button>
          </div>
        ) : (
          /* Grid Configuration: 1x1 if single saved job, 2x2 on mobile if multiple */
          <div className={`grid gap-4 sm:gap-6 ${
            savedJobs.length === 1 
              ? 'grid-cols-1 max-w-2xl mx-auto w-full' 
              : 'grid-cols-2 lg:grid-cols-3'
          }`}>
            {savedJobs.map((job, index) => {
              const isExiting = exitingIds.includes(job._id)
              return (
                <div
                  key={job._id}
                  className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${getCardBorder(job)} p-4 sm:p-6 rounded-[1.5rem] sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-400 ease-in-out flex flex-col justify-between ${
                    isExiting 
                      ? 'opacity-0 scale-90 -translate-y-4 max-h-0 py-0 my-0 border-none overflow-hidden' 
                      : (window.getScrollAnimClass ? window.getScrollAnimClass(index) : "")
                  }`}
                >
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* Header Stacked */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-sm sm:text-lg font-black text-slate-800 dark:text-white leading-snug truncate whitespace-nowrap">
                            {job.title || "Unknown Position"}
                          </h2>
                          <p className="text-[10px] sm:text-xs font-semibold text-brand-primary truncate">
                            {job.company || "Unknown Company"}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleUnsave(job._id)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-primary dark:text-slate-400 dark:hover:text-brand-primary transition cursor-pointer shrink-0"
                          title="Remove from Saved"
                        >
                          <FaBookmark className="text-xs sm:text-sm text-brand-primary" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {job.jobType && (
                          <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary-light rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 select-none">
                            {job.jobType}
                          </span>
                        )}
                        {job.isPremium && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 select-none shadow-sm">
                            👑 Premium
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details: Location & Salary */}
                    <div className="space-y-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-405">
                      {job.location && (
                        <p className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-slate-400" /> {job.location}
                        </p>
                      )}
                      {job.salary && (
                        <p className="flex items-center gap-1.5">
                          <FaRupeeSign className="text-slate-405" /> {Number(job.salary).toLocaleString("en-IN")} / month
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2.5">
                    <button
                      onClick={() => navigate(`/jobs`, { state: { highlightJobId: job._id } })}
                      className="flex-1 py-2 sm:py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-700/60 border border-slate-200/50 dark:border-slate-700/50 text-slate-655 dark:text-slate-330 font-bold rounded-xl text-[10px] sm:text-xs transition active:scale-95 cursor-pointer text-center"
                    >
                      View Details
                    </button>
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

export default SavedJobs
