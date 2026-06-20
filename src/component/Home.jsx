import React from 'react'
import Services from './Services.jsx'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleExplore = () => {
    const token = localStorage.getItem("token")

    if (token) {
      navigate('/jobs')
    } else {
      navigate('/login')
    }
  }

  return (
    <>
      <div className="relative min-h-screen bg-[#F8F7F4] overflow-hidden flex flex-col items-center justify-center px-6">

        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-[#2E7D32]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-[#F4A261]/10 blur-[120px]" />

        <div className="mb-6 px-5 py-2 rounded-full border border-[#2E7D32]/20 bg-white text-[#2E7D32] text-sm font-medium tracking-wide shadow-sm">
          Your next career move starts here
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 tracking-tight text-[#374151]">
          Bridge the Gap to <br />
          <span className="bg-gradient-to-r from-[#2E7D32] to-[#F4A261] bg-clip-text text-transparent">
            Your Dream Career
          </span>
        </h1>

        <p className="text-gray-600 max-w-2xl text-center text-lg md:text-xl leading-relaxed mb-10">
          Discover verified opportunities, connect with trusted employers,
          and build a successful career with confidence through CareerBridge.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">

          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-4 bg-[#2E7D32] hover:bg-[#256728] text-white font-semibold rounded-xl shadow-md transition-all hover:-translate-y-1"
          >
            Explore Jobs
          </button>

          <Link to="/signup">
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-[#2E7D32] hover:bg-[#2E7D32] hover:text-white text-[#2E7D32] font-semibold rounded-xl transition-all">
              Get Started
            </button>
          </Link>

        </div>

        {/* Bottom Text */}
        <div className="mt-16 text-gray-500 text-sm font-medium uppercase tracking-widest">
          Connecting Talent With Opportunity
        </div>

      </div>

      <Services />
    </>
  )
}
export default Home