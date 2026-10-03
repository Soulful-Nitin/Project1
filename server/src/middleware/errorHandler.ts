import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong. Please try again.';

  // Handle Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value error: A record with this ${duplicateField} already exists.`;
    
    if (err.keyValue.userId && err.keyValue.mealId) {
      message = 'You have already submitted a rating for this meal.';
    }
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join('; ');
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier format.';
  }

  console.error(`[Error] ${req.method} ${req.url} - ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
};
