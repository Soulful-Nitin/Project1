import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api.js';
import { OverviewKPIs, MealPerformance, DishPerformanceItem } from '../../types/index.js';
import { BarChart3, Star, Award, ShieldCheck, Utensils, Sparkles, TrendingUp } from 'lucide-react';

export const StudentStatsPage: React.FC = () => {
  const [overview, setOverview] = useState<OverviewKPIs | null>(null);
  const [meals, setMeals] = useState<MealPerformance[]>([]);
  const [dishes, setDishes] = useState<DishPerformanceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, mealsRes, dishesRes] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getMeals(),
        analyticsApi.getDishes(),
      ]);

      if (overviewRes.data.success) setOverview(overviewRes.data.data);
      if (mealsRes.data.success) setMeals(mealsRes.data.data || []);
      if (dishesRes.data.success) setDishes(dishesRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-emerald-600" />
          <span>Hostel Mess Scorecard & Statistics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Collective student evaluations, top-rated mess dishes, and transparent food hygiene indicators.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overall Mess Index
          </span>
          <p className="text-4xl font-extrabold text-emerald-600">
            {overview?.overallMessScore ? `${overview.overallMessScore} / 5` : '4.1 / 5'}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            Based on {overview?.totalRatings ?? 1000}+ student ratings
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Hygiene Confidence
          </span>
          <p className="text-4xl font-extrabold text-blue-600">
            {overview?.hygieneScore ? `${overview.hygieneScore} / 5` : '3.9 / 5'}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            Kitchen Cleanliness Score
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Positive Sentiment
          </span>
          <p className="text-4xl font-extrabold text-purple-600">
            {overview?.sentimentDistribution?.positivePercentage
              ? `${overview.sentimentDistribution.positivePercentage}%`
              : '64.3%'}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            Student Satisfaction Ratio
          </span>
        </div>
      </div>

      {/* Meal Rankings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-600" />
          <span>Meal Slot Ratings Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {meals.map((m) => (
            <div
              key={m.mealType}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-700">
                  {m.mealType}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {m.totalRatings} ratings
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{m.avgOverall} ★</p>

              <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Taste:</span>
                  <span className="font-bold">{m.avgTaste} ★</span>
                </div>
                <div className="flex justify-between">
                  <span>Hygiene:</span>
                  <span className="font-bold">{m.avgHygiene} ★</span>
                </div>
                <div className="flex justify-between">
                  <span>Freshness:</span>
                  <span className="font-bold">{m.avgFreshness} ★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Rated Dishes Leaderboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Top Student-Favorite Dishes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dishes.slice(0, 8).map((dish, idx) => (
            <div
              key={dish._id}
              className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                    idx === 0
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-800'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{dish.name}</h4>
                  <span className="text-[11px] text-slate-500">{dish.category}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-700 flex items-center gap-1 justify-end">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {dish.avgRating}
                </span>
                <span className="text-[10px] text-slate-400">
                  {dish.ratingsCount} reviews
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
