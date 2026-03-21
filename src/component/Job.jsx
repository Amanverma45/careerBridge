import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from "react-icons/fi";

function Job() {
  const [jobs, setJobs] = useState([])
  const [appliedIds, setAppliedIds] = useState([])

  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [salary, setSalary] = useState("")
  const [sort, setSort] = useState("")
  const [loading, setLoading] = useState(true)
  const [applyLoadingId, setApplyLoadingId] = useState(null);

  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const filteredJobs = jobs.filter(job => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())

    const matchLocation =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase())

    const matchType =
      jobType === "" ||
      job.jobType?.toLowerCase().includes(jobType.toLowerCase())

    let matchSalary = true

    if (salary === "0-30000") {
      matchSalary = job.salary <= 30000
    } else if (salary === "30000-60000") {
      matchSalary = job.salary > 30000 && job.salary <= 60000
    } else if (salary === "60000-100000") {
      matchSalary = job.salary > 60000 && job.salary <= 100000
    } else if (salary === "100000+") {
      matchSalary = job.salary > 100000
    }

    return matchSearch && matchLocation && matchType && matchSalary
  })

  let sortedJobs = [...filteredJobs]
  if (sort === "low") {
    sortedJobs.sort((a, b) => a.salary - b.salary)
  } else if (sort === "high") {
    sortedJobs.sort((a, b) => b.salary - a.salary)
  }
  const handleClearFilters = () => {
    setSearch("")
    setLocation("")
    setJobType("")
    setSalary("")
  }

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
      } finally {
        setLoading(false)
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
      setApplyLoadingId(jobId)

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
    } finally {
      setApplyLoadingId(null)
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-10">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            type="text"
            placeholder="Search by job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Location */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
        >
          <option value="">All Locations</option>
          <option value="indore">Indore</option>
          <option value="pune">Pune</option>
          <option value="bangalore">Bangalore</option>
          <option value="hyderabad">Hyderabad</option>
        </select>

        {/* jobtype  */}
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
        </select>


        {/* salary  */}
        <select
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
        >
          <option value="">All Salaries</option>
          <option value="0-30000">0 - 30K</option>
          <option value="30000-60000">30K - 60K</option>
          <option value="60000-100000">60K - 1L</option>
          <option value="100000+">1L+</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="low">Salary: Low to High</option>
          <option value="high">Salary: High to Low</option>
        </select>
      </div>

      {/* clr filter  */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Clear Filters
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh] col-span-full">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-sm">Try changing filters</p>
          </div>
        ) : (
          sortedJobs.map((job) => (
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
                disabled={
                  appliedIds.includes(job._id) ||
                  applyLoadingId === job._id
                }
                onClick={() => handleApply(job._id)}
                className={`mt-4 px-6 py-2 rounded-lg flex items-center justify-center gap-2
    ${appliedIds.includes(job._id)
                    ? "bg-green-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"}
  `}
              >
                {applyLoadingId === job._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Applying...
                  </>
                ) : appliedIds.includes(job._id) ? (
                  "Applied"
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
export default Job;
