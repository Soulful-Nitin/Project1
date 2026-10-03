export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  hostel: string;
  room?: string;
  profileImage?: string;
}

export interface Dish {
  _id: string;
  name: string;
  category: string;
  description?: string;
  isVegetarian: boolean;
  calories?: number;
  imageUrl?: string;
}

export interface Meal {
  _id: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  dishes: Dish[];
  servingTime: string;
  specialNote?: string;
  hasRated?: boolean;
  userRating?: Rating | null;
}

export interface Rating {
  _id: string;
  userId: string | User;
  mealId: string | Meal;
  taste: number;
  quality: number;
  hygiene: number;
  freshness: number;
  quantity: number;
  variety: number;
  overall: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  _id: string;
  userId: { _id: string; name: string; hostel: string; room?: string };
  mealId?: { _id: string; date: string; mealType: string; dishes?: Dish[] };
  ratingId?: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topics: string[];
  anonymous: boolean;
  createdAt: string;
}

export interface Complaint {
  _id: string;
  userId: { _id: string; name: string; email?: string; hostel: string; room?: string };
  mealId?: { _id: string; date: string; mealType: string; servingTime?: string };
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
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'complaint_update';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface OverviewKPIs {
  overallMessScore: number;
  averageRating: number;
  hygieneScore: number;
  totalRatings: number;
  totalFeedbacks: number;
  activeComplaints: number;
  totalComplaints: number;
  resolvedComplaints: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
    positivePercentage: number;
  };
  qualityScores: {
    taste: number;
    quality: number;
    hygiene: number;
    freshness: number;
    quantity: number;
    variety: number;
  };
}

export interface RatingTrendItem {
  date: string;
  avgOverall: number;
  avgTaste: number;
  avgHygiene: number;
  avgQuality: number;
  avgFreshness: number;
  avgQuantity: number;
  count: number;
}

export interface MealPerformance {
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  avgOverall: number;
  avgTaste: number;
  avgHygiene: number;
  avgQuality: number;
  avgFreshness: number;
  avgQuantity: number;
  avgVariety: number;
  totalRatings: number;
}

export interface QualityBreakdownItem {
  subject: string;
  score: number;
  fullMark: number;
}

export interface DishPerformanceItem {
  _id: string;
  name: string;
  category: string;
  isVegetarian: boolean;
  avgRating: number;
  avgTaste: number;
  ratingsCount: number;
}

export interface SentimentAnalyticsData {
  totalFeedbacks: number;
  distribution: {
    positive: number;
    neutral: number;
    negative: number;
    positivePct: number;
    neutralPct: number;
    negativePct: number;
  };
  topTopics: Array<{ topic: string; count: number }>;
}

export interface ComplaintAnalyticsData {
  byCategory: Array<{ category: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
}

export interface AIInsight {
  id: string;
  type: 'positive' | 'warning' | 'alert' | 'info';
  title: string;
  message: string;
  metric?: string;
  impact: 'High' | 'Medium' | 'Low';
  actionItem?: string;
}
