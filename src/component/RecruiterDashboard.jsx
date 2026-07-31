import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilAlt, HiTrash, HiUserGroup, HiLocationMarker, HiCurrencyRupee, HiOfficeBuilding } from 'react-icons/hi';

function RecruiterDashboard() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [editJobId, setEditJobId] = useState(null)
  const [editData, setEditData] = useState({})

  const [loading, setLoading] = useState(true)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const [deleteJobConfirmId, setDeleteJobConfirmId] = useState(null)
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

  const executeDelete = async (id) => {
    setDeleteJobConfirmId(null)
    try {
      setDeleteLoadingId(id)
      await axios.delete(
        `https://careerbridge-b-1.onrender.com/job/deletejob/${id}`
      )
      toast.success("Job deleted successfully")
      setJobs(jobs.filter(job => job._id !== id))
    } catch (error) {
      toast.error("Failed to delete job")
      console.log(error.message)
    } finally {
      setDeleteLoadingId(null)
    }
  }

  const handleUpdate = async (id) => {
    const originalJob = jobs.find(job => job._id === id)
    if (originalJob) {
      if (
        (editData.title || '').trim() === (originalJob.title || '').trim() &&
        (editData.company || '').trim() === (originalJob.company || '').trim() &&
        (editData.location || '').trim() === (originalJob.location || '').trim() &&
        (editData.salary || '').trim() === (originalJob.salary || '').trim()
      ) {
        toast.error("No changes detected")
        setEditJobId(null)
        return
      }
    }

    try {
      setUpdateLoadingId(id)

      await axios.put(
        `https://careerbridge-b-1.onrender.com/job/updatejob/${id}`,
        editData
      )
      toast.success("Job updated successfully")

      setJobs(jobs.map(job =>
        job._id === id ? { ...job, ...editData } : job
      ))

      setEditJobId(null)

    } catch (error) {
      toast.error("Failed to update job")
      console.log(error.message)
    } finally {
      setUpdateLoadingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white">
              Recruiter Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Manage your jobs and track applicants easily.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/addJobs')}
            className="px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer text-sm shrink-0"
          >
            <HiPlus className="text-lg" /> Post New Job
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 p-16 rounded-3xl text-center shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-555/5 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-3xl mx-auto mb-4">
              <HiOutlineBriefcase />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No Jobs Posted Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Create a job post to start receiving job applications.</p>
            <button
              onClick={() => navigate('/addJobs')}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-md transition cursor-pointer text-sm"
            >
              Post a Job Opportunity
            </button>
          </div>
        ) : (
          /* Jobs Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentJobs.map((job, index) => {
              const borderColors = [
                "border-t-brand-primary",
                "border-t-brand-secondary",
                "border-t-brand-accent"
              ];
              const borderClass = borderColors[index % 3];

              return (
                <div
                  key={job._id}
                  className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${borderClass} rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col`}
                >
                  {editJobId === job._id ? (
                    /* Edit Form Mode */
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Job Title</label>
                          <input
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Company</label>
                          <input
                            value={editData.company}
                            onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                            className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-855 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Location</label>
                            <input
                              value={editData.location}
                              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                              className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-855 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Salary</label>
                            <input
                              value={editData.salary}
                              onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                              className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-855 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => setEditJobId(null)}
                          className="w-1/2 px-4 py-2 border border-slate-300 dark:border-slate-800 text-slate-655 dark:text-slate-350 hover:bg-slate-55/40 rounded-xl font-bold transition text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(job._id)}
                          disabled={updateLoadingId === job._id}
                          className="w-1/2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
                        >
                          {updateLoadingId === job._id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Card Display */
                    <>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">
                            {job.title}
                          </h3>
                        </div>

                        <div className="space-y-2 text-sm text-slate-655 dark:text-slate-400">
                          <p className="flex items-center gap-2">
                            <HiOfficeBuilding className="text-slate-400 dark:text-slate-500 text-base" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company}</span>
                          </p>

                          <p className="flex items-center gap-2">
                            <HiLocationMarker className="text-slate-400 dark:text-slate-500 text-base" />
                            <span>{job.location}</span>
                          </p>

                          {job.salary && (
                            <p className="flex items-center gap-2 text-brand-secondary font-bold text-base pt-1">
                              <HiCurrencyRupee className="text-lg" />
                              <span>{job.salary}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setEditJobId(job._id)
                            setEditData(job)
                          }}
                          className="px-3.5 py-2 border border-slate-300 dark:border-slate-800 text-slate-655 dark:text-slate-350 hover:border-brand-primary dark:hover:border-brand-primary hover:text-brand-primary rounded-xl font-bold transition text-xs cursor-pointer flex items-center gap-1"
                        >
                          <HiPencilAlt className="text-sm" /> Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => setDeleteJobConfirmId(job._id)}
                          disabled={deleteLoadingId === job._id}
                          className="px-3.5 py-2 border border-rose-250/60 dark:border-rose-955/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition flex items-center gap-1 text-xs cursor-pointer disabled:opacity-50"
                        >
                          {deleteLoadingId === job._id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                              ...
                            </>
                          ) : (
                            <>
                              <HiTrash className="text-sm" /> Delete
                            </>
                          )}
                        </button>

                        {/* VIEW */}
                        <button
                          onClick={() => navigate(`/applicants/${job._id}`)}
                          className="px-3.5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition flex items-center gap-1.5 text-xs ml-auto cursor-pointer shadow-sm hover:shadow"
                        >
                          <HiUserGroup className="text-sm" /> Applicants
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {jobs.length > jobsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-12 pb-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold disabled:opacity-50 cursor-pointer shadow-sm text-sm"
            >
              Previous
            </button>

            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold disabled:opacity-50 cursor-pointer shadow-sm text-sm"
            >
              Next
            </button>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {deleteJobConfirmId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center space-y-5">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto border border-rose-200/20">
                <HiTrash />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white">Delete Job Posting?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  Are you sure you want to delete this job posting? This action cannot be undone and all associated applicants will be removed.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                   onClick={() => setDeleteJobConfirmId(null)}
                   className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold transition text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                   onClick={() => executeDelete(deleteJobConfirmId)}
                   className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition text-xs cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default RecruiterDashboard