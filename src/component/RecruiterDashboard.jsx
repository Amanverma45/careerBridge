import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecruiterDashboard() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [editJobId, setEditJobId] = useState(null)
  const [editData, setEditData] = useState({})

  const [loading, setLoading] = useState(true)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const [updateLoadingId, setUpdateLoadingId] = useState(null)

  const jobsPerPage = 6

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(jobs.length / jobsPerPage) || 1

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)

        const response = await axios.get(
          `https://careerbridge-b-1.onrender.com/job/recruiterJobs/${user._id}`
        )

        setJobs(response.data)

      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchJobs()
    }
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "This action cannot be undone. Delete this job?"
    )
    if (!confirmDelete) return

    try {
      setDeleteLoadingId(id)

      await axios.delete(
        `https://careerbridge-b-1.onrender.com/job/deletejob/${id}`
      )

      setJobs(jobs.filter(job => job._id !== id))

    } catch (error) {
      console.log(error.message)
    } finally {
      setDeleteLoadingId(null)
    }
  }

  const handleUpdate = async (id) => {
    try {
      setUpdateLoadingId(id)

      await axios.put(
        `https://careerbridge-b-1.onrender.com/job/updatejob/${id}`,
        editData
      )

      setJobs(jobs.map(job =>
        job._id === id ? { ...job, ...editData } : job
      ))

      setEditJobId(null)

    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateLoadingId(null)
    }
  }

return (
  <div className="min-h-screen bg-[#F8F7F4] text-[#374151] p-6 md:p-10">

    <div className="max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">

        <div>
          <h2 className="text-4xl font-bold text-[#374151]">
            Recruiter Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your jobs and track applicants easily.
          </p>
        </div>

        {/* <button
          onClick={() => navigate('/addJobs')}
          className="bg-[#2E7D32] hover:bg-[#256728] text-white px-6 py-3 rounded-2xl font-semibold transition shadow-md"
        >
          + Post New Job
        </button> */}

      </div>

      {/* Page Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-10 h-10 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 rounded-3xl text-center shadow-sm">
          <p className="text-gray-500 text-lg">
            No jobs posted yet
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {currentJobs.map((job) => (

            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all"
            >

              {editJobId === job._id ? (
                <>
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full border border-gray-300 p-3 mb-3 rounded-xl"
                  />

                  <input
                    value={editData.company}
                    onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    className="w-full border border-gray-300 p-3 mb-3 rounded-xl"
                  />

                  <input
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full border border-gray-300 p-3 mb-3 rounded-xl"
                  />

                  <input
                    value={editData.salary}
                    onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                    className="w-full border border-gray-300 p-3 mb-3 rounded-xl"
                  />

                  {/* SAVE BUTTON */}
                  <button
                    onClick={() => handleUpdate(job._id)}
                    disabled={updateLoadingId === job._id}
                    className="mt-2 px-5 py-2 bg-[#2E7D32] text-white rounded-xl flex items-center gap-2"
                  >
                    {updateLoadingId === job._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>

                  <button
                    onClick={() => setEditJobId(null)}
                    className="mt-2 ml-2 px-5 py-2 bg-gray-400 text-white rounded-xl"
                  >
                    Cancel
                  </button>

                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-[#2E7D32] mb-3">
                    {job.title}
                  </h3>

                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Company:</span> {job.company}
                  </p>

                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>

                  {job.salary && (
                    <p className="text-[#F4A261] font-semibold mb-3">
                      ₹ {job.salary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-4">

                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditJobId(job._id)
                        setEditData(job)
                      }}
                      className="px-4 py-2 bg-[#F4A261] text-white rounded-xl"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={deleteLoadingId === job._id}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl flex items-center gap-2"
                    >
                      {deleteLoadingId === job._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>

                    {/* VIEW */}
                    <button
                      onClick={() => navigate(`/applicants/${job._id}`)}
                      className="px-4 py-2 bg-[#2E7D32] text-white rounded-xl"
                    >
                      View Applicants
                    </button>

                  </div>
                </>
              )}

            </div>

          ))}

        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-5 py-2 bg-[#2E7D32] text-white rounded-xl disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>

  </div>
)

}

export default RecruiterDashboard