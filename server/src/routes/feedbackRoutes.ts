import { Router } from 'express';
import { createFeedback, getFeedbacks } from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createFeedback);
router.get('/', getFeedbacks);

export default router;
