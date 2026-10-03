import { Router } from 'express';
import {
  getMeals,
  getTodayMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} from '../controllers/mealController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public / Authenticated read routes
router.get('/', getMeals);
router.get('/today', (req, res, next) => {
  // Optional auth for today to get user's rating status
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    authenticateToken(req, res, () => getTodayMeals(req, res, next));
  } else {
    getTodayMeals(req, res, next);
  }
});
router.get('/:id', getMealById);

// Admin-only management routes
router.post('/', authenticateToken, requireRole('admin'), createMeal);
router.put('/:id', authenticateToken, requireRole('admin'), updateMeal);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteMeal);

export default router;
