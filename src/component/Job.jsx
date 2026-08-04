import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaRupeeSign, 
  FaSearch, 
  FaSpinner, 
  FaCheckCircle,
  FaBookmark,
  FaRegBookmark 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { HiArrowLeft } from 'react-icons/hi';
import Button from "./Button";

let jobsCache = null;
let appliedIdsCache = null;
let savedIdsCache = null;

function Job() {
  const [jobs, setJobs] = useState(jobsCache || [])
  const [appliedIds, setAppliedIds] = useState(appliedIdsCache || [])
  const [savedIds, setSavedIds] = useState(savedIdsCache || [])

  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [salary, setSalary] = useState("")
  const [sort, setSort] = useState("match")
  const [loading, setLoading] = useState(!jobsCache)
  const [applyLoadingId, setApplyLoadingId] = useState(null);

  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const navigate = useNavigate()

  const filteredJobs = jobs.filter(job => {
    const matchSearch =
      (job.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(search.toLowerCase())

    const matchLocation =
      location === "" ||
      (job.location || '').toLowerCase().includes(location.toLowerCase())

    const matchType =
      jobType === "" ||
      (job.jobType || '').toLowerCase().includes(jobType.toLowerCase())

    let matchSalary = true

    if (salary === "0-30000") {
      matchSalary = job.salary <= 30000
    } else if (salary === "30000-60000") {
      matchSalary = job.salary > 30000 && job.salary <= 60000
    } else if (salary === "60000-100000") {
      matchSalary = job.salary > 60000 && job.salary <= 100000
    } else if (salary === "100000+") {
      matchSalary = job.salary > 100000
    }

    return matchSearch && matchLocation && matchType && matchSalary
  })

  const getMatchScore = (job) => {
    if (!user) return 0;
    
    const userSkills = (user.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    if (userSkills.length === 0) return 15;
    
    let jobSkills = [];
    if (job.skills) {
      jobSkills = job.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    }
    
    const matchedSkills = userSkills.filter(skill => jobSkills.includes(skill));
    const jobText = `${job.title} ${job.description} ${job.skills || ""}`.toLowerCase();
    const textMatchedSkills = userSkills.filter(skill => jobText.includes(skill));
    
    const titleKeywords = (job.title || "").toLowerCase().split(' ').map(w => w.trim()).filter(w => w.length > 2);
    const targetJobKeywords = (user.targetJob || "").toLowerCase().split(' ').map(w => w.trim()).filter(w => w.length > 2);
    const titleMatch = targetJobKeywords.some(keyword => titleKeywords.includes(keyword));
    
    let score = 0;
    if (jobSkills.length > 0) {
      const directRatio = matchedSkills.length / jobSkills.length;
      const indirectRatio = textMatchedSkills.length / userSkills.length;
      score = (directRatio * 0.75 + indirectRatio * 0.25) * 100;
    } else {
      score = (textMatchedSkills.length / userSkills.length) * 80;
    }
    
    if (titleMatch) {
      score += 20;
    }
    
    const finalScore = Math.min(Math.round(score), 99);
    return finalScore < 15 ? 15 + (finalScore % 10) : finalScore;
  }

  // Map match scores
  let mappedJobs = filteredJobs.map(job => ({
    ...job,
    matchScore: getMatchScore(job)
  }))

  let sortedJobs = [...mappedJobs]
  if (sort === "low") {
    sortedJobs.sort((a, b) => a.salary - b.salary)
  } else if (sort === "high") {
    sortedJobs.sort((a, b) => b.salary - a.salary)
  } else if (sort === "match") {
    sortedJobs.sort((a, b) => b.matchScore - a.matchScore)
  }

  const handleClearFilters = () => {
    setSearch("")
    setLocation("")
    setJobType("")
    setSalary("")
    setSort("")
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!jobsCache) {
          setLoading(true)
        }
        const response = await axios.get(
          "/job/getJob"
        )
        const fetched = response.data.jobs || []
        setJobs(fetched)
        jobsCache = fetched
        
        if (user) {
          const appliedRes = await axios.get(
            `/application/appliedJobs/${user._id}`
          )
          const ids = appliedRes.data.map(app => app.jobId?._id).filter(id => id != null)
          setAppliedIds(ids)
          appliedIdsCache = ids

          const savedRes = await axios.get(
            `/api/savedJobs/${user._id}`
          )
          const sIds = savedRes.data.map(job => job._id).filter(id => id != null)
          setSavedIds(sIds)
          savedIdsCache = sIds
        }
      } catch (error) {
        console.error("Fetch Jobs Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])
  useEffect(() => {
    if (!loading && window.initScrollAnimations) {
      setTimeout(() => {
        window.initScrollAnimations()
      }, 50)
    }
  }, [loading])

  const handleToggleSave = async (jobId) => {
    if (!user) {
      toast.error("Please login to save jobs")
      window.dispatchEvent(new Event("open-login"))
      return
    }

    try {
      const response = await axios.post("/api/toggleSaveJob", {
        userId: user._id,
        jobId
      })
      const isSavedNow = response.data.isSaved
      if (isSavedNow) {
        setSavedIds(prev => {
          const updated = [...prev, jobId]
          savedIdsCache = updated
          return updated
        })
        toast.success("Job saved successfully!")
      } else {
        setSavedIds(prev => {
          const updated = prev.filter(id => id !== jobId)
          savedIdsCache = updated
          return updated
        })
        toast.success("Job removed from saved list")
      }
    } catch (error) {
      console.error("Toggle Save Error:", error)
      toast.error("Failed to update save status")
    }
  }

  const handleApply = async (jobId) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setApplyLoadingId(jobId)
      const response = await axios.post(
        "/application/applyJob",
        {
          userId: user._id,
          jobId
        }
      )
      setAppliedIds(prev => {
        const updated = [...prev, jobId]
        appliedIdsCache = updated
        return updated
      })
      toast.success(response.data.message || "Applied successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed")
    } finally {
      setApplyLoadingId(null)
    }
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
              Available Jobs
            </h1>
            <p className="text-slate-400 dark:text-slate-500 mt-1.5 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              Discover opportunities that match your skills, preferences, and career goals.
            </p>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          
          {/* Search box */}
          <div className="relative col-span-2 md:col-span-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="text"
              placeholder="Search title, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition text-sm"
            />
          </div>

          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-355 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition text-sm"
          >
            <option value="">All Locations</option>
            <option value="indore">Indore</option>
            <option value="pune">Pune</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
          </select>

          {/* Job Type */}
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-355 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition text-sm"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
          </select>

          {/* Salary Filter */}
          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-355 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition text-sm"
          >
            <option value="">All Salaries</option>
            <option value="0-30000">0 - 30K</option>
            <option value="30000-60000">30K - 60K</option>
            <option value="60000-100000">60K - 1L</option>
            <option value="100000+">1L+</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-355 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition text-sm"
          >
            <option value="match">Match Score (AI)</option>
            <option value="low">Salary: Low to High</option>
            <option value="high">Salary: High to Low</option>
          </select>

        </div>

        {/* Clear Filter Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition text-xs shadow-sm cursor-pointer active:scale-95"
          >
            Clear Filters
          </button>
        </div>

        {/* Job Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-[40vh] col-span-full gap-3">
              <FaSpinner className="animate-spin text-4xl text-brand-primary" />
              <span className="text-sm font-bold text-slate-400">Fetching jobs list...</span>
            </div>
          ) : sortedJobs.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-16 rounded-[2rem] text-center shadow-sm max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-555/5 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-3xl mx-auto">
                <FaBriefcase />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-850 dark:text-white">No Jobs Found</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 leading-relaxed">
                  We couldn't find any job opportunities matching your criteria. Try adjusting the search keywords or filters.
                </p>
              </div>
              <button 
                onClick={handleClearFilters} 
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            sortedJobs.map((job, index) => {
              const isApplied = appliedIds.includes(job._id)
              return (
                <div
                  key={job._id}
                  className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${
                    job.isPremium 
                      ? 'border-t-amber-500 shadow-lg shadow-amber-500/5' 
                      : isApplied 
                      ? 'border-t-emerald-500' 
                      : 'border-t-brand-primary'
                  } p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between ${window.getScrollAnimClass ? window.getScrollAnimClass(index) : ""}`}
                >
                  <div className="space-y-4">
                    {/* Card Title & Type */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="text-lg font-black text-slate-805 dark:text-white leading-snug line-clamp-1">
                            {job.title}
                          </h2>
                          {job.isPremium && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 select-none shadow-sm">
                              👑 Premium
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-brand-primary">
                          {job.company}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Save Job Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleSave(job._id); }}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-brand-primary dark:text-slate-500 dark:hover:text-brand-primary transition-all duration-200 cursor-pointer active:scale-90"
                          title={savedIds.includes(job._id) ? "Remove from Saved" : "Save Job"}
                        >
                          {savedIds.includes(job._id) ? (
                            <FaBookmark className="text-brand-primary text-sm sm:text-base animate-scale-in" />
                          ) : (
                            <FaRegBookmark className="text-sm sm:text-base" />
                          )}
                        </button>

                        <div className="text-right flex flex-col items-end gap-1.5">
                        {job.jobType && (
                          <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary-light rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 select-none">
                            {job.jobType}
                          </span>
                        )}
                        {user && (
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider select-none shrink-0 ${
                            job.matchScore >= 80 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                              : job.matchScore >= 50
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-955/40 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {job.matchScore}% Match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                    {/* Details: Location & Salary */}
                    <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      {job.location && (
                        <p className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-slate-400" /> {job.location}
                        </p>
                      )}
                      {job.salary && (
                        <p className="flex items-center gap-1 text-brand-secondary font-bold text-sm pt-1">
                          <FaRupeeSign className="text-xs" /> {job.salary}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p className="text-xs text-slate-550 dark:text-slate-450 line-clamp-3 leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-3">
                        {job.description}
                      </p>
                    )}

                    {/* Skills Overlap Badges */}
                    {user && (
                      <div className="border-t border-slate-100 dark:border-slate-800/40 pt-3 space-y-1.5">
                        <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">AI Skill Match</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            const uSkills = (user.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
                            const jSkills = (job.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
                            const matched = uSkills.filter(s => jSkills.includes(s));
                            const missing = jSkills.filter(s => !uSkills.includes(s));

                            return (
                              <>
                                {matched.length === 0 && missing.length === 0 && (
                                  <span className="text-[10px] text-slate-400 italic">No skills overlap info available</span>
                                )}
                                {matched.map((skill, idx) => (
                                  <span key={`m-${idx}`} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                    ✓ {skill}
                                  </span>
                                ))}
                                {missing.slice(0, 3).map((skill, idx) => (
                                  <span key={`ms-${idx}`} className="bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider">
                                    {skill}
                                  </span>
                                ))}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Apply Action Button */}
                  <div className="mt-6 pt-2">
                    <Button
                      loading={applyLoadingId === job._id}
                      disabled={isApplied}
                      onClick={() => handleApply(job._id)}
                      className={
                        isApplied
                          ? "bg-emerald-500 text-white w-full border-none"
                          : "bg-brand-primary hover:bg-brand-primary-hover text-white w-full border-none"
                      }
                    >
                      {isApplied ? (
                        <span className="flex items-center gap-1.5 justify-center">
                          <FaCheckCircle className="text-xs" /> Applied
                        </span>
                      ) : (
                        "Apply Now"
                      )}
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Job
