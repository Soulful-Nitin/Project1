import React, { useState, useEffect } from 'react';
import { ratingsApi } from '../../services/api.js';
import { Rating } from '../../types/index.js';
import { StarRating } from '../../components/common/StarRating.js';
import { History, Utensils, Calendar, Star, Tag, CheckCircle2 } from 'lucide-react';

export const StudentHistoryPage: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadMyRatings();
  }, []);

  const loadMyRatings = async () => {
    setIsLoading(true);
    try {
      const res = await ratingsApi.getMyRatings();
      if (res.data.success) {
        setRatings(res.data.ratings || []);
      }
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
          <History className="w-7 h-7 text-emerald-600" />
          <span>My Meal Rating History</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review all your past meal evaluations, scores, and tagged feedback.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-3">
              <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-full bg-slate-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : ratings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <Utensils className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No ratings submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Head to Today's Menu and rate your first breakfast, lunch, or dinner!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ratings.map((r: any) => {
            const meal = r.mealId;
            const mealType = meal?.mealType
              ? meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)
              : 'Meal';

            return (
              <div
                key={r._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {mealType}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">
                      {meal?.date || new Date(r.createdAt).toLocaleDateString()}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-extrabold text-slate-900">
                      {r.overall} <span className="text-slate-400 font-normal text-xs">/ 5</span>
                    </span>
                  </div>
                </div>

                {/* Dishes */}
                {meal?.dishes && meal.dishes.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Dishes on menu:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {meal.dishes.map((d: any) => (
                        <span
                          key={d._id || d}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                        >
                          {d.name || 'Dish'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6 Quality Parameters Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Taste</span>
                    <span className="font-bold text-slate-800">{r.taste} ★</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Quality</span>
                    <span className="font-bold text-slate-800">{r.quality} ★</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Hygiene</span>
                    <span className="font-bold text-slate-800">{r.hygiene} ★</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Freshness</span>
                    <span className="font-bold text-slate-800">{r.freshness} ★</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Quantity</span>
                    <span className="font-bold text-slate-800">{r.quantity} ★</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Variety</span>
                    <span className="font-bold text-slate-800">{r.variety} ★</span>
                  </div>
                </div>

                {/* Tags */}
                {r.tags && r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.tags.map((t: string) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        🏷️ {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
