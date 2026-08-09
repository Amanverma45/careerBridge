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
  FaRegBookmark,
  FaShareAlt,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaCommentAlt,
  FaLink
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiX } from 'react-icons/hi';
import Button from "./Button";

let jobsCache = null;
let appliedIdsCache = null;
let savedIdsCache = null;

function Job() {
  const [jobs, setJobs] = useState(jobsCache || [])
  const [appliedIds, setAppliedIds] = useState(appliedIdsCache || [])
  const [savedIds, setSavedIds] = useState(savedIdsCache || [])
  const [shareJob, setShareJob] = useState(null)

  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [salary, setSalary] = useState("")
  const [sort, setSort] = useState("match")
  const [loading, setLoading] = useState(!jobsCache)
  const [applyLoadingId, setApplyLoadingId] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null
  const navigate = useNavigate()

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
        const fetched = response.data.jobs && Array.isArray(response.data.jobs) ? response.data.jobs : []
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
        setHasAnimated(true)
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

  // filter & sort jobs logic
  const filteredJobs = jobs.filter(job => {
    const matchSearch = 
      (job.title || "").toLowerCase().includes(search.toLowerCase()) || 
      (job.company || "").toLowerCase().includes(search.toLowerCase());
    
    const matchLocation = location ? (job.location || "").toLowerCase() === location.toLowerCase() : true;
    const matchJobType = jobType ? (job.jobType || "") === jobType : true;
    
    // salary range check
    let matchSalary = true;
    if (salary) {
      const jobSal = parseFloat(job.salary) || 0;
      if (salary === "0-30000") matchSalary = jobSal <= 30000;
      else if (salary === "30000-60000") matchSalary = jobSal > 30000 && jobSal <= 60000;
      else if (salary === "60000-100000") matchSalary = jobSal > 60000 && jobSal <= 100000;
      else if (salary === "100000+") matchSalary = jobSal > 100000;
    }

    return matchSearch && matchLocation && matchJobType && matchSalary;
  });

  // --- SMART MATCHING ALGORITHM IMPLEMENTATION (Identical to Dashboard) ---
  const userSkills = (user?.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean)

  const computeJobMatch = (job) => {
    if (!job) return { score: 0, matched: [], missing: [] }
    if (!userSkills.length) return { score: 0, matched: [], missing: [] }

    let jobSkills = (job.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
    
    const titleLower = (job.title || "").toLowerCase()
    const descLower = (job.description || "").toLowerCase()
    const textToSearch = `${titleLower} ${descLower}`

    // 1. If job has no explicit skills, let's infer them from title/description categories
    if (jobSkills.length === 0) {
      const commonSkills = [
        "react", "node", "express", "mongodb", "javascript", "js", "html", "css",
        "laravel", "php", "java", "spring", "c++", "c#", "dotnet", ".net", "python",
        "django", "flask", "angular", "vue", "typescript", "ts", "mysql", "sql", "postgresql",
        "aws", "docker", "kubernetes", "git", "nextjs", "next.js", "nuxt", "svelte"
      ]
      
      const detectedTech = commonSkills.filter(skill => {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`\\b${escaped}\\b`, 'i')
        return regex.test(textToSearch)
      })

      if (detectedTech.length > 0) {
        jobSkills = detectedTech
      } else {
        const frontendKeywords = ["frontend", "web dev", "web developer", "ui", "ux", "designer"]
        const backendKeywords = ["backend", "apis", "api", "server"]
        const fullstackKeywords = ["full stack", "fullstack"]

        const isFrontendJob = frontendKeywords.some(kw => textToSearch.includes(kw))
        const isBackendJob = backendKeywords.some(kw => textToSearch.includes(kw))
        const isFullStackJob = fullstackKeywords.some(kw => textToSearch.includes(kw))

        const impliedSkills = new Set()
        if (isFrontendJob) {
          ["html", "css", "javascript", "js", "react"].forEach(s => impliedSkills.add(s))
        }
        if (isBackendJob) {
          ["node", "express", "mongodb"].forEach(s => impliedSkills.add(s))
        }
        if (isFullStackJob) {
          ["html", "css", "javascript", "js", "react", "node", "express", "mongodb"].forEach(s => impliedSkills.add(s))
        }
        jobSkills = Array.from(impliedSkills)
      }
    }

    // 2. Perform match computation
    let matched = []
    let missing = []

    if (jobSkills.length > 0) {
      jobSkills.forEach(skill => {
        if (userSkills.includes(skill)) {
          matched.push(skill)
        } else {
          // Synonym support for JS/Javascript
          if (skill === "js" && userSkills.includes("javascript")) {
            matched.push(skill)
          } else if (skill === "javascript" && userSkills.includes("js")) {
            matched.push(skill)
          } else {
            missing.push(skill)
          }
        }
      })

      const score = Math.round((matched.length / jobSkills.length) * 100)
      return { score, matched, missing }
    }

    return { score: 0, matched: [], missing: [] }
  }

  // Calculate Match Score
  const jobsWithScores = filteredJobs.map(job => {
    const matchDetails = computeJobMatch(job)
    return { 
      ...job, 
      matchScore: matchDetails.score,
      matchedSkills: matchDetails.matched,
      missingSkills: matchDetails.missing
    }
  });

  const sortedJobs = [...jobsWithScores].sort((a, b) => {
    if (sort === "match") return b.matchScore - a.matchScore;
    if (sort === "low") return (parseFloat(a.salary) || 0) - (parseFloat(b.salary) || 0);
    if (sort === "high") return (parseFloat(b.salary) || 0) - (parseFloat(a.salary) || 0);
    return 0;
  });

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
            <p className="text-slate-405 dark:text-slate-500 mt-1.5 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
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
                <h2 className="text-lg font-black text-slate-855 dark:text-white">No Jobs Found</h2>
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
                  } p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between ${window.getScrollAnimClass && !hasAnimated ? window.getScrollAnimClass(index) : ""}`}
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

                        {/* Share Job Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setShareJob(job); }}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-brand-primary dark:text-slate-500 dark:hover:text-brand-primary transition-all duration-200 cursor-pointer active:scale-90"
                          title="Share Job"
                        >
                          <FaShareAlt className="text-sm sm:text-base" />
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
                          {((job.matchedSkills || []).length === 0 && (job.missingSkills || []).length === 0) ? (
                            <span className="text-[10px] text-slate-400 italic">No skills overlap info available</span>
                          ) : (
                            <>
                              {(job.matchedSkills || []).map((skill, idx) => (
                                <span key={`m-${idx}`} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                  ✓ {skill}
                                </span>
                              ))}
                              {(job.missingSkills || []).slice(0, 3).map((skill, idx) => (
                                <span key={`ms-${idx}`} className="bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider">
                                  {skill}
                                </span>
                              ))}
                            </>
                          )}
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

export default Job;
