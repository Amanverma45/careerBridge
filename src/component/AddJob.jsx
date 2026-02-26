import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AddJob() {

  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [description, setDescription] = useState('')
  const [jobType, setJobType] = useState('')

  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
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
      alert("Job Created Successfully ✅")
      navigate('/recruiter/dashboard')

    } catch (error) {
      console.log("Full Error:", error)
      console.log("Error Response:", error.response)
      console.log("Error Data:", error.response?.data)
      console.log("Status Code:", error.response?.status)
      alert("Job Creation Failed ❌")
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Create New Job</h1>
            <p className="text-slate-400">Fill in the details to post a new opportunity.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Job Title</label>
              <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Backend Developer" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Company Name</label>
              <input onChange={(e) => setCompany(e.target.value)} type="text" placeholder="CodeNest Pvt Ltd" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Location</label>
              <input onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Bangalore" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Salary</label>
              <input onChange={(e) => setSalary(e.target.value)} type="text" placeholder="70000" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Job Type</label>
              <input onChange={(e) => setJobType(e.target.value)} type="text" placeholder="Full-Time / Remote" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea onChange={(e) => setDescription(e.target.value)} placeholder="Enter job description..." className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] mt-4">
              Post Job
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddJob