import React, { useState } from 'react'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminMode, setAdminMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const path = adminMode ? '/admin/login' : '/auth/login'
      const { data } = await api.post(path, { email, password })
      if (!data?.token) {
        setError('Login failed: missing token')
        return
      }
      localStorage.setItem('token', data.token)
      // persist role from backend response for correctness
      const backendRole = data?.user?.role || (adminMode ? 'admin' : 'candidate')
      localStorage.setItem('role', backendRole)
      // notify app to refresh auth state
      try { window.dispatchEvent(new Event('auth-changed')) } catch {}
      navigate(backendRole === 'admin' ? '/admin' : '/candidate')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Sign in to your account to continue</div>
        <form onSubmit={onSubmit} className="auth-form">
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label className="row">
            <input type="checkbox" checked={adminMode} onChange={(e) => setAdminMode(e.target.checked)} />
            Admin login
          </label>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  )
}
