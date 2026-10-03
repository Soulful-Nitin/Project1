import { Request, Response, NextFunction } from 'express';
import { Complaint } from '../models/Complaint.js';
import { Notification } from '../models/Notification.js';

export const createComplaint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { category, description, mealId, imageUrl, anonymous, priority } = req.body;

    if (!category || !description || !description.trim()) {
      res.status(400).json({
        success: false,
        message: 'Category and description are required for filing a complaint.',
      });
      return;
    }

    const complaint = await Complaint.create({
      userId,
      mealId: mealId || undefined,
      category,
      description: description.trim(),
      imageUrl: imageUrl || '',
      anonymous: !!anonymous,
      priority: priority || 'Medium',
      status: 'Submitted',
    });

    // Notify admins
    await Notification.create({
      title: `New ${complaint.priority} Priority Complaint`,
      message: `A new complaint regarding "${category}" has been filed.`,
      type: 'alert',
      link: '/admin/complaints',
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. The mess administration has been notified.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyComplaints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const complaints = await Complaint.find({ userId })
      .populate('mealId', 'date mealType servingTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComplaints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, category, priority, search } = req.query;
    const filter: any = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (search) {
      filter.description = { $regex: search as string, $options: 'i' };
    }

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email hostel room')
      .populate('mealId', 'date mealType')
      .sort({ createdAt: -1 });

    const sanitized = complaints.map((c) => {
      const obj = c.toObject();
      if (obj.anonymous) {
        obj.userId = { name: 'Anonymous Student', hostel: 'Verified Resident' } as any;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      count: sanitized.length,
      complaints: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    if (status) {
      complaint.status = status;
      if (status === 'Resolved') {
        complaint.resolvedAt = new Date();
      }
    }

    if (priority) {
      complaint.priority = priority;
    }

    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
    }

    await complaint.save();

    // Notify the student who raised the complaint
    if (complaint.userId) {
      await Notification.create({
        userId: complaint.userId,
        title: `Complaint Status Updated: ${complaint.status}`,
        message: adminResponse
          ? `Status changed to ${complaint.status}. Admin Response: "${adminResponse}"`
          : `Your complaint regarding "${complaint.category}" status has been updated to "${complaint.status}".`,
        type: complaint.status === 'Resolved' ? 'success' : 'complaint_update',
        link: '/student/complaints',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};
