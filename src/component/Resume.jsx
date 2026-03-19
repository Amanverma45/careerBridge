import React, { useState } from "react"
import axios from "axios"

function Resume() {
    const [uploaded, setuploaded] = useState(null)
    const [file, setFile] = useState(null)

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    })
    const handleUpload = async (e) => {
        e.preventDefault()

        if (!file) return alert("Please select resume")

        const formData = new FormData()
        formData.append("resume", file)
        formData.append("userId", user._id)

        console.log("USER:", user)
        console.log("UPLOADED:", uploaded)

        try {
            const res = await axios.post(
                "https://careerbridge-b-1.onrender.com/api/uploadResume",
                formData
            )

            console.log("RESPONSE:", res.data)

            const newResume = res.data.user.resume

            setuploaded(newResume)

            const updatedUser = { ...user, resume: newResume }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setUser(updatedUser)

            alert(res.data.message)

        } catch (error) {
            console.log("ERROR:", error)
        }
    }

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Upload Resume
                </h1>

                <form onSubmit={handleUpload} className="space-y-6">

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">

                        <p className="text-gray-500 mb-3">
                            Select your resume (PDF / DOC)
                        </p>

                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full"
                        />

                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition">
                        Upload Resume
                    </button>
                    {uploaded && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-700 font-medium">
                                Resume Uploaded Successfully
                            </p>

                            {/* <a
                                href={`https://careerbridge-b-1.onrender.com/uploads/${uploaded}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 underline"
                            >
                                View Resume
                            </a> */}
                            <a href={uploaded} target="_blank" rel="noreferrer">
                                View Resume
                            </a>
                        </div>
                    )}
                </form>

            </div>

        </div>

    )

}

export default Resume