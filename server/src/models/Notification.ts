import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  userId?: Types.ObjectId; // null implies global / all users
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'complaint_update';
  read: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'alert', 'complaint_update'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
