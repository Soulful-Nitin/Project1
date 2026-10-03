import React, { useState, useEffect } from 'react';
import { analyticsApi, feedbackApi } from '../../services/api.js';
import { SentimentAnalyticsData, Feedback } from '../../types/index.js';
import {
  Sparkles,
  Smile,
  Meh,
  Frown,
  Search,
  Filter,
  MessageSquare,
  Tag,
  Shield,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const SentimentAnalyticsPage: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<SentimentAnalyticsData | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSentimentData();
    loadFeedbacks();
  }, [selectedSentiment, selectedTopic]);

  const loadSentimentData = async () => {
    try {
      const res = await analyticsApi.getSentiment();
      if (res.data.success) {
        setSentimentData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await feedbackApi.getFeedbacks({
        sentiment: selectedSentiment,
        topic: selectedTopic,
        limit: 50,
      });
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const pieChartData = sentimentData
    ? [
        { name: 'Positive', value: sentimentData.distribution.positive, color: '#10b981' },
        { name: 'Neutral', value: sentimentData.distribution.neutral, color: '#64748b' },
        { name: 'Negative', value: sentimentData.distribution.negative, color: '#ef4444' },
      ]
    : [];

  const filteredFeedbacks = feedbacks.filter((f) =>
    f.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-emerald-600" />
          <span>AI Sentiment & Written Feedback Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Automated Natural Language Processing analyzing student tone, sentiments, and recurring kitchen topics.
        </p>
      </div>

      {/* Top Visualizations: Sentiment Donut & Topic Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Sentiment Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Sentiment Distribution</h3>
            <p className="text-xs text-slate-500">Overall feedback tone breakdown</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-900 rounded-xl font-bold">
              <span>{sentimentData?.distribution.positivePct ?? 0}%</span>
              <span className="text-[10px] text-emerald-600 block font-semibold">Positive</span>
            </div>
            <div className="p-2 bg-slate-100 text-slate-800 rounded-xl font-bold">
              <span>{sentimentData?.distribution.neutralPct ?? 0}%</span>
              <span className="text-[10px] text-slate-500 block font-semibold">Neutral</span>
            </div>
            <div className="p-2 bg-red-50 text-red-900 rounded-xl font-bold">
              <span>{sentimentData?.distribution.negativePct ?? 0}%</span>
              <span className="text-[10px] text-red-600 block font-semibold">Negative</span>
            </div>
          </div>
        </div>

        {/* Top Extracted Discussion Topics */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Top Extracted Quality Topics</h3>
            <p className="text-xs text-slate-500">Frequency of key kitchen themes detected in feedback</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData?.topTopics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="topic" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick topic badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 self-center">Filter Topic:</span>
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all ${
                selectedTopic === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Topics
            </button>
            {sentimentData?.topTopics.map((t) => (
              <button
                key={t.topic}
                onClick={() => setSelectedTopic(t.topic)}
                className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all ${
                  selectedTopic === t.topic
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.topic} ({t.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Feedback Stream & Search */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Real-Time Student Written Feedback Feed</span>
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredFeedbacks.length} student reviews
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search feedback text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>
        </div>

        {/* Feedback Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
              Loading student feedbacks...
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
              No feedbacks match selected filters.
            </div>
          ) : (
            filteredFeedbacks.map((fb) => (
              <div
                key={fb._id}
                className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          fb.sentiment === 'positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fb.sentiment === 'negative'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {fb.sentiment === 'positive' ? (
                          <Smile className="w-3 h-3" />
                        ) : fb.sentiment === 'negative' ? (
                          <Frown className="w-3 h-3" />
                        ) : (
                          <Meh className="w-3 h-3" />
                        )}
                        {fb.sentiment.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Score: {fb.sentimentScore}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-medium mt-2">
                    "{fb.text}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                  <div className="flex flex-wrap gap-1">
                    {fb.topics.map((tp) => (
                      <span
                        key={tp}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-white text-slate-600 rounded-md border border-slate-200"
                      >
                        🏷️ {tp}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] text-slate-500 font-medium">
                    {fb.anonymous ? 'Anonymous Resident' : fb.userId?.name} (
                    {fb.userId?.hostel || 'Hostel'})
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
