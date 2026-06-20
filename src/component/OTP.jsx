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
                toast.error("Signup session expired")
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

            toast.success("Signup successful")

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
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6">

            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8">

                <div className="text-center mb-8">

                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2E7D32]/10 flex items-center justify-center">
                        <span className="text-2xl">🔐</span>
                    </div>

                    <h1 className="text-3xl font-bold text-[#374151]">
                        Verify OTP
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Enter the verification code sent to your email.
                    </p>

                    {email && (
                        <p className="text-[#2E7D32] font-medium mt-2 break-all">
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
                        className="w-full text-center text-2xl tracking-[8px] border border-gray-300 rounded-2xl py-4 focus:outline-none focus:border-[#2E7D32]"
                    />

                    <button
                        onClick={handleVerify}
                        className="w-full bg-[#2E7D32] hover:bg-[#256728] text-white py-3 rounded-2xl font-semibold transition"
                    >
                        Verify OTP
                    </button>

                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Didn't receive the code? Check your spam folder.
                </p>

            </div>

        </div>
    )
}

export default OTP

