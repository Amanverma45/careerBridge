import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
import { validateText, validatePhone, validateUrl } from '../utils/validation'

function Profile({ isModal, onClose, viewUser }) {
    const storedUser = localStorage.getItem("user")
    const [user, setUser] = useState(viewUser || (storedUser ? JSON.parse(storedUser) : null))
    const isRecruiter = user?.role === 'recruiter'

    useEffect(() => {
        if (viewUser) {
            setUser(viewUser)
        }
    }, [viewUser])

    const fileInputRef = useRef(null)
    const resumeInputRef = useRef(null)

    const [isEditMode, setIsEditMode] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [name, setName] = useState('')
    const [skills, setSkills] = useState('')
    const [experience, setExperience] = useState('')
    const [bio, setBio] = useState('')

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
        // Run validations on inputs
        const nameError = validateText(name, "Name");
        if (nameError) {
            toast.error(nameError);
            return;
        }

        if (skills) {
            const skillsError = validateText(skills, isRecruiter ? "Company Name" : "Skills");
            if (skillsError) {
                toast.error(skillsError);
                return;
            }
        }

        if (experience) {
            if (isRecruiter) {
                const websiteError = validateUrl(experience, "Company Website");
                if (websiteError) {
                    toast.error(websiteError);
                    return;
                }
            } else {
                const expError = validateText(experience, "Experience");
                if (expError) {
                    toast.error(expError);
                    return;
                }
            }
        }

        if (bio) {
            const bioError = validateText(bio, isRecruiter ? "Company Description" : "Bio");
            if (bioError) {
                toast.error(bioError);
                return;
            }
        }

        // Validate phone, location, and socials for both recruiters and candidates
        const phoneError = validatePhone(phone);
        if (phoneError) {
            toast.error(phoneError);
            return;
        }

        if (location) {
            const locError = validateText(location, "Location");
            if (locError) {
                toast.error(locError);
                return;
            }
        }

        const linkedinError = validateUrl(linkedin, "LinkedIn URL");
        if (linkedinError) {
            toast.error(linkedinError);
            return;
        }

        const githubError = validateUrl(github, "GitHub URL");
        if (githubError) {
            toast.error(githubError);
            return;
        }

        const portfolioError = validateUrl(portfolio, "Portfolio URL");
        if (portfolioError) {
            toast.error(portfolioError);
            return;
        }

        if (!isRecruiter) {
            const hasGrad = (educationGrad || '').trim().length > 0;
            const has12 = (education12 || '').trim().length > 0;
            const has10 = (education10 || '').trim().length > 0;
            if (!hasGrad && !has12 && !has10) {
                toast.error("Please add at least one education record (Graduation, 12th, or 10th)");
                return;
            }

            if (educationGrad) {
                const eduGradError = validateText(educationGrad, "Graduation details");
                if (eduGradError) {
                    toast.error(eduGradError);
                    return;
                }
            }

            if (education12) {
                const edu12Error = validateText(education12, "12th details");
                if (edu12Error) {
                    toast.error(edu12Error);
                    return;
                }
            }

            if (education10) {
                const edu10Error = validateText(education10, "10th details");
                if (edu10Error) {
                    toast.error(edu10Error);
                    return;
                }
            }

            if (experienceCompany) {
                const expCompError = validateText(experienceCompany, "Experience Company");
                if (expCompError) {
                    toast.error(expCompError);
                    return;
                }
            }

            if (experienceRole) {
                const expRoleError = validateText(experienceRole, "Experience Role");
                if (expRoleError) {
                    toast.error(expRoleError);
                    return;
                }
            }

            if (certification) {
                const certError = validateText(certification, "Certification");
                if (certError) {
                    toast.error(certError);
                    return;
                }
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

                phone,
                location,
                linkedin,
                github,
                portfolio,

                educationGrad: isRecruiter ? undefined : educationGrad,
                education12: isRecruiter ? undefined : education12,
                education10: isRecruiter ? undefined : education10,
                experienceCompany: isRecruiter ? undefined : experienceCompany,
                experienceRole: isRecruiter ? undefined : experienceRole,
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
                    <div className="flex justify-between items-center w-full pb-4 border-b border-slate-200/60 dark:border-slate-800/60 gap-2">
                        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 dark:text-white leading-none whitespace-nowrap truncate min-w-0">
                            {isRecruiter ? "Company Profile" : "My Profile"}
                        </h1>
                        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                            {!viewUser && (
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-[10px] sm:text-xs md:text-sm flex items-center gap-1 sm:gap-1.5 transition cursor-pointer active:scale-95 border-none shadow-sm whitespace-nowrap shrink-0"
                                >
                                    <HiPencilAlt className="text-xs sm:text-sm shrink-0" /> <span className="shrink-0">Edit Profile</span>
                                </button>
                            )}
                            {isModal && onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition active:scale-90 cursor-pointer border-none flex items-center justify-center shrink-0"
                                    aria-label="Close modal"
                                >
                                    <HiX className="text-sm sm:text-lg stroke-[3px]" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isRecruiter ? (
                            <>
                                {/* RECRUITER CARD 1: Header Profile Card */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-4 shadow-sm flex flex-col items-center text-center justify-center min-h-[220px]">
                                    <button
                                        onClick={() => {
                                            if (user.profilePhoto) {
                                                setIsPreviewOpen(true);
                                            } else {
                                                toast.error("No profile image");
                                            }
                                        }}
                                        type="button"
                                        className="relative w-24 h-24 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center cursor-pointer group border-none p-0 outline-none"
                                        title="Click to zoom photo"
                                    >
                                        {user.profilePhoto ? (
                                            <img
                                                src={user.profilePhoto}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <HiOutlineUser className="text-4xl text-slate-400" />
                                        )}
                                    </button>

                                    <div className="w-full">
                                        <h2 className="text-lg font-black text-slate-800 dark:text-white mt-2 leading-tight truncate w-full">
                                            {skills || "Company Name"}
                                        </h2>
                                        {user.name && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                                                Recruiter: {user.name}
                                            </p>
                                        )}
                                        <p className="text-[10px] font-bold text-brand-primary mt-1.5 select-none uppercase tracking-wider bg-brand-primary/10 px-2 py-0.5 rounded-full inline-block">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>

                                {/* RECRUITER CARD 2: Contact Info Card */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-4 shadow-sm flex flex-col justify-start">
                                    <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800/60">Contact Info</h3>
                                    <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 mt-2">
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
                                    {(github || linkedin || portfolio) && (
                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3">
                                            <p className="text-[9px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider mb-2">Social Profiles</p>
                                            <div className="flex flex-wrap gap-2">
                                                {github && (
                                                    <a
                                                        href={github.startsWith('http') ? github : `https://${github}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-[9px] tracking-wide transition active:scale-95 no-underline shadow-sm border-none cursor-pointer"
                                                    >
                                                        <FaGithub className="text-xs shrink-0" /> GitHub
                                                    </a>
                                                )}
                                                {linkedin && (
                                                    <a
                                                        href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[9px] tracking-wide transition active:scale-95 no-underline shadow-sm border-none cursor-pointer"
                                                    >
                                                        <FaLinkedin className="text-xs shrink-0" /> LinkedIn
                                                    </a>
                                                )}
                                                {portfolio && (
                                                    <a
                                                        href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold rounded-xl text-[9px] tracking-wide transition active:scale-95 no-underline shadow-sm border-none cursor-pointer"
                                                    >
                                                        <FaGlobe className="text-xs shrink-0" /> Portfolio
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RECRUITER CARD 3: Company Description */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-4 shadow-sm flex flex-col justify-start">
                                    <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800/60">Company Description</h3>
                                    <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-355 whitespace-pre-line overflow-y-auto max-h-[140px] pr-1">
                                        {bio || "No company description added yet."}
                                    </p>
                                </div>

                                {/* RECRUITER CARD 4: Company Website & Meta */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800/60 mb-3">Company Website</h3>
                                        {experience ? (
                                            <a
                                                href={experience.startsWith('http') ? experience : `https://${experience}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-secondary/10 hover:bg-brand-secondary text-brand-secondary hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95 no-underline"
                                            >
                                                <HiOutlineGlobeAlt className="text-base shrink-0" /> <span className="truncate max-w-[200px]">{experience}</span>
                                            </a>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No website specified</p>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Status</span>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">Verified Partner</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* CANDIDATE CARD 1: Header Profile & Contacts */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-5 shadow-sm flex flex-col justify-start">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                        <button
                                            onClick={() => {
                                                if (user.profilePhoto) {
                                                    setIsPreviewOpen(true);
                                                } else {
                                                    toast.error("No profile image");
                                                }
                                            }}
                                            type="button"
                                            className="relative w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center cursor-pointer group border-none p-0 outline-none shrink-0"
                                            title="Click to zoom photo"
                                        >
                                            {user.profilePhoto ? (
                                                <img
                                                    src={user.profilePhoto}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <HiOutlineUser className="text-4xl text-slate-400" />
                                            )}
                                        </button>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight truncate w-full">
                                                {name || "Name Not Added"}
                                            </h2>
                                            <p className="text-[10px] font-bold text-brand-primary mt-1 select-none uppercase tracking-wider bg-brand-primary/10 px-2 py-0.5 rounded-full inline-block">
                                                {user.role}
                                            </p>
                                        </div>
                                    </div>

                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider">Contact Info</h3>
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
                                </div>

                                {/* CANDIDATE CARD 2: About & Skills */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-4 shadow-sm flex flex-col justify-start">
                                    <div>
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800/60">About Me</h3>
                                        <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-355 whitespace-pre-line mt-2 overflow-y-auto max-h-[100px] pr-1">
                                            {bio || "No bio details added yet."}
                                        </p>
                                    </div>

                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    <div className="space-y-3 flex-1 flex flex-col justify-start">
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider">Key Skills</h3>
                                        {skills ? (
                                            <div className="flex flex-wrap gap-1.5 mt-1 overflow-y-auto max-h-[100px] pr-1">
                                                {skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-955 border border-slate-200/50 dark:border-slate-800 text-[10px] font-semibold text-slate-755 dark:text-slate-300 shadow-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* CANDIDATE CARD 3: Experience & Education */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-4 shadow-sm flex flex-col justify-start">
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                                            <FaBriefcase className="text-slate-400 text-xs" /> Work Experience
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Experience Level</p>
                                                <p className="text-xs font-black text-slate-755 dark:text-white">{experience || "Not Specified"}</p>
                                            </div>
                                            {(experienceCompany || experienceRole) && (
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Last Employer / Role</p>
                                                    <p className="text-xs font-black text-slate-755 dark:text-white truncate">
                                                        {experienceRole || "Developer"} at {experienceCompany || "Company"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    <div className="space-y-3 flex-1 flex flex-col justify-start">
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                                            <FaGraduationCap className="text-slate-400 text-sm" /> Education History
                                        </h3>
                                        <div className="space-y-2 mt-2 overflow-y-auto max-h-[140px] pr-1">
                                            {educationGrad && (
                                                <div className="p-2 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                                                    <p className="text-[9px] font-black uppercase tracking-wider text-brand-primary">Graduation</p>
                                                    <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate mt-0.5">{educationGrad}</p>
                                                </div>
                                            )}
                                            {education12 && (
                                                <div className="p-2 bg-white dark:bg-slate-955 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                                                    <p className="text-[9px] font-black uppercase tracking-wider text-brand-secondary">Class 12th</p>
                                                    <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate mt-0.5">{education12}</p>
                                                </div>
                                            )}
                                            {education10 && (
                                                <div className="p-2 bg-white dark:bg-slate-955 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                                                    <p className="text-[9px] font-black uppercase tracking-wider text-amber-500">Class 10th</p>
                                                    <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate mt-0.5">{education10}</p>
                                                </div>
                                            )}
                                            {!educationGrad && !education12 && !education10 && (
                                                <p className="text-xs text-slate-400 italic">No education details recorded yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CANDIDATE CARD 4: Resume & Social Links */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl space-y-4 shadow-sm flex flex-col justify-start">
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider">My Resume</h3>
                                        {user.resume ? (
                                            <div className="space-y-2 mt-1.5">
                                                <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
                                                    <FaFilePdf className="text-2xl text-rose-500 shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-xs text-slate-700 dark:text-slate-300 truncate">Resume.pdf</p>
                                                        <p className="text-[9px] text-slate-400">Cloudinary Upload</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <a
                                                        href={user.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 text-center no-underline border-none cursor-pointer"
                                                    >
                                                        <FaEye className="text-[10px]" /> View
                                                    </a>
                                                    <a
                                                        href={user.resume}
                                                        download="Resume.pdf"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 text-center no-underline border-none cursor-pointer"
                                                    >
                                                        <FaDownload className="text-[10px]" /> Download
                                                    </a>
                                                </div>
                                                {!viewUser && (
                                                    <button
                                                        onClick={() => resumeInputRef.current.click()}
                                                        disabled={uploadingResume}
                                                        className="w-full py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 border-none flex items-center justify-center gap-1.5 cursor-pointer"
                                                    >
                                                        <FaUpload className="text-[10px]" /> {uploadingResume ? "Uploading..." : "Update Resume"}
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-2 space-y-2 mt-1.5">
                                                <p className="text-slate-400 italic text-[11px]">No resume uploaded yet</p>
                                                {!viewUser && (
                                                    <button
                                                        onClick={() => resumeInputRef.current.click()}
                                                        disabled={uploadingResume}
                                                        className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 border-none flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                                                    >
                                                        <FaUpload className="text-[10px]" /> {uploadingResume ? "Uploading..." : "Upload Resume"}
                                                    </button>
                                                )}
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

                                    {certification && (
                                        <>
                                            <hr className="border-slate-200/60 dark:border-slate-800/60" />
                                            <div className="space-y-1">
                                                <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                                                    <FaCertificate className="text-slate-400 text-xs shrink-0" /> Certifications
                                                </h3>
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                                                    {certification}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <hr className="border-slate-200/60 dark:border-slate-800/60" />

                                    <div className="space-y-3">
                                        <h3 className="text-[10px] uppercase font-black text-slate-405 dark:text-slate-500 tracking-wider">Social Profiles</h3>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {github && (
                                                <a
                                                    href={github.startsWith('http') ? github : `https://${github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-[10px] tracking-wide transition active:scale-95 no-underline shadow-sm border-none"
                                                >
                                                    <FaGithub className="text-sm shrink-0" /> GitHub
                                                </a>
                                            )}
                                            {linkedin && (
                                                <a
                                                    href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[10px] tracking-wide transition active:scale-95 no-underline shadow-sm border-none"
                                                >
                                                    <FaLinkedin className="text-sm shrink-0" /> LinkedIn
                                                </a>
                                            )}
                                            {portfolio && (
                                                <a
                                                    href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold rounded-xl text-[10px] tracking-wide transition active:scale-95 no-underline shadow-sm border-none"
                                                >
                                                    <FaGlobe className="text-xs shrink-0" /> Portfolio
                                                </a>
                                            )}
                                            {!github && !linkedin && !portfolio && (
                                                <p className="text-xs text-slate-400 italic">No social links added yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
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
                        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50/50 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl">
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
                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-355">
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

                        {/* Location */}
                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-355">
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
                            </>
                        )}

                        <div className="md:col-span-2 border-t border-slate-150 dark:border-slate-800/80 pt-4">
                            <h3 className="text-xs uppercase font-black text-slate-400 dark:text-slate-505 tracking-wider font-bold">Social Links & Portfolios</h3>
                        </div>

                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-355">
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
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-355">
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
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-355">
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
            {isPreviewOpen && createPortal(
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-center justify-center p-4 animate-fade-in cursor-zoom-out" onClick={() => setIsPreviewOpen(false)}>
                    <div className="relative max-w-sm sm:max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        {/* Close button floating at top-right corner of the image */}
                        <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border-2 border-white shadow-lg flex items-center justify-center transition active:scale-95 cursor-pointer z-20"
                            aria-label="Close preview"
                        >
                            <HiX className="text-base stroke-[3px]" />
                        </button>

                        {/* Image with white border frame */}
                        <div className="rounded-3xl overflow-hidden border-[6px] border-white shadow-2xl bg-white">
                            {user.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt="Profile Zoom"
                                    className="w-full h-auto object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center aspect-square bg-slate-100">
                                    <HiOutlineUser className="text-8xl text-slate-400" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
            />
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