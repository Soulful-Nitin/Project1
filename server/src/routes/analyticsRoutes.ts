import { Router } from 'express';
import {
  getOverview,
  getTrends,
  getMealsAnalytics,
  getDishesAnalytics,
  getQualityAnalytics,
  getSentimentAnalytics,
  getComplaintsAnalytics,
  getAIInsights,
} from '../controllers/analyticsController.js';

const router = Router();

// Analytics endpoints (available for dashboard visualization)
router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/meals', getMealsAnalytics);
router.get('/dishes', getDishesAnalytics);
router.get('/quality', getQualityAnalytics);
router.get('/sentiment', getSentimentAnalytics);
router.get('/complaints', getComplaintsAnalytics);
router.get('/insights', getAIInsights);

export default router;
