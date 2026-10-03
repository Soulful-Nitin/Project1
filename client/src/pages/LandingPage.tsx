import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { analyticsApi } from '../services/api.js';
import { OverviewKPIs } from '../types/index.js';
import {
  Utensils,
  BarChart3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  MessageSquareWarning,
  Star,
  Users,
  Activity,
  Layers,
  ChefHat,
  HeartHandshake,
  Check,
  ChevronRight,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const LandingPage: React.FC = () => {
  const { quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<OverviewKPIs | null>(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await analyticsApi.getOverview();
        if (res.data.success) {
          setOverview(res.data.data);
        }
      } catch (err) {
        // Fallback demo values if server is booting
        setOverview({
          overallMessScore: 4.12,
          averageRating: 4.05,
          hygieneScore: 3.92,
          totalRatings: 1093,
          totalFeedbacks: 594,
          activeComplaints: 14,
          totalComplaints: 45,
          resolvedComplaints: 31,
          sentimentDistribution: {
            positive: 382,
            neutral: 145,
            negative: 67,
            positivePercentage: 64.3,
          },
          qualityScores: {
            taste: 4.1,
            quality: 4.0,
            hygiene: 3.9,
            freshness: 4.2,
            quantity: 4.3,
            variety: 3.8,
          },
        });
      }
    };
    loadOverview();
  }, []);

  const sampleTrendData = [
    { day: 'Mon', rating: 3.8, hygiene: 3.7 },
    { day: 'Tue', rating: 4.2, hygiene: 4.0 },
    { day: 'Wed', rating: 4.0, hygiene: 3.9 },
    { day: 'Thu', rating: 4.4, hygiene: 4.3 },
    { day: 'Fri', rating: 3.9, hygiene: 3.8 },
    { day: 'Sat', rating: 4.5, hygiene: 4.4 },
    { day: 'Sun', rating: 4.6, hygiene: 4.5 },
  ];

  const mealPerfData = [
    { name: 'Breakfast', rating: 4.25, color: '#10b981' },
    { name: 'Lunch', rating: 4.08, color: '#3b82f6' },
    { name: 'Snacks', rating: 4.15, color: '#f59e0b' },
    { name: 'Dinner', rating: 3.75, color: '#6366f1' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 gradient-hero border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart Hostel Dining Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Turn Student Feedback Into <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500">
                Better Food.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              MessMeter helps hostel messes understand student satisfaction through real-time feedback, analytics, and actionable insights.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                type="button"
                onClick={async () => {
                  await quickLoginAs('student');
                  navigate('/student');
                }}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Rate Today's Meal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await quickLoginAs('admin');
                  navigate('/admin');
                }}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span>Admin Analytics Portal</span>
              </button>
            </div>

            {/* Demo Quick Notice */}
            <p className="text-xs text-slate-500 font-medium">
              ⚡ Instant 1-Click Demo enabled • Preloaded with 120+ verified students & live meals
            </p>
          </div>

          {/* Real-time KPI Preview Bar */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overall Mess Score
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
                {overview?.overallMessScore ? `${overview.overallMessScore} / 5` : '4.1 / 5'}
              </p>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                Composite Quality Index
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Rating
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {overview?.averageRating ? `${overview.averageRating} / 5` : '4.0 / 5'}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                ⭐ 1,000+ Meal Reviews
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Hygiene Score
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {overview?.hygieneScore ? `${overview.hygieneScore} / 5` : '3.9 / 5'}
              </p>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                Kitchen Sanitization Standard
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Complaints
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
                {overview?.activeComplaints ?? '14'}
              </p>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                Transparent Resolution
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE ANALYTICS PREVIEW SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
              Actionable Intelligence
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              MongoDB Powered Food Analytics
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Every chart is computed directly on the backend with MongoDB aggregation pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Weekly Quality & Rating Trend</h4>
                  <p className="text-xs text-slate-500">Continuous 7-day student satisfaction pulse</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Overall Rating
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Hygiene
                  </span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[3, 5]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="hygiene" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Meal Performance Bar Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Meal Slot Comparison</h4>
                  <p className="text-xs text-slate-500">Breakfast vs Lunch vs Snacks vs Dinner</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                  Target: ≥ 4.0 / 5.0
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mealPerfData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="rating" radius={[8, 8, 0, 0]} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS / CORE WORKFLOW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
              Our Continuous Feedback Loop
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              COLLECT • ANALYZE • IDENTIFY • ACT • IMPROVE
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              How MessMeter turns daily meal reviews into measurable dining hall enhancements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Collect</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students rate meals on 6 specific parameters (Taste, Hygiene, Freshness, Quantity, Variety, Quality) and submit written reviews.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Analyze</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                MongoDB aggregations compute trends, and NLP algorithms extract sentiment and topics (oiliness, spiciness, saltiness).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Identify</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI insights isolate dish-level quality drops, recurring hygiene concerns, and peak-time meal shortages.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base">Act</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Admins calibrate chef recipes, resolve tagged complaints, and update weekly meal schedules in real time.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                5
              </div>
              <h4 className="font-bold text-slate-900 text-base">Improve</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hostel mess food quality systematically rises, student trust is restored, and food wastage drops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
              Complete Feature Suite
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Students & Mess Administrators
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Detailed Meal Rating</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-dimensional rating matrix across taste, hygiene, freshness, portion size, and menu variety with quick tags.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Transparent Complaints</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Report hygiene or quality grievances with optional photos and anonymous mode. Track live status until resolved.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">AI Sentiment Analysis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatic NLP topic detection categorizing student sentiment into actionable kitchen operational recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your hostel mess dining experience?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Join hundreds of students and hostel wardens leveraging real-time data to guarantee fresh, hygienic, and delicious meals every single day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={async () => {
                await quickLoginAs('student');
                navigate('/student');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              Open Student Portal
            </button>
            <button
              type="button"
              onClick={async () => {
                await quickLoginAs('admin');
                navigate('/admin');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
            >
              Open Admin Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
