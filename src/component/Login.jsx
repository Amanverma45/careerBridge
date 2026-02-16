import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

function Login() {
    const [email,setemail]= useState('');
    const [password,setpassword]= useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        console.log(email)
        console.log(password)
        try{
            const response = await axios.post('https://careerbridge-b-1.onrender.com/api/loginUser',{
                email,
                password 
            })
            const token = response.data.token
            if(token){
                localStorage.setItem('token',token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                navigate('/dashboard')
                window.location.reload()
            }
            console.log(response)
            alert('Login Successfully')
        }catch(error){
            console.log(error.message)
            alert('Envalid Email or password')
        }
    }
    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative overflow-hidden">

            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />

            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-slate-400">
                        Don't have an account? <Link to="/signup" className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition font-medium">Sign up</Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <input onChange={(e)=>setemail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            {/* <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Forgot password?</button> */}
                        </div>
                        <input onChange={(e)=>setpassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    {/* <div className="flex items-center gap-2 ml-1">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/20" />
                        <label htmlFor="remember" className="text-sm text-slate-400 select-none">Remember me for 30 days</label>
                    </div> */}

                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] mt-2">
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-slate-500 leading-relaxed">
                    By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
            </div>
        </div>
    )
}

export default Login