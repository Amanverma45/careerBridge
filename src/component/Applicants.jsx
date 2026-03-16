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
                console.log(error)
            }

        }

        fetchApplicants()

    }, [])

    return (

        <div className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Applicants
            </h1>

            {applicants.map(app => (
                <div key={app._id} className="border p-4 mb-4 rounded">

                    <h3>{app.userId.name}</h3>

                    <p>{app.userId.email}</p>

                </div>
            ))}

        </div>

    )

}

export default Applicants