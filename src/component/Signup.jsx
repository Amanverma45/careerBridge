import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import toast from 'react-hot-toast';


function Signup() {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('')
  const [role, setrole] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!name || !email || !password || !role) {
      toast.error("Please fill all fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      toast.error("Enter valid email address")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    await axios.post('https://careerbridge-b-1.onrender.com/api/sendOTP', { email })
   console.log("OTP API called")
    localStorage.setItem("otpData", JSON.stringify({
      name,
      email,
      password,
      role
    }))
    console.log("Sending OTP to:", email)
    toast.success("OTP sent successfully")

    navigate("/verify-otp", { state: { email } })

  } catch (error) {
    toast.error(error.response?.data?.message || "Signup Failed");
  } finally {
    setLoading(false)
  }
}
return (
  <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6 relative overflow-hidden">

    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2E7D32]/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#F4A261]/10 blur-[120px]" />

    <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#374151] mb-2">
          Create Account
        </h1>

        <p className="text-gray-500">
          Already have an account?
          <Link
            to="/login"
            className="text-[#2E7D32] hover:underline ml-1 font-medium"
          >
            Login
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Name
          </label>

          <input
            onChange={(e) => setname(e.target.value)}
            type="text"
            placeholder="John Doe"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Email Address
          </label>

          <input
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="name@gmail.com"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>

          <input
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Role
          </label>

          <select
            value={role}
            onChange={(e) => setrole(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-gray-700"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="bg-[#2E7D32] hover:bg-[#256728] text-white w-full"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

      </form>

    </div>
  </div>
)
}

export default Signup