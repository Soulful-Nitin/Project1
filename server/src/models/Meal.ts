import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMeal extends Document {
  date: string; // Stored in YYYY-MM-DD format for easy aggregation and timezone-safe matching
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  dishes: Types.ObjectId[];
  servingTime: string;
  specialNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    date: {
      type: String,
      required: [true, 'Meal date is required (YYYY-MM-DD)'],
      index: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
      index: true,
    },
    dishes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dish',
      },
    ],
    servingTime: {
      type: String,
      required: [true, 'Serving time range is required'],
      default: '12:30 PM - 02:30 PM',
    },
    specialNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so one meal type per date
MealSchema.index({ date: 1, mealType: 1 }, { unique: true });

export const Meal = mongoose.model<IMeal>('Meal', MealSchema);
