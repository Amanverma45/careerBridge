import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Profile() {

    const storedUser = localStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : null

    const [name, setName] = useState('')
    const [skills, setSkills] = useState('')
    const [experience, setExperience] = useState('')
    const [bio, setBio] = useState('')

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setSkills(user.skills || '')
            setExperience(user.experience || '')
            setBio(user.bio || '')
        }
    }, [])

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`https://careerbridge-b-1.onrender.com/api/updateUser/${user._id}`,
                {
                    name,
                    skills,
                    experience,
                    bio
                }
            )

            localStorage.setItem('user', JSON.stringify(response.data.user))
            alert("Profile updated successfully")

        } catch (error) {
            console.log(error.response?.data || error.message)
            alert("Update failed")
        }
    }

    if (!user) {
        return <div className="text-white p-10">Please login again</div>
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-10">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

            <div className="bg-slate-900 p-6 rounded-xl max-w-lg space-y-4">

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-2 p-3 bg-slate-800 rounded-lg"/>
                </div>

                <div>
                    <label>Skills</label>
                    <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="React, Node, MongoDB"
                        className="w-full mt-2 p-3 bg-slate-800 rounded-lg"
                    />
                </div>

                <div>
                    <label>Experience</label>
                    <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="2 years"
                        className="w-full mt-2 p-3 bg-slate-800 rounded-lg"
                    />
                </div>

                <div>
                    <label>Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full mt-2 p-3 bg-slate-800 rounded-lg"
                        rows="4"
                    />
                </div>
                <button
                    onClick={handleUpdate}
                    className="bg-indigo-600 px-6 py-3 rounded-lg w-full">
                    Update Profile
                </button>
            </div>
        </div>
    )
}

export default Profile
