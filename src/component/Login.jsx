import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Button from './Button';
import toast from 'react-hot-toast';
import { HiX } from 'react-icons/hi';

function Login({ isModal, onClose }) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        'https://careerbridge-b-1.onrender.com/api/loginUser',
        {
          email: email.toLowerCase(),
          password
        }
      )

      const token = response.data.token
      const user = response.data.user

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem("loginTime", Date.now())

        toast.success('Login Successfully')
        
        if (onClose) {
          onClose();
        }

        if (user.role === "recruiter") {
          navigate('/recruiterdashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Invalid Email or Password')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterClick = (e) => {
    if (isModal) {
      e.preventDefault();
      window.dispatchEvent(new Event("open-register"));
    }
  }

  const cardContent = (
    <div className={`w-full relative ${isModal ? "" : "max-w-md bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-xl relative z-10"}`}>
      {isModal && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <HiX className="text-xl" />
        </button>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            onClick={handleRegisterClick}
            className="text-brand-secondary hover:underline transition font-semibold"
          >
            Register
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-650 dark:text-slate-300 ml-1">
            Email Address
          </label>
          <input
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-650 dark:text-slate-300 ml-1">
            Password
          </label>
          <input
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100"
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full py-3.5"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        By signing in, you agree to our <Link to="/terms" onClick={onClose} className="hover:underline text-slate-500 dark:text-slate-400 font-semibold">Terms of Service</Link> and <Link to="/privacy" onClick={onClose} className="hover:underline text-slate-500 dark:text-slate-400 font-semibold">Privacy Policy</Link>.
      </p>
    </div>
  );

  if (isModal) {
    return cardContent;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/5 dark:bg-brand-primary/3 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/5 dark:bg-brand-secondary/3 blur-[120px]" />
      {cardContent}
    </div>
  )
}

export default Login