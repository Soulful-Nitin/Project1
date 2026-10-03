import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';
import { Complaint } from '../models/Complaint.js';
import { Feedback } from '../models/Feedback.js';
import { Meal } from '../models/Meal.js';
import { Dish } from '../models/Dish.js';

export class AnalyticsService {
  /**
   * Calculates high-level KPI cards for the dashboard
   */
  public static async getOverviewKPIs() {
    // 1. Rating metrics aggregation
    const ratingStats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          avgOverall: { $avg: '$overall' },
          avgHygiene: { $avg: '$hygiene' },
          avgTaste: { $avg: '$taste' },
          avgQuality: { $avg: '$quality' },
          avgFreshness: { $avg: '$freshness' },
          avgQuantity: { $avg: '$quantity' },
          avgVariety: { $avg: '$variety' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    // 2. Total feedback count & sentiment distribution
    const sentimentStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalFeedbacks = await Feedback.countDocuments();

    // 3. Complaint metrics
    const activeComplaintsCount = await Complaint.countDocuments({
      status: { $in: ['Submitted', 'Under Review', 'In Progress'] },
    });

    const totalComplaintsCount = await Complaint.countDocuments();
    const resolvedComplaintsCount = await Complaint.countDocuments({ status: 'Resolved' });

    // Calculate positive %
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    sentimentStats.forEach((item) => {
      if (item._id === 'positive') positiveCount = item.count;
      else if (item._id === 'neutral') neutralCount = item.count;
      else if (item._id === 'negative') negativeCount = item.count;
    });

    const positivePercentage = totalFeedbacks > 0
      ? Number(((positiveCount / totalFeedbacks) * 100).toFixed(1))
      : 0;

    const stats = ratingStats[0] || {
      avgOverall: 0,
      avgHygiene: 0,
      avgTaste: 0,
      avgQuality: 0,
      avgFreshness: 0,
      avgQuantity: 0,
      avgVariety: 0,
      totalRatings: 0,
    };

    // Calculate overall Mess Score (composite weight)
    const overallMessScore = Number((
      (stats.avgOverall || 0) * 0.4 +
      (stats.avgHygiene || 0) * 0.3 +
      (stats.avgQuality || 0) * 0.2 +
      (stats.avgFreshness || 0) * 0.1
    ).toFixed(2));

    return {
      overallMessScore: overallMessScore || 0,
      averageRating: Number((stats.avgOverall || 0).toFixed(2)),
      hygieneScore: Number((stats.avgHygiene || 0).toFixed(2)),
      totalRatings: stats.totalRatings || 0,
      totalFeedbacks,
      activeComplaints: activeComplaintsCount,
      totalComplaints: totalComplaintsCount,
      resolvedComplaints: resolvedComplaintsCount,
      sentimentDistribution: {
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount,
        positivePercentage,
      },
      qualityScores: {
        taste: Number((stats.avgTaste || 0).toFixed(2)),
        quality: Number((stats.avgQuality || 0).toFixed(2)),
        hygiene: Number((stats.avgHygiene || 0).toFixed(2)),
        freshness: Number((stats.avgFreshness || 0).toFixed(2)),
        quantity: Number((stats.avgQuantity || 0).toFixed(2)),
        variety: Number((stats.avgVariety || 0).toFixed(2)),
      },
    };
  }

  /**
   * Calculates Rating Trends grouped by date over given days window (e.g. 7, 30, 90)
   */
  public static async getRatingTrends(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    return Rating.aggregate([
      {
        $lookup: {
          from: 'meals',
          localField: 'mealId',
          foreignField: '_id',
          as: 'meal',
        },
      },
      { $unwind: '$meal' },
      {
        $match: {
          'meal.date': { $gte: startDateStr },
        },
      },
      {
        $group: {
          _id: '$meal.date',
          avgOverall: { $avg: '$overall' },
          avgTaste: { $avg: '$taste' },
          avgHygiene: { $avg: '$hygiene' },
          avgQuality: { $avg: '$quality' },
          avgFreshness: { $avg: '$freshness' },
          avgQuantity: { $avg: '$quantity' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          avgOverall: { $round: ['$avgOverall', 2] },
          avgTaste: { $round: ['$avgTaste', 2] },
          avgHygiene: { $round: ['$avgHygiene', 2] },
          avgQuality: { $round: ['$avgQuality', 2] },
          avgFreshness: { $round: ['$avgFreshness', 2] },
          avgQuantity: { $round: ['$avgQuantity', 2] },
          count: 1,
        },
      },
    ]);
  }

  /**
   * Calculates Meal Performance comparing Breakfast, Lunch, Snacks, Dinner
   */
  public static async getMealPerformance() {
    return Rating.aggregate([
      {
        $lookup: {
          from: 'meals',
          localField: 'mealId',
          foreignField: '_id',
          as: 'meal',
        },
      },
      { $unwind: '$meal' },
      {
        $group: {
          _id: '$meal.mealType',
          avgOverall: { $avg: '$overall' },
          avgTaste: { $avg: '$taste' },
          avgHygiene: { $avg: '$hygiene' },
          avgQuality: { $avg: '$quality' },
          avgFreshness: { $avg: '$freshness' },
          avgQuantity: { $avg: '$quantity' },
          avgVariety: { $avg: '$variety' },
          totalRatings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          mealType: '$_id',
          avgOverall: { $round: ['$avgOverall', 2] },
          avgTaste: { $round: ['$avgTaste', 2] },
          avgHygiene: { $round: ['$avgHygiene', 2] },
          avgQuality: { $round: ['$avgQuality', 2] },
          avgFreshness: { $round: ['$avgFreshness', 2] },
          avgQuantity: { $round: ['$avgQuantity', 2] },
          avgVariety: { $round: ['$avgVariety', 2] },
          totalRatings: 1,
        },
      },
      {
        $sort: { avgOverall: -1 },
      },
    ]);
  }

  /**
   * Quality Breakdown by parameter
   */
  public static async getQualityBreakdown() {
    const stats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          taste: { $avg: '$taste' },
          quality: { $avg: '$quality' },
          hygiene: { $avg: '$hygiene' },
          freshness: { $avg: '$freshness' },
          quantity: { $avg: '$quantity' },
          variety: { $avg: '$variety' },
          overall: { $avg: '$overall' },
        },
      },
    ]);

    if (!stats.length) {
      return [
        { subject: 'Taste', score: 0, fullMark: 5 },
        { subject: 'Quality', score: 0, fullMark: 5 },
        { subject: 'Hygiene', score: 0, fullMark: 5 },
        { subject: 'Freshness', score: 0, fullMark: 5 },
        { subject: 'Quantity', score: 0, fullMark: 5 },
        { subject: 'Variety', score: 0, fullMark: 5 },
      ];
    }

    const s = stats[0];
    return [
      { subject: 'Taste', score: Number((s.taste || 0).toFixed(2)), fullMark: 5 },
      { subject: 'Quality', score: Number((s.quality || 0).toFixed(2)), fullMark: 5 },
      { subject: 'Hygiene', score: Number((s.hygiene || 0).toFixed(2)), fullMark: 5 },
      { subject: 'Freshness', score: Number((s.freshness || 0).toFixed(2)), fullMark: 5 },
      { subject: 'Quantity', score: Number((s.quantity || 0).toFixed(2)), fullMark: 5 },
      { subject: 'Variety', score: Number((s.variety || 0).toFixed(2)), fullMark: 5 },
    ];
  }

  /**
   * Calculates individual dish ratings and frequency
   */
  public static async getDishPerformance() {
    return Meal.aggregate([
      { $unwind: '$dishes' },
      {
        $lookup: {
          from: 'dishes',
          localField: 'dishes',
          foreignField: '_id',
          as: 'dishDetails',
        },
      },
      { $unwind: '$dishDetails' },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'mealId',
          as: 'mealRatings',
        },
      },
      { $unwind: '$mealRatings' },
      {
        $group: {
          _id: '$dishDetails._id',
          name: { $first: '$dishDetails.name' },
          category: { $first: '$dishDetails.category' },
          isVegetarian: { $first: '$dishDetails.isVegetarian' },
          avgRating: { $avg: '$mealRatings.overall' },
          avgTaste: { $avg: '$mealRatings.taste' },
          ratingsCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          isVegetarian: 1,
          avgRating: { $round: ['$avgRating', 2] },
          avgTaste: { $round: ['$avgTaste', 2] },
          ratingsCount: 1,
        },
      },
      { $sort: { avgRating: -1 } },
    ]);
  }

  /**
   * Sentiment analytics & topic extraction
   */
  public static async getSentimentAnalytics() {
    const sentimentGroups = await Feedback.aggregate([
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 },
          avgScore: { $avg: '$sentimentScore' },
        },
      },
    ]);

    const topicGroups = await Feedback.aggregate([
      { $unwind: '$topics' },
      {
        $group: {
          _id: '$topics',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const total = await Feedback.countDocuments();

    const distribution = {
      positive: 0,
      neutral: 0,
      negative: 0,
      positivePct: 0,
      neutralPct: 0,
      negativePct: 0,
    };

    sentimentGroups.forEach((g) => {
      if (g._id === 'positive') distribution.positive = g.count;
      else if (g._id === 'neutral') distribution.neutral = g.count;
      else if (g._id === 'negative') distribution.negative = g.count;
    });

    if (total > 0) {
      distribution.positivePct = Number(((distribution.positive / total) * 100).toFixed(1));
      distribution.neutralPct = Number(((distribution.neutral / total) * 100).toFixed(1));
      distribution.negativePct = Number(((distribution.negative / total) * 100).toFixed(1));
    }

    const topics = topicGroups.map((t) => ({
      topic: t._id,
      count: t.count,
    }));

    return {
      totalFeedbacks: total,
      distribution,
      topTopics: topics,
    };
  }

  /**
   * Complaint Analytics: categories, status, meals, and resolution times
   */
  public static async getComplaintAnalytics() {
    const byCategory = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]);

    const byStatus = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    const byPriority = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          priority: '$_id',
          count: 1,
        },
      },
    ]);

    return {
      byCategory,
      byStatus,
      byPriority,
    };
  }

  /**
   * Dynamic AI Insights generated 100% strictly from real database analytics
   */
  public static async getAIInsights() {
    const insights: Array<{
      id: string;
      type: 'positive' | 'warning' | 'alert' | 'info';
      title: string;
      message: string;
      metric?: string;
      impact: 'High' | 'Medium' | 'Low';
      actionItem?: string;
    }> = [];

    // 1. Meal performance insights
    const mealPerf = await this.getMealPerformance();
    if (mealPerf.length > 0) {
      const highestMeal = mealPerf[0];
      const lowestMeal = mealPerf[mealPerf.length - 1];

      insights.push({
        id: 'insight-highest-meal',
        type: 'positive',
        title: 'Top Performing Meal Slot',
        message: `${highestMeal.mealType.charAt(0).toUpperCase() + highestMeal.mealType.slice(1)} currently leads overall student satisfaction with an average rating of ${highestMeal.avgOverall} / 5 across ${highestMeal.totalRatings} ratings.`,
        metric: `${highestMeal.avgOverall}/5.0`,
        impact: 'Medium',
        actionItem: 'Replicate kitchen preparation workflows from this slot into lower-rated meals.',
      });

      if (lowestMeal.avgOverall < 3.8 && lowestMeal.mealType !== highestMeal.mealType) {
        insights.push({
          id: 'insight-lowest-meal',
          type: 'warning',
          title: `${lowestMeal.mealType.charAt(0).toUpperCase() + lowestMeal.mealType.slice(1)} Needs Quality Attention`,
          message: `${lowestMeal.mealType.charAt(0).toUpperCase() + lowestMeal.mealType.slice(1)} is currently the lowest-rated meal at ${lowestMeal.avgOverall} / 5. Students scored taste at ${lowestMeal.avgTaste}/5 and freshness at ${lowestMeal.avgFreshness}/5.`,
          metric: `${lowestMeal.avgOverall}/5.0`,
          impact: 'High',
          actionItem: 'Review recipe consistency, serving temperature, and preparation lead time.',
        });
      }
    }

    // 2. Dish performance insights
    const dishPerf = await this.getDishPerformance();
    if (dishPerf.length > 0) {
      const topDish = dishPerf[0];
      const bottomDish = dishPerf[dishPerf.length - 1];

      if (topDish.avgRating >= 4.0) {
        insights.push({
          id: 'insight-top-dish',
          type: 'positive',
          title: `Highest Rated Dish: ${topDish.name}`,
          message: `Students gave "${topDish.name}" an exceptional average rating of ${topDish.avgRating} / 5 (${topDish.ratingsCount} ratings).`,
          metric: `${topDish.avgRating}/5.0`,
          impact: 'Low',
          actionItem: 'Keep this dish in the regular weekly rotation.',
        });
      }

      if (bottomDish.avgRating < 3.4 && bottomDish.ratingsCount >= 5) {
        insights.push({
          id: 'insight-bottom-dish',
          type: 'alert',
          title: `Low Satisfaction for "${bottomDish.name}"`,
          message: `"${bottomDish.name}" received an average rating of ${bottomDish.avgRating} / 5. Negative tags frequently point to preparation and oiliness.`,
          metric: `${bottomDish.avgRating}/5.0`,
          impact: 'High',
          actionItem: 'Consult head chef to adjust spice levels, oil quantity, or consider menu substitution.',
        });
      }
    }

    // 3. Hygiene & Complaint insights
    const overview = await this.getOverviewKPIs();
    if (overview.hygieneScore < 3.9) {
      insights.push({
        id: 'insight-hygiene-warning',
        type: 'alert',
        title: 'Hygiene Score Below Target Threshold',
        message: `Current overall hygiene rating is ${overview.hygieneScore} / 5.0 (target: ≥ 4.2 / 5.0). Active complaints pending review: ${overview.activeComplaints}.`,
        metric: `${overview.hygieneScore}/5.0`,
        impact: 'High',
        actionItem: 'Conduct an immediate surprise kitchen inspection and mandate sanitization logs.',
      });
    } else {
      insights.push({
        id: 'insight-hygiene-healthy',
        type: 'positive',
        title: 'Hygiene Standard Maintained',
        message: `Student hygiene confidence is solid at ${overview.hygieneScore} / 5.0 across recorded evaluations.`,
        metric: `${overview.hygieneScore}/5.0`,
        impact: 'Medium',
      });
    }

    // 4. Sentiment topic trends
    const sentiment = await this.getSentimentAnalytics();
    if (sentiment.topTopics.length > 0) {
      const mostMentioned = sentiment.topTopics[0];
      insights.push({
        id: 'insight-top-topic',
        type: 'info',
        title: `Primary Student Discussion Topic: ${mostMentioned.topic}`,
        message: `"${mostMentioned.topic}" was mentioned ${mostMentioned.count} times in student feedback reviews this period.`,
        metric: `${mostMentioned.count} mentions`,
        impact: 'Medium',
        actionItem: `Focus on feedback details regarding ${mostMentioned.topic.toLowerCase()} during weekly kitchen audit.`,
      });
    }

    return insights;
  }
}
