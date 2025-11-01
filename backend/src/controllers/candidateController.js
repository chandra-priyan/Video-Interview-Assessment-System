import cloudinary from '../config/cloudinary.js'
import Question from '../models/Question.js'
import Response from '../models/Response.js'

export const getQuestions = async (req, res) => {
  try {
    const qs = await Question.find({}).sort({ order: 1, createdAt: 1 })
    res.json(qs.map(q => ({ id: q._id, title: `Q${(q.order ?? 0) + 1}`, prompt: q.questionText })))
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions' })
  }
}

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const upload = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'tech-interview-answers' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    const result = await upload()
    return res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    return res.status(500).json({ message: 'Video upload failed' })
  }
}

export const submitResponses = async (req, res) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No responses provided' })
    }
    const docs = await Response.insertMany(items.map(it => ({
      userId: req.user._id,
      questionId: it.questionId,
      videoUrl: it.videoUrl
    })))
    res.status(201).json({ count: docs.length })
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit responses' })
  }
}

export const mySubmissions = async (req, res) => {
  try {
    const list = await Response.find({ userId: req.user._id }).populate('questionId', 'questionText')
    res.json(list.map(r => ({
      id: r._id,
      questionId: r.questionId?._id,
      questionText: r.questionId?.questionText,
      videoUrl: r.videoUrl,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    })))
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submissions' })
  }
}
