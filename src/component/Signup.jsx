import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('')
  const [role, setrole] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(role)

    try {
      const response = await axios.post('https://careerbridge-b-1.onrender.com/api/saveUser', {
        name,
        email,
        password,
        role
      })
      console.log(response)
      alert('User Created successfully')
      navigate('/login')
    } catch (error) {
      console.log("Full Error:", error);
      console.log("Error Response:", error.response);
      console.log("Error Data:", error.response?.data);
      console.log("Status Code:", error.response?.status);
      alert("Signup Failed ❌");
    }
  }
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        <div className="hidden lg:flex flex-col justify-center p-12 bg-indigo-600/10 border-r border-slate-800">
          <h2 className="text-3xl font-bold mb-6">Join the future of <br /><span className="text-indigo-400">Career Building.</span></h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">✓</div>
              <p className="text-slate-300">Access to 10,000+ exclusive tech roles.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">✓</div>
              <p className="text-slate-300">AI-powered resume optimization tools.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">✓</div>
              <p className="text-slate-300">Direct networking with industry hiring managers.</p>
            </li>
          </ul>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Create an account</h1>
            <p className="text-slate-400">Already have an account? <Link to="/login" className="text-indigo-400 cursor-pointer hover:underline">Log in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Name</label>
              <input onChange={(e) => setname(e.target.value)} type="text" placeholder="John Doe" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input onChange={(e) => setemail(e.target.value)} type="email" placeholder="name@gmail.com" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input onChange={(e) => setpassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Role</label>
              <input onChange={(e) => setrole(e.target.value)} type="text" placeholder="user or requitor" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
            </div>

            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] mt-4">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup