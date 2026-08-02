import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaUserCircle, 
  FaBriefcase, 
  FaFileAlt, 
  FaChartLine, 
  FaArrowRight, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSpinner,
  FaHourglassHalf,
  FaMapMarkerAlt,
  FaRupeeSign
} from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import Button from './Button'

function Welcome() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  
  // Safe Parse localStorage user object
  const user = (() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      console.error("Localstorage user parse error:", e)
      return null
    }
  })()

  useEffect(() => {
    if (!user?._id) {
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`
        )
        if (response.data && Array.isArray(response.data)) {
          setApplications(response.data)
        } else {
          setApplications([])
        }
      } catch (err) {
        console.error("Fetch dashboard data error:", err)
        setError("Unable to retrieve job applications. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calculate profile strength (each is worth 25%)
  let strength = 0
  const checklist = [
    { key: "name", label: "Full Name", value: user?.name, desc: "Add your name in profile setup" },
    { key: "skills", label: "Skills Added", value: user?.skills, desc: "List your top professional skills" },
    { key: "experience", label: "Experience Details", value: user?.experience, desc: "Add your work or project history" },
    { key: "bio", label: "Professional Bio", value: user?.bio, desc: "Write a short summary about yourself" }
  ]
  
  checklist.forEach(item => {
    if (item.value) {
      if (typeof item.value === 'string') {
        if (item.value.trim() !== "") strength += 25
      } else {
        strength += 25
      }
    }
  })

  // Safe checks for applications array
  const appsArray = Array.isArray(applications) ? applications : []
  const pendingCount = appsArray.filter(app => (app?.status || '').toLowerCase() === 'pending').length
  const shortlistedCount = appsArray.filter(app => 
    (app?.status || '').toLowerCase() === 'shortlisted' || (app?.status || '').toLowerCase() === 'accepted'
  ).length
  const rejectedCount = appsArray.filter(app => (app?.status || '').toLowerCase() === 'rejected').length

  const stats = [
    { label: "Profile Strength", value: `${strength}%`, icon: <FaChartLine />, color: "text-brand-primary bg-brand-primary/10", borderClass: "border-t-brand-primary" },
    { label: "Applied Jobs", value: appsArray.length, icon: <FaBriefcase />, color: "text-violet-500 bg-violet-500/10", borderClass: "border-t-violet-500" },
    { label: "Shortlisted", value: shortlistedCount, icon: <FaCheckCircle />, color: "text-emerald-500 bg-emerald-500/10", borderClass: "border-t-emerald-500" },
    { label: "Pending Reviews", value: pendingCount, icon: <FaHourglassHalf />, color: "text-amber-500 bg-amber-500/10", borderClass: "border-t-amber-500" }
  ]

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A"
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase()
    if (s === 'shortlisted' || s === 'accepted') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/30 rounded-full text-xs font-bold capitalize select-none shrink-0">
          <FaCheckCircle className="text-[10px]" /> {s}
        </span>
      )
    }
    if (s === 'rejected') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-250 dark:border-rose-900/30 rounded-full text-xs font-bold capitalize select-none shrink-0">
          <FaTimesCircle className="text-[10px]" /> {s}
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-250 dark:border-amber-900/30 rounded-full text-xs font-bold capitalize select-none shrink-0">
        <FaHourglassHalf className="text-[10px]" /> {s}
      </span>
    )
  }

  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isHubOpen, setIsHubOpen] = useState(false)
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("resume")

  const handleResourceHubClick = () => {
    setIsHubOpen(true)
  }

  const handleReachSupportClick = () => {
    setIsSupportOpen(true)
  }

  const handleSupportSubmit = async (e) => {
    e.preventDefault()
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast.error("Please fill in all fields.")
      return
    }
    
    setSubmitLoading(true)
    setTimeout(() => {
      setSubmitLoading(false)
      const ticketId = Math.floor(100000 + Math.random() * 900000)
      toast.success(`Support ticket #${ticketId} created! We will email you at ${user?.email}`)
      setSupportForm({ subject: "", message: "" })
      setIsSupportOpen(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 p-4 sm:p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Greeting */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-secondary p-6 sm:p-8 md:p-10 rounded-[2rem] text-white shadow-xl">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 backdrop-blur-[2px] rounded-l-[10rem] pointer-events-none transform translate-x-12 translate-y-2 hidden md:block" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Welcome Back, {user?.name || "Job Seeker"}! 👋
            </h1>
            <p className="text-white/85 text-sm sm:text-base md:text-lg leading-relaxed">
              Track your active job applications, optimize your professional resume score, and browse verified listings from top recruiters.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/jobs')}
                className="px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl shadow-md hover:bg-slate-50 transition active:scale-95 text-sm cursor-pointer border-none"
              >
                Browse Jobs
              </button>
              <button
                onClick={() => navigate('/resume')}
                className="px-5 py-2.5 bg-brand-primary-hover text-white font-bold rounded-xl shadow-md hover:bg-brand-primary transition border border-white/20 active:scale-95 text-sm cursor-pointer border-none"
              >
                Build & Optimize Resume
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${stat.borderClass} p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between gap-2.5 sm:gap-4`}
            >
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-slate-405 dark:text-slate-505 text-[10px] sm:text-xs font-black uppercase tracking-wider truncate">
                  {stat.label}
                </p>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                  {stat.value}
                </h3>
              </div>
              <div className={`text-sm sm:text-xl p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${stat.color} shrink-0`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Middle Two-Column Section */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Profile Completeness Checklist (1 Column) */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-primary p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black mb-1 text-slate-800 dark:text-white">Profile Strength</h2>
              <p className="text-slate-400 dark:text-slate-505 text-xs mb-5">Complete your profile details to rank higher in recruiter searches.</p>
              
              {/* Strength Progress Bar */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-brand-primary">{strength}% Setup Complete</span>
                  <span className="text-slate-400 dark:text-slate-505">{strength === 100 ? "Ready to Apply! 🚀" : `${100 - strength}% left`}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500 rounded-full" 
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>

              {/* Checklist details */}
              <div className="space-y-4">
                {checklist.map((item, idx) => {
                  const isDone = item.value && String(item.value).trim() !== ""
                  return (
                    <div 
                      key={idx} 
                      onClick={() => navigate('/profile')} 
                      className={`flex items-start gap-3 p-2.5 rounded-2xl border transition duration-200 cursor-pointer ${
                        isDone 
                          ? 'border-emerald-100/50 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-955/5 hover:bg-emerald-50/20 dark:hover:bg-emerald-955/10' 
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 hover:border-brand-primary/20 dark:hover:border-brand-primary/20 hover:bg-slate-50 dark:hover:bg-slate-950/30'
                      }`}
                    >
                      {isDone ? (
                        <FaCheckCircle className="text-emerald-500 text-lg mt-0.5 shrink-0" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-355 dark:border-slate-700 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h4 className={`text-sm font-bold ${isDone ? 'text-slate-750 dark:text-slate-300' : 'text-slate-505 dark:text-slate-400'}`}>
                          {item.label}
                        </h4>
                        {!isDone && (
                          <p className="text-[11px] text-brand-primary font-medium hover:underline mt-0.5">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {strength === 100 && (
              <div className="mt-6 p-3 bg-brand-secondary/10 dark:bg-brand-secondary/5 rounded-2xl text-center text-xs font-bold text-brand-secondary">
                Your profile is 100% complete. You look amazing! ✨
              </div>
            )}
          </div>

          {/* Applications List Tracker (2 Columns) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-secondary p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-black text-slate-850 dark:text-white">Applications Status Tracker</h2>
                {appsArray.length > 0 && (
                  <button 
                    onClick={() => navigate('/appliedJobs')} 
                    className="text-xs font-black text-brand-primary hover:underline hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer border-none bg-transparent"
                  >
                    View All
                  </button>
                )}
              </div>
              <p className="text-slate-400 dark:text-slate-505 text-xs mb-5">Updates on the jobs you've applied to recently.</p>

              {loading ? (
                <div className="flex flex-col justify-center items-center h-48 gap-3">
                  <FaSpinner className="animate-spin text-3xl text-brand-primary" />
                  <span className="text-xs font-bold text-slate-400">Fetching applications...</span>
                </div>
              ) : error ? (
                <div className="p-6 text-center text-xs font-bold text-rose-500 bg-rose-50/50 dark:bg-rose-955/10 rounded-2xl border border-rose-100 dark:border-rose-950/20">
                  {error}
                </div>
              ) : appsArray.length === 0 ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-505 text-2xl mx-auto">
                    <FaBriefcase />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">No Active Applications</h4>
                    <p className="text-slate-400 dark:text-slate-550 text-xs max-w-xs mx-auto">Browse through our open vacancies and find the best fit for your skills.</p>
                  </div>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 cursor-pointer border-none"
                  >
                    Explore Job Vacancies
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {appsArray.slice(0, 5).map((app) => {
                    if (!app) return null
                    const job = app.jobId || {}
                    return (
                      <div 
                        key={app._id}
                        className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl hover:border-slate-200/60 dark:hover:border-slate-700/60 hover:bg-white dark:hover:bg-slate-900/60 transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div className="space-y-1 text-left">
                          <h4 className="text-sm font-black text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                            {job.title || "Unknown Job Position"}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-505">
                            <span className="font-semibold text-slate-700 dark:text-slate-350">{job.company || "N/A"}</span>
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-[10px]" /> {job.location}
                              </span>
                            )}
                            {job.salary && (
                              <span className="flex items-center gap-0.5 text-brand-secondary font-bold">
                                <FaRupeeSign className="text-[9px]" /> {job.salary}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-start sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
                          {getStatusBadge(app.status)}
                          <span className="text-[10px] text-slate-400 dark:text-slate-505 flex items-center gap-1">
                            <FaCalendarAlt className="text-[9px]" /> {formatDate(app.appliedAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            
            {appsArray.length > 5 && (
              <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                <span className="text-xs text-slate-400 dark:text-slate-550 font-semibold">
                  Showing top 5 of {appsArray.length} applications
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/jobs')}
            className="group relative overflow-hidden bg-gradient-to-br from-brand-primary to-blue-700 p-6 rounded-[2rem] text-white shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[160px] text-left"
          >
            <div className="relative z-10">
              <h3 className="text-base sm:text-xl font-bold mb-2 truncate whitespace-nowrap">Browse Job Openings</h3>
              <p className="text-white/80 text-xs leading-relaxed max-w-[200px]">Explore remote, full-time and freelance roles matches your set.</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 font-bold text-xs group-hover:gap-4 transition-all">
              Explore Now <FaArrowRight />
            </div>
            <FaBriefcase className="absolute -bottom-4 -right-4 text-[7rem] text-white/10 -rotate-12 pointer-events-none z-0" />
          </div>

          <div
            onClick={() => navigate('/resume')}
            className="group relative overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-accent p-6 rounded-[2rem] text-slate-855 dark:text-white shadow-sm hover:shadow-md hover:border-brand-accent hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[160px] text-left cursor-pointer"
          >
            <div className="relative z-10">
              <h3 className="text-base sm:text-xl font-bold mb-2 truncate whitespace-nowrap">AI Resume Builder & Optimizer</h3>
              <p className="text-slate-400 dark:text-slate-550 text-xs leading-relaxed max-w-[240px]">
                Build a professional ATS-friendly resume from scratch with AI assistance, or upload & optimize your existing files.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-2 font-bold text-xs text-[#F59E0B] group-hover:gap-4 transition-all">
              Build & Optimize <FaArrowRight />
            </div>
            <FaFileAlt className="absolute -bottom-4 -right-4 text-[7rem] text-slate-100 dark:text-slate-800/20 -rotate-12 pointer-events-none z-0" />
          </div>

          <div
            onClick={() => navigate('/profile')}
            className="group relative overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-secondary p-6 rounded-[2rem] text-slate-855 dark:text-white shadow-sm hover:shadow-md hover:border-brand-secondary hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[160px] text-left cursor-pointer"
          >
            <div className="relative z-10">
              <h3 className="text-base sm:text-xl font-bold mb-2 truncate whitespace-nowrap">Edit Account Profile</h3>
              <p className="text-slate-400 dark:text-slate-550 text-xs leading-relaxed max-w-[200px]">Add experience, bio, details, skills and download profiles.</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 font-bold text-xs text-brand-secondary group-hover:gap-4 transition-all">
              Update Profile <FaArrowRight />
            </div>
            <FaUserCircle className="absolute -bottom-4 -right-4 text-[7rem] text-slate-100 dark:text-slate-800/20 -rotate-12 pointer-events-none z-0" />
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-secondary rounded-2xl shadow-sm text-center">
          <p className="text-xs text-slate-400 dark:text-slate-550">
            Need additional assistance? Access our{" "}
            <span 
              onClick={handleResourceHubClick}
              className="text-brand-primary font-bold cursor-pointer hover:underline"
            >
              Career Resource Hub
            </span>
            {" "}or{" "}
            <span 
              onClick={handleReachSupportClick}
              className="text-brand-primary font-bold cursor-pointer hover:underline"
            >
              Reach Support
            </span>.
          </p>
        </div>

      </div>

      {/* Support Request Modal */}
      {isSupportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative text-slate-800 dark:text-slate-200">
            <button
              onClick={() => setIsSupportOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
            
            <div className="mb-6 text-left">
              <h3 className="text-2xl font-black text-slate-850 dark:text-white">Reach Support</h3>
              <p className="text-xs text-slate-405 dark:text-slate-500 mt-1">Get direct assistance from the CareerBridge helpdesk team.</p>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Your Contact Email</label>
                <input 
                  type="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 p-2.5 rounded-xl text-xs text-slate-455 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g. Resume tool help" 
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-305 dark:border-slate-805 p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Message Description</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe your issue or query..." 
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-305 dark:border-slate-805 p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSupportOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold transition text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  loading={submitLoading}
                  className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold text-xs border-none cursor-pointer"
                >
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Career Resources Modal */}
      {isHubOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full relative max-h-[85vh] overflow-y-auto text-slate-800 dark:text-slate-200">
            <button
              onClick={() => setIsHubOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6 text-left">
              <h3 className="text-2xl font-black text-slate-855 dark:text-white">Career Resource Hub</h3>
              <p className="text-xs text-slate-405 dark:text-slate-500 mt-1">Free tips and strategies directly on-screen to guide your career path.</p>
            </div>

            {/* Tab select headers */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("resume")}
                className={`pb-3 text-xs font-black tracking-wider uppercase border-b-2 transition cursor-pointer ${
                  activeTab === "resume" 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                }`}
              >
                Resume Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("interview")}
                className={`pb-3 text-xs font-black tracking-wider uppercase border-b-2 transition cursor-pointer ${
                  activeTab === "interview" 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                }`}
              >
                Interview Excellence
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`pb-3 text-xs font-black tracking-wider uppercase border-b-2 transition cursor-pointer ${
                  activeTab === "skills" 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                }`}
              >
                Marketable Skills
              </button>
            </div>

            {/* Tab content wrapper */}
            <div className="space-y-4 text-sm text-slate-655 dark:text-slate-350 leading-relaxed min-h-[180px] text-left">
              {activeTab === "resume" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-white">Resume Writing Standards</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><strong>Rule of One Page:</strong> Unless you have 5+ years of relevant industry experience, keep your resume strictly to a single page.</li>
                    <li><strong>Action & Results:</strong> Use action verbs and metric results. Instead of "Responsible for writing code", use "Engineered modular React components resulting in a 15% loading speed increase".</li>
                    <li><strong>ATS Compatibility:</strong> Avoid graphics, tables, or text boxes inside columns as they can confuse Applicant Tracking System (ATS) parsers. Use standard fonts like Inter, Arial, or Georgia.</li>
                    <li><strong>Order of Experience:</strong> List experience in reverse-chronological order (most recent job first).</li>
                  </ul>
                </div>
              )}

              {activeTab === "interview" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-805 dark:text-white">Acing Your Job Interviews</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><strong>The STAR Framework:</strong> Answer behavioral questions by outlining the <strong>S</strong>ituation, the <strong>T</strong>ask at hand, the <strong>A</strong>ction you implemented, and the final <strong>R</strong>esult.</li>
                    <li><strong>First Impressions:</strong> Prepare a 90-second "Tell me about yourself" overview focusing strictly on your career achievements and skill relevance.</li>
                    <li><strong>Company Deep-Dive:</strong> Research the company's recent news, product launches, and company values before stepping into the room. Ask targeted questions at the end of the call.</li>
                  </ul>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-805 dark:text-white">Skills in High Demand</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><strong>Frontend Development:</strong> High proficiency in React, TypeScript, Tailwind CSS, and headless CSS architectures is sought after in early-stage startups and corporations.</li>
                    <li><strong>Backend & Databases:</strong> Skills in Node.js, Express, databases (MongoDB, PostgreSQL), and cloud orchestration platforms (AWS, Docker) are key core competencies.</li>
                    <li><strong>Soft Skills:</strong> Clear asynchronous documentation, technical communication, and collaborative Git workflow management are highly valued.</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => setIsHubOpen(false)}
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs transition cursor-pointer border-none"
              >
                Close Resources
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Welcome
