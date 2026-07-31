import React, { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { HiOutlineDocumentText, HiOutlineCloudUpload, HiEye, HiTrash, HiCheckCircle, HiSwitchHorizontal, HiXCircle } from 'react-icons/hi'

function Resume() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isReplacing, setIsReplacing] = useState(false)

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
            setIsReplacing(false)
            toast.success(isReplacing ? "Resume replaced successfully" : "Resume uploaded successfully")
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
            setFile(null)
            setIsReplacing(false)
            toast.success("Resume deleted successfully")
        } catch (error) {
            console.log("DELETE RESPONSE:", error.response?.data)
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to delete resume")
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleView = () => {
        if (user?.resume) {
            window.open(user.resume, "_blank");
        } else {
            toast.error("No resume found");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0f172a] p-4 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm w-full max-w-md relative overflow-hidden">
                {/* Decorative top bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary" />

                {/* Header Block */}
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

                {/* Main Content Area */}
                {user?.resume && !isReplacing ? (
                    /* Active Resume Display View */
                    <div className="space-y-6">
                        <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-900/30 rounded-2xl p-5 text-center flex flex-col items-center gap-3">
                            <HiCheckCircle className="text-4xl text-teal-500" />
                            <div>
                                <h3 className="font-bold text-slate-850 dark:text-white text-base">Your Resume is Active</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">You can view, delete, or replace it below.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleView}
                                className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
                            >
                                <HiEye className="text-lg" /> View Current Resume
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setIsReplacing(true);
                                    }}
                                    className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <HiSwitchHorizontal className="text-base" /> Replace
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="px-4 py-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <HiTrash className="text-base" /> Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Resume Upload View (If no resume, or if replacing) */
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="file"
                                id="resume-upload"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (!selectedFile) return;

                                    if (user?.resume) {
                                        const parts = user.resume.split('/');
                                        const lastPart = parts[parts.length - 1];
                                        const currentName = lastPart.replace(/_\d+\.[^.]+$/, '').toLowerCase();
                                        const selectedName = selectedFile.name.split('.')[0].toLowerCase();

                                        if (selectedName === currentName) {
                                            toast.error("This resume is already uploaded");
                                            e.target.value = ""; // Reset file input selection
                                            return;
                                        }
                                    }
                                    setFile(selectedFile);
                                }}
                                className="hidden"
                            />

                            <label
                                htmlFor="resume-upload"
                                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-primary dark:hover:border-brand-primary/70 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-brand-primary/5 transition-all group"
                            >
                                <div className="flex flex-col items-center justify-center text-center p-4">
                                    <HiOutlineCloudUpload className="text-3xl text-slate-400 group-hover:text-brand-primary transition mb-2" />
                                    <p className="text-xs sm:text-sm font-semibold text-slate-655 dark:text-slate-350 px-2 leading-snug">
                                        Choose File to Upload
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
                                </div>
                            </label>
                        </div>

                        {/* Selected File Display Block BELOW the upload zone */}
                        {file && (
                            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                                <HiOutlineDocumentText className="text-2xl text-brand-primary shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Selected File</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate mt-0.5">{file.name}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading || !file}
                                className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                                    loading || !file
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                                        : "bg-brand-primary hover:bg-brand-primary-hover text-white"
                                }`}
                            >
                                {loading ? "Uploading..." : (isReplacing ? "Upload & Replace Resume" : "Upload Resume")}
                            </button>

                            {/* Cancel Replace Button */}
                            {isReplacing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        setIsReplacing(false);
                                    }}
                                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                >
                                    <HiXCircle className="text-lg" /> Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Resume