import React, { useEffect, useState } from 'react'
import axios from 'axios'
function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([])

  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const response = await axios.get(
          `https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`
        )
        setAppliedJobs(response.data)
      } catch (error) {
        console.log("FETCH APPLIED ERROR:", error)
      }
    }

    if (user) {
      fetchApplied()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Applied Jobs</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {appliedJobs.map((app) => (
          <div
            key={app._id}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800"
          >
            <h2 className="text-xl font-bold mb-2">
              {app.jobId.title}
            </h2>

            <p className="text-slate-400">
              {app.jobId.company}
            </p>

            <p className="text-emerald-400 font-semibold mt-2">
              ₹ {app.jobId.salary}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AppliedJobs