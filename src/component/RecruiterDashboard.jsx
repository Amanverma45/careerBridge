import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([])
     const storedUser = localStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : null
    
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`https://careerbridge-b-1.onrender.com/job/recruiterJobs/${user._id}`)
                setJobs(response.data)
            } catch (error) {
                console.log(error.message)
            }
        }
        if (user) {
            fetchJobs()
        }
    }, [])
    return (
        <div>
            <h2>Recruiter Dashboard</h2>

            {jobs.map((job) => (
                <div key={job._id}>
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>
                    <p>{job.location}</p>
                </div>
            ))}
        </div>
    )
}

export default RecruiterDashboard
