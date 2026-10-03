import { Router } from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} from '../controllers/complaintController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Student creates & views own complaints
router.post('/', authenticateToken, createComplaint);
router.get('/my', authenticateToken, getMyComplaints);

// Admin views & updates all complaints
router.get('/', authenticateToken, requireRole('admin'), getAllComplaints);
router.put('/:id', authenticateToken, requireRole('admin'), updateComplaintStatus);

export default router;
