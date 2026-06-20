import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import toast from "react-hot-toast"
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
      toast.success("Job Created Successfully")
      navigate('/recruiterdashboard')

    } catch (error) {
      console.log("Full Error:", error)
      console.log("Error Response:", error.response)
      console.log("Error Data:", error.response?.data)
      console.log("Status Code:", error.response?.status)
      toast.error("Job Creation Failed")
    }
  }

 return (
  <div className="min-h-screen bg-[#F8F7F4] text-[#374151] flex items-center justify-center p-6">

    <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-sm">

      <div className="p-8 md:p-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#374151] mb-2">
            Create New Job
          </h1>

          <p className="text-gray-500">
            Fill in the details to post a new opportunity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Job Title
            </label>

            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Backend Developer"
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Company Name
            </label>

            <input
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              placeholder="CodeNest Pvt Ltd"
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Location
            </label>

            <input
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              placeholder="Bangalore"
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Salary
            </label>

            <input
              onChange={(e) => setSalary(e.target.value)}
              type="text"
              placeholder="70000"
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Job Type
            </label>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
            >
              <option value="">Select Job Type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Description
            </label>

            <textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter job description..."
              rows="5"
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
            />
          </div>

          <button
            className="w-full py-4 bg-[#2E7D32] hover:bg-[#256728] text-white font-semibold rounded-2xl transition-all"
          >
            Post Job
          </button>

        </form>

      </div>

    </div>

  </div>
)
}

export default AddJob