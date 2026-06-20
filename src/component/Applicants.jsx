import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

function Applicants() {
    const { jobId } = useParams()
    const [applicants, setApplicants] = useState([])
    const [selectedResume, setSelectedResume] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                setLoading(true)

                const res = await axios.get(
                    `https://careerbridge-b-1.onrender.com/application/applicants/${jobId}`
                )

                setApplicants(res.data)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchApplicants()
    }, [jobId])

    return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#374151] py-12">

            <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-bold mb-10 text-[#374151]">
                    Applicants
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-[50vh]">
                        <div className="w-10 h-10 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : applicants.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-sm">
                        <p className="text-gray-500 text-lg">
                            No applicants yet
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applicants.map((app) => (
                            <div
                                key={app._id}
                                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-lg font-bold">
                                        {app.userId?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-[#374151]">
                                            {app.userId?.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {app.userId?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-xs text-gray-400 mt-2">
                                        Applied on: {new Date(app.appliedAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }).replace(/ /g, "-")}
                                    </p>

                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {app.userId?.resume && (
                                            <>
                                                <button
                                                    onClick={() => setSelectedResume(app.userId.resume)}
                                                    className="bg-[#2E7D32] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#256728] transition"
                                                >
                                                    View
                                                </button>

                                                <a
                                                    href={app.userId.resume}
                                                    download
                                                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition"
                                                >
                                                    Download
                                                </a>

                                                <button
                                                    onClick={async () => {
                                                        await axios.put(
                                                            `https://careerbridge-b-1.onrender.com/application/status/${app._id}`,
                                                            { status: "shortlisted" }
                                                        )
                                                        alert("Candidate Shortlisted")
                                                    }}
                                                    className="bg-[#F4A261] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#e89249] transition"
                                                >
                                                    Shortlist
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* {Resume Preview  */}
            {selectedResume && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50">

                    <div className={`bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl ${isFullScreen ? "w-full h-full rounded-none" : "w-[85%] h-[85%]"}`}>

                        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-[#F8F7F4]">
                            <h2 className="text-lg font-semibold text-[#374151]">
                                Resume Preview
                            </h2>

                            <div className="flex gap-2">

                                <a
                                    href={selectedResume}
                                    download
                                    className="bg-[#2E7D32] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#256728] transition"
                                >
                                    Download
                                </a>

                                <button
                                    onClick={() => setZoom(prev => prev + 0.2)}
                                    className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg transition"
                                >
                                    +
                                </button>

                                <button
                                    onClick={() => setZoom(prev => Math.max(0.6, prev - 0.2))}
                                    className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg transition"
                                >
                                    -
                                </button>

                                <button
                                    onClick={() => setZoom(1)}
                                    className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg text-sm transition"
                                >
                                    Reset
                                </button>

                                <button
                                    onClick={() => setIsFullScreen(prev => !prev)}
                                    className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg text-sm transition"
                                >
                                    {isFullScreen ? "Exit Full" : "Full"}
                                </button>

                                <button
                                    onClick={() => setSelectedResume(null)}
                                    className="text-red-500 text-lg font-bold px-2"
                                >
                                    ✖
                                </button>

                            </div>
                        </div>

                        <div className="w-full h-full overflow-auto flex justify-center bg-gray-50">
                            <div
                                style={{
                                    transform: `scale(${zoom})`,
                                    transformOrigin: "top center"
                                }}
                            >
                                <iframe
                                    src={selectedResume}
                                    width="800px"
                                    height="1000px"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Applicants
