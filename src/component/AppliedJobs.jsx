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
  <div className="min-h-screen bg-[#F8F7F4] p-6 md:p-10">

    <div className="max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#374151]">
          Applied Jobs
        </h1>

        <p className="text-gray-500 mt-2">
          Track the status of your job applications.
        </p>
      </div>

      {appliedJobs.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#374151]">
            No Applications Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Start applying for jobs to see them here.
          </p>
        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {appliedJobs.map((app) => (

            <div
              key={app._id}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >

              <div className="flex justify-between items-start mb-4">

                <div>
                  <h2 className="text-2xl font-bold text-[#374151]">
                    {app.jobId.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {app.jobId.company}
                  </p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    app.status === "shortlisted"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status === "shortlisted"
                    ? "Shortlisted"
                    : "Pending"}
                </div>

              </div>

              <p className="text-[#F4A261] font-bold text-lg">
                ₹ {app.jobId.salary}
              </p>

              <div className="mt-5 border-t border-gray-100 pt-4">

                <p className="text-sm text-gray-500">
                  Application Status
                </p>

                <p
                  className={`font-semibold mt-1
                  ${
                    app.status === "shortlisted"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status === "shortlisted"
                    ? "✅ Shortlisted"
                    : "⏳ Under Review"}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
)
}

export default AppliedJobs