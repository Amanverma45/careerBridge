import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from "react-hot-toast"

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

        const response = await axios.put(
            `https://careerbridge-b-1.onrender.com/api/updateUser/${user._id}`,
            {
                name,
                skills,
                experience,
                bio
            }
        )
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        )
        toast.success("Profile updated successfully")
    } catch (error) {
        console.log(error.response?.data || error.message)
        toast.error("Update failed")
    }
}

    if (!user) {
    return (
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <p className="text-gray-600">
                    Please login again
                </p>
            </div>
        </div>
    )
}
    return (
    <div className="min-h-screen bg-[#F8F7F4] p-6 md:p-10">

        <div className="max-w-2xl mx-auto">

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#374151]">
                    Edit Profile
                </h1>

                <p className="text-gray-500 mt-2">
                    Keep your profile updated to improve job matching.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Skills
                    </label>

                    <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Experience
                    </label>

                    <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Fresher / 1 Year / 2 Years"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Bio
                    </label>

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="5"
                        placeholder="Write something about yourself..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    className="w-full bg-[#2E7D32] hover:bg-[#256728] text-white py-3 rounded-xl font-semibold transition"
                >
                    Update Profile
                </button>

            </div>

        </div>

    </div>
)
}

export default Profile
