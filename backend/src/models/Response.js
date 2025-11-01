import mongoose from 'mongoose'

const responseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    videoUrl: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, default: '' }
  },
  { timestamps: true }
)

export default mongoose.model('Response', responseSchema)
