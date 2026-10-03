import React, { useState, useEffect } from 'react';
import { reportsApi } from '../../services/api.js';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Award,
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  BarChart2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadReport();
  }, [reportType]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const res = await reportsApi.getSummary(reportType);
      if (res.data.success) {
        setReportData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const overview = reportData?.overview;
  const meals = reportData?.mealPerformance || [];
  const dishes = reportData?.dishPerformance || [];
  const quality = reportData?.qualityBreakdown || [];
  const sentiment = reportData?.sentiment;
  const insights = reportData?.insights || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Controls (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-600" />
            <span>Dining Quality Reports & Data Export</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate printable executive mess food reports and download complete analytical CSV datasets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setReportType('weekly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                reportType === 'weekly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Report
            </button>
            <button
              type="button"
              onClick={() => setReportType('monthly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                reportType === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Report
            </button>
          </div>

          {/* Export Dropdown / Buttons */}
          <a
            href={reportsApi.exportCSVUrl('ratings')}
            download="messmeter_ratings.csv"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ratings CSV</span>
          </a>

          <a
            href={reportsApi.exportCSVUrl('complaints')}
            download="messmeter_complaints.csv"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Complaints CSV</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Report Document Title Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black tracking-tight text-slate-900">
                MESS<span className="text-emerald-600">METER</span>
              </span>
              <span className="text-xs text-slate-400">| Food Quality Assurance Report</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Hostel Mess {reportType === 'weekly' ? 'Weekly Quality Audit' : 'Monthly Performance Review'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hostels: Kaveri, Krishna, Godavari, Brahmaputra & Ganga Kitchens
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
            <p>
              <strong>Generated:</strong> {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
            </p>
            <p>
              <strong>Audit Period:</strong> Last {reportType === 'weekly' ? '7 Days' : '30 Days'}
            </p>
            <p>
              <strong>Status:</strong> Official Mess Council Report
            </p>
          </div>
        </div>

        {/* 1. Executive Summary KPI Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            1. Executive Scorecard
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Overall Mess Score</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                {overview?.overallMessScore} / 5.0
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Average Rating</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {overview?.averageRating} / 5.0
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Hygiene Score</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-0.5">
                {overview?.hygieneScore} / 5.0
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Student Feedback</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-0.5">
                {overview?.totalFeedbacks} reviews
              </p>
            </div>
          </div>
        </div>

        {/* 2. Meal Performance Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            2. Meal Slot Satisfaction Ratings
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Meal Slot</th>
                <th className="py-2.5 px-3 text-right">Average Rating</th>
                <th className="py-2.5 px-3 text-right">Taste</th>
                <th className="py-2.5 px-3 text-right">Hygiene</th>
                <th className="py-2.5 px-3 text-right">Freshness</th>
                <th className="py-2.5 px-3 text-right">Total Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {meals.map((m: any) => (
                <tr key={m.mealType}>
                  <td className="py-2.5 px-3 font-bold text-slate-900 uppercase">
                    {m.mealType}
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">
                    {m.avgOverall} ★
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{m.avgTaste} ★</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{m.avgHygiene} ★</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{m.avgFreshness} ★</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{m.totalRatings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Top Dishes & Bottom Dishes */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            3. Dish Ranking & Student Favorites
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-700 block">
                ⭐ Top 5 Student-Favorite Dishes:
              </span>
              <ul className="text-xs space-y-1.5">
                {dishes.slice(0, 5).map((d: any, idx: number) => (
                  <li key={d._id} className="flex justify-between items-center text-slate-700">
                    <span>
                      {idx + 1}. <strong>{d.name}</strong> ({d.category})
                    </span>
                    <span className="font-extrabold text-emerald-700">{d.avgRating} ★</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-amber-700 block">
                ⚠️ Dishes Requiring Quality Attention:
              </span>
              <ul className="text-xs space-y-1.5">
                {dishes.slice(-5).reverse().map((d: any, idx: number) => (
                  <li key={d._id} className="flex justify-between items-center text-slate-700">
                    <span>
                      {idx + 1}. <strong>{d.name}</strong> ({d.category})
                    </span>
                    <span className="font-extrabold text-amber-700">{d.avgRating} ★</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Actionable AI Recommendations */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            4. Key Findings & Recommended Operational Actions
          </h3>
          <div className="space-y-2.5">
            {insights.map((ins: any) => (
              <div
                key={ins.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ins.title}</span>
                  <span className="font-semibold text-slate-500">{ins.impact} Priority</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{ins.message}</p>
                {ins.actionItem && (
                  <p className="text-emerald-800 font-semibold pt-0.5">
                    <strong>Recommended Action:</strong> {ins.actionItem}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Sign-off */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div>
            <p>Verified by Mess Committee & Head of Catering Services</p>
            <p className="text-[10px] text-slate-400">MessMeter Platform Automated Audit Signature</p>
          </div>
          <div className="text-right font-bold text-slate-800">
            <p>Office of the Hostel Warden</p>
          </div>
        </div>
      </div>
    </div>
  );
};
