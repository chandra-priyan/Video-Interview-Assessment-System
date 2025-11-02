import React from 'react'
import { Link } from 'react-router-dom'
import QuestionList from '../components/Candidate/QuestionList'
import '../styles/candidate.css'

export default function CandidateDashboard() {
  return (
    <div className="candidate-dashboard">
      <div className="candidate-dashboard-inner">
        <h2>Candidate Dashboard</h2>
        <div className="toolbar">
          <Link to="/candidate/record"><button>Record Answer</button></Link>
          <Link to="/candidate/questions"><button>View Questions</button></Link>
        </div>
        <QuestionList />
      </div>
    </div>
  )
}
