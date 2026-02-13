import React from 'react'
import { useNavigate } from 'react-router-dom';

function Job() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const handleApply =()=>{
        if(token){
            alert('Application Submitted')
        }else{
            navigate('/login')
        }
    }
   return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Available Jobs</h1>

      <div className="bg-slate-800 p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-semibold">Frontend Developer</h2>
        <p className="text-slate-400 mt-2">
          Location: Remote | Salary: ₹8-12 LPA
        </p>

        <button
          onClick={handleApply}
          className="mt-4 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500">
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default Job;
