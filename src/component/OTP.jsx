import { useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

function OTP() {
    const [otp, setOtp] = useState("")
    const location = useLocation()
    const navigate = useNavigate()

    const email = location.state?.email

    const handleVerify = async () => {
        try {

            if (!email) {
                toast.error("Email not found")
                navigate("/signup")
                return
            }

            if (!otp) {
                toast.error("Enter OTP")
                return
            }

            const otpData = JSON.parse(
                localStorage.getItem("otpData")
            )

            if (!otpData) {
                toast.error("Registration session expired")
                navigate("/signup")
                return
            }

            await axios.post(
                "https://careerbridge-b-1.onrender.com/api/verifyOTP",
                {
                    email,
                    otp
                }
            )

            await axios.post(
                "https://careerbridge-b-1.onrender.com/api/saveUser",
                otpData
            )

            localStorage.removeItem("otpData")

            toast.success("Registration successful")

            navigate("/login")

        } catch (err) {
            console.log(err)

            toast.error(
                err.response?.data?.message ||
                "Invalid OTP"
            )
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] flex items-center justify-center p-6 transition-colors duration-300">

            <div className="w-full max-w-md bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/85 rounded-3xl shadow-xl p-8">

                <div className="text-center mb-8">

                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
                        <span className="text-2xl">🔐</span>
                    </div>

                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">
                        Verify OTP
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">
                        Enter the verification code sent to your email.
                    </p>

                    {email && (
                        <p className="text-brand-secondary font-semibold mt-2 break-all text-sm">
                            {email}
                        </p>
                    )}

                </div>

                <div className="space-y-5">

                    <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        className="w-full text-center text-2xl tracking-[8px] bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800 dark:text-slate-100 font-bold"
                    />

                    <button
                        onClick={handleVerify}
                        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3.5 rounded-2xl font-bold transition shadow-md active:scale-95 cursor-pointer"
                    >
                        Verify OTP
                    </button>

                </div>

                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
                    Didn't receive the code? Check your spam folder.
                </p>

            </div>

        </div>
    )
}

export default OTP

