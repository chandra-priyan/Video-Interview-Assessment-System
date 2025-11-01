import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isActive = (path) => pathname === path

  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const isAdmin = role === 'admin'
  const isCandidate = role === 'candidate'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const isAuthed = Boolean(token)

  const onLogout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    } catch {}
    try { window.dispatchEvent(new Event('auth-changed')) } catch {}
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">Tech Interview Portal</div>
        <nav className="nav-links">
          {!isAuthed ? (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
              <Link to="/signup" className={`nav-link ${isActive('/signup') ? 'active' : ''}`}>Signup</Link>
            </>
          ) : (
            <>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              {!isAdmin && (
                <Link to="/candidate" className={`nav-link ${isActive('/candidate') ? 'active' : ''}`}>Candidate</Link>
              )}
              {!isCandidate && (
                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
              )}
              <button onClick={onLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
