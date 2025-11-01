import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import Loader from '../Common/Loader'

export default function QuestionList() {
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
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div>
      <h3>Questions</h3>
      <ul>
        {questions.map((q) => (
          <li key={q.id} style={{ marginBottom: 12 }}>
            <strong>{q.title}</strong>
            <div style={{ color: '#555' }}>{q.prompt}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
