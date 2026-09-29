import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../features/authSlice'
import { User, Mail, Lock, LogOut, Pencil, X } from 'lucide-react'

const Profile = () => {
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('userInfo'))

  const [user, setUser] = useState(storedUser || null)
  const { auth } = useSelector((state) => state)
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setFormData({ name: user.name, email: user.email, password: '' })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await dispatch(updateUser(formData)).unwrap()
      setEditing(false)
      setMessage('Profile updated successfully')
    } catch (err) {
      setMessage('Update failed — please try again')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </Link>
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-4">
            <User className="w-9 h-9 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
          {user.role && (
            <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-600 ring-1 ring-slate-200">
              {user.role}
            </span>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900">Edit details</h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5 hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
              <div className="flex items-center gap-3 px-4 py-3">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Name</p>
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-900">{user.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium py-2.5 hover:bg-slate-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit profile
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium py-2.5 hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-emerald-600">{message}</p>
        )}
      </div>
    </div>
  )
}

export default Profile