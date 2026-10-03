import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification.js';

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    // Fetch notifications directed to the user OR broadcast notifications (userId is null)
    const filter: any = {
      $or: [{ userId }, { userId: null }],
    };

    // If student, exclude admin-only alerts
    if (role === 'student') {
      filter.type = { $ne: 'alert' };
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      ...filter,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    await Notification.updateMany(
      { $or: [{ userId }, { userId: null }], read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};
