import { Request, Response, NextFunction } from 'express';
import { Rating } from '../models/Rating.js';
import { Feedback } from '../models/Feedback.js';
import { Meal } from '../models/Meal.js';
import { SentimentService } from '../services/sentimentService.js';

export const createRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const {
      mealId,
      taste,
      quality,
      hygiene,
      freshness,
      quantity,
      variety,
      overall,
      tags,
      feedbackText,
      anonymous,
    } = req.body;

    if (!mealId || !taste || !quality || !hygiene || !freshness || !quantity || !variety || !overall) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required rating parameters (1 to 5 scale).',
      });
      return;
    }

    const meal = await Meal.findById(mealId);
    if (!meal) {
      res.status(404).json({ success: false, message: 'Meal does not exist.' });
      return;
    }

    // Check if duplicate
    const existingRating = await Rating.findOne({ userId, mealId });
    if (existingRating) {
      res.status(409).json({
        success: false,
        message: 'You have already rated this meal. Thank you for your feedback!',
      });
      return;
    }

    // Create Rating
    const rating = await Rating.create({
      userId,
      mealId,
      taste: Number(taste),
      quality: Number(quality),
      hygiene: Number(hygiene),
      freshness: Number(freshness),
      quantity: Number(quantity),
      variety: Number(variety),
      overall: Number(overall),
      tags: Array.isArray(tags) ? tags : [],
    });

    // If written feedback provided, analyze sentiment and store
    let feedback = null;
    if (feedbackText && feedbackText.trim().length > 0) {
      const sentimentResult = SentimentService.analyze(feedbackText);
      feedback = await Feedback.create({
        userId,
        mealId,
        ratingId: rating._id,
        text: feedbackText.trim(),
        sentiment: sentimentResult.sentiment,
        sentimentScore: sentimentResult.sentimentScore,
        topics: sentimentResult.topics,
        anonymous: !!anonymous,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Meal rating and feedback submitted successfully. Thank you!',
      rating,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRatings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const ratings = await Rating.find({ userId })
      .populate({
        path: 'mealId',
        populate: { path: 'dishes' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const rating = await Rating.findOne({ _id: req.params.id, userId });

    if (!rating) {
      res.status(404).json({ success: false, message: 'Rating not found or unauthorized to edit.' });
      return;
    }

    const { taste, quality, hygiene, freshness, quantity, variety, overall, tags } = req.body;

    if (taste) rating.taste = Number(taste);
    if (quality) rating.quality = Number(quality);
    if (hygiene) rating.hygiene = Number(hygiene);
    if (freshness) rating.freshness = Number(freshness);
    if (quantity) rating.quantity = Number(quantity);
    if (variety) rating.variety = Number(variety);
    if (overall) rating.overall = Number(overall);
    if (tags) rating.tags = tags;

    await rating.save();

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully.',
      rating,
    });
  } catch (error) {
    next(error);
  }
};
