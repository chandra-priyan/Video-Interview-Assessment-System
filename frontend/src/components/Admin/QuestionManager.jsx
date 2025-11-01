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
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 2rem;
        }
        
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 2.5rem;
          max-width: 900px;
          margin: 0 auto;
        }
        
        h3 {
          margin: 0 0 2rem 0;
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
          border-bottom: 3px solid #667eea;
          padding-bottom: 0.75rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: start;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        
        input {
          padding: 0.875rem 1.125rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s ease;
          font-family: inherit;
          background: #f8fafc;
        }
        
        input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        input[type="number"] {
          width: 150px;
        }
        
        @media (max-width: 768px) {
          input[type="number"] {
            width: 100%;
          }
        }
        
        button {
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        
        button[type="submit"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .danger {
          background: #ef4444;
          color: white;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .danger:hover {
          background: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        .error-text {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #ef4444;
          font-weight: 500;
        }
        
        .list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.2s ease;
          gap: 1rem;
        }
        
        .list-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transform: translateX(4px);
        }
        
        .list-item > div {
          flex: 1;
          color: #475569;
          line-height: 1.6;
        }
        
        .list-item strong {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          margin-right: 0.75rem;
          font-weight: 600;
        }
        
        .loader {
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #94a3b8;
          font-size: 1.125rem;
        }
        
        @media (max-width: 640px) {
          body {
            padding: 1rem;
          }
          
          .card {
            padding: 1.5rem;
          }
          
          h3 {
            font-size: 1.5rem;
          }
          
          .list-item {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .list-item button {
            align-self: flex-end;
          }
        }
      `}</style>
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
    </>
  )
}
