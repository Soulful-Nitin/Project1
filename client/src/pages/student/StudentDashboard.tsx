import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { mealsApi, complaintsApi } from '../../services/api.js';
import { Meal, Complaint } from '../../types/index.js';
import { RateMealModal } from '../../components/student/RateMealModal.js';
import { StarRating } from '../../components/common/StarRating.js';
import {
  Utensils,
  Clock,
  CheckCircle2,
  Star,
  AlertTriangle,
  MessageSquareWarning,
  History,
  BarChart3,
  Calendar,
  Sparkles,
  Flame,
  Coffee,
  Sun,
  Moon,
  Cookie,
  ChevronRight,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [activeMealForRating, setActiveMealForRating] = useState<Meal | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadDashboardData();
  }, [selectedDate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [mealsRes, complaintsRes] = await Promise.all([
        mealsApi.getTodayMeals(selectedDate),
        complaintsApi.getMyComplaints(),
      ]);

      if (mealsRes.data.success) {
        setTodayMeals(mealsRes.data.meals || []);
      }
      if (complaintsRes.data.success) {
        setRecentComplaints(complaintsRes.data.complaints?.slice(0, 3) || []);
      }
    } catch (err) {
      console.error('Failed loading student dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openRatingModal = (meal: Meal) => {
    setActiveMealForRating(meal);
    setRatingModalOpen(true);
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'lunch':
        return <Sun className="w-5 h-5 text-emerald-600" />;
      case 'snacks':
        return <Cookie className="w-5 h-5 text-orange-600" />;
      case 'dinner':
        return <Moon className="w-5 h-5 text-indigo-600" />;
      default:
        return <Utensils className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getMealBadgeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'lunch':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'snacks':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'dinner':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Student Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Active Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
            {user?.hostel || 'Hostel Kaveri'} • Room {user?.room || '101'} • Welcome to your daily dining dashboard.
          </p>
        </div>

        {/* Date Selector */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3 self-stretch sm:self-auto">
          <Calendar className="w-4 h-4 text-emerald-200" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">
              Menu Date
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/student/complaints"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-105 transition-transform">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Report a Complaint</h4>
              <p className="text-xs text-slate-500">Hygiene, food quality, or portion issues</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/student/history"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">My Rating History</h4>
              <p className="text-xs text-slate-500">View past submitted meal reviews</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/student/stats"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Mess Food Scorecard</h4>
              <p className="text-xs text-slate-500">Hostel-wide rankings & hygiene score</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* 3. Today's Menu Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              <span>Today's Meal Schedule & Menu</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select any meal slot below to view dishes and submit your rating.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full w-fit">
            📅 {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 animate-pulse space-y-4">
                <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
                <div className="h-16 bg-slate-100 rounded-xl"></div>
                <div className="h-10 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : todayMeals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <Utensils className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No meals scheduled for this date</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The mess manager has not posted the menu for {selectedDate}. Check back shortly or switch dates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {todayMeals.map((meal) => {
              const mealName = meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1);
              const isRated = meal.hasRated;

              return (
                <div
                  key={meal._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  {/* Top: Slot & Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-100 rounded-2xl">
                        {getMealIcon(meal.mealType)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">{mealName}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{meal.servingTime}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getMealBadgeColor(
                        meal.mealType
                      )}`}
                    >
                      {mealName}
                    </span>
                  </div>

                  {/* Dishes List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Dishes on Menu ({meal.dishes.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {meal.dishes.map((dish) => (
                        <div
                          key={dish._id}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dish.isVegetarian ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                            title={dish.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                          />
                          <span>{dish.name}</span>
                          {dish.calories && (
                            <span className="text-[10px] text-slate-400">
                              ({dish.calories} cal)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Note if any */}
                  {meal.specialNote && (
                    <div className="text-xs bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                      💡 {meal.specialNote}
                    </div>
                  )}

                  {/* Rating Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isRated ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>You Rated This Meal</span>
                        </div>
                        {meal.userRating && (
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>{meal.userRating.overall} / 5</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-slate-500 font-medium">
                          Feedback open for today
                        </span>
                        <button
                          type="button"
                          onClick={() => openRatingModal(meal)}
                          className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Rate Meal</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Active Complaints Status Widget */}
      {recentComplaints.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquareWarning className="w-4 h-4 text-emerald-600" />
              <span>Your Recent Complaints</span>
            </h3>
            <Link
              to="/student/complaints"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All Complaints →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentComplaints.map((c) => (
              <div key={c._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{c.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{c.description}</p>
                </div>
                {c.adminResponse && (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg self-start sm:self-auto border border-emerald-100">
                    Admin: "{c.adminResponse.slice(0, 45)}..."
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rate Meal Modal */}
      <RateMealModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        meal={activeMealForRating}
        onRatingSuccess={loadDashboardData}
      />
    </div>
  );
};
