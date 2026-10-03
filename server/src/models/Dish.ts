import mongoose, { Document, Schema } from 'mongoose';

export interface IDish extends Document {
  name: string;
  category: string;
  description?: string;
  isVegetarian: boolean;
  calories?: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DishSchema = new Schema<IDish>(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Dish category is required'],
      enum: [
        'Main Course',
        'Curry & Dal',
        'Bread & Rice',
        'Snacks & Beverages',
        'Dessert & Sweets',
        'Salad & Accompaniments',
        'Breakfast Special',
      ],
      default: 'Main Course',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isVegetarian: {
      type: Boolean,
      default: true,
    },
    calories: {
      type: Number,
      default: 250,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Dish = mongoose.model<IDish>('Dish', DishSchema);
