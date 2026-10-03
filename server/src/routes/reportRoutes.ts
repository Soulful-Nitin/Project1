import { Router } from 'express';
import { getReportSummary, exportReportCSV } from '../controllers/reportController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authenticateToken, requireRole('admin'), getReportSummary);
router.get('/export', authenticateToken, requireRole('admin'), exportReportCSV);

export default router;
