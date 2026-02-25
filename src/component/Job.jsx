import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Job() {
  const [jobs, setJobs] = useState([])
  const [appliedIds, setAppliedIds] = useState([])

  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://careerbridge-b-1.onrender.com/job/getJob')
        setJobs(response.data.jobs)

        const ids = response.data.map(app => app.jobId._Id)
        setAppliedIds(ids)
      } catch (error) {
        console.log("FETCH JOB ERROR:", error)
      }
    }

    fetchJobs()
  }, [])

  const handleApply = async (jobId) => {
    setAppliedIds(prev=>[...prev,jobId])
    if (!user) {
      navigate('/login')
      return;
    }
    try {
      const response = await axios.post('https://careerbridge-b-1.onrender.com/application/applyJob', {
        userId: user._id,
        jobId: jobId
      })
      alert(response.data.message)
    } catch (error) {
      alert(error.response?.data?.message || 'Application failed')
    }
  }
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800"
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
