import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const hash = await bcrypt.hash(password, 10)
    const allowedRoles = ['candidate', 'admin']
    const selectedRole = allowedRoles.includes(role) ? role : 'candidate'
    const user = await User.create({ name, email, password: hash, role: selectedRole })

    return res.status(201).json({ id: user._id, name: user.name, email: user.email })
  } catch (err) {
    return res.status(500).json({ message: 'Signup error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken(user)
    return res.json({ token, user: { id: user._id, name: user.name, role: user.role } })
  } catch (err) {
    return res.status(500).json({ message: 'Login error' })
  }
}
