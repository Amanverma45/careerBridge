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
            const res = await axios.post("/api/verifyOTP", {
                email,
                otp
            })

            toast.success(res.data.message)
            navigate("/login")

        } catch (err) {
            toast.error("Invalid OTP")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <input
                type="number"
                maxLength="4"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>
        </div>
    )
}

export default OTP