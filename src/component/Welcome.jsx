// import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaBriefcase, FaFileAlt, FaChartLine, FaArrowRight } from 'react-icons/fa'

function Welcome() {
  const navigate = useNavigate()
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  let strength = 0;
  if (user?.name) strength += 25
  if (user?.skills) strength += 25
  if (user?.experience) strength += 25
  if (user?.bio) strength += 25

  const stats = [
    { label: "Profile Strength", value: `${strength}%`, icon: <FaChartLine />, color: "text-emerald-400" },
    { label: "Skills", value: user?.skills || "Not added", icon: <FaBriefcase />, color: "text-blue-400" },
    { label: "Experience", value: user?.experience || "Not added", icon: <FaFileAlt />, color: "text-purple-400" },
  ]

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 relative overflow-hidden">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -z-10" />

      <div className="max-w-6xl mx-auto">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              Welcome back <span className="text-indigo-400">{user?.name}</span>
            </h1>

            <p className="text-slate-400 text-lg">
              Here's what's happening with your career search today.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 px-6 py-3 rounded-2xl transition-all"
            >
              <FaUserCircle className="text-2xl text-indigo-400" />
              <span>Edit Profile</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (

            <div
              key={i}
              className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm"
            >
              <div className={`text-2xl mb-4 ${stat.color}`}>{stat.icon}</div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* //process */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm mb-12">
          <h2 className="text-xl font-bold mb-4">Profile Overview</h2>

          <p className="mb-2">
            <strong>Name:</strong> {user?.name}
          </p>

          <p className="mb-2">
            <strong>Skills:</strong> {user?.skills || "Not added"}
          </p>

          <p className="mb-2">
            <strong>Experience:</strong> {user?.experience || "Not added"}
          </p>

          <p>
            <strong>Bio:</strong> {user?.bio || "Not added"}
          </p>
        </div>


        <div className="grid lg:grid-cols-2 gap-8">

          <div
            className="relative group overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2rem] shadow-xl shadow-indigo-500/20 cursor-pointer"
            onClick={() => navigate('/jobs')}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3">Find New Opportunities</h2>
              <p className="text-indigo-100/80 mb-6 max-w-[250px]">
                Explore new jobs that match your profile.
              </p>
              <div className="flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all">
                Browse Jobs <FaArrowRight />
              </div>
            </div>
            <FaBriefcase className="absolute -bottom-4 -right-4 text-[12rem] text-white/10 -rotate-12" />
          </div>

          <div
            className="relative group overflow-hidden bg-slate-900 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all cursor-pointer"
            onClick={() => navigate('/resume')}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3 text-white">Optimize Resume</h2>
              <p className="text-slate-400 mb-6 max-w-[250px]">
                Improve your resume score and visibility.
              </p>
              <div className="flex items-center gap-2 font-bold text-indigo-400 group-hover:gap-4 transition-all">
                Improve Score <FaArrowRight />
              </div>
            </div>
            <FaFileAlt className="absolute -bottom-4 -right-4 text-[12rem] text-slate-800/50 -rotate-12" />
          </div>

        </div>
        <div className="mt-12 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-center">
          <p className="text-sm text-slate-500">
            Need help? Check out our{" "}
            <span className="text-indigo-400 cursor-pointer hover:underline">Career Guide</span>
            {" "}or{" "}
            <span className="text-indigo-400 cursor-pointer hover:underline">Contact Support</span>.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Welcome
