import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { HiArrowLeft, HiOutlineMail, HiOutlineCalendar, HiEye, HiDownload, HiCheck, HiX, HiMinus, HiPlus, HiRefresh, HiExternalLink, HiOutlineUser } from 'react-icons/hi'
import Profile from './Profile.jsx'

function Applicants() {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [applicants, setApplicants] = useState([])
    const [viewProfileUser, setViewProfileUser] = useState(null)
    const [selectedResume, setSelectedResume] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [statusLoadingId, setStatusLoadingId] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)
    const [iframeLoading, setIframeLoading] = useState(false)

    const fetchApplicants = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                `https://careerbridge-b-1.onrender.com/application/applicants/${jobId}`
            )
            setApplicants(res.data)
        } catch (error) {
            console.log(error)
            toast.error("Failed to load applicants")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (jobId) {
            fetchApplicants()
        }
    }, [jobId])

    useEffect(() => {
        if (!loading && window.initScrollAnimations) {
            setTimeout(() => {
                window.initScrollAnimations()
            }, 50)
        }
    }, [loading])

    useEffect(() => {
        if (!selectedResume) {
            setIframeUrl(null)
            return
        }

        const isPdf = selectedResume.toLowerCase().endsWith('.pdf') || selectedResume.includes('/raw/upload') || selectedResume.includes('.pdf')

        if (isPdf) {
            setIframeLoading(true)
            axios.get(selectedResume, { responseType: 'blob' })
                .then(response => {
                    const blob = new Blob([response.data], { type: 'application/pdf' })
                    const localUrl = URL.createObjectURL(blob)
                    setIframeUrl(localUrl)
                })
                .catch(err => {
                    console.error("Error loading resume blob:", err)
                    setIframeUrl(selectedResume)
                })
                .finally(() => {
                    setIframeLoading(false)
                })
        } else {
            setIframeUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(selectedResume)}&embedded=true`)
        }

        return () => {
            if (iframeUrl && iframeUrl.startsWith('blob:')) {
                URL.revokeObjectURL(iframeUrl)
            }
        }
    }, [selectedResume])

    const handleShortlist = async (appId) => {
        try {
            setStatusLoadingId(appId)
            await axios.put(
                `https://careerbridge-b-1.onrender.com/application/status/${appId}`,
                { status: "shortlisted" }
            )
            toast.success("Candidate Shortlisted successfully")
            setApplicants(prev => prev.map(app => app._id === appId ? { ...app, status: "shortlisted" } : app))
        } catch (error) {
            toast.error("Failed to shortlist candidate")
            console.log(error)
        } finally {
            setStatusLoadingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 py-10 transition-colors duration-300 animate-fade-in">
            <div className="max-w-6xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-200/60 dark:border-slate-800/60 w-full">
                    <div className="flex items-center gap-3 pr-4 min-w-0 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/recruiterdashboard')}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 active:scale-95 transition cursor-pointer shrink-0"
                            aria-label="Go back"
                        >
                            <HiArrowLeft className="text-base" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                                Applicants
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                Review candidates who applied for this job.
                            </p>
                        </div>
                    </div>

                    {applicants.length > 0 && (
                        <span className="px-4 py-2 bg-brand-primary/10 text-brand-primary font-bold rounded-xl text-sm shrink-0 w-full sm:w-auto text-center sm:text-left">
                            Total: {applicants.length} Candidates
                        </span>
                    )}
                </div>

                {/* Main Body */}
                {loading ? (
                    <div className="flex justify-center items-center h-[40vh]">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : applicants.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 p-16 rounded-3xl text-center shadow-sm max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-slate-555/5 dark:bg-slate-955 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-3xl mx-auto mb-4">
                            <HiOutlineCalendar />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No Applicants Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Applications will show up here once candidates apply.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                        {applicants.map((app, index) => {
                          const isShortlisted = app.status === "shortlisted"
                          const borderColors = [
                              "border-t-brand-primary",
                              "border-t-brand-secondary",
                              "border-t-brand-accent"
                          ];
                          const borderClass = borderColors[index % 3];

                          return (
                            <div
                                key={app._id}
                                className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${borderClass} rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between max-w-md w-full mx-auto ${window.getScrollAnimClass ? window.getScrollAnimClass(index) : ""}`}
                            >
                                <div>
                                    {/* Candidate Row Header */}
                                    <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                                        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-brand-primary/10 text-brand-primary rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-lg font-black border border-brand-primary/20 shrink-0">
                                            {app.userId?.name?.charAt(0).toUpperCase() || "?"}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xs sm:text-base font-extrabold text-slate-800 dark:text-white truncate leading-tight">
                                                {app.userId?.name || "Anonymous Candidate"}
                                            </h3>
                                            <p className="text-[10px] sm:text-xs text-slate-550 dark:text-slate-400 truncate flex items-center gap-1">
                                                <HiOutlineMail className="shrink-0 text-xs" /> {app.userId?.email || "No email"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Application Information */}
                                    <div className="space-y-1.5 mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                            <span className="text-slate-450 dark:text-slate-505">Applied Date:</span>
                                            <span className="font-semibold text-slate-600 dark:text-slate-355">
                                                {new Date(app.appliedAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }).replace(/ /g, "-")}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                            <span className="text-slate-450 dark:text-slate-505">Status:</span>
                                            <span className={`px-2 py-0.5 rounded-lg font-bold text-[9px] sm:text-[10px] uppercase border ${
                                                isShortlisted 
                                                    ? "bg-teal-50 dark:bg-teal-950/20 text-teal-650 dark:text-teal-400 border-teal-200/50 dark:border-teal-900/30"
                                                    : "bg-amber-50 dark:bg-amber-950/20 text-amber-655 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30"
                                            }`}>
                                                {app.status || "pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Block */}
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2 w-full">
                                    {/* Candidate Profile Button */}
                                    <button
                                        onClick={() => setViewProfileUser(app.userId)}
                                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg sm:rounded-xl font-bold transition text-[10px] sm:text-xs flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-sm"
                                    >
                                        <HiOutlineUser className="text-sm shrink-0" /> View Profile
                                    </button>

                                    {/* View / Get inline row */}
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        {app.userId?.resume ? (
                                            <>
                                                <button
                                                    onClick={() => setSelectedResume(app.userId.resume)}
                                                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary rounded-lg sm:rounded-xl font-bold transition text-[10px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer w-full"
                                                >
                                                    <HiEye className="text-xs sm:text-sm shrink-0" /> View
                                                </button>

                                                <a
                                                    href={app.userId.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg sm:rounded-xl font-bold transition text-[10px] sm:text-xs flex items-center justify-center gap-1 w-full"
                                                >
                                                    <HiDownload className="text-xs sm:text-sm shrink-0" /> Get
                                                </a>
                                            </>
                                        ) : (
                                            <span className="col-span-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 italic py-1 text-center">
                                                No resume uploaded
                                            </span>
                                        )}
                                    </div>

                                    {/* Shortlist button below them taking full width */}
                                    {!isShortlisted && (
                                        <button
                                            onClick={() => handleShortlist(app._id)}
                                            disabled={statusLoadingId === app._id}
                                            className="w-full py-1.5 sm:py-2 bg-brand-secondary hover:bg-brand-secondary-hover text-white rounded-lg sm:rounded-xl font-bold transition text-[10px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                        >
                                            {statusLoadingId === app._id ? (
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <HiCheck className="text-sm shrink-0" /> Shortlist
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                          )
                        })}
                    </div>
                )}
            </div>

            {/* Resume Preview Modal */}
            {selectedResume && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative transition-all duration-300 ${
                        isFullScreen ? "w-full h-full rounded-none" : "w-[90%] md:w-[80%] h-[90%]"
                    }`}>
                        
                        {/* Preview Header Control Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 gap-3">
                            <h2 className="text-lg font-black text-slate-800 dark:text-white">
                                Resume Preview
                            </h2>

                            <div className="flex flex-wrap items-center gap-2">

                                <button
                                    onClick={() => setZoom(prev => prev + 0.2)}
                                    className="p-2 bg-slate-200/60 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition text-xs font-black cursor-pointer"
                                    aria-label="Zoom in"
                                >
                                    <HiPlus className="text-sm" />
                                </button>

                                <button
                                    onClick={() => setZoom(prev => Math.max(0.6, prev - 0.2))}
                                    className="p-2 bg-slate-200/60 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition text-xs font-black cursor-pointer"
                                    aria-label="Zoom out"
                                >
                                    <HiMinus className="text-sm" />
                                </button>

                                <button
                                    onClick={() => setZoom(1)}
                                    className="px-3 py-2 bg-slate-200/60 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition text-xs font-bold cursor-pointer"
                                >
                                    Reset
                                </button>

                                <button
                                    onClick={() => setIsFullScreen(prev => !prev)}
                                    className="px-3 py-2 bg-slate-200/60 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition text-xs font-bold cursor-pointer"
                                >
                                    {isFullScreen ? "Exit Full" : "Full Screen"}
                                </button>

                                <a
                                    href={selectedResume}
                                    download="Resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl transition text-xs font-bold flex items-center gap-1.5 no-underline border-none"
                                >
                                    <HiDownload className="text-sm shrink-0" /> Get
                                </a>

                                <button
                                    onClick={() => setSelectedResume(null)}
                                    className="p-2 bg-slate-200/60 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
                                    aria-label="Close"
                                >
                                    <HiX className="text-sm" />
                                </button>
                            </div>
                        </div>

                        {/* Resume Frame Container */}
                        <div className="w-full h-full overflow-auto flex flex-col items-center bg-slate-100 dark:bg-slate-955 p-6 relative">
                            
                            {iframeLoading ? (
                                <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
                                    <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs text-slate-550 dark:text-slate-455 font-semibold animate-pulse">Loading resume details...</p>
                                </div>
                            ) : (
                                iframeUrl && (
                                    <iframe
                                        src={iframeUrl}
                                        title="Candidate Resume"
                                        style={{
                                            width: '100%',
                                            maxWidth: `${800 * zoom}px`,
                                            height: `${1000 * zoom}px`
                                        }}
                                        className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white transition-all duration-200"
                                    />
                                )
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* Candidate Profile Modal */}
            {viewProfileUser && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto animate-scale-in">
                        <Profile isModal={true} viewUser={viewProfileUser} onClose={() => setViewProfileUser(null)} />
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default Applicants
