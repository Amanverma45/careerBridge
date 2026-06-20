import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from "react-icons/fi";
import toast from 'react-hot-toast';
import Button from "./Button";

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
  // const token = localStorage.getItem("token")

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

      toast.success(response.data.message);

    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed")
    } finally {
      setApplyLoadingId(null)
    }
  }
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#374151] p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#374151]">
            Available Jobs
          </h1>

          <p className="text-gray-500 mt-2">
            Discover opportunities that match your skills and career goals.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Search */}
          <div className="relative">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
            />

          </div>
          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
          >
            <option value="">All Locations</option>
            <option value="indore">Indore</option>
            <option value="pune">Pune</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
          </select>

          {/* jobtype */}
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
          </select>

          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
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
            className="w-full p-3 rounded-2xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition"
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
              className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium shadow-sm"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {loading ? (

              <div className="flex justify-center items-center h-[50vh] col-span-full">
                <div className="w-10 h-10 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
              </div>

            ) : sortedJobs.length === 0 ? (

              <div className="col-span-full bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
                <p className="text-xl font-semibold text-[#374151]">
                  No Jobs Found
                </p>

                <p className="text-gray-500 mt-2">
                  Try changing filters or search keywords.
                </p>
              </div>

            ) : (

              sortedJobs.map((job) => (

                <div
                  key={job._id}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >

                  <h2 className="text-2xl font-bold text-[#374151] mb-2">
                    {job.title}
                  </h2>

                  <p className="text-gray-500">
                    {job.company}
                  </p>

                  <p className="text-gray-500">
                    {job.location}
                  </p>

                  <p className="text-[#F4A261] font-semibold mt-3 text-lg">
                    ₹ {job.salary}
                  </p>

                  <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="mt-5">

                    <Button
                      loading={applyLoadingId === job._id}
                      disabled={appliedIds.includes(job._id)}
                      onClick={() => handleApply(job._id)}
                      className={
                        appliedIds.includes(job._id)
                          ? "bg-green-600 text-white w-full"
                          : "bg-[#2E7D32] hover:bg-[#256728] text-white w-full"
                      }
                    >
                      {applyLoadingId === job._id
                        ? "Applying..."
                        : appliedIds.includes(job._id)
                          ? "Applied"
                          : "Apply Now"}
                    </Button>
                  </div>
                </div>
              ))
            )}
                   </div>
        </div>
      </div>
  )
}

export default Job
