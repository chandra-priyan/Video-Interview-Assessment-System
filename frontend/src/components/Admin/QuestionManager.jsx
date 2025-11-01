import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import Loader from '../Common/Loader'

export default function QuestionManager() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState([])
  const [questionText, setQuestionText] = useState('')
  const [order, setOrder] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchQuestions = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/questions')
      setQuestions(data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const addQuestion = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/admin/questions', { questionText, order: Number(order) || 0 })
      setQuestionText('')
      setOrder('')
      fetchQuestions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create question')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this question?')) return
    try {
      await api.delete(`/admin/questions/${id}`)
      setQuestions((qs) => qs.filter((q) => q._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="card">
      <h3>Manage Questions</h3>
      <form onSubmit={addQuestion} className="form-grid">
        <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Question text" required />
        <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="Order (0..n)" />
        <button type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Question'}</button>
      </form>
      {error && <div className="error-text">{error}</div>}
      {loading ? (
        <Loader label="Loading questions..." />
      ) : (
        <ul className="list">
          {questions.map((q) => (
            <li key={q._id} className="list-item">
              <div>
                <strong>Order {q.order}</strong>: {q.questionText}
              </div>
              <button className="danger" onClick={() => remove(q._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
