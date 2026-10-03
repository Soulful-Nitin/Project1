import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IComplaint extends Document {
  userId: Types.ObjectId;
  mealId?: Types.ObjectId;
  category:
    | 'Food Quality'
    | 'Hygiene'
    | 'Quantity'
    | 'Temperature'
    | 'Foreign Object'
    | 'Late Serving'
    | 'Menu Repetition'
    | 'Other';
  description: string;
  imageUrl?: string;
  anonymous: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
  adminResponse?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
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
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Complaint category is required'],
      enum: [
        'Food Quality',
        'Hygiene',
        'Quantity',
        'Temperature',
        'Foreign Object',
        'Late Serving',
        'Menu Repetition',
        'Other',
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      maxlength: [2000, 'Complaint description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved'],
      default: 'Submitted',
      index: true,
    },
    adminResponse: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
