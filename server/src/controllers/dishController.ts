import { Request, Response, NextFunction } from 'express';
import { Dish } from '../models/Dish.js';

export const getDishes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search } = req.query;
    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search as string, $options: 'i' };
    }

    const dishes = await Dish.find(filter).sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: dishes.length,
      dishes,
    });
  } catch (error) {
    next(error);
  }
};

export const getDishById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      res.status(404).json({ success: false, message: 'Dish not found' });
      return;
    }
    res.status(200).json({ success: true, dish });
  } catch (error) {
    next(error);
  }
};

export const createDish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category, description, isVegetarian, calories, imageUrl } = req.body;

    if (!name || !category) {
      res.status(400).json({ success: false, message: 'Dish name and category are required' });
      return;
    }

    const dish = await Dish.create({
      name,
      category,
      description: description || '',
      isVegetarian: isVegetarian !== undefined ? isVegetarian : true,
      calories: calories ? Number(calories) : 250,
      imageUrl: imageUrl || '',
    });

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      dish,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dish) {
      res.status(404).json({ success: false, message: 'Dish not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Dish updated successfully',
      dish,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      res.status(404).json({ success: false, message: 'Dish not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
