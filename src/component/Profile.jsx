import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from "react-hot-toast"
import { HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineGlobeAlt, HiOutlineMail, HiPencilAlt, HiArrowLeft, HiX } from 'react-icons/hi'

function Profile({ isModal, onClose }) {
    const storedUser = localStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : null
    const isRecruiter = user?.role === 'recruiter'

    const [isEditMode, setIsEditMode] = useState(false)
    const [name, setName] = useState('')
    const [skills, setSkills] = useState('')
    const [experience, setExperience] = useState('')
    const [bio, setBio] = useState('')
    const [loading, setLoading] = useState(false)

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
            }
        }
    }, [isEditMode])

    const handleUpdate = async () => {
        const currentName = (user.name || '').trim();
        const currentSkills = (isRecruiter ? (user.companyName || user.skills || '') : (user.skills || '')).trim();
        const currentExperience = (isRecruiter ? (user.companyWebsite || user.experience || '') : (user.experience || '')).trim();
        const currentBio = (isRecruiter ? (user.companyDescription || user.bio || '') : (user.bio || '')).trim();

        if (
            name.trim() === currentName &&
            skills.trim() === currentSkills &&
            experience.trim() === currentExperience &&
            bio.trim() === currentBio
        ) {
            toast.error("No changes detected")
            setIsEditMode(false)
            return
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
                companyDescription: isRecruiter ? bio : undefined
            }

            const response = await axios.put(
                `https://careerbridge-b-1.onrender.com/api/updateUser/${user._id}`,
                payload
            )
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            )
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
        <div className={`w-full relative ${isModal ? "" : "max-w-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"}`}>
            
            {/* Modal Close Button */}
            {isModal && (
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition z-20 cursor-pointer"
                    aria-label="Close modal"
                >
                    <HiX className="text-xl stroke-[3px]" />
                </button>
            )}

            {/* View Mode */}
            {!isEditMode ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 justify-start pr-12">
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                            {isRecruiter ? "Company Profile" : "My Profile"}
                        </h1>
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="px-3.5 py-1.5 bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary font-bold rounded-xl text-sm flex items-center gap-1.5 transition cursor-pointer shrink-0"
                        >
                            <HiPencilAlt className="text-base" /> Edit
                        </button>
                    </div>

                    {/* Profile Details Block */}
                    <div className="space-y-6 relative">
                        {/* Header Info Block */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pb-5 border-b border-slate-200/60 dark:border-slate-800/60">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-brand-primary text-2xl shadow-inner shrink-0">
                                {isRecruiter ? <HiOutlineOfficeBuilding /> : <HiOutlineUser />}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">
                                    {isRecruiter ? (skills || "Company Name Not Added") : (name || "Name Not Added")}
                                </h2>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    {isRecruiter && (
                                        <span className="flex items-center gap-1.5">
                                            <HiOutlineUser className="text-slate-400" /> Recruiter: {name || "Name not specified"}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <HiOutlineMail className="text-slate-400" /> {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid Content */}
                        <div className="space-y-5 text-slate-750 dark:text-slate-250">
                            {isRecruiter ? (
                                <>
                                    <div className="space-y-1.5">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Company Website</h3>
                                        {experience ? (
                                            <a 
                                                href={experience.startsWith('http') ? experience : `https://${experience}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-brand-secondary hover:underline text-xs sm:text-sm font-semibold"
                                            >
                                                <HiOutlineGlobeAlt className="text-base" /> {experience}
                                            </a>
                                        ) : (
                                            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 italic">No website specified</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Company Description</h3>
                                        <p className="text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                                            {bio || "No company description added yet. Edit profile to add details."}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Key Skills</h3>
                                        {skills ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.split(',').map((skill, i) => (
                                                    <span 
                                                        key={i}
                                                        className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-750 dark:text-slate-300 shadow-sm"
                                                    >
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs sm:text-sm text-slate-450 italic">No skills listed yet.</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Experience</h3>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                                            {experience || "No experience details added yet."}
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <h3 className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Bio</h3>
                                        <p className="text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                                            {bio || "Write a brief bio about yourself..."}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Mode Form
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditMode(false)}
                            className="p-2 rounded-xl bg-slate-105 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white active:scale-95 transition cursor-pointer"
                            aria-label="Go back"
                        >
                            <HiArrowLeft className="text-base" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                                Edit Profile
                            </h1>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Recruiter Name" : "Name"}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-850 dark:text-slate-100 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Company Name" : "Skills"}
                            </label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder={isRecruiter ? "e.g. Google, CareerBridge" : "React, Node.js, MongoDB"}
                                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-850 dark:text-slate-100 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Company Website" : "Experience"}
                            </label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder={isRecruiter ? "e.g. https://company.com" : "Fresher / 1 Year / 2 Years"}
                                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-850 dark:text-slate-100 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block mb-1.5 font-bold text-xs text-slate-700 dark:text-slate-350">
                                {isRecruiter ? "Company Description" : "Bio"}
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows="4"
                                placeholder={isRecruiter ? "Write something about your company..." : "Write something about yourself..."}
                                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-355 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-850 dark:text-slate-100 text-sm"
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => setIsEditMode(false)}
                                className="w-1/2 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 rounded-xl font-bold transition active:scale-95 cursor-pointer text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="w-1/2 bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl font-bold transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
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
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] p-6 md:p-10 flex flex-col justify-center items-center transition-colors duration-300">
            {cardContent}
        </div>
    )
}

export default Profile
