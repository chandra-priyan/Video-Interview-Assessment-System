import React from 'react'

export default function Loader({ label = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span className="spinner" style={{ width: 16, height: 16, border: '2px solid #ddd', borderTopColor: '#111', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
      <span>{label}</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
