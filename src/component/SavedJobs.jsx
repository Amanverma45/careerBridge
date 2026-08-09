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
  FaRegBookmark,
  FaShareAlt,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaCommentAlt,
  FaLink
} from "react-icons/fa"
import { HiArrowLeft, HiX } from "react-icons/hi"

let savedJobsCache = null;

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState(savedJobsCache || [])
  const [loading, setLoading] = useState(!savedJobsCache)
  const [error, setError] = useState(null)
  const [exitingIds, setExitingIds] = useState([])
  const [shareJob, setShareJob] = useState(null)
  const [hasAnimated, setHasAnimated] = useState(false)

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
        const fetchedSaved = Array.isArray(response.data) ? response.data : []
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
        setHasAnimated(true)
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
            Array.isArray(savedJobs) && savedJobs.length === 1 
              ? 'grid-cols-1 max-w-2xl mx-auto w-full' 
              : 'grid-cols-2 lg:grid-cols-3'
          }`}>
            {Array.isArray(savedJobs) && savedJobs.map((job, index) => {
              const isExiting = exitingIds.includes(job._id)
              return (
                <div
                  key={job._id}
                  className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${getCardBorder(job)} p-4 sm:p-6 rounded-[1.5rem] sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-400 ease-in-out flex flex-col justify-between ${
                    isExiting 
                      ? 'opacity-0 scale-90 -translate-y-4 max-h-0 py-0 my-0 border-none overflow-hidden' 
                      : (window.getScrollAnimClass && !hasAnimated ? window.getScrollAnimClass(index) : "")
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
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleUnsave(job._id)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-primary dark:text-slate-400 dark:hover:text-brand-primary transition cursor-pointer shrink-0"
                            title="Remove from Saved"
                          >
                            <FaBookmark className="text-xs sm:text-sm text-brand-primary" />
                          </button>

                          <button
                            onClick={() => setShareJob(job)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-primary dark:text-slate-400 dark:hover:text-brand-primary transition cursor-pointer shrink-0"
                            title="Share Job"
                          >
                            <FaShareAlt className="text-xs sm:text-sm" />
                          </button>
                        </div>
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
      {/* Share Modal */}
      {shareJob && (() => {
        const shareText = `${shareJob.title} at ${shareJob.company}\n📍 ${shareJob.location || "Remote"}\n💼 ${shareJob.jobType || "Full-Time"}\n\nApply now: ${window.location.origin}/jobs?jobId=${shareJob._id}`;
        return (
          <div 
            onClick={() => setShareJob(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 animate-fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200/85 dark:border-slate-800/85 w-full sm:max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-6 shadow-2xl relative overflow-hidden text-center transition-all duration-300 animate-slide-up sm:animate-scale-in pb-8 sm:pb-6"
            >
              {/* Drag Handle for Mobile Bottom Sheet */}
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-slate-855 dark:text-white">Share Job Opportunity</h3>
                <button 
                  onClick={() => setShareJob(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition active:scale-90 cursor-pointer border-none text-slate-500 dark:text-slate-400"
                >
                  <HiX className="text-base" />
                </button>
              </div>

              {/* Job Details Card Preview */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl mb-4 text-left border border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-800 dark:text-white leading-tight truncate">{shareJob.title}</h4>
                <p className="text-xs font-semibold text-brand-primary mt-1">{shareJob.company}</p>
                <p className="text-[10px] text-slate-405 mt-1">{shareJob.location}</p>
              </div>

              {/* Copy Link Section (Top Option) */}
              <div className="mb-6 p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 truncate flex-1 text-left px-2 select-all overflow-hidden">
                  {`${window.location.origin}/jobs?jobId=${shareJob._id}`}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareText);
                    toast.success("Job details copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer border-none shrink-0"
                >
                  Copy
                </button>
              </div>

              {/* Social Sharing Title */}
              <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider text-left mb-3">Or Share Via</p>

              {/* Social Grid */}
              <div className="grid grid-cols-3 gap-3.5">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareJob(null)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 transition active:scale-95 shadow-sm"
                >
                  <FaWhatsapp className="text-2xl sm:text-3xl mb-1.5" />
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/jobs?jobId=${shareJob._id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareJob(null)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 transition active:scale-95 shadow-sm"
                >
                  <FaLinkedin className="text-2xl sm:text-3xl mb-1.5" />
                  <span className="text-[10px] font-bold">LinkedIn</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/jobs?jobId=${shareJob._id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareJob(null)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 transition active:scale-95 shadow-sm"
                >
                  <FaFacebook className="text-2xl sm:text-3xl mb-1.5" />
                  <span className="text-[10px] font-bold">Facebook</span>
                </a>

                {/* SMS */}
                <a
                  href={`sms:?body=${encodeURIComponent(shareText)}`}
                  onClick={() => setShareJob(null)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-955/15 text-amber-600 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-955/25 transition active:scale-95 shadow-sm"
                >
                  <FaCommentAlt className="text-2xl sm:text-3xl mb-1.5" />
                  <span className="text-[10px] font-bold">SMS</span>
                </a>

                {/* Instagram */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareText);
                    toast.success("Job details copied! Share it on your Instagram story or DM.");
                    setShareJob(null);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-pink-50 dark:bg-pink-955/15 text-pink-600 dark:text-pink-400 hover:bg-pink-100/50 dark:hover:bg-pink-955/25 transition active:scale-95 shadow-sm cursor-pointer border-none"
                >
                  <FaInstagram className="text-2xl sm:text-3xl mb-1.5" />
                  <span className="text-[10px] font-bold">Instagram</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  )
}

export default SavedJobs;
