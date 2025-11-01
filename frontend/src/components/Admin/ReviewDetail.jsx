import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../utils/api'
import Loader from '../Common/Loader'

export default function ReviewDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get(`/admin/response/${id}`)
        if (mounted) {
          setItem(data)
          setRating(data?.rating || 0)
          setComment(data?.comment || '')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load review')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      await api.post(`/admin/response/${id}/review`, { rating: Number(rating), comment })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading review..." />
  if (error) return <div style={{ color: 'red' }}>{error}</div>
  if (!item) return null

  return (
    <div>
      <h3>{item.candidateName} - {item.questionTitle}</h3>
      <video src={item.videoUrl} controls style={{ width: '100%', background: '#000', borderRadius: 8 }} />
      <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
        <label>
          Rating (0-10):
          <input type="number" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
        <textarea placeholder="Comments" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
        <button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  )
}
