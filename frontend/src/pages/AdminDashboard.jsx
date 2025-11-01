import React from 'react'
import ReviewList from '../components/Admin/ReviewList'
import QuestionManager from '../components/Admin/QuestionManager'
import '../styles/admin.css'

export default function AdminDashboard() {
  const [tab, setTab] = React.useState('reviews')
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button onClick={() => setTab('reviews')} className={tab === 'reviews' ? 'btn active' : 'btn'}>Reviews</button>
        <button onClick={() => setTab('questions')} className={tab === 'questions' ? 'btn active' : 'btn'}>Questions</button>
      </div>
      {tab === 'reviews' ? <ReviewList /> : <QuestionManager />}
    </div>
  )
}
