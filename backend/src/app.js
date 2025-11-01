import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

dotenv.config()

const app = express()

app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api', candidateRoutes)
app.use('/api/admin', adminRoutes)

connectDB()

// Optional: seed an admin user if env vars provided
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return
  const name = process.env.ADMIN_NAME || 'Admin'
  const existing = await User.findOne({ email, role: 'admin' })
  if (existing) return
  const hash = await bcrypt.hash(password, 10)
  await User.create({ name, email, password: hash, role: 'admin' })
  console.log('Seeded admin user:', email)
}

ensureAdmin().catch(() => {})

export default app
