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
    <div className="min-h-screen bg-gray-100 text-gray-800 py-12">

        <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-3xl font-bold mb-10">Applicants</h1>

            {loading ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : applicants.length === 0 ? (
                <div className="text-gray-500 text-center py-10">
                    No applicants yet
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applicants.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition"
                        >

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                                    {app.userId?.name?.charAt(0)}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {app.userId?.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {app.userId?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <p className="text-xs text-gray-400 mt-2">
                                    Applied on: {new Date(app.appliedAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    }).replace(/ /g, "-")}
                                </p>

                                <div className="flex gap-2">
                                    {app.userId?.resume && (
                                        <>
                                            <button
                                                onClick={() => setSelectedResume(app.userId.resume)}
                                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm"
                                            >
                                                View
                                            </button>

                                            <a
                                                href={app.userId.resume}
                                                download
                                                className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300 transition"
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
                                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm"
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

                <div className={`bg-white rounded-xl overflow-hidden flex flex-col ${isFullScreen ? "w-full h-full rounded-none" : "w-[80%] h-[80%]"}`}>

                    <div className="flex justify-between items-center px-4 py-2 border-b bg-gradient-to-r from-gray-100 to-gray-200">
                        <h2 className="text-lg font-semibold">Resume Preview</h2>

                        <div className="flex gap-2">

                            <a
                                href={selectedResume}
                                download
                                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Download
                            </a>

                            <button
                                onClick={() => setZoom(prev => prev + 0.2)}
                                className="bg-gray-200 px-2 rounded"
                            >
                                +
                            </button>

                            <button
                                onClick={() => setZoom(prev => Math.max(0.6, prev - 0.2))}
                                className="bg-gray-200 px-2 rounded"
                            >
                                -
                            </button>

                            <button
                                onClick={() => setZoom(1)}
                                className="bg-gray-200 px-2 rounded text-sm"
                            >
                                Reset
                            </button>

                            <button
                                onClick={() => setIsFullScreen(prev => !prev)}
                                className="bg-gray-200 px-2 rounded text-sm"
                            >
                                {isFullScreen ? "Exit Full" : "Full"}
                            </button>

                            <button
                                onClick={() => setSelectedResume(null)}
                                className="text-red-500 text-lg font-bold"
                            >
                                ✖
                            </button>

                        </div>
                    </div>

                    <div className="w-full h-full overflow-auto flex justify-center">
                        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
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
