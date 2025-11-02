import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import Loader from '../Common/Loader'

export default function ReviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [showSavedPopup, setShowSavedPopup] = useState(false)
  const [isAlreadySaved, setIsAlreadySaved] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get(`/admin/response/${id}`)
        if (mounted) {
          setItem(data)
          setRating(data?.rating || 0)
          setComment(data?.comment || '')
          // Check if review is already saved (has rating or comment)
          setIsAlreadySaved(!!(data?.rating || data?.comment))
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
      // Show saved popup
      setShowSavedPopup(true)
      // Navigate back after a short delay to show the popup
      setTimeout(() => {
        navigate('/admin')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading review..." />
  if (error) return <div className="error-text">{error}</div>
  if (!item) return null

  return (
    <>
    {/* Saved Popup */}
    {showSavedPopup && (
      <>
        <div className="popup-overlay"></div>
        <div className="saved-popup">
          Saved Successfully!
        </div>
      </>
    )}
    <style>{`/* Card Container */
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 2.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* Heading */
.card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  border-bottom: 3px solid #667eea;
  padding-bottom: 0.75rem;
}

/* Video Player */
.full-width {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

video.full-width {
  background: #000;
  max-height: 600px;
  object-fit: contain;
}

/* Stack Layout */
.stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.mt-16 {
  margin-top: 1.5rem;
}

/* Row Layout */
.row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 640px) {
  .row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}

/* Label */
.row label {
  font-weight: 600;
  color: #334155;
  font-size: 1rem;
  min-width: 140px;
}

@media (max-width: 640px) {
  .row label {
    min-width: auto;
  }
}

/* Input Fields */
.row input[type="number"] {
  flex: 1;
  padding: 0.875rem 1.125rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
  background: #f8fafc;
  max-width: 200px;
}

@media (max-width: 640px) {
  .row input[type="number"] {
    max-width: 100%;
  }
}

.row input[type="number"]:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Textarea */
textarea.full-width {
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
  background: #f8fafc;
  resize: vertical;
  min-height: 120px;
}

textarea.full-width:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.full-width::placeholder {
  color: #94a3b8;
}

/* Save Button */
.stack > button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  align-self: flex-start;
}

.stack > button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.stack > button:active:not(:disabled) {
  transform: translateY(0);
}

.stack > button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .stack > button {
    width: 100%;
    align-self: stretch;
  }
}

/* Error Message */
.error-text {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin: 1rem auto;
  border-left: 4px solid #ef4444;
  font-weight: 500;
  max-width: 1000px;
}

/* Loader Container */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 400px;
}

.loader {
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-label {
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
  }
  
  .card h3 {
    font-size: 1.375rem;
  }
  
  video.full-width {
    max-height: 400px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1rem;
  }
  
  .card h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  
  video.full-width {
    max-height: 300px;
  }
  
  .stack {
    gap: 1rem;
  }
}

/* Focus Visible Enhancement */
input:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection Color */
::selection {
  background: #667eea;
  color: white;
}

::-moz-selection {
  background: #667eea;
  color: white;
}

/* Saved Popup */
.saved-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
  z-index: 1000;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: popupSlideIn 0.3s ease-out;
}

.saved-popup::before {
  content: '✓';
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Already Saved Indicator */
.already-saved-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-left: 16px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.already-saved-indicator::before {
  content: '✓';
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
`}</style>
    <div className="card">
      <h3>
        {item.candidateName} - {item.questionTitle}
        {isAlreadySaved && (
          <span className="already-saved-indicator">
            Already Saved
          </span>
        )}
      </h3>
      <video src={item.videoUrl} controls className="full-width" />
      <div className="stack mt-16">
        <div className="row">
          <label htmlFor="rating">Rating (0-10):</label>
          <input id="rating" type="number" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <textarea className="full-width" placeholder="Comments" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
        <button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
    </>
  )
}

