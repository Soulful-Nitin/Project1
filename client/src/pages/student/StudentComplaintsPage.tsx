import React, { useState, useEffect } from 'react';
import { complaintsApi, mealsApi } from '../../services/api.js';
import { Complaint, Meal } from '../../types/index.js';
import {
  MessageSquareWarning,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  HelpCircle,
  X,
  Sparkles,
  Search,
} from 'lucide-react';

const CATEGORIES = [
  'Food Quality',
  'Hygiene',
  'Quantity',
  'Temperature',
  'Foreign Object',
  'Late Serving',
  'Menu Repetition',
  'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const StudentComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [mealId, setMealId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [anonymous, setAnonymous] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadComplaints();
    loadMeals();
  }, []);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await complaintsApi.getMyComplaints();
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMeals = async () => {
    try {
      const res = await mealsApi.getTodayMeals();
      if (res.data.success) {
        setTodayMeals(res.data.meals || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await complaintsApi.createComplaint({
        category,
        description,
        mealId: mealId || undefined,
        imageUrl: imageBase64 || undefined,
        anonymous,
        priority,
      });

      if (res.data.success) {
        setSuccessMsg('Complaint filed successfully. The mess administration has been notified.');
        setDescription('');
        setImageBase64('');
        setIsFormOpen(false);
        await loadComplaints();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Under Review':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquareWarning className="w-7 h-7 text-emerald-600" />
            <span>Complaints & Grievance Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Report food quality or hygiene issues with transparent status tracking and admin accountability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isFormOpen ? 'Cancel Report' : 'File New Complaint'}</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. New Complaint Form Accordion / Card */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Report a Mess Issue</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Please provide clear details. You can report anonymously if preferred.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Related Meal */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Related Meal (Optional)
                </label>
                <select
                  value={mealId}
                  onChange={(e) => setMealId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">General Mess / Not Specific</option>
                  {todayMeals.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.mealType.toUpperCase()} ({m.servingTime})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue clearly (e.g. food temperature, foreign object, shortage of chappatis, hygiene concerns in tray washing area)..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Optional Image Upload */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Attach Photo Evidence (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {imageBase64 && (
                  <div className="relative inline-block">
                    <img
                      src={imageBase64}
                      alt="Uploaded proof"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setImageBase64('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="anonComplaint"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="anonComplaint" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Submit Anonymously (Your identity will not be shown to kitchen staff or admins)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                {isSubmitting ? 'Filing Complaint...' : 'Submit Complaint to Mess Council'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Complaints List & Status Tracker */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Your Submitted Complaints ({complaints.length})
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse space-y-3">
                <div className="h-5 w-48 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-full bg-slate-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No complaints reported</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't filed any complaints yet. If you encounter food quality or hygiene issues, use the "File New Complaint" button above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((comp) => {
              const statusSteps = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
              const currentStepIndex = statusSteps.indexOf(comp.status);

              return (
                <div
                  key={comp._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        #{comp._id.slice(-6).toUpperCase()}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base">{comp.category}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(
                          comp.priority
                        )}`}
                      >
                        {comp.priority} Priority
                      </span>
                      {comp.anonymous && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Anonymous
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border self-start sm:self-auto ${getStatusColor(
                        comp.status
                      )}`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Photo if attached */}
                  {comp.imageUrl && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Attached Photo:
                      </span>
                      <img
                        src={comp.imageUrl}
                        alt="Complaint evidence"
                        className="w-36 h-28 object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}

                  {/* Interactive Status Progression Bar */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Resolution Progress:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={step} className="space-y-1">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isDone
                                  ? comp.status === 'Resolved'
                                    ? 'bg-emerald-500'
                                    : 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                            <span
                              className={`text-[10px] block font-bold ${
                                isCurrent
                                  ? 'text-emerald-700'
                                  : isDone
                                  ? 'text-slate-700'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Admin Response Note */}
                  {comp.adminResponse ? (
                    <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Admin Official Response
                      </span>
                      <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                        "{comp.adminResponse}"
                      </p>
                      {comp.resolvedAt && (
                        <span className="text-[10px] text-emerald-700 block pt-1">
                          Resolved on {new Date(comp.resolvedAt).toLocaleDateString()} at{' '}
                          {new Date(comp.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      Awaiting review by hostel mess supervisor...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
