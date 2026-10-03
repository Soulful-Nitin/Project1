import { Router } from 'express';
import { createRating, getMyRatings, updateRating } from '../controllers/ratingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createRating);
router.get('/my', authenticateToken, getMyRatings);
router.put('/:id', authenticateToken, updateRating);

export default router;
