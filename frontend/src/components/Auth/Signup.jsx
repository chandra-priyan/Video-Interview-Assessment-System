import React, { useState } from 'react'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/signup', { name, email, password, role })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-title">Create your account</div>
        <div className="auth-subtitle">Sign up to start your interview prep</div>
        <form onSubmit={onSubmit} className="auth-form">
          <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ display: 'block', marginTop: 6 }}>
              <option value="candidate">Candidate</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
