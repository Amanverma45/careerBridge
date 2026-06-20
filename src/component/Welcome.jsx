import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaBriefcase, FaFileAlt, FaChartLine, FaArrowRight } from 'react-icons/fa'
import axios from 'axios'
function Welcome() {
  const [appliedCount, setAppliedCount] = useState(0)

  const navigate = useNavigate()
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  useEffect(() => {
    if (!user?._id) return

    const fetchAppliedCount = async () => {
      try {
        const response = await axios.get(
          `https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`
        )
        
        setAppliedCount(response.data.length)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAppliedCount()
  }, [user])
  
  let strength = 0;
  if (user?.name) strength += 25
  if (user?.skills) strength += 25
  if (user?.experience) strength += 25
  if (user?.bio) strength += 25

 const stats = [
  { label: "Profile Strength", value: `${strength}%`, icon: <FaChartLine />, color: "text-[#2E7D32]" },
  { label: "Skills", value: user?.skills || "Not added", icon: <FaBriefcase />, color: "text-[#F4A261]" },
  { label: "Experience", value: user?.experience || "Not added", icon: <FaFileAlt />, color: "text-sky-500" },
  { label: "Applied Jobs", value: appliedCount, icon: <FaBriefcase />, color: "text-violet-500" }
]

  return (
  <div className="min-h-screen bg-[#F8F7F4] text-[#374151] p-6 md:p-12">

    <div className="max-w-6xl mx-auto">

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">

        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Welcome back{" "}
            <span className="text-[#2E7D32]">
              {user?.name}
            </span>
          </h1>

          <p className="text-gray-500 text-lg">
            Here's what's happening with your career search today.
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() => navigate('/appliedJobs')}
            className="flex items-center gap-3 bg-white border border-gray-200 hover:border-[#2E7D32] px-6 py-3 rounded-2xl shadow-sm transition-all"
          >
            📄 Applied Jobs
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 bg-white border border-gray-200 hover:border-[#2E7D32] px-6 py-3 rounded-2xl shadow-sm transition-all"
          >
            <FaUserCircle className="text-2xl text-[#2E7D32]" />
            <span>Edit Profile</span>
          </button>

        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {stats.map((stat, i) => (

          <div
            key={i}
            className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className={`text-2xl mb-4 ${stat.color}`}>
              {stat.icon}
            </div>

            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              {stat.label}
            </p>

            <h3 className="text-2xl font-bold mt-2 break-words">
              {stat.value}
            </h3>

          </div>

        ))}

      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm mb-12">

        <h2 className="text-xl font-bold mb-4">
          Profile Overview
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Skills:</strong> {user?.skills || "Not added"}
          </p>

          <p>
            <strong>Experience:</strong> {user?.experience || "Not added"}
          </p>

          <p>
            <strong>Bio:</strong> {user?.bio || "Not added"}
          </p>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div
          className="relative group overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#256728] p-8 rounded-[2rem] shadow-lg cursor-pointer"
          onClick={() => navigate('/jobs')}
        >

          <div className="relative z-10">

            <h2 className="text-2xl font-bold mb-3 text-white">
              Find New Opportunities
            </h2>

            <p className="text-green-100 mb-6 max-w-[250px]">
              Explore new jobs that match your profile.
            </p>

            <div className="flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all">
              Browse Jobs <FaArrowRight />
            </div>

          </div>

          <FaBriefcase className="absolute -bottom-4 -right-4 text-[12rem] text-white/10 -rotate-12" />

        </div>

        <div
          className="relative group overflow-hidden bg-white border border-gray-200 p-8 rounded-[2rem] shadow-sm hover:border-[#F4A261] transition-all cursor-pointer"
          onClick={() => navigate('/resume')}
        >

          <div className="relative z-10">

            <h2 className="text-2xl font-bold mb-3 text-[#374151]">
              Optimize Resume
            </h2>

            <p className="text-gray-500 mb-6 max-w-[250px]">
              Improve your resume score and visibility.
            </p>

            <div className="flex items-center gap-2 font-bold text-[#F4A261] group-hover:gap-4 transition-all">
              Improve Score <FaArrowRight />
            </div>

          </div>

          <FaFileAlt className="absolute -bottom-4 -right-4 text-[12rem] text-gray-100 -rotate-12" />

        </div>

      </div>

      <div className="mt-12 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">

        <p className="text-sm text-gray-500">

          Need help? Check out our{" "}

          <span className="text-[#2E7D32] cursor-pointer hover:underline">
            Career Guide
          </span>

          {" "}or{" "}

          <span className="text-[#2E7D32] cursor-pointer hover:underline">
            Contact Support
          </span>

        </p>

      </div>

    </div>
  </div>
)
}

export default Welcome
