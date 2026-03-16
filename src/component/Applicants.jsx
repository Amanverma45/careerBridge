import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

function Applicants() {

  const { jobId } = useParams()
  const [applicants, setApplicants] = useState([])

  useEffect(() => {

    const fetchApplicants = async () => {

      try {

        const res = await axios.get(
          `https://careerbridge-b-1.onrender.com/application/applicants/${jobId}`
        )

        setApplicants(res.data)

      } catch (error) {
        console.log("FETCH APPLICANTS ERROR:", error)
      }

    }

    fetchApplicants()

  }, [jobId])

  return (

    <div className="min-h-screen bg-gray-100 text-gray-800 p-10">

      <h1 className="text-3xl font-bold mb-8">
        Applicants
      </h1>

      {applicants.length === 0 ? (

        <div className="text-gray-400">
          No applicants yet
        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {applicants.map((app) => (

            <div
              key={app._id}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg hover:border-indigo-500 transition"
            >

              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold">
                  {app.userId?.name?.charAt(0)}
                </div>

                {/* User Info */}
                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {app.userId?.name}
                  </h3>

                  <p className="text-gray-300 text-sm">
                    {app.userId?.email}
                  </p>

                </div>

              </div>

              <div className="mt-4 text-sm text-gray-400">
                Applied for this job
              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}

export default Applicants