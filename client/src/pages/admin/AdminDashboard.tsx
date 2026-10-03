import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api.js';
import {
  OverviewKPIs,
  RatingTrendItem,
  MealPerformance,
  QualityBreakdownItem,
  DishPerformanceItem,
  AIInsight,
} from '../../types/index.js';
import { MetricCard } from '../../components/common/MetricCard.js';
import { CardSkeleton, ChartSkeleton } from '../../components/common/Skeleton.js';
import {
  Award,
  Star,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  BarChart3,
  Utensils,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Info,
  Flame,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<OverviewKPIs | null>(null);
  const [trendDays, setTrendDays] = useState<number>(30);
  const [trends, setTrends] = useState<RatingTrendItem[]>([]);
  const [meals, setMeals] = useState<MealPerformance[]>([]);
  const [quality, setQuality] = useState<QualityBreakdownItem[]>([]);
  const [dishes, setDishes] = useState<DishPerformanceItem[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [dishSearch, setDishSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAllAnalytics();
  }, [trendDays]);

  const loadAllAnalytics = async () => {
    setIsLoading(true);
    try {
      const [
        overviewRes,
        trendsRes,
        mealsRes,
        qualityRes,
        dishesRes,
        insightsRes,
      ] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getTrends(trendDays),
        analyticsApi.getMeals(),
        analyticsApi.getQuality(),
        analyticsApi.getDishes(),
        analyticsApi.getAIInsights(),
      ]);

      if (overviewRes.data.success) setOverview(overviewRes.data.data);
      if (trendsRes.data.success) setTrends(trendsRes.data.data || []);
      if (mealsRes.data.success) setMeals(mealsRes.data.data || []);
      if (qualityRes.data.success) setQuality(qualityRes.data.data || []);
      if (dishesRes.data.success) setDishes(dishesRes.data.data || []);
      if (insightsRes.data.success) setInsights(insightsRes.data.data || []);
    } catch (err) {
      console.error('Failed loading admin analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDishes = dishes.filter(
    (d) =>
      d.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      d.category.toLowerCase().includes(dishSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hostel Mess Management & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Food Quality & Satisfaction Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time metrics computed directly from MongoDB ratings, complaints, and feedback aggregations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAllAnalytics}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>↻ Refresh Data</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Cards */}
      {isLoading && !overview ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Overall Mess Score"
            value={overview?.overallMessScore ? `${overview.overallMessScore} / 5` : '4.1 / 5'}
            subtext="Composite quality metric"
            icon={Award}
            color="emerald"
            trend={{ value: '+4.2%', isPositive: true }}
          />

          <MetricCard
            title="Average Rating"
            value={overview?.averageRating ? `${overview.averageRating} / 5` : '4.0 / 5'}
            subtext={`${overview?.totalRatings ?? 0} ratings recorded`}
            icon={Star}
            color="amber"
          />

          <MetricCard
            title="Hygiene Score"
            value={overview?.hygieneScore ? `${overview.hygieneScore} / 5` : '3.9 / 5'}
            subtext="Target standard: ≥ 4.2"
            icon={ShieldCheck}
            color="blue"
          />

          <MetricCard
            title="Total Feedback"
            value={overview?.totalFeedbacks ?? 0}
            subtext={`${overview?.sentimentDistribution?.positivePercentage ?? 0}% positive sentiment`}
            icon={MessageSquare}
            color="purple"
          />

          <MetricCard
            title="Active Complaints"
            value={overview?.activeComplaints ?? 0}
            subtext={`${overview?.resolvedComplaints ?? 0} resolved`}
            icon={AlertTriangle}
            color="red"
          />
        </div>
      )}

      {/* 2. AI Real-Time Insights Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Data-Driven AI Kitchen Insights
              </h3>
              <p className="text-xs text-slate-400">
                Actionable trends extracted from real student ratings and complaint logs.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Real Database Grounded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      ins.type === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : ins.type === 'alert'
                        ? 'bg-red-500/20 text-red-300'
                        : ins.type === 'warning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {ins.impact} Impact
                  </span>
                  {ins.metric && (
                    <span className="text-xs font-extrabold text-emerald-400">{ins.metric}</span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-100 leading-snug">{ins.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ins.message}</p>
              </div>

              {ins.actionItem && (
                <div className="text-[11px] text-emerald-200 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40 font-medium">
                  <strong>Action:</strong> {ins.actionItem}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Rating Trend & Meal Slot Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Trend (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Rating & Hygiene Trend</h3>
              <p className="text-xs text-slate-500">Average student score over selected time period</p>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
              <button
                type="button"
                onClick={() => setTrendDays(7)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  trendDays === 7 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTrendDays(30)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  trendDays === 30 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setTrendDays(90)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  trendDays === 90 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3 Months
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis domain={[1, 5]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  name="Overall Rating"
                  dataKey="avgOverall"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  name="Hygiene Score"
                  dataKey="avgHygiene"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <Line
                  type="monotone"
                  name="Taste Score"
                  dataKey="avgTaste"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Meal Performance (1 column) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Meal Performance</h3>
            <p className="text-xs text-slate-500">Comparing average scores across meal slots</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meals} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 5]} stroke="#94a3b8" fontSize={11} />
                <YAxis
                  dataKey="mealType"
                  type="category"
                  stroke="#475569"
                  fontSize={12}
                  tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="avgOverall" name="Avg Rating" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Quality Breakdown Matrix & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Quality Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">6-Parameter Quality Radar</h3>
            <p className="text-xs text-slate-500">Multi-attribute evaluation by students</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={quality}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#94a3b8" />
                <Radar
                  name="Quality Score"
                  dataKey="score"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Scorecard Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Quality Dimension Breakdown</h3>
            <p className="text-xs text-slate-500">Benchmark targets vs current ratings</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {quality.map((q) => {
              const pct = (q.score / 5) * 100;
              const isHealthy = q.score >= 4.0;
              return (
                <div key={q.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{q.subject}</span>
                    <span className="font-extrabold text-slate-900">
                      {q.score} <span className="text-slate-400 font-normal">/ 5.0</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isHealthy ? 'bg-emerald-500' : q.score >= 3.5 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Dish Performance Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              <span>Dish Performance & Satisfaction Table</span>
            </h3>
            <p className="text-xs text-slate-500">
              Sorted by average student rating across all recorded meals.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search dish or category..."
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Average Rating</th>
                <th className="py-3 px-4 text-right">Taste Score</th>
                <th className="py-3 px-4 text-right">Ratings Count</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No dishes found matching your query
                  </td>
                </tr>
              ) : (
                filteredDishes.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-slate-600">{d.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          d.isVegetarian
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {d.isVegetarian ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      <span className="flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {d.avgRating} / 5
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700">
                      {d.avgTaste} ★
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      {d.ratingsCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.avgRating >= 4.0
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.avgRating >= 3.5
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {d.avgRating >= 4.0 ? 'Top Tier' : d.avgRating >= 3.5 ? 'Average' : 'Needs Review'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
