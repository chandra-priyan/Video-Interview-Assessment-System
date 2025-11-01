import { Router } from 'express'
import multer from 'multer'
import { protect } from '../middleware/authMiddleware.js'
import { getQuestions, uploadVideo, submitResponses, mySubmissions } from '../controllers/candidateController.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } })

router.get('/questions', getQuestions)
router.post('/response/upload', protect, upload.single('file'), uploadVideo)
router.post('/response/submit', protect, submitResponses)
router.get('/response/my-submissions', protect, mySubmissions)

export default router
