import { Router } from 'express'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import { adminLogin, listResponses, getResponse, reviewResponse, deleteResponse, listQuestionsAdmin, createQuestion, deleteQuestion } from '../controllers/adminController.js'

const router = Router()

router.post('/login', adminLogin)

router.use(protect, adminOnly)
router.get('/responses', listResponses)
router.get('/response/:id', getResponse)
router.post('/response/:id/review', reviewResponse)
router.delete('/response/:id', deleteResponse)

// Questions management
router.get('/questions', listQuestionsAdmin)
router.post('/questions', createQuestion)
router.delete('/questions/:id', deleteQuestion)

export default router
