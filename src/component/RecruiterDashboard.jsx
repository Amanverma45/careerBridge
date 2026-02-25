import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

function RecruiterDashboard() {
    const storedUser = localStorage.getItem("user")
    const user = storedUser?.JSON.parse(storedUser) : null

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

        </div>
    )
}

export default RecruiterDashboard
