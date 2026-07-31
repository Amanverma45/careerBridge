import React from 'react'
import { Link } from 'react-router-dom'
import { HiUserAdd, HiIdentification, HiSearch, HiBadgeCheck, HiArrowRight } from 'react-icons/hi'

function About() {
  const steps = [
    {
      icon: HiUserAdd,
      title: "1. Create an Account",
      desc: "Register today and start applying directly to active vacancies from verified employers."
    },
    {
      icon: HiIdentification,
      title: "2. Complete Your Profile",
      desc: "Highlight your key skills, education, and work experience. Upload your latest resume to make a strong impression."
    },
    {
      icon: HiSearch,
      title: "3. Discover Opportunities",
      desc: "Explore verified, active vacancies across top industries. Filter by roles that best align with your expertise."
    },
    {
      icon: HiBadgeCheck,
      title: "4. Apply with Confidence",
      desc: "Submit your application with a single click. Your professional credentials are instantly formatted and shared with hiring managers."
    }
  ]

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] overflow-hidden py-20 px-6 sm:px-10 lg:px-16 flex flex-col items-center transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-brand-secondary/5 dark:bg-brand-secondary/3 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-brand-primary/5 dark:bg-brand-primary/3 blur-[120px]" />

      {/* Main Content */}
      <div className="max-w-4xl w-full text-center mb-16">
        <span className="mb-6 px-5 py-2 rounded-full border border-brand-secondary/20 dark:border-brand-secondary/10 bg-white dark:bg-slate-800 text-brand-secondary text-xs sm:text-sm font-semibold tracking-wider uppercase inline-block shadow-sm">
          About CareerBridge
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white mb-6 leading-tight">
          Bridge the Gap to <br />
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Your Professional Success
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-350 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          CareerBridge is a premier employment marketplace designed to streamline recruitment, connect top-tier talent with validated employers, and empower professionals worldwide. We build the infrastructure to fast-track your hiring pipeline.
        </p>
      </div>

      {/* Step by Step Guide Container */}
      <div className="max-w-5xl w-full mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-850 dark:text-white mb-10">
          How to Apply for Jobs (Step-by-Step Guide)
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const borderColors = [
              "border-t-brand-primary",
              "border-t-brand-secondary",
              "border-t-brand-accent",
              "border-t-brand-primary"
            ];
            const iconColors = [
              "text-brand-primary",
              "text-brand-secondary",
              "text-brand-accent",
              "text-brand-primary"
            ];
            const borderClass = borderColors[idx % 4];
            const iconColorClass = iconColors[idx % 4];
            const IconComponent = step.icon;

            return (
              <div 
                key={idx}
                className={`group bg-white/70 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${borderClass} rounded-2xl p-4 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] dark:hover:shadow-[0_10px_30px_rgba(20,184,166,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 sm:gap-5`}
              >
                <div className={`w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm transition-all group-hover:scale-105 duration-300 ${iconColorClass}`}>
                  <IconComponent className="text-xl sm:text-2xl" />
                </div>
                <div className="flex flex-col text-slate-800 dark:text-slate-200">
                  <h3 className="text-sm sm:text-xl font-bold mb-1.5 sm:mb-2 text-slate-800 dark:text-white">{step.title}</h3>
                  <p className="text-[11px] sm:text-base text-slate-600 dark:text-slate-450 leading-normal sm:leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-3xl w-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_15px_40px_rgba(37,99,235,0.2)]">
        {/* Glow Element */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 blur-[50px] rounded-full" />
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 relative z-10">
          Ready to Take the Next Step?
        </h2>
        <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto mb-8 relative z-10 leading-relaxed">
          Register today and start applying directly to active vacancies from verified employers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <button 
            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-register")); }}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-primary hover:text-brand-primary-hover font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            Get Started Free <HiArrowRight />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-login")); }}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white hover:text-slate-100 font-semibold rounded-xl border border-white/30 hover:border-white hover:bg-white/10 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            Login to Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default About
