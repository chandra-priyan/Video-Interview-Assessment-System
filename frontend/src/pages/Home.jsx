import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

export default function Home() {
  useEffect(() => {
    // Add parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const heroContent = document.querySelector('.hero-content')
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Video Interview Assessment System</h1>
          <p className="subtitle">Transform Your Hiring Process</p>
          <p>
            Welcome to the future of technical recruiting. Our innovative platform revolutionizes the way you conduct interviews by providing a comprehensive video-based assessment system. Record, review, and evaluate candidate responses with ease, making your hiring process more efficient and data-driven.
          </p>
          <p>
            Whether you're a recruiter screening hundreds of candidates or a hiring manager looking for the perfect fit, our platform streamlines the entire interview workflow. Save time, reduce bias, and make better hiring decisions with our cutting-edge video interview technology.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button">Sign Up</Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-container">
            <div className="video-mockup">
              <div className="mockup-header">
                <span className="mockup-dot dot-red"></span>
                <span className="mockup-dot dot-yellow"></span>
                <span className="mockup-dot dot-green"></span>
              </div>
              <div className="mockup-content">
                <div className="video-icon">▶️</div>
                <h3>Interactive Video Interviews</h3>
                <p>Record, Review & Assess</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Our Platform?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3>Video Recording</h3>
            <p>Capture high-quality video responses from candidates with our intuitive recording interface. Support for multiple formats and devices.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Collaborative Review</h3>
            <p>Enable your entire hiring team to review and rate candidate responses. Share feedback and make collaborative hiring decisions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track interview metrics, compare candidates, and gain insights with comprehensive analytics and reporting tools.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Enterprise-grade security ensures all candidate data and video content remains confidential and protected.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Time-Efficient</h3>
            <p>Screen more candidates in less time. Schedule interviews asynchronously and review responses at your convenience.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Custom Questions</h3>
            <p>Create tailored question sets for different roles. Build your question library and reuse templates across positions.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
