import React, { useEffect, useRef, useState } from 'react'
import api from '../../utils/api'
import '../../styles/record-answer.css'

export default function RecordAnswer() {
  const videoRef = useRef(null)
  const playbackRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])

  const [recording, setRecording] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [videoURL, setVideoURL] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [successMsg, setSuccessMsg] = useState('')
  const [hasRecording, setHasRecording] = useState(false)

  useEffect(() => {
    // fetch questions for selection
    ;(async () => {
      try {
        const { data } = await api.get('/questions')
        setQuestions(data || [])
      } catch (_) {}
    })()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const initStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Cannot access camera/microphone: ' + (err.message || ''))
    }
  }

  const chooseMimeType = () => {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ]
    for (const t of types) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t
    }
    return ''
  }

  const startRecording = async () => {
    setError('')
    setSuccessMsg('')
    setVideoURL('')
    if (playbackRef.current) playbackRef.current.src = ''
    setHasRecording(false)
    if (!streamRef.current) await initStream()
    const mimeType = chooseMimeType()
    const options = mimeType ? { mimeType } : undefined
    const mr = new MediaRecorder(streamRef.current, options)
    chunksRef.current = []

    mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      if (playbackRef.current) playbackRef.current.src = url
      setHasRecording(true)
    }

    mediaRecorderRef.current = mr
    mr.start()
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const resetRecording = () => {
    setHasRecording(false)
    chunksRef.current = []
    if (playbackRef.current) playbackRef.current.src = ''
    startRecording()
  }

  const uploadVideo = async () => {
    if (!chunksRef.current.length) return
    setUploading(true)
    setError('')
    setSuccessMsg('')
    try {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const file = new File([blob], `answer-${Date.now()}.webm`, { type: 'video/webm' })
      const form = new FormData()
      form.append('file', file)
      // Backend should upload to Cloudinary and return { url }
      const { data } = await api.post('/response/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data?.url) setVideoURL(data.url)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const submitResponse = async () => {
    const q = questions[currentIndex]
    if (!videoURL || !q?.id) {
      setError('Upload a video for the current question first')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      await api.post('/response/submit', { items: [{ questionId: q.id, videoUrl: videoURL }] })
      setSuccessMsg('Response submitted!')
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  const goPrev = () => {
    if (currentIndex <= 0) return
    setCurrentIndex((i) => i - 1)
    setVideoURL('')
    setHasRecording(false)
    if (playbackRef.current) playbackRef.current.src = ''
  }

  const goNext = () => {
    if (currentIndex >= Math.max(0, questions.length - 1)) return
    setCurrentIndex((i) => i + 1)
    setVideoURL('')
    setHasRecording(false)
    if (playbackRef.current) playbackRef.current.src = ''
  }

  return (
    <div className="record-answer-container">
      <div className="record-answer-card">
        <div className="record-answer-inner">
          <div className="record-answer-header">
            <h1 className="record-answer-title">Record Your Answer</h1>
          </div>

          {/* Question Section */}
        <div className="question-section">
          <div className="question-header">
            <span className="question-label">Question</span>
            <span className="question-counter">
              {questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : '0 / 0'}
            </span>
          </div>
          <div className="question-title">{questions[currentIndex]?.title || 'Loading...'}</div>
          <div className="question-prompt">{questions[currentIndex]?.prompt || ''}</div>
        </div>

        {/* Video Section */}
        <div className="video-section">
          <div className="video-container">
            <video ref={videoRef} autoPlay muted playsInline className="video-preview" />
            {recording && (
              <div className="video-overlay recording-indicator">
                <span className="loading-spinner"></span>
                Recording...
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="control-toolbar">
          {!recording && (
            <button className="control-btn control-btn-primary" onClick={startRecording}>
              Start Recording
            </button>
          )}
          {recording && (
            <button className="control-btn control-btn-danger" onClick={stopRecording}>
              Stop Recording
            </button>
          )}
          <button 
            className="control-btn control-btn-success" 
            onClick={uploadVideo} 
            disabled={uploading || !hasRecording}
          >
            {uploading && <span className="loading-spinner"></span>}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {hasRecording && !recording && (
            <button className="control-btn control-btn-warning" onClick={resetRecording}>
              Re-record
            </button>
          )}
          <button 
            className="control-btn control-btn-primary" 
            onClick={submitResponse} 
            disabled={submitting || !videoURL || !questions[currentIndex]?.id}
          >
            {submitting && <span className="loading-spinner"></span>}
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </div>

        {/* Navigation */}
        <div className="navigation-section">
          <button className="nav-btn" onClick={goPrev} disabled={currentIndex === 0}>
            ← Previous Question
          </button>
          <button className="nav-btn" onClick={goNext} disabled={currentIndex >= Math.max(0, questions.length - 1)}>
            Next Question →
          </button>
        </div>

        {/* Messages */}
        <div className="message-section">
          {error && <div className="error-message">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}
        </div>

        {/* Playback Section */}
        <div className="playback-section">
          <h3 className="playback-title">Playback</h3>
          <div className="video-container">
            <video ref={playbackRef} controls className="video-playback" />
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}
