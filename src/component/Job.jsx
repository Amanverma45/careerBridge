import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from "react-icons/fi";

function Job() {
  const [jobs, setJobs] = useState([])
  const [appliedIds, setAppliedIds] = useState([])

  const [search, setSearch] = useState("")

  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  )
  useEffect(() => {
    const fetchJobs = async () => {
      try {

        const response = await axios.get(
          "https://careerbridge-b-1.onrender.com/job/getJob"
        )

        setJobs(response.data.jobs)

        if (user) {

          const appliedRes = await axios.get(
            `https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`
          )

          const ids = appliedRes.data.map(app => app.jobId._id)

          setAppliedIds(ids)

        }

      } catch (error) {
        console.log(error)
      }
    }

    fetchJobs()
  }, [])

  const handleApply = async (jobId) => {

    if (!user) {
      navigate('/login')
      return
    }

    try {

      const response = await axios.post(
        "https://careerbridge-b-1.onrender.com/application/applyJob",
        {
          userId: user._id,
          jobId
        }
      )

      setAppliedIds(prev => [...prev, jobId])

      alert(response.data.message)

    } catch (error) {

      alert(error.response?.data?.message || "Application failed")

    }
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-10">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>

      <div className="relative mb-8">

        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

        <input
          type="text"
          placeholder="Search by job title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">{job.title}</h2>
            <p className="text-slate-400">{job.company}</p>
            <p className="text-slate-400">{job.location}</p>
            <p className="text-emerald-400 font-semibold mt-2">
              ₹ {job.salary}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              {job.description}
            </p>
            <button
              disabled={appliedIds.includes(job._id)}
              onClick={() => handleApply(job._id)}
              className={`mt-4 px-6 py-2 rounded-lg ${appliedIds.includes(job._id)
                ? "bg-green-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
                }`}
            >
              {appliedIds.includes(job._id) ? "Applied " : "Apply Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Job;
