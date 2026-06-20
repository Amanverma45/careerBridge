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
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] p-4">

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 w-full max-w-md">

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#374151]">
                    Resume Manager
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                    Upload and manage your latest resume
                </p>
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
                        className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-[#2E7D32] transition-all"
                    >

                        <div className="flex flex-col items-center justify-center">

                            <svg
                                className="w-8 h-8 mb-3 text-gray-400 group-hover:text-[#2E7D32]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>

                            <p className="text-sm font-medium text-gray-600 text-center px-2">
                                {file ? file.name : "Choose Resume (PDF, DOC, DOCX)"}
                            </p>

                        </div>

                    </label>

                </div>

                <button
                    disabled={loading || !file}
                    className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
                        loading || !file
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-[#2E7D32] hover:bg-[#256728] hover:shadow-lg"
                    }`}
                >
                    {loading ? "Uploading..." : "Upload Resume"}
                </button>

            </form>

            {user?.resume && (

                <div className="mt-8 pt-6 border-t border-gray-200">

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">

                        <div className="flex items-center justify-between">

                            <span className="font-medium text-gray-700">
                                Resume Uploaded
                            </span>

                            <div className="flex items-center gap-4">

                                <button
                                    onClick={handleView}
                                    className="text-[#2E7D32] hover:underline font-semibold"
                                >
                                    View
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    </div>
)

}

export default Resume