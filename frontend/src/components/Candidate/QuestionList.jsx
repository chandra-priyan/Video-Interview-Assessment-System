import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import Loader from '../Common/Loader'

export default function QuestionList() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get('/questions')
        if (mounted) setQuestions(data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <Loader label="Loading questions..." />
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="questions-section">
      <h3>Questions</h3>
      {questions.length === 0 ? (
        <div className="empty-state">No questions available yet.</div>
      ) : (
        <ul>
          {questions.map((q) => (
            <li 
              key={q.id} 
              onClick={() => navigate('/candidate/record', { state: { question: q } })}
              className="clickable-question"
            >
              <strong>{q.title}</strong>
              <div>{q.prompt}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
