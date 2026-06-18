import React, { useState } from "react"
import axios from "axios"

function Resume() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    })

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) return alert("Please select resume")

        setLoading(true)
        const formData = new FormData()
        formData.append("resume", file)
        formData.append("userId", user?._id)

        try {
            const res = await axios.post("https://careerbridge-b-1.onrender.com/api/uploadResume", formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            console.log("USER AFTER UPLOAD:", res.data.user)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            setUser(res.data.user)
            setFile(null)
            alert("Resume uploaded successfully")
            console.log("USER AFTER UPLOAD:", res.data.user)
        } catch (error) {
            console.log(error)
            alert("Upload failed")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete?")) return
        try {
            await axios.delete(
                `https://careerbridge-b-1.onrender.com/api/deleteResume/${user._id}`
            )
            const updatedUser = { ...user, resume: "" }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setUser(updatedUser)
            alert("Resume deleted")
        }catch (error) {
  console.log("DELETE RESPONSE:", error.response?.data)
  console.log(error)
}
    }
    const handleView = () => {
    if (!user?.resume) return alert("No resume found");
    const viewUrl = user.resume.replace("/upload/", "/upload/fl_attachment:false,f_auto/");

    window.open(viewUrl, "_blank", "noopener,noreferrer");
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

                {/* Title Section */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Resume Manager
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Upload your latest CV here</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">

                    <div className="relative group">
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />
                        <label
                            htmlFor="resume-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition-all"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">

                                <svg className="w-8 h-8 mb-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-600 font-medium">
                                    {file ? file.name : "Tap to choose file"}
                                </p>
                            </div>
                        </label>
                    </div>

                    <button
                        disabled={loading || !file}
                        className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${loading || !file ? "bg-blue-400" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? "Processing..." : "Upload Now"}
                    </button>
                </form>

                {/* User Resume Info */}
                {user?.resume && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">Current Resume:</span>
                            <div className="flex space-x-3">
                                <button
    onClick={handleView} // Hamara naya function
    className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition"
>
    View
</button>
                                <span className="text-gray-300">|</span>
                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700 text-sm font-bold transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Resume