import React from 'react'
import ReviewList from '../components/Admin/ReviewList'
import QuestionManager from '../components/Admin/QuestionManager'

export default function AdminDashboard() {
  const [tab, setTab] = React.useState('reviews')
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab('reviews')} className={tab === 'reviews' ? 'btn active' : 'btn'}>Reviews</button>
        <button onClick={() => setTab('questions')} className={tab === 'questions' ? 'btn active' : 'btn'}>Questions</button>
      </div>
      {tab === 'reviews' ? <ReviewList /> : <QuestionManager />}
    </div>
  )
}
