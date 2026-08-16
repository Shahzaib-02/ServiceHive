import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { getCustomerReviews, createCustomerReview } from '../controllers/reviewsController.js'

const router = express.Router()

router.get('/', authenticateToken, getCustomerReviews)
router.post('/', authenticateToken, createCustomerReview)

export default router
