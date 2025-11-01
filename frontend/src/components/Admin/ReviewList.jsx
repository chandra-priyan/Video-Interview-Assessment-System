import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import Loader from '../Common/Loader'

export default function ReviewList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/responses')
      setItems(data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <Loader label="Loading submissions..." />
  if (error) return <div className="error-text">{error}</div>

  return (
    <div className="card">
      <h3>Submissions</h3>
      <div className="toolbar">
        <button onClick={load}>Refresh</button>
      </div>
      {items.length === 0 ? (
        <div className="empty">No submissions yet.</div>
      ) : (
        <ul className="list">
          {items.map((r) => (
            <li key={r.id} className="list-item">
              <Link className="link" to={`/admin/reviews/${r.id}`}>
                {r.candidateName} - {r.questionTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

