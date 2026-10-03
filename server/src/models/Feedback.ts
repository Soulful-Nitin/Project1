import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFeedback extends Document {
  userId: Types.ObjectId;
  mealId: Types.ObjectId;
  ratingId?: Types.ObjectId;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1.0 to 1.0
  topics: string[];
  anonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
      index: true,
    },
    ratingId: {
      type: Schema.Types.ObjectId,
      ref: 'Rating',
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true,
      maxlength: [1000, 'Feedback text cannot exceed 1000 characters'],
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral',
      index: true,
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    topics: {
      type: [String],
      default: [],
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
