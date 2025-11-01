import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Common/Navbar.jsx'
import './styles/global-theme.css'
import Home from './pages/Home.jsx'
import CandidateDashboard from './pages/CandidateDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './components/Auth/Login.jsx'
import Signup from './components/Auth/Signup.jsx'
import QuestionList from './components/Candidate/QuestionList.jsx'
import RecordAnswer from './components/Candidate/RecordAnswer.jsx'
import ReviewDetail from './components/Admin/ReviewDetail.jsx'

function App() {
  const location = useLocation()
  const [auth, setAuth] = React.useState({ token: null, role: null })

  React.useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null
    setAuth({ token: t, role: r })
  }, [location.pathname])

  React.useEffect(() => {
    const refresh = () => {
      const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null
      setAuth({ token: t, role: r })
    }
    window.addEventListener('auth-changed', refresh)
    return () => window.removeEventListener('auth-changed', refresh)
  }, [])

  const isAuthed = Boolean(auth.token)
  const isAdmin = auth.role === 'admin'
  const isCandidate = auth.role === 'candidate'
  return (
    <ThemeProvider>
      <div>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={isAuthed ? (isAdmin ? '/admin' : '/candidate') : '/login'} replace />} />
            <Route path="/login" element={isAuthed ? <Navigate to={isAdmin ? '/admin' : '/candidate'} replace /> : <Login />} />
            <Route path="/signup" element={isAuthed ? <Navigate to={isAdmin ? '/admin' : '/candidate'} replace /> : <Signup />} />

            <Route path="/candidate" element={!isAuthed ? <Navigate to="/login" replace /> : (isAdmin ? <Navigate to="/admin" replace /> : <CandidateDashboard />)} />
            <Route path="/candidate/questions" element={!isAuthed ? <Navigate to="/login" replace /> : (isAdmin ? <Navigate to="/admin" replace /> : <QuestionList />)} />
            <Route path="/candidate/record" element={!isAuthed ? <Navigate to="/login" replace /> : (isAdmin ? <Navigate to="/admin" replace /> : <RecordAnswer />)} />

            <Route path="/admin" element={!isAuthed ? <Navigate to="/login" replace /> : (isCandidate ? <Navigate to="/candidate" replace /> : <AdminDashboard />)} />
            <Route path="/admin/reviews/:id" element={!isAuthed ? <Navigate to="/login" replace /> : (isCandidate ? <Navigate to="/candidate" replace /> : <ReviewDetail />)} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
