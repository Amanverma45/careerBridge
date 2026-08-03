import React, { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { 
    HiOutlineDocumentText, 
    HiOutlineCloudUpload, 
    HiEye, 
    HiTrash, 
    HiCheckCircle, 
    HiSwitchHorizontal, 
    HiXCircle,
    HiSparkles,
    HiPrinter,
    HiArrowLeft,
    HiPencilAlt,
    HiFolderOpen
} from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

function Resume() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("builder") // Default to AI builder tab
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isReplacing, setIsReplacing] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // Wizard Generation State
    const [isGenerated, setIsGenerated] = useState(false)

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    })

    // AI Resume Builder state
    const [resumeData, setResumeData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        website: user?.companyWebsite || "",
        targetJob: "Software Engineer",
        summary: user?.bio || "Detail-oriented professional seeking to leverage technical expertise to build scalable applications and solve business challenges.",
        skills: user?.skills || "JavaScript, React, Node.js, HTML, CSS, MongoDB",
        experience: "Worked on frontend user interfaces.\nBuilt backend REST API endpoints and connected database.",
        projects: "E-Commerce Web App: Developed a full-stack e-commerce app using React, Node.js, and MongoDB. Features secure Stripe checkout, user reviews, and an admin dashboard.\nPortfolio Website: Built a highly performant portfolio website using React, TailwindCSS, and Framer Motion with page transition animations.",
        education: "Bachelor of Science in Computer Science"
    })

    const [aiProcessing, setAiProcessing] = useState(false)

    // AI Polish Handlers (Local template assistants)
    const handleAIPolishSummary = () => {
        setAiProcessing(true)
        setTimeout(() => {
            const formattedSkills = resumeData.skills.split(",").slice(0, 4).join(", ")
            const newSummary = `Results-driven ${resumeData.targetJob || "Professional"} with hands-on expertise in ${formattedSkills || "modern technologies"}. Proven track record of collaborating in agile teams, optimizing code performance, and translating complex technical requirements into user-centric software solutions. Adept at rapid problem-solving and clean system architecture.`
            setResumeData(prev => ({ ...prev, summary: newSummary }))
            setAiProcessing(false)
            toast.success("AI polished professional summary!")
        }, 800)
    }

    const handleAIOptimizeExperience = () => {
        setAiProcessing(true)
        setTimeout(() => {
            let exp = resumeData.experience
            // Replace basic words with strong active engineering verbs
            exp = exp.replace(/worked on/gi, "Engineered high-performance")
                     .replace(/built/gi, "Architected secure and performant")
                     .replace(/created/gi, "Developed responsive")
                     .replace(/did/gi, "Spearheaded scalable")
                     .replace(/helped/gi, "Collaborated on")
            
            setResumeData(prev => ({ ...prev, experience: exp }))
            setAiProcessing(false)
            toast.success("AI optimized experience with action verbs!")
        }, 800)
    }

    const handleAIEnhanceProjects = () => {
        setAiProcessing(true)
        setTimeout(() => {
            let proj = resumeData.projects
            // Replace basic project descriptions with ATS optimized phrasing
            proj = proj.replace(/developed a/gi, "Spearheaded development of a high-scale")
                       .replace(/built a/gi, "Architected a responsive")
                       .replace(/features/gi, "Integrated optimized modules supporting")
                       .replace(/uses/gi, "Leveraging a modern stack containing")
            
            setResumeData(prev => ({ ...prev, projects: proj }))
            setAiProcessing(false)
            toast.success("AI optimized project bullet points!")
        }, 800)
    }

    const handleAIEnhanceSkills = () => {
        setAiProcessing(true)
        setTimeout(() => {
            // Clean up duplicates and add relevant keywords based on target job
            const job = (resumeData.targetJob || "").toLowerCase()
            let skillsArr = resumeData.skills.split(",").map(s => s.trim()).filter(Boolean)
            
            // Add job specific keywords
            if (job.includes("react") || job.includes("frontend") || job.includes("web")) {
                if (!skillsArr.includes("TailwindCSS")) skillsArr.push("TailwindCSS")
                if (!skillsArr.includes("TypeScript")) skillsArr.push("TypeScript")
                if (!skillsArr.includes("REST APIs")) skillsArr.push("REST APIs")
            }
            if (job.includes("backend") || job.includes("node") || job.includes("engineer")) {
                if (!skillsArr.includes("Express.js")) skillsArr.push("Express.js")
                if (!skillsArr.includes("System Design")) skillsArr.push("System Design")
                if (!skillsArr.includes("Git & Version Control")) skillsArr.push("Git & Version Control")
            }

            // Remove duplicates
            const uniqueSkills = [...new Set(skillsArr)].join(", ")
            setResumeData(prev => ({ ...prev, skills: uniqueSkills }))
            setAiProcessing(false)
            toast.success("AI tailored skills tags for target role!")
        }, 600)
    }

    const handleGenerateResume = (e) => {
        e.preventDefault()
        setAiProcessing(true)
        setTimeout(() => {
            setAiProcessing(false)
            setIsGenerated(true)
            toast.success("ATS Resume Generated Successfully!")
        }, 1200)
    }

    const handlePrint = () => {
        window.print()
    }

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

    const executeDelete = async () => {
        setShowConfirmModal(false)
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
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 p-6 md:p-10 transition-colors duration-300">
            {/* Hidden Print Area Stylesheet Injection */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #resume-preview-card, #resume-preview-card * {
                        visibility: visible;
                    }
                    #resume-preview-card {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        box-shadow: none;
                        border: none;
                        padding: 0;
                        margin: 0;
                        background: white !important;
                        color: #0f172a !important;
                    }
                }
            `}} />

            <div className="max-w-7xl mx-auto">
                {/* Back to Dashboard & Title Block */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800/60 w-full">
                    <div className="flex items-center gap-3 pr-4 min-w-0 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 active:scale-95 transition cursor-pointer shrink-0"
                            aria-label="Go back"
                        >
                            <HiArrowLeft className="text-base" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                                ATS Resume Suite
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                Create an ATS-optimized resume or manage your uploads.
                            </p>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 self-stretch sm:self-auto">
                        <button
                            onClick={() => setActiveTab("builder")}
                            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                                activeTab === "builder"
                                    ? "bg-white dark:bg-slate-800 text-brand-primary shadow-sm"
                                    : "text-slate-500 hover:text-slate-805 dark:hover:text-white"
                            }`}
                        >
                            <HiSparkles className="text-lg animate-pulse text-amber-505" /> AI Resume Builder
                        </button>
                        <button
                            onClick={() => setActiveTab("manager")}
                            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                                activeTab === "manager"
                                    ? "bg-white dark:bg-slate-800 text-brand-primary shadow-sm"
                                    : "text-slate-500 hover:text-slate-805 dark:hover:text-white"
                            }`}
                        >
                            <HiOutlineDocumentText className="text-lg" /> Upload Manager
                        </button>
                    </div>
                </div>

                {/* TAB 1: UPLOAD MANAGER */}
                {activeTab === "manager" && (
                    <div className="flex items-center justify-center py-10">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm w-full max-w-md relative overflow-hidden">
                            {/* Decorative top bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary" />

                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-brand-primary/20">
                                    <HiOutlineDocumentText />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                    Resume Manager
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                                    Upload and manage your active PDF/DOC resume
                                </p>
                            </div>

                            {user?.resume && !isReplacing ? (
                                <div className="space-y-6">
                                    <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-900/30 rounded-2xl p-5 text-center flex flex-col items-center gap-3">
                                        <HiCheckCircle className="text-4xl text-teal-500" />
                                        <div>
                                            <h3 className="font-bold text-slate-850 dark:text-white text-base">Your Resume is Active</h3>
                                            <p className="text-slate-505 dark:text-slate-400 text-xs mt-1">You can view, delete, or replace it below.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleView}
                                            className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
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
                                                onClick={() => setShowConfirmModal(true)}
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
                                                        e.target.value = "";
                                                        return;
                                                    }
                                                }
                                                setFile(selectedFile);
                                            }}
                                            className="hidden"
                                        />

                                        <label
                                            htmlFor="resume-upload"
                                            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-primary dark:hover:border-brand-primary/70 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-955 hover:bg-brand-primary/5 transition-all group"
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

                                    {file && (
                                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex items-start gap-3">
                                            <HiOutlineDocumentText className="text-2xl text-brand-primary shrink-0 mt-0.5" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Selected File</p>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate mt-0.5">{file.name}</p>
                                                <p className="text-[10px] text-slate-405 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <button
                                            type="submit"
                                            disabled={loading || !file}
                                            className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                                                loading || !file
                                                    ? "bg-slate-100 dark:bg-slate-805 text-slate-400 dark:text-slate-505 cursor-not-allowed shadow-none"
                                                    : "bg-brand-primary hover:bg-brand-primary-hover text-white"
                                            }`}
                                        >
                                            {loading ? "Uploading..." : (isReplacing ? "Upload & Replace Resume" : "Upload Resume")}
                                        </button>

                                        {isReplacing && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFile(null);
                                                    setIsReplacing(false);
                                                }}
                                                className="w-full py-3 bg-slate-55/20 hover:bg-slate-100 dark:bg-slate-955 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                            >
                                                <HiXCircle className="text-lg" /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: AI RESUME BUILDER (Wizard Flow) */}
                {activeTab === "builder" && (
                    <>
                        {/* STATE A: FORM FILL UP WIZARD VIEW */}
                        {!isGenerated ? (
                            <form onSubmit={handleGenerateResume} className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-md space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary" />

                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 border border-amber-500/20">
                                        <HiSparkles className="animate-pulse" />
                                    </div>
                                    <h2 className="text-base xs:text-lg sm:text-3xl font-black text-slate-800 dark:text-white leading-tight whitespace-nowrap truncate">
                                        Build Your Resume with AI
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Fill in your details below. Our AI assistant will optimize your phrasing and generate an ATS-friendly template.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    
                                    {/* Section 1: Personal Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 pb-1">1. Personal Information</h3>
                                        
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                                                <input
                                                    required
                                                    value={resumeData.name}
                                                    onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-350 dark:border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Target Job Title</label>
                                                <input
                                                    required
                                                    value={resumeData.targetJob}
                                                    onChange={(e) => setResumeData({ ...resumeData, targetJob: e.target.value })}
                                                    placeholder="e.g. React Developer"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-355 dark:border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Email</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={resumeData.email}
                                                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-350 dark:border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
                                                <input
                                                    required
                                                    value={resumeData.phone}
                                                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                                                    placeholder="e.g. +91 9876543210"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-355 dark:border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Portfolio or Portfolio Website URL</label>
                                            <input
                                                value={resumeData.website}
                                                onChange={(e) => setResumeData({ ...resumeData, website: e.target.value })}
                                                placeholder="e.g. github.com/username"
                                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Education & Skills */}
                                    <div className="space-y-4 pt-2">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 pb-1">2. Core Competencies</h3>
                                        
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Education Details</label>
                                                <input
                                                    required
                                                    value={resumeData.education}
                                                    onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })}
                                                    placeholder="e.g. B.Tech in Computer Science"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-350 dark:border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Skills (Comma-separated)</label>
                                                <input
                                                    required
                                                    value={resumeData.skills}
                                                    onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                                                    placeholder="React, Node.js, Express, MongoDB"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-350 dark:border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Experience, Projects & Summary */}
                                    <div className="space-y-4 pt-2">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 pb-1">3. Projects & Work History</h3>
                                        
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Work Experience Details</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={resumeData.experience}
                                                onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                                                placeholder="e.g. Worked as frontend engineer. Engineered user dashboards and managed APIs."
                                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-850 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Projects Description</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={resumeData.projects}
                                                onChange={(e) => setResumeData({ ...resumeData, projects: e.target.value })}
                                                placeholder="e.g. E-Commerce App: Built with React/Node/MongoDB featuring Stripe checkout."
                                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-850 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Professional Summary / Bio</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={resumeData.summary}
                                                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-850 py-2.5 px-3 rounded-xl text-xs text-slate-805 dark:text-slate-100 focus:outline-none focus:border-brand-primary leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={aiProcessing}
                                        className="w-full py-3 sm:py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl font-black shadow-lg hover:shadow-xl active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 text-xs sm:text-base whitespace-nowrap"
                                    >
                                        {aiProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Optimizing Layout & Writing ATS Template...
                                            </>
                                        ) : (
                                            <>
                                                <HiSparkles className="text-xl animate-pulse text-amber-300" />
                                                Generate ATS Resume with AI
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* STATE B: DETAILED PREVIEW & OPTIMIZE ACTION PANELS */
                            <div className="grid lg:grid-cols-12 gap-8 items-start">
                                
                                {/* Left Side: AI Optimization & Navigation Actions */}
                                <div className="lg:col-span-5 space-y-6">
                                    
                                    {/* Action Header Card */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-5">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-805 dark:text-white flex items-center gap-2">
                                                <HiCheckCircle className="text-emerald-500 text-xl" /> Resume Ready!
                                            </h3>
                                            <p className="text-xs text-slate-405 mt-1">Download your optimized PDF or run AI enhancement tools.</p>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={handlePrint}
                                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-705 text-white font-black rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                                            >
                                                <HiPrinter className="text-lg" /> Download & Save PDF
                                            </button>

                                            <button
                                                onClick={() => setIsGenerated(false)}
                                                className="w-full py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                                            >
                                                <HiPencilAlt className="text-base" /> Edit Details Form
                                            </button>
                                        </div>
                                    </div>

                                    {/* AI Enhancement Suite Card */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
                                        <div>
                                            <h4 className="text-sm font-black uppercase text-slate-400 dark:text-slate-550 tracking-wider">AI Enhancement Suite</h4>
                                            <p className="text-[10px] text-slate-400 mt-1">Click to automatically rewrite sections using ATS-approved guidelines.</p>
                                        </div>

                                        <div className="space-y-2.5 pt-2">
                                            <button
                                                type="button"
                                                onClick={handleAIPolishSummary}
                                                disabled={aiProcessing}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/5 hover:border-amber-500/30 border border-slate-200 dark:border-slate-800 rounded-xl transition text-left text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <HiSparkles className="text-amber-500 text-sm" /> Optimize Summary & Bio
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-slate-400">Run Assist</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleAIOptimizeExperience}
                                                disabled={aiProcessing}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-955 hover:bg-amber-500/5 hover:border-amber-500/30 border border-slate-200 dark:border-slate-800 rounded-xl transition text-left text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <HiSparkles className="text-amber-500 text-sm" /> Optimize Experience Verbs
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-slate-400">Run Assist</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleAIEnhanceProjects}
                                                disabled={aiProcessing}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-955 hover:bg-amber-500/5 hover:border-amber-500/30 border border-slate-200 dark:border-slate-800 rounded-xl transition text-left text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <HiFolderOpen className="text-amber-500 text-sm" /> Optimize Projects Phrasing
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-slate-400">Run Assist</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleAIEnhanceSkills}
                                                disabled={aiProcessing}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-955 hover:bg-amber-500/5 hover:border-amber-500/30 border border-slate-200 dark:border-slate-800 rounded-xl transition text-left text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <HiSparkles className="text-amber-500 text-sm" /> Tailor Skills Keywords
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-slate-400">Run Assist</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: The Premium A4 Sheet Preview */}
                                <div className="lg:col-span-7 w-full">
                                    <div 
                                        id="resume-preview-card"
                                        className="bg-white text-slate-900 p-5 sm:p-10 md:p-12 shadow-md rounded-2xl border border-slate-200/80 min-h-[850px] relative font-sans leading-relaxed text-sm select-text text-left"
                                    >
                                        {/* Sheet Header */}
                                        <div className="border-b-2 border-slate-800 pb-5 text-center">
                                            <h2 className="text-xl sm:text-3xl font-extrabold tracking-wide uppercase text-slate-900">{resumeData.name || "YOUR NAME"}</h2>
                                            <p className="text-xs sm:text-sm font-bold text-brand-primary uppercase tracking-wider mt-1">{resumeData.targetJob || "TARGET JOB TITLE"}</p>
                                            
                                            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs text-slate-655 mt-3 font-medium">
                                                {resumeData.email && <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200/40">{resumeData.email}</span>}
                                                {resumeData.phone && <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200/40">{resumeData.phone}</span>}
                                                {resumeData.website && <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200/40">{resumeData.website}</span>}
                                            </div>
                                        </div>

                                        {/* Sheet Body */}
                                        <div className="space-y-6 mt-6">
                                            {/* Summary section */}
                                            {resumeData.summary && (
                                                <div className="space-y-1.5">
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-905 border-b border-slate-200 pb-0.5">Professional Summary</h3>
                                                    <p className="text-slate-700 text-xs sm:text-sm text-justify leading-relaxed">{resumeData.summary}</p>
                                                </div>
                                            )}

                                            {/* Skills Section */}
                                            {resumeData.skills && (
                                                <div className="space-y-1.5">
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-905 border-b border-slate-200 pb-0.5">Technical Expertise</h3>
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {resumeData.skills.split(",").map((skill, idx) => (
                                                            <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-semibold">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Experience Section */}
                                            {resumeData.experience && (
                                                <div className="space-y-1.5">
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-905 border-b border-slate-200 pb-0.5">Work History</h3>
                                                    <div className="space-y-2 pt-1 font-sans">
                                                        {resumeData.experience.split("\n").map((line, idx) => {
                                                            if (!line.trim()) return null;
                                                            return (
                                                                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                                                                    <span className="text-brand-primary font-bold mt-1">•</span>
                                                                    <p className="leading-relaxed">{line.trim()}</p>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Projects Section */}
                                            {resumeData.projects && (
                                                <div className="space-y-1.5">
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-905 border-b border-slate-200 pb-0.5">Key Projects</h3>
                                                    <div className="space-y-2 pt-1 font-sans">
                                                        {resumeData.projects.split("\n").map((line, idx) => {
                                                            if (!line.trim()) return null;
                                                            return (
                                                                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                                                                    <span className="text-brand-primary font-bold mt-1">•</span>
                                                                    <p className="leading-relaxed">{line.trim()}</p>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Education Section */}
                                            {resumeData.education && (
                                                <div className="space-y-1.5">
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-905 border-b border-slate-200 pb-0.5">Education & Credentials</h3>
                                                    <p className="text-slate-700 text-xs sm:text-sm pt-1">{resumeData.education}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Custom Confirmation Modal Overlay */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center space-y-5">
                        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto border border-rose-200/20">
                            <HiTrash />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-855 dark:text-white">Delete Resume?</h3>
                            <p className="text-slate-550 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                                Are you sure you want to delete your resume? This action cannot be undone and will remove it from all job applications.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold transition text-xs cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition text-xs cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Resume