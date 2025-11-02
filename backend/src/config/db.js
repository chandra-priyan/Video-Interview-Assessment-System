import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI
  
  if (!uri) {
    console.error('MongoDB URI is not defined in environment variables')
    process.exit(1)
  }
  
  try {
    await mongoose.connect(uri, {
      autoIndex: true
    })
    console.log('MongoDB connected to Atlas')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}
