import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

function Profile() {
    const [name, setName] = useState('')
    const storedUser = localStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : null

    useEffect(() => {
        if (user) {
            setName(user.name)
        }
    }, [])

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`https://careerbridge-b-1.onrender.com/api/updateUser/${user._id}`,
                { name }
            )
            localStorage.setItem('user', JSON.stringify(response.data.user))
            alert("profile updated successfully")
        } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message)
    alert(error.response?.data?.message || "Update failed")
}

    }
    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-10">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

            <div className="bg-slate-900 p-6 rounded-xl max-w-lg">
                <div className="mb-4">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-2 p-3 bg-slate-800 rounded-lg"
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    className="bg-indigo-600 px-6 py-3 rounded-lg"
                >
                    Update
                </button>
            </div>
        </div>
    )
}


export default Profile
