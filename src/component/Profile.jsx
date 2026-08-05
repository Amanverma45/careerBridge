import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from "react-hot-toast"
import { 
  HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineGlobeAlt, 
  HiOutlineMail, HiPencilAlt, HiArrowLeft, HiX 
} from 'react-icons/hi'
import { 
  FaCamera, FaGithub, FaLinkedin, FaGlobe, FaFilePdf, 
  FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, 
  FaCertificate, FaDownload, FaUpload, FaEye 
} from 'react-icons/fa'

function Profile({ isModal, onClose }) {
    const storedUser = localStorage.getItem("user")
    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null)
    const isRecruiter = user?.role === 'recruiter'

    const fileInputRef = useRef(null)
    const resumeInputRef = useRef(null)

    const [isEditMode, setIsEditMode] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [name, setName] = useState('')
    const [skills, setSkills] = useState('')
    const [experience, setExperience] = useState('')
    const [bio, setBio] = useState('')
    
    // New fields
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')
    const [educationGrad, setEducationGrad] = useState('')
    const [education12, setEducation12] = useState('')
    const [education10, setEducation10] = useState('')
    const [experienceCompany, setExperienceCompany] = useState('')
    const [experienceRole, setExperienceRole] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [github, setGithub] = useState('')
    const [portfolio, setPortfolio] = useState('')
    const [certification, setCertification] = useState('')

    const [loading, setLoading] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const [uploadingResume, setUploadingResume] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            if (isRecruiter) {
                setSkills(user.companyName || user.skills || '')
                setExperience(user.companyWebsite || user.experience || '')
                setBio(user.companyDescription || user.bio || '')
            } else {
                setSkills(user.skills || '')
                setExperience(user.experience || '')
                setBio(user.bio || '')
                
                // New user fields
                setPhone(user.phone || '')
                setLocation(user.location || '')
                setEducationGrad(user.educationGrad || '')
                setEducation12(user.education12 || '')
                setEducation10(user.education10 || '')
                setExperienceCompany(user.experienceCompany || '')
                setExperienceRole(user.experienceRole || '')
                setLinkedin(user.linkedin || '')
                setGithub(user.github || '')
                setPortfolio(user.portfolio || '')
                setCertification(user.certification || '')
            }
        }
    }, [isEditMode, user])

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("photo", file)
        formData.append("userId", user._id)

        try {
            setUploadingPhoto(true)
            const response = await axios.post("/api/uploadPhoto", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            localStorage.setItem("user", JSON.stringify(response.data.user))
            setUser(response.data.user)
            toast.success("Profile photo updated successfully!")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to upload photo")
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleRemovePhoto = async () => {
        try {
            setUploadingPhoto(true)
            const response = await axios.post("/api/removePhoto", { userId: user._id })
            localStorage.setItem("user", JSON.stringify(response.data.user))
            setUser(response.data.user)
            toast.success("Profile photo removed successfully!")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to remove photo")
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("resume", file)
        formData.append("userId", user._id)

        try {
            setUploadingResume(true)
            const response = await axios.post("/api/uploadResume", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            localStorage.setItem("user", JSON.stringify(response.data.user))
            setUser(response.data.user)
            toast.success("Resume uploaded successfully!")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to upload resume")
        } finally {
            setUploadingResume(false)
        }
    }

    const handleUpdate = async () => {
        if (!isRecruiter) {
            const hasGrad = (educationGrad || '').trim().length > 0;
            const has12 = (education12 || '').trim().length > 0;
            const has10 = (education10 || '').trim().length > 0;
            if (!hasGrad && !has12 && !has10) {
                toast.error("Please add at least one education record (Graduation, 12th, or 10th)");
                return;
            }
        }

        try {
            setLoading(true)
            const payload = {
                name,
                skills: isRecruiter ? undefined : skills,
                experience: isRecruiter ? undefined : experience,
                bio: isRecruiter ? undefined : bio,
                companyName: isRecruiter ? skills : undefined,
                companyWebsite: isRecruiter ? experience : undefined,
                companyDescription: isRecruiter ? bio : undefined,

                // New fields
                phone: isRecruiter ? undefined : phone,
                location: isRecruiter ? undefined : location,
                educationGrad: isRecruiter ? undefined : educationGrad,
                education12: isRecruiter ? undefined : education12,
                education10: isRecruiter ? undefined : education10,
                experienceCompany: isRecruiter ? undefined : experienceCompany,
                experienceRole: isRecruiter ? undefined : experienceRole,
                linkedin: isRecruiter ? undefined : linkedin,
                github: isRecruiter ? undefined : github,
                portfolio: isRecruiter ? undefined : portfolio,
                certification: isRecruiter ? undefined : certification,
            }

            const response = await axios.put(
                `/api/updateUser/${user._id}`,
                payload
            )
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            )
            setUser(response.data.user)
            toast.success("Profile updated successfully")
            setIsEditMode(false)
        } catch (error) {
            console.log(error.response?.data || error.message)
            toast.error("Update failed")
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-slate-600 dark:text-slate-400 font-semibold mb-4">
                    Please login again
                </p>
            </div>
        )
    }

    const cardContent = (
        <div className={`w-full relative animate-scale-in ${isModal ? "" : "max-w-4xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4"}`}>
            
            {/* View Mode */}
            {!isEditMode ? (
                <div className="space-y-6">
                    {/* Header bar */}
                    <div className="flex justify-between items-center w-full pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                        <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-none whitespace-nowrap">
                            {isRecruiter ? "Company Profile" : "My Profile"}
                        </h1>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer active:scale-95 border-none shadow-sm"
                            >
                                <HiPencilAlt className="text-sm" /> Edit Profile
                            </button>
                            {isModal && onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition active:scale-90 cursor-pointer border-none flex items-center justify-center shrink-0"
                                    aria-label="Close modal"
                                >
                                    <HiX className="text-lg stroke-[3px]" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column - User info, Photo, Contacts, Resume (Unified inside 1 Card) */}
                        <div className="md:col-span-1 p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-6 shadow-sm flex flex-col justify-start">
                            {/* Profile Photo Display with zoom preview wrapper */}
                            <div className="flex flex-col items-center text-center relative group">
                                <button 
                                    onClick={() => setIsPreviewOpen(true)}
                                    type="button"
                                    className="relative w-28 h-28 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center cursor-zoom-in group border-none p-0 outline-none"
                                    title="Click to zoom photo"
                                >
                                    {user.profilePhoto ? (
                                        <img 
                                            src={user.profilePhoto} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <HiOutlineUser className="text-5xl text-slate-400" />
                                    )}
                                    
                                    {/* Zoom overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <FaEye className="text-2xl" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Preview</span>
                                    </div>
                                </button>
                                <input 
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />

                                <h2 className="text-lg font-black text-slate-800 dark:text-white mt-4 leading-tight truncate w-full">
                                    {isRecruiter ? (skills || "Company Name") : (name || "Name Not Added")}
                                </h2>
                                <p className="text-xs font-semibold text-brand-primary mt-1 select-none uppercase tracking-wider">
                                    {user.role}
                                </p>
                            </div>

                            <hr className="border-slate-200/60 dark:border-slate-800/60" />

                            {/* Contacts & Metadata */}
                            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                                <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider">Contact Info</h3>
                                
                                <p className="flex items-center gap-2.5">
                                    <HiOutlineMail className="text-base text-slate-400 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </p>
                                
                                {user.phone && (
                                    <p className="flex items-center gap-2.5">
                                        <FaPhone className="text-sm text-slate-400 shrink-0" />
                                        <span>{user.phone}</span>
                                    </p>
                                )}

                                {user.location && (
                                    <p className="flex items-center gap-2.5">
                                        <FaMapMarkerAlt className="text-sm text-slate-400 shrink-0" />
                                        <span>{user.location}</span>
                                    </p>
                                )}
                            </div>

                            {/* Resume Panel (Users only) */}
                            {!isRecruiter && (
                                <>
                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />
                                    <div className="text-xs space-y-4">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider">My Resume</h3>
                                        
                                        {user.resume ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
                                                    <FaFilePdf className="text-3xl text-rose-500 shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-slate-700 dark:text-slate-300 truncate">Resume.pdf</p>
                                                        <p className="text-[10px] text-slate-405">Cloudinary Upload</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <a 
                                                        href={user.resume} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-[10px] uppercase tracking-wider transition active:scale-95 text-center no-underline border-none"
                                                    >
                                                        <FaEye /> View
                                                    </a>
                                                    <a 
                                                        href={user.resume} 
                                                        download="Resume.pdf"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-[10px] uppercase tracking-wider transition active:scale-95 text-center no-underline border-none"
                                                    >
                                                        <FaDownload /> Download
                                                    </a>
                                                </div>

                                                <button 
                                                    onClick={() => resumeInputRef.current.click()}
                                                    disabled={uploadingResume}
                                                    className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition active:scale-95 border-none flex items-center justify-center gap-2"
                                                >
                                                    <FaUpload /> {uploadingResume ? "Uploading..." : "Update Resume"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 space-y-3">
                                                <p className="text-slate-400 italic text-xs">No resume uploaded yet</p>
                                                <button 
                                                    onClick={() => resumeInputRef.current.click()}
                                                    disabled={uploadingResume}
                                                    className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition active:scale-95 border-none flex items-center justify-center gap-2 mx-auto"
                                                >
                                                    <FaUpload /> {uploadingResume ? "Uploading..." : "Upload Resume"}
                                                </button>
                                            </div>
                                        )}
                                        <input 
                                            ref={resumeInputRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleResumeUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Column - Experience, Education, Bio, Socials (Unified inside 1 Card) */}
                        <div className="md:col-span-2 p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-6 shadow-sm flex flex-col justify-start">
                            {/* Bio */}
                            <div className="space-y-2">
                                <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider">
                                    {isRecruiter ? "Company Description" : "About Me"}
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                                    {bio || (isRecruiter ? "No company description added yet." : "No bio details added yet. Edit profile to write about yourself.")}
                                </p>
                            </div>

                            {/* Recruiter Details vs User Details */}
                            {isRecruiter ? (
                                <div className="space-y-4">
                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider">Company Website</h3>
                                        {experience ? (
                                            <a 
                                                href={experience.startsWith('http') ? experience : `https://${experience}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-brand-secondary hover:underline text-xs font-semibold"
                                            >
                                                <HiOutlineGlobeAlt className="text-sm shrink-0" /> {experience}
                                            </a>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No website specified</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    {/* User Skills */}
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider">Key Skills</h3>
                                        {skills ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                                                    <span 
                                                        key={i}
                                                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-955 border border-slate-200/50 dark:border-slate-800 text-[10px] sm:text-xs font-semibold text-slate-755 dark:text-slate-300 shadow-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
                                        )}
                                    </div>

                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    {/* User Work Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider flex items-center gap-1.5">
                                            <FaBriefcase className="text-slate-400 text-xs" /> Work Experience
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience Level</p>
                                                <p className="text-xs font-black text-slate-755 dark:text-white">{experience || "Not Specified"}</p>
                                            </div>
                                            {(experienceCompany || experienceRole) && (
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Employer / Role</p>
                                                    <p className="text-xs font-black text-slate-755 dark:text-white">
                                                        {experienceRole || "Developer"} at {experienceCompany || "Company"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    {/* User Education Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider flex items-center gap-1.5">
                                            <FaGraduationCap className="text-slate-400 text-sm" /> Education History
                                        </h3>

                                        <div className="space-y-3.5">
                                            {educationGrad && (
                                                <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-primary">Graduation</p>
                                                    <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-0.5">{educationGrad}</p>
                                                </div>
                                            )}
                                            {education12 && (
                                                <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-secondary">Class 12th</p>
                                                    <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-0.5">{education12}</p>
                                                </div>
                                            )}
                                            {education10 && (
                                                <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-500">Class 10th</p>
                                                    <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-0.5">{education10}</p>
                                                </div>
                                            )}
                                            {!educationGrad && !education12 && !education10 && (
                                                <p className="text-xs text-slate-400 italic">No education details recorded yet.</p>
                                            )}
                                        </div>
                                    </div>

                                    {certification && (
                                        <>
                                            <hr className="border-slate-200/60 dark:border-slate-800/60" />
                                            <div className="space-y-2">
                                                <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider flex items-center gap-1.5">
                                                    <FaCertificate className="text-slate-450 text-xs animate-pulse-slow" /> Certifications
                                                </h3>
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {certification}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    {/* Social links */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider">Social Links & Portfolios</h3>
                                        
                                        <div className="flex flex-wrap gap-2.5">
                                            {github && (
                                                <a 
                                                    href={github.startsWith('http') ? github : `https://${github}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs tracking-wide transition active:scale-95 no-underline shadow-sm border-none"
                                                >
                                                    <FaGithub className="text-base" /> GitHub
                                                </a>
                                            )}

                                            {linkedin && (
                                                <a 
                                                    href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs tracking-wide transition active:scale-95 no-underline shadow-sm border-none"
                                                >
                                                    <FaLinkedin className="text-base" /> LinkedIn
                                                </a>
                                            )}

                                            {portfolio && (
                                                <a 
                                                    href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold rounded-xl text-xs tracking-wide transition active:scale-95 no-underline shadow-sm border-none"
                                                >
                                                    <FaGlobe className="text-sm" /> Portfolio
                                                </a>
                                            )}

                                            {!github && !linkedin && !portfolio && (
                                                <p className="text-xs text-slate-400 italic">No social links added yet</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Mode Form
                <div className="space-y-6">
                    <div className="flex justify-between items-center w-full pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsEditMode(false)}
                                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 active:scale-95 transition cursor-pointer shrink-0 border-none"
                                aria-label="Go back"
                            >
                                <HiArrowLeft className="text-base" />
                            </button>
                            <h1 className="text-xl font-black text-slate-800 dark:text-white leading-none">
                                Edit Profile Details
                            </h1>
                        </div>
                        {isModal && onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition active:scale-90 cursor-pointer border-none flex items-center justify-center shrink-0"
                                aria-label="Close modal"
                            >
                                <HiX className="text-lg stroke-[3px]" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                        {/* Profile Photo edit section inside Edit Profile */}
                        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center shrink-0">
                                {user.profilePhoto ? (
                                    <img 
                                        src={user.profilePhoto} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <HiOutlineUser className="text-4xl text-slate-400" />
                                )}
                                {uploadingPhoto && (
                                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                                        <span className="text-[10px] text-white font-bold">Uploading...</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                                <p className="text-xs font-bold text-slate-755 dark:text-slate-350">Profile Picture</p>
                                <p className="text-[10px] text-slate-400">Upload JPEG, PNG or WEBP (Max 10MB)</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    {user.profilePhoto ? (
                                        <>
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                type="button"
                                                disabled={uploadingPhoto}
                                                className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary font-bold rounded-xl text-xs transition cursor-pointer border-none flex items-center gap-1.5 active:scale-95"
                                            >
                                                <FaCamera /> Change Photo
                                            </button>
                                            <button
                                                onClick={handleRemovePhoto}
                                                type="button"
                                                disabled={uploadingPhoto}
                                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 font-bold rounded-xl text-xs transition cursor-pointer border-none flex items-center gap-1.5 active:scale-95"
                                            >
                                                Remove Photo
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            type="button"
                                            disabled={uploadingPhoto}
                                            className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary font-bold rounded-xl text-xs transition cursor-pointer border-none flex items-center gap-1.5 active:scale-95"
                                        >
                                            <FaCamera /> Upload Photo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Recruiter Name" : "Full Name"}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                            />
                        </div>

                        {/* Phone */}
                        {!isRecruiter && (
                            <div>
                                <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. +91 9876543210"
                                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                />
                            </div>
                        )}

                        {/* Location */}
                        {!isRecruiter && (
                            <div>
                                <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Indore, Madhya Pradesh"
                                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                />
                            </div>
                        )}

                        {/* Skills / Company Name */}
                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Company Name" : "Skills (comma separated)"}
                            </label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder={isRecruiter ? "e.g. Google, CareerBridge" : "React, Node.js, MongoDB"}
                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                            />
                        </div>

                        {/* Experience / Website */}
                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Company Website" : "Experience Level"}
                            </label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder={isRecruiter ? "e.g. https://company.com" : "e.g. 2 Years / Fresher"}
                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                            />
                        </div>

                        {/* Bio / Description */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Company Description" : "Profile Bio"}
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows="3"
                                placeholder={isRecruiter ? "Write something about your company..." : "Write something about yourself..."}
                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                            />
                        </div>

                        {/* User Specific Extended Fields */}
                        {!isRecruiter && (
                            <>
                                <div className="md:col-span-2 border-t border-slate-150 dark:border-slate-800/80 pt-4 mt-2">
                                    <h3 className="text-xs uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider font-bold">Employment Details</h3>
                                </div>
                                
                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        Employer / Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={experienceCompany}
                                        onChange={(e) => setExperienceCompany(e.target.value)}
                                        placeholder="e.g. ABC Company"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        Job Role / Designation
                                    </label>
                                    <input
                                        type="text"
                                        value={experienceRole}
                                        onChange={(e) => setExperienceRole(e.target.value)}
                                        placeholder="e.g. Software Developer"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div className="md:col-span-2 border-t border-slate-150 dark:border-slate-800/80 pt-4">
                                    <h3 className="text-xs uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider font-bold">Education Details (At least one required)</h3>
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        Graduation Details
                                    </label>
                                    <input
                                        type="text"
                                        value={educationGrad}
                                        onChange={(e) => setEducationGrad(e.target.value)}
                                        placeholder="e.g. B.Tech in CSE, SGSITS College (2025)"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        Class 12th Details
                                    </label>
                                    <input
                                        type="text"
                                        value={education12}
                                        onChange={(e) => setEducation12(e.target.value)}
                                        placeholder="e.g. CBSE Board, 92% (2021)"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        Class 10th Details
                                    </label>
                                    <input
                                        type="text"
                                        value={education10}
                                        onChange={(e) => setEducation10(e.target.value)}
                                        placeholder="e.g. MP Board, 94% (2019)"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        Certifications
                                    </label>
                                    <input
                                        type="text"
                                        value={certification}
                                        onChange={(e) => setCertification(e.target.value)}
                                        placeholder="e.g. AWS Cloud Practitioner / Oracle Java Certified"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div className="md:col-span-2 border-t border-slate-150 dark:border-slate-800/80 pt-4">
                                    <h3 className="text-xs uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider font-bold">Social Links & Portfolios</h3>
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        GitHub Link
                                    </label>
                                    <input
                                        type="text"
                                        value={github}
                                        onChange={(e) => setGithub(e.target.value)}
                                        placeholder="e.g. https://github.com/username"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        LinkedIn Link
                                    </label>
                                    <input
                                        type="text"
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                        placeholder="e.g. https://linkedin.com/in/username"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                        Portfolio Website Link
                                    </label>
                                    <input
                                        type="text"
                                        value={portfolio}
                                        onChange={(e) => setPortfolio(e.target.value)}
                                        placeholder="e.g. https://myportfolio.com"
                                        className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100 text-sm"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-150 dark:border-slate-800/80">
                        <button
                            onClick={() => setIsEditMode(false)}
                            className="w-1/2 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 py-3 rounded-xl font-bold transition active:scale-95 cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="w-1/2 bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl font-bold transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-sm border-none"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
            {/* Image Preview Lightbox */}
            {isPreviewOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsPreviewOpen(false)}>
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        {/* Header with Name and Close button */}
                        <div className="flex justify-between items-center w-full pb-3 border-b border-slate-200 dark:border-slate-850">
                            <h2 className="text-lg font-black text-slate-800 dark:text-white leading-none">
                                {isRecruiter ? (skills || "Company Profile") : (name || "Profile Photo")}
                            </h2>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer border-none flex items-center justify-center"
                                aria-label="Close preview"
                            >
                                <HiX className="text-lg stroke-[3px]" />
                            </button>
                        </div>
                        
                        {/* Large Image */}
                        <div className="mt-4 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 aspect-square border border-slate-200 dark:border-slate-800">
                            {user.profilePhoto ? (
                                <img 
                                    src={user.profilePhoto} 
                                    alt="Profile Zoom" 
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <HiOutlineUser className="text-8xl text-slate-350 dark:text-slate-700" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (isModal) {
        return cardContent;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] p-6 md:p-10 flex flex-col justify-center items-center transition-colors duration-300 animate-fade-in">
            {cardContent}
        </div>
    )
}

export default Profile
