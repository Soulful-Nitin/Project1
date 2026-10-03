import { Request, Response, NextFunction } from 'express';
import { Feedback } from '../models/Feedback.js';
import { SentimentService } from '../services/sentimentService.js';

export const createFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { mealId, text, ratingId, anonymous } = req.body;

    if (!mealId || !text || !text.trim()) {
      res.status(400).json({ success: false, message: 'Meal and feedback text are required' });
      return;
    }

    const analysis = SentimentService.analyze(text.trim());

    const feedback = await Feedback.create({
      userId,
      mealId,
      ratingId: ratingId || undefined,
      text: text.trim(),
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      topics: analysis.topics,
      anonymous: !!anonymous,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sentiment, topic, limit = 50, page = 1 } = req.query;
    const filter: any = {};

    if (sentiment && sentiment !== 'all') {
      filter.sentiment = sentiment;
    }

    if (topic && topic !== 'all') {
      filter.topics = topic;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const feedbacks = await Feedback.find(filter)
      .populate('userId', 'name hostel room')
      .populate({
        path: 'mealId',
        populate: { path: 'dishes', select: 'name category' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Feedback.countDocuments(filter);

    // Sanitize anonymous feedbacks
    const sanitized = feedbacks.map((fb) => {
      const obj = fb.toObject();
      if (obj.anonymous) {
        obj.userId = { name: 'Anonymous Student', hostel: 'Verified Resident' } as any;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      count: sanitized.length,
      total,
      page: Number(page),
      feedbacks: sanitized,
    });
  } catch (error) {
    next(error);
  }
};
