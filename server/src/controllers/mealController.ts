import { Request, Response, NextFunction } from 'express';
import { Meal } from '../models/Meal.js';
import { Rating } from '../models/Rating.js';

export const getMeals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, startDate, endDate, mealType } = req.query;
    const filter: any = {};

    if (date) {
      filter.date = date;
    } else if (startDate && endDate) {
      filter.date = { $gte: startDate as string, $lte: endDate as string };
    }

    if (mealType) {
      filter.mealType = mealType;
    }

    const meals = await Meal.find(filter)
      .populate('dishes')
      .sort({ date: 1, mealType: 1 });

    res.status(200).json({
      success: true,
      count: meals.length,
      meals,
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayMeals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Current local date in YYYY-MM-DD
    const todayStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const userId = req.user?.userId;

    const meals = await Meal.find({ date: todayStr })
      .populate('dishes')
      .sort({
        // Order by breakfast -> lunch -> snacks -> dinner
        mealType: 1,
      });

    // Map order
    const mealOrder: Record<string, number> = { breakfast: 1, lunch: 2, snacks: 3, dinner: 4 };
    meals.sort((a, b) => (mealOrder[a.mealType] || 0) - (mealOrder[b.mealType] || 0));

    // If student is logged in, attach their rating for each meal if any
    let userRatingsMap: Record<string, any> = {};
    if (userId) {
      const mealIds = meals.map((m) => m._id);
      const userRatings = await Rating.find({
        userId,
        mealId: { $in: mealIds },
      });

      userRatings.forEach((r) => {
        userRatingsMap[r.mealId.toString()] = r;
      });
    }

    const mealsWithStatus = meals.map((meal) => {
      const mealObj = meal.toObject();
      const userRating = userRatingsMap[meal._id.toString()];
      return {
        ...mealObj,
        hasRated: !!userRating,
        userRating: userRating || null,
      };
    });

    res.status(200).json({
      success: true,
      date: todayStr,
      count: mealsWithStatus.length,
      meals: mealsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const getMealById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const meal = await Meal.findById(req.params.id).populate('dishes');
    if (!meal) {
      res.status(404).json({ success: false, message: 'Meal not found' });
      return;
    }

    let userRating = null;
    if (req.user?.userId) {
      userRating = await Rating.findOne({
        userId: req.user.userId,
        mealId: meal._id,
      });
    }

    res.status(200).json({
      success: true,
      meal,
      hasRated: !!userRating,
      userRating,
    });
  } catch (error) {
    next(error);
  }
};

export const createMeal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, mealType, dishes, servingTime, specialNote } = req.body;

    if (!date || !mealType || !dishes || !dishes.length) {
      res.status(400).json({
        success: false,
        message: 'Date, meal type, and at least one dish are required.',
      });
      return;
    }

    const existingMeal = await Meal.findOne({ date, mealType });
    if (existingMeal) {
      res.status(409).json({
        success: false,
        message: `A ${mealType} menu already exists for ${date}. You can edit it instead.`,
      });
      return;
    }

    const meal = await Meal.create({
      date,
      mealType,
      dishes,
      servingTime: servingTime || getDefaultServingTime(mealType),
      specialNote: specialNote || '',
    });

    const populatedMeal = await Meal.findById(meal._id).populate('dishes');

    res.status(201).json({
      success: true,
      message: 'Meal menu created successfully.',
      meal: populatedMeal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMeal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('dishes');

    if (!meal) {
      res.status(404).json({ success: false, message: 'Meal not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Meal updated successfully.',
      meal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMeal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      res.status(404).json({ success: false, message: 'Meal not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const getDefaultServingTime = (type: string): string => {
  switch (type) {
    case 'breakfast':
      return '07:30 AM - 09:30 AM';
    case 'lunch':
      return '12:30 PM - 02:30 PM';
    case 'snacks':
      return '05:00 PM - 06:00 PM';
    case 'dinner':
      return '07:30 PM - 09:30 PM';
    default:
      return '12:00 PM - 02:00 PM';
  }
};
