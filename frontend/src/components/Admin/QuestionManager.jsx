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
    <>
    <style>{`
        .question-manager-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
          color: white;
        }
        
        .question-manager-card h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.3px;
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .question-manager-card .form-grid {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: start;
        }
        
        @media (max-width: 768px) {
          .question-manager-card .form-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .question-manager-card input {
          padding: 0.875rem 1.125rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          font-family: inherit;
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
        
        .question-manager-card input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .question-manager-card input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
        }
        
        .question-manager-card input[type="number"] {
          width: 150px;
        }
        
        @media (max-width: 768px) {
          .question-manager-card input[type="number"] {
            width: 100%;
          }
        }
        
        .question-manager-card button {
          padding: 0.75rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        
        .question-manager-card button[type="submit"] {
          background: rgba(139, 92, 246, 0.85);
          color: white;
        }
        
        .question-manager-card button[type="submit"]:hover:not(:disabled) {
          background: rgba(139, 92, 246, 1);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }
        
        .question-manager-card button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .question-manager-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .question-manager-card .danger {
          background: rgba(239, 68, 68, 0.85);
          color: white;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .question-manager-card .danger:hover {
          background: rgba(239, 68, 68, 1);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        .question-manager-card .error-text {
          background: rgba(239, 68, 68, 0.15);
          color: rgba(255, 255, 255, 0.95);
          padding: 1rem 1.25rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #ef4444;
          font-weight: 500;
        }
        
        .question-manager-card .list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .question-manager-card .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          margin-bottom: 0;
          transition: all 0.2s ease;
          gap: 1rem;
        }
        
        .question-manager-card .list-item:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateX(4px);
        }
        
        .question-manager-card .list-item > div {
          flex: 1;
          color: white;
          line-height: 1.6;
        }
        
        .question-manager-card .list-item strong {
          display: inline-block;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          margin-right: 0.75rem;
          font-weight: 600;
        }
        
        .question-manager-card .empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
        }
        
        @media (max-width: 640px) {
          .question-manager-card {
            padding: 1.25rem;
            margin: 0 1rem;
          }
          
          .question-manager-card h3 {
            font-size: 1.35rem;
          }
          
          .question-manager-card .list-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 0.85rem 1rem;
          }
          
          .question-manager-card .list-item button {
            align-self: flex-end;
          }
        }
      `}</style>
    <div className="question-manager-card">
      <h3>Manage Questions</h3>
      <form onSubmit={addQuestion} className="form-grid">
        <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Question text" required />
        <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="Order (0..n)" />
        <button type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Question'}</button>
      </form>
      {error && <div className="error-text">{error}</div>}
      {loading ? (
        <Loader label="Loading questions..." />
      ) : questions.length === 0 ? (
        <div className="empty-state">No questions yet. Add your first question above.</div>
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
    </>
  )
}
