import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>Use this portal to conduct tech interviews with recorded answers.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/candidate"><button>Candidate Dashboard</button></Link>
        <Link to="/admin"><button>Admin Dashboard</button></Link>
      </div>
    </div>
  )
}
