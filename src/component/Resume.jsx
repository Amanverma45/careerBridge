import React, { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { HiOutlineDocumentText, HiOutlineCloudUpload, HiEye, HiTrash } from 'react-icons/hi'

function Resume() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    })

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            toast.error("Please select a resume file")
            return
        }

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
            localStorage.setItem("user", JSON.stringify(res.data.user))
            setUser(res.data.user)
            setFile(null)
            toast.success("Resume uploaded successfully")
        } catch (error) {
            console.log(error)
            toast.error("Upload failed")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your resume? This will remove it from all job applications.")) return
        try {
            setDeleteLoading(true)
            await axios.delete(
                `https://careerbridge-b-1.onrender.com/api/deleteResume/${user._id}`
            )
            const updatedUser = { ...user, resume: "", resumePublicId: "" }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setUser(updatedUser)
            toast.success("Resume deleted successfully")
        } catch (error) {
            console.log("DELETE RESPONSE:", error.response?.data)
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to delete resume")
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleView = async () => {
        try {
            const res = await axios.get(
                `https://careerbridge-b-1.onrender.com/api/viewResume/${user._id}`
            );
            if (res.data.resume) {
                window.open(res.data.resume, "_blank");
            } else {
                toast.error("No resume found")
            }
        } catch (error) {
            console.log(error);
            toast.error("No resume found");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0f172a] p-4 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm w-full max-w-md relative overflow-hidden">
                {/* Decorative top bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary" />

                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-brand-primary/20">
                        <HiOutlineDocumentText />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">
                        Resume Manager
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
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
                            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-primary dark:hover:border-brand-primary/70 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-brand-primary/5 transition-all group"
                        >
                            <div className="flex flex-col items-center justify-center text-center p-4">
                                <HiOutlineCloudUpload className="text-3xl text-slate-400 group-hover:text-brand-primary transition mb-2" />
                                <p className="text-xs sm:text-sm font-semibold text-slate-655 dark:text-slate-350 truncate max-w-[280px]">
                                    {file ? file.name : "Choose Resume (PDF, DOC, DOCX)"}
                                </p>
                                {!file && (
                                    <p className="text-[10px] text-slate-400 mt-1">Max file size 5MB</p>
                                )}
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                            loading || !file
                                ? "bg-brand-primary/45 cursor-not-allowed shadow-none"
                                : "bg-brand-primary hover:bg-brand-primary-hover"
                        }`}
                    >
                        {loading ? "Uploading..." : "Upload Resume"}
                    </button>
                </form>

                {user?.resume && (
                    <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-bold text-slate-750 dark:text-slate-300 text-sm truncate">
                                    Active Resume Uploaded
                                </span>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={handleView}
                                        className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <HiEye className="text-sm" /> View
                                    </button>

                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                    >
                                        {deleteLoading ? (
                                            <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <HiTrash className="text-sm" /> Delete
                                            </>
                                        )}
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