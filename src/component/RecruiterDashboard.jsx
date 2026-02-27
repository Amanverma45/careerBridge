import React, { useEffect, useState } from 'react'
import axios from 'axios'

function RecruiterDashboard() {

    const [jobs, setJobs] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [editJobId, setEditJobId] = useState(null)
    const [editData, setEditData] = useState({})

    const jobsPerPage = 6

    const storedUser = localStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : null

    // ---------------- Pagination ----------------
    const indexOfLastJob = currentPage * jobsPerPage
    const indexOfFirstJob = indexOfLastJob - jobsPerPage
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)
    const totalPages = Math.ceil(jobs.length / jobsPerPage) || 1

    // ---------------- Fetch Jobs ----------------
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(
                    `https://careerbridge-b-1.onrender.com/job/recruiterJobs/${user._id}`
                )
                setJobs(response.data)
            } catch (error) {
                console.log(error.message)
            }
        }

        if (user) {
            fetchJobs()
        }
    }, [])

    // ---------------- Delete ----------------
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "⚠️ This action cannot be undone. Delete this job?"
        )
        if (!confirmDelete) return

        try {
            await axios.delete(
                `https://careerbridge-b-1.onrender.com/job/deletejob/${id}`
            )

            setJobs(jobs.filter(job => job._id !== id))

        } catch (error) {
            console.log(error.message)
        }
    }

    // ---------------- Save Edit ----------------
    const handleUpdate = async (id) => {
        try {
            await axios.put(
                `https://careerbridge-b-1.onrender.com/job/updatejob/${id}`,
                {
                    title: editData.title,
                    company: editData.company,
                    location: editData.location,
                    salary: editData.salary,
                    description: editData.description,
                    jobType: editData.jobType
                }
            )

            setJobs(jobs.map(job =>
                job._id === id ? { ...job, ...editData } : job
            ))

            setEditJobId(null)

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-[#f8f5f0] text-gray-800 p-10">

            <div className="max-w-6xl mx-auto">

                <h2 className="text-3xl font-bold mb-10 text-gray-800">
                    Recruiter Dashboard
                </h2>

                {jobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center shadow-sm">
                        <p className="text-gray-500 text-lg">
                            No jobs posted yet
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentJobs.map((job) => (

                            <div
                                key={job._id}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md"
                            >

                                {editJobId === job._id ? (
                                    <>
                                        <input
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full border p-2 mb-2 rounded"
                                        />

                                        <input
                                            value={editData.company}
                                            onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                                            className="w-full border p-2 mb-2 rounded"
                                        />

                                        <input
                                            value={editData.location}
                                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                            className="w-full border p-2 mb-2 rounded"
                                        />

                                        <input
                                            value={editData.salary}
                                            onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                                            className="w-full border p-2 mb-2 rounded"
                                        />

                                        <button
                                            onClick={() => handleUpdate(job._id)}
                                            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => setEditJobId(null)}
                                            className="mt-2 ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                            {job.title}
                                        </h3>
                                        <p className="text-gray-700 mb-1">
                                            <span className="font-medium">Company:</span> {job.company}
                                        </p>

                                        <p className="text-gray-700 mb-1">
                                            <span className="font-medium">Location:</span> {job.location}
                                        </p>

                                        <div className="flex gap-3 mt-4">
                                            <button
                                                onClick={() => {
                                                    setEditJobId(job._id)
                                                    setEditData(job)
                                                }}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 mt-10">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    )
}

export default RecruiterDashboard