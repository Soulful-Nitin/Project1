import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../analytics/analyticsService.js';
import { Rating } from '../models/Rating.js';
import { Feedback } from '../models/Feedback.js';
import { Complaint } from '../models/Complaint.js';

export const getReportSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type = 'weekly' } = req.query;
    const days = type === 'monthly' ? 30 : 7;

    const [overview, mealPerformance, dishPerformance, qualityBreakdown, sentiment, complaints, insights] =
      await Promise.all([
        AnalyticsService.getOverviewKPIs(),
        AnalyticsService.getMealPerformance(),
        AnalyticsService.getDishPerformance(),
        AnalyticsService.getQualityBreakdown(),
        AnalyticsService.getSentimentAnalytics(),
        AnalyticsService.getComplaintAnalytics(),
        AnalyticsService.getAIInsights(),
      ]);

    res.status(200).json({
      success: true,
      reportType: type,
      periodDays: days,
      generatedAt: new Date().toISOString(),
      data: {
        overview,
        mealPerformance,
        dishPerformance: dishPerformance.slice(0, 15),
        qualityBreakdown,
        sentiment,
        complaints,
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportReportCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dataset = 'ratings' } = req.query;

    if (dataset === 'complaints') {
      const complaints = await Complaint.find()
        .populate('userId', 'name email hostel room')
        .populate('mealId', 'date mealType')
        .sort({ createdAt: -1 });

      const header = 'ID,Category,Priority,Status,Description,Date,Anonymous,Admin Response\n';
      const rows = complaints.map((c) => {
        const desc = `"${(c.description || '').replace(/"/g, '""')}"`;
        const resp = `"${(c.adminResponse || '').replace(/"/g, '""')}"`;
        const dt = new Date(c.createdAt).toISOString().split('T')[0];
        return `${c._id},${c.category},${c.priority},${c.status},${desc},${dt},${c.anonymous},${resp}`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="messmeter_complaints_export.csv"');
      res.status(200).send(header + rows.join('\n'));
      return;
    }

    if (dataset === 'feedback') {
      const feedbacks = await Feedback.find()
        .populate('userId', 'name hostel room')
        .populate('mealId', 'date mealType')
        .sort({ createdAt: -1 });

      const header = 'ID,Date,Meal Type,Sentiment,Score,Topics,Anonymous,Feedback Text\n';
      const rows = feedbacks.map((f: any) => {
        const text = `"${(f.text || '').replace(/"/g, '""')}"`;
        const topics = `"${(f.topics || []).join('; ')}"`;
        const dt = f.mealId?.date || new Date(f.createdAt).toISOString().split('T')[0];
        const mType = f.mealId?.mealType || 'General';
        return `${f._id},${dt},${mType},${f.sentiment},${f.sentimentScore},${topics},${f.anonymous},${text}`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="messmeter_feedback_export.csv"');
      res.status(200).send(header + rows.join('\n'));
      return;
    }

    // Default: ratings dataset
    const ratings = await Rating.find()
      .populate('userId', 'name hostel room')
      .populate('mealId', 'date mealType')
      .sort({ createdAt: -1 });

    const header = 'Rating ID,Date,Meal,Taste,Quality,Hygiene,Freshness,Quantity,Variety,Overall,Tags\n';
    const rows = ratings.map((r: any) => {
      const dt = r.mealId?.date || new Date(r.createdAt).toISOString().split('T')[0];
      const mType = r.mealId?.mealType || 'General';
      const tags = `"${(r.tags || []).join('; ')}"`;
      return `${r._id},${dt},${mType},${r.taste},${r.quality},${r.hygiene},${r.freshness},${r.quantity},${r.variety},${r.overall},${tags}`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="messmeter_ratings_export.csv"');
    res.status(200).send(header + rows.join('\n'));
  } catch (error) {
    next(error);
  }
};
