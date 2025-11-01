import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
)

export default mongoose.model('Question', questionSchema)
