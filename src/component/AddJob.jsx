import React, { useState } from 'react'
import axios from 'axios'
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import { HiOutlineBriefcase, HiArrowLeft } from 'react-icons/hi'

function AddJob() {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [description, setDescription] = useState('')
  const [jobType, setJobType] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !company || !location || !salary || !jobType || !description) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("https://careerbridge-b-1.onrender.com/job/createJob",
        {
          title,
          company,
          location,
          salary,
          description,
          jobType,
          postedBy: user._id
        }
      )
      console.log("USER:", user)
      console.log(response)
      toast.success("Job Created Successfully")
      navigate('/recruiterdashboard')

    } catch (error) {
      console.log("Full Error:", error)
      toast.error("Job Creation Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] p-6 md:p-10 flex flex-col justify-center items-center transition-colors duration-300">
      
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Decorative gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary" />

        <div className="p-8 sm:p-10">
          {/* Back Navigation Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/recruiterdashboard')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white active:scale-95 transition cursor-pointer shrink-0"
              aria-label="Go back"
            >
              <HiArrowLeft className="text-base" />
            </button>
          </div>

          {/* Header Title & Description */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-none whitespace-nowrap">
              Create New Job
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm whitespace-nowrap">
              Fill in the details to post a new opportunity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">
                Job Title
              </label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="e.g. Backend Developer"
                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-850 dark:text-slate-100 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">
                Company Name
              </label>
              <input
                onChange={(e) => setCompany(e.target.value)}
                type="text"
                placeholder="e.g. Google"
                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-855 dark:text-slate-100 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">
                  Location
                </label>
                <input
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  placeholder="e.g. Remote / Bangalore"
                  className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-855 dark:text-slate-100 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">
                  Salary Range
                </label>
                <input
                  onChange={(e) => setSalary(e.target.value)}
                  type="text"
                  placeholder="e.g. $80k - $100k / Yr"
                  className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-855 dark:text-slate-100 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-750 dark:text-slate-300 text-sm"
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">
                Job Description
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the role, requirements, skills wanted..."
                rows="5"
                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-855 dark:text-slate-100 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl transition shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-base"
            >
              {loading ? "Posting..." : "Post Job Opportunity"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddJob