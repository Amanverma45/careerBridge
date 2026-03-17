import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

function Applicants() {

    const { jobId } = useParams()
    const [applicants, setApplicants] = useState([])

    useEffect(() => {

        const fetchApplicants = async () => {

            try {

                const res = await axios.get(
                    `https://careerbridge-b-1.onrender.com/application/applicants/${jobId}`
                )

                setApplicants(res.data)

            } catch (error) {
                console.log("FETCH APPLICANTS ERROR:", error)
            }

        }

        fetchApplicants()

    }, [jobId])

    return (

        <div className="min-h-screen bg-gray-100 text-gray-800 py-12">

            <div className="max-w-6xl mx-auto px-6">

                <h1 className="text-3xl font-bold mb-10">
                    Applicants
                </h1>

                {applicants.length === 0 ? (

                    <div className="text-gray-500">
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
                                                <a
                                                    href={`https://careerbridge-b-1.onrender.com/uploads/${app.userId.resume}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-500 transition"
                                                >
                                                    View
                                                </a>

                                                <a
                                                    href={`https://careerbridge-b-1.onrender.com/uploads/${app.userId.resume}`}
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

        </div>

    )

}

export default Applicants