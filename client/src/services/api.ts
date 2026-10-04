import axios from 'axios';
import {
  User,
  Meal,
  Dish,
  Rating,
  Feedback,
  Complaint,
  NotificationItem,
  OverviewKPIs,
  RatingTrendItem,
  MealPerformance,
  QualityBreakdownItem,
  DishPerformanceItem,
  SentimentAnalyticsData,
  ComplaintAnalyticsData,
  AIInsight,
} from '../types/index.js';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Attach JWT token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('messmeter_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error. Please ensure the backend server is running.';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ success: boolean; token: string; user: User }>('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string; role?: string; hostel?: string; room?: string }) =>
    api.post<{ success: boolean; token: string; user: User }>('/auth/register', userData),
  getMe: () => api.get<{ success: boolean; user: User }>('/auth/me'),
};

export const mealsApi = {
  getTodayMeals: (date?: string) =>
    api.get<{ success: boolean; date: string; count: number; meals: Meal[] }>(
      `/meals/today${date ? `?date=${date}` : ''}`
    ),
  getMeals: (params?: { date?: string; startDate?: string; endDate?: string; mealType?: string }) =>
    api.get<{ success: boolean; count: number; meals: Meal[] }>('/meals', { params }),
  getMealById: (id: string) =>
    api.get<{ success: boolean; meal: Meal; hasRated: boolean; userRating: Rating | null }>(`/meals/${id}`),
  createMeal: (mealData: Partial<Meal>) =>
    api.post<{ success: boolean; message: string; meal: Meal }>('/meals', mealData),
  updateMeal: (id: string, mealData: Partial<Meal>) =>
    api.put<{ success: boolean; message: string; meal: Meal }>(`/meals/${id}`, mealData),
  deleteMeal: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/meals/${id}`),
};

export const dishesApi = {
  getDishes: (params?: { category?: string; search?: string }) =>
    api.get<{ success: boolean; count: number; dishes: Dish[] }>('/dishes', { params }),
  createDish: (dishData: Partial<Dish>) =>
    api.post<{ success: boolean; message: string; dish: Dish }>('/dishes', dishData),
  updateDish: (id: string, dishData: Partial<Dish>) =>
    api.put<{ success: boolean; message: string; dish: Dish }>(`/dishes/${id}`, dishData),
  deleteDish: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/dishes/${id}`),
};

export const ratingsApi = {
  submitRating: (ratingData: {
    mealId: string;
    taste: number;
    quality: number;
    hygiene: number;
    freshness: number;
    quantity: number;
    variety: number;
    overall: number;
    tags?: string[];
    feedbackText?: string;
    anonymous?: boolean;
  }) => api.post<{ success: boolean; message: string; rating: Rating; feedback?: Feedback }>('/ratings', ratingData),
  getMyRatings: () =>
    api.get<{ success: boolean; count: number; ratings: Rating[] }>('/ratings/my'),
};

export const feedbackApi = {
  getFeedbacks: (params?: { sentiment?: string; topic?: string; page?: number; limit?: number }) =>
    api.get<{ success: boolean; count: number; total: number; page: number; feedbacks: Feedback[] }>('/feedback', { params }),
  createFeedback: (data: { mealId: string; text: string; anonymous?: boolean }) =>
    api.post<{ success: boolean; message: string; feedback: Feedback }>('/feedback', data),
};

export const complaintsApi = {
  createComplaint: (data: {
    category: string;
    description: string;
    mealId?: string;
    imageUrl?: string;
    anonymous?: boolean;
    priority?: string;
  }) => api.post<{ success: boolean; message: string; complaint: Complaint }>('/complaints', data),
  getMyComplaints: () =>
    api.get<{ success: boolean; count: number; complaints: Complaint[] }>('/complaints/my'),
  getAllComplaints: (params?: { status?: string; category?: string; priority?: string; search?: string }) =>
    api.get<{ success: boolean; count: number; complaints: Complaint[] }>('/complaints', { params }),
  updateComplaintStatus: (
    id: string,
    data: { status?: string; priority?: string; adminResponse?: string }
  ) => api.put<{ success: boolean; message: string; complaint: Complaint }>(`/complaints/${id}`, data),
};

export const analyticsApi = {
  getOverview: () => api.get<{ success: boolean; data: OverviewKPIs }>('/analytics/overview'),
  getTrends: (days = 30) =>
    api.get<{ success: boolean; count: number; data: RatingTrendItem[] }>(`/analytics/trends?days=${days}`),
  getMeals: () => api.get<{ success: boolean; data: MealPerformance[] }>('/analytics/meals'),
  getDishes: () => api.get<{ success: boolean; count: number; data: DishPerformanceItem[] }>('/analytics/dishes'),
  getQuality: () => api.get<{ success: boolean; data: QualityBreakdownItem[] }>('/analytics/quality'),
  getSentiment: () => api.get<{ success: boolean; data: SentimentAnalyticsData }>('/analytics/sentiment'),
  getComplaints: () => api.get<{ success: boolean; data: ComplaintAnalyticsData }>('/analytics/complaints'),
  getAIInsights: () => api.get<{ success: boolean; count: number; data: AIInsight[] }>('/analytics/insights'),
};

export const notificationsApi = {
  getMyNotifications: () =>
    api.get<{ success: boolean; unreadCount: number; notifications: NotificationItem[] }>('/notifications'),
  markAsRead: (id: string) => api.put<{ success: boolean }>(`/notifications/${id}/read`),
  markAllAsRead: () => api.put<{ success: boolean; message: string }>('/notifications/read-all'),
};

export const reportsApi = {
  getSummary: (type: 'weekly' | 'monthly' = 'weekly') =>
    api.get<{ success: boolean; reportType: string; periodDays: number; generatedAt: string; data: any }>(
      `/reports/summary?type=${type}`
    ),
  exportCSVUrl: (dataset: 'ratings' | 'feedback' | 'complaints' = 'ratings') =>
    `/api/reports/export?dataset=${dataset}`,
};

export default api;
