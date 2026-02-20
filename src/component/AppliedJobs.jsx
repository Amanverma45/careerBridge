import React from 'react'

function AppliedJobs() {
    const [AppliedJobs,setAppliedJobs] = useState([])

    useEffect(() => {
        const fetchApplied = async ()=>{
            const response = await axios.get(`https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`,)
            setAppliedJobs(response.data)
        }
        fetchApplied()
    }, [])
  return (
    <div>
      {AppliedJobs.map(app =>{
        <div key={app._id}>
            <h2>{app.jobId.title}</h2>
            <p>{app.jobId.company}</p>
            <p>{app.jobId.salary}</p>
        </div>
      })}
    </div>
  )
}

export default AppliedJobs
