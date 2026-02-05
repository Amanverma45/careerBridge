import React from 'react'

function Home() {
  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden flex flex-col items-center justify-center px-6">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="mb-6 px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-sm font-medium tracking-wide animate-fade-in">
        ✨ Your next career move starts here
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 tracking-tight">
        Bridge the Gap to <br />
        <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Your Dream Career
        </span>
      </h1>

      <p className="text-slate-400 max-w-2xl text-center text-lg md:text-xl leading-relaxed mb-10">
        Stop searching and start discovering. CareerBridge uses AI to match your unique 
        skillset with high-impact opportunities worldwide.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
        <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-1 active:scale-95">
          Explore Jobs
        </button>
        
        <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all">
          Get Started
        </button>
      </div>

      <div className="mt-16 text-slate-500 text-sm font-medium uppercase tracking-widest">
        Trusted by 500+ Top Tech Companies
      </div>

    </div>
  )
}

export default Home