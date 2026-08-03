import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilAlt, HiTrash, HiUserGroup, HiLocationMarker, HiCurrencyRupee, HiOfficeBuilding, HiArrowLeft } from 'react-icons/hi';

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
    if (
      !(editData.title || '').trim() ||
      !(editData.company || '').trim() ||
      !(editData.location || '').trim() ||
      !(editData.salary || '').trim() ||
      !(editData.jobType || '').trim() ||
      !(editData.description || '').trim()
    ) {
      toast.error("Please fill in all fields")
      return
    }

    const originalJob = jobs.find(job => job._id === id)
    if (originalJob) {
      if (
        (editData.title || '').trim() === (originalJob.title || '').trim() &&
        (editData.company || '').trim() === (originalJob.company || '').trim() &&
        (editData.location || '').trim() === (originalJob.location || '').trim() &&
        (editData.salary || '').trim() === (originalJob.salary || '').trim() &&
        (editData.jobType || '').trim() === (originalJob.jobType || '').trim() &&
        (editData.description || '').trim() === (originalJob.description || '').trim()
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 p-6 md:p-10 transition-colors duration-300 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3 pr-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 active:scale-95 transition cursor-pointer shrink-0"
              aria-label="Go back"
            >
              <HiArrowLeft className="text-base" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                Recruiter Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                Manage your jobs and track applicants easily.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/addJobs')}
            className="w-full sm:w-auto px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm shrink-0"
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
              <HiOfficeBuilding />
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
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${borderClass} rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col animate-fade-in-up`}
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
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Location</label>
                            <input
                              value={editData.location}
                              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Salary</label>
                            <input
                              value={editData.salary}
                              onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Job Type</label>
                            <input
                              value={editData.jobType}
                              onChange={(e) => setEditData({ ...editData, jobType: e.target.value })}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                              placeholder="e.g. Full-time, Remote"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 mb-1">Description</label>
                            <textarea
                              value={editData.description}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                              rows="1"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none"
                              placeholder="Describe the role..."
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
                      {/* Top Header Block (Full width) */}
                      <div className="flex justify-between items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                        <h3 className="text-lg font-black text-slate-805 dark:text-white leading-tight truncate">
                          {job.title}
                        </h3>
                        {job.jobType && (
                          <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary-light rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0">
                            {job.jobType}
                          </span>
                        )}
                      </div>

                      {/* Bottom Details/Actions Split Block */}
                      <div className="flex flex-row justify-between items-stretch gap-3 sm:gap-6 pt-3.5">
                        {/* Left Details Block */}
                        <div className="flex-1 space-y-3">
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
                              <p className="flex items-center gap-2 text-brand-secondary font-bold text-base pt-0.5">
                                <HiCurrencyRupee className="text-lg" />
                                <span>{job.salary}</span>
                              </p>
                            )}
                          </div>

                          {job.description && (
                            <p className="text-xs text-slate-550 dark:text-slate-450 line-clamp-2 leading-relaxed italic border-t border-slate-100 dark:border-slate-800/40 pt-2.5 mt-2">
                              "{job.description}"
                            </p>
                          )}
                        </div>

                        {/* Right Vertical Button Stack Column */}
                        <div className="flex flex-col gap-2.5 justify-center pl-3 sm:pl-5 border-l border-slate-100 dark:border-slate-800/80 shrink-0 w-[115px] sm:w-[130px]">
                          {/* VIEW/APPLICANTS (Primary) */}
                          <button
                            onClick={() => navigate(`/applicants/${job._id}`)}
                            className="w-full py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-sm active:scale-95 shrink-0"
                          >
                            <HiUserGroup className="text-sm" /> Applicants
                          </button>

                          {/* EDIT (Secondary) */}
                          <button
                            onClick={() => {
                              setEditJobId(job._id)
                              setEditData(job)
                            }}
                            className="w-full py-2 border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl font-bold transition text-xs cursor-pointer flex items-center justify-center gap-1 active:scale-95 shrink-0"
                          >
                            <HiPencilAlt className="text-sm" /> Edit
                          </button>

                          {/* DELETE (Destructive) */}
                          <button
                            onClick={() => setDeleteJobConfirmId(job._id)}
                            disabled={deleteLoadingId === job._id}
                            className="w-full py-2 border border-rose-200 dark:border-rose-955/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition flex items-center justify-center gap-1 text-xs cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
                          >
                            {deleteLoadingId === job._id ? (
                              <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <HiTrash className="text-sm" /> Delete
                              </>
                            )}
                          </button>
                        </div>
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