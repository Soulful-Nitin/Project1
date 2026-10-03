import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../analytics/analyticsService.js';

export const getOverview = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const overview = await AnalyticsService.getOverviewKPIs();
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
    const trends = await AnalyticsService.getRatingTrends(days);
    res.status(200).json({ success: true, count: trends.length, data: trends });
  } catch (error) {
    next(error);
  }
};

export const getMealsAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const meals = await AnalyticsService.getMealPerformance();
    res.status(200).json({ success: true, data: meals });
  } catch (error) {
    next(error);
  }
};

export const getDishesAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dishes = await AnalyticsService.getDishPerformance();
    res.status(200).json({ success: true, count: dishes.length, data: dishes });
  } catch (error) {
    next(error);
  }
};

export const getQualityAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quality = await AnalyticsService.getQualityBreakdown();
    res.status(200).json({ success: true, data: quality });
  } catch (error) {
    next(error);
  }
};

export const getSentimentAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sentiment = await AnalyticsService.getSentimentAnalytics();
    res.status(200).json({ success: true, data: sentiment });
  } catch (error) {
    next(error);
  }
};

export const getComplaintsAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const complaints = await AnalyticsService.getComplaintAnalytics();
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

export const getAIInsights = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const insights = await AnalyticsService.getAIInsights();
    res.status(200).json({ success: true, count: insights.length, data: insights });
  } catch (error) {
    next(error);
  }
};
