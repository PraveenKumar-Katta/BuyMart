import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('userInfo'))

  const [user, setUser] = useState(storedUser || {})
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setFormData({ name: user.name, email: user.email, password: '' })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      setUser(res.data)
      setEditing(false)
      setMessage('Profile updated successfully ✅')
    } catch (err) {
      setMessage('Update failed ❌')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://thumbs.dreamstime.com/z/student-avatar-illustration-user-profile-icon-youth-avatar-student-avatar-illustration-simple-cartoon-user-portrait-user-profile-276205531.jpg"
            alt="User Avatar"
            className="w-24 h-24 rounded-full mb-4 border-4 border-gray-300 object-cover"
          />
          <h2 className="text-2xl font-bold">👤 Your Profile</h2>
          <p className="text-sm text-gray-600">{user.role?.toUpperCase()}</p>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded w-full p-2"
                placeholder="Leave blank to keep old password"
              />
            </div>
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Save Changes
              </button>
              <button
                type="button"
                className="text-gray-600 underline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Logout
        </button>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  )
}

export default Profile
