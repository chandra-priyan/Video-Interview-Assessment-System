import React, { useEffect, useRef, useState } from 'react'
import api from '../../utils/api'

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
  const [questionId, setQuestionId] = useState('')
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
    if (!videoURL || !questionId) {
      setError('Select a question and upload a video first')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      await api.post('/response/submit', { items: [{ questionId, videoUrl: videoURL }] })
      setSuccessMsg('Response submitted!')
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h3>Record Answer</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          Select question
          <select value={questionId} onChange={(e) => setQuestionId(e.target.value)} style={{ display: 'block', marginTop: 6 }}>
            <option value="">-- choose --</option>
            {questions.map(q => (
              <option key={q.id} value={q.id}>{q.title} - {q.prompt?.slice(0, 80)}</option>
            ))}
          </select>
        </label>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', background: '#000', borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {!recording && <button onClick={startRecording}>Start Recording</button>}
          {recording && <button onClick={stopRecording}>Stop</button>}
          <button onClick={uploadVideo} disabled={uploading || !hasRecording}>{uploading ? 'Uploading...' : 'Upload'}</button>
          {hasRecording && !recording && <button onClick={resetRecording}>Re-record</button>}
          <button onClick={submitResponse} disabled={submitting || !videoURL || !questionId}>{submitting ? 'Submitting...' : 'Submit Response'}</button>
        </div>
        {error && <div className="error-text">{error}</div>}
        {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}
        <div>
          <h4>Playback</h4>
          <video ref={playbackRef} controls style={{ width: '100%', background: '#000', borderRadius: 8 }} />
        </div>
        {videoURL && (
          <div>
            <strong>Uploaded URL:</strong> <a href={videoURL} target="_blank" rel="noreferrer">{videoURL}</a>
          </div>
        )}
      </div>
    </div>
  )
}
