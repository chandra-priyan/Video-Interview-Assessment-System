import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Response from '../models/Response.js'
import Question from '../models/Question.js'

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email, role: 'admin' })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken(user)
    return res.json({ token, user: { id: user._id, name: user.name, role: user.role } })
  } catch (err) {
    return res.status(500).json({ message: 'Login error' })
  }
}

export const listResponses = async (req, res) => {
  try {
    const list = await Response.find({}).populate('userId', 'name email').populate('questionId', 'questionText')
    res.json(list.map(r => ({
      id: r._id,
      candidateName: r.userId?.name,
      candidateEmail: r.userId?.email,
      questionTitle: r.questionId?.questionText?.slice(0, 60),
      videoUrl: r.videoUrl,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    })))
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch responses' })
  }
}

export const getResponse = async (req, res) => {
  try {
    const r = await Response.findById(req.params.id).populate('userId', 'name email').populate('questionId', 'questionText')
    if (!r) return res.status(404).json({ message: 'Not found' })
    res.json({
      id: r._id,
      candidateName: r.userId?.name,
      candidateEmail: r.userId?.email,
      questionTitle: r.questionId?.questionText,
      videoUrl: r.videoUrl,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch response' })
  }
}

export const reviewResponse = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const r = await Response.findByIdAndUpdate(
      req.params.id,
      { $set: { rating: Number(rating) || 0, comment: comment || '' } },
      { new: true }
    )
    if (!r) return res.status(404).json({ message: 'Not found' })
    res.json({ id: r._id, rating: r.rating, comment: r.comment })
  } catch (err) {
    res.status(500).json({ message: 'Failed to save review' })
  }
}

export const deleteResponse = async (req, res) => {
  try {
    const r = await Response.findByIdAndDelete(req.params.id)
    if (!r) return res.status(404).json({ message: 'Not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete' })
  }
}

// Question management
export const listQuestionsAdmin = async (req, res) => {
  try {
    const qs = await Question.find({}).sort({ order: 1, createdAt: 1 })
    res.json(qs)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions' })
  }
}

export const createQuestion = async (req, res) => {
  try {
    const { questionText, order } = req.body
    if (!questionText) return res.status(400).json({ message: 'questionText required' })
    const q = await Question.create({ questionText, order: Number(order) || 0 })
    res.status(201).json(q)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create question' })
  }
}

export const deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id)
    if (!q) return res.status(404).json({ message: 'Not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question' })
  }
}
