import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

export default function Home() {
  return (
    <div className="home">
      <h2>Welcome</h2>
      <p>Use this portal to conduct tech interviews with recorded answers.</p>
      <div className="toolbar">
        <Link to="/candidate"><button>Candidate Dashboard</button></Link>
        <Link to="/admin"><button>Admin Dashboard</button></Link>
      </div>
    </div>
  )
}
