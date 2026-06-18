import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Button from './Button';
import toast from 'react-hot-toast';

function Login() {
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
return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6 relative overflow-hidden">

        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#2E7D32]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#F4A261]/10 blur-[120px]" />

        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl relative z-10">

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-[#374151] mb-2">
                    Welcome Back
                </h1>

                <p className="text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-[#2E7D32] hover:text-[#256728] transition font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ml-1">
                        Email Address
                    </label>

                    <input
                        onChange={(e) => setemail(e.target.value)}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ml-1">
                        Password
                    </label>

                    <input
                        onChange={(e) => setpassword(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition-all"
                    />
                </div>

                <Button
                    type="submit"
                    loading={loading}
                    className="bg-[#2E7D32] hover:bg-[#256728] text-white w-full"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </Button>

            </form>

            <p className="mt-8 text-center text-xs text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>

        </div>
    </div>
)
}

export default Login