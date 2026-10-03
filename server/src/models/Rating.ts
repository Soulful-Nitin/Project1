import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRating extends Document {
  userId: Types.ObjectId;
  mealId: Types.ObjectId;
  taste: number; // 1 - 5
  quality: number; // 1 - 5
  hygiene: number; // 1 - 5
  freshness: number; // 1 - 5
  quantity: number; // 1 - 5
  variety: number; // 1 - 5
  overall: number; // 1 - 5
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: [true, 'Meal ID is required'],
      index: true,
    },
    taste: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    quality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    hygiene: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    freshness: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    variety: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate ratings for the same student and meal
RatingSchema.index({ userId: 1, mealId: 1 }, { unique: true });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
