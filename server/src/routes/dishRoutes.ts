import { Router } from 'express';
import {
  getDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getDishes);
router.get('/:id', getDishById);

// Admin-only dish routes
router.post('/', authenticateToken, requireRole('admin'), createDish);
router.put('/:id', authenticateToken, requireRole('admin'), updateDish);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteDish);

export default router;
