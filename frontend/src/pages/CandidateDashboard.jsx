import React from 'react'
import { Link } from 'react-router-dom'
import QuestionList from '../components/Candidate/QuestionList'

export default function CandidateDashboard() {
  return (
    <div>
      <h2>Candidate Dashboard</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/candidate/record"><button>Record Answer</button></Link>
        <Link to="/candidate/questions"><button>View Questions</button></Link>
      </div>
      <QuestionList />
    </div>
  )
}
