import React from 'react'
import QuestionList from '../components/Candidate/QuestionList'
import { Link } from 'react-router-dom'
import '../styles/candidate.css'

export default function CandidateQuestions() {
  return (
    <div className="candidate-dashboard">
      <div className="candidate-dashboard-inner">
        <h2>Available Questions</h2>
        <div className="toolbar">
          <Link to="/candidate"><button>Back to Dashboard</button></Link>
          <Link to="/candidate/record"><button>Record Answer</button></Link>
        </div>
        <QuestionList />
      </div>
    </div>
  )
}
