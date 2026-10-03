import React, { useState, useEffect } from 'react';
import { Meal } from '../../types/index.js';
import { ratingsApi } from '../../services/api.js';
import { Modal } from '../common/Modal.js';
import { StarRating } from '../common/StarRating.js';
import {
  Sparkles,
  Smile,
  Meh,
  Frown,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface RateMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal | null;
  onRatingSuccess: () => void;
}

const QUICK_TAGS = [
  'Good taste',
  'Fresh',
  'Good quantity',
  'Excellent',
  'Well cooked',
  'Too spicy',
  'Too salty',
  'Too oily',
  'Cold food',
  'Poor taste',
  'Poor hygiene',
];

export const RateMealModal: React.FC<RateMealModalProps> = ({
  isOpen,
  onClose,
  meal,
  onRatingSuccess,
}) => {
  const [overall, setOverall] = useState(4);
  const [taste, setTaste] = useState(4);
  const [quality, setQuality] = useState(4);
  const [hygiene, setHygiene] = useState(4);
  const [freshness, setFreshness] = useState(4);
  const [quantity, setQuantity] = useState(4);
  const [variety, setVariety] = useState(4);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (meal) {
      // Reset form on meal change
      setOverall(4);
      setTaste(4);
      setQuality(4);
      setHygiene(4);
      setFreshness(4);
      setQuantity(4);
      setVariety(4);
      setSelectedTags([]);
      setFeedbackText('');
      setAnonymous(false);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [meal]);

  if (!meal) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Live sentiment estimation for feedback preview
  const estimateSentiment = () => {
    if (!feedbackText.trim()) return null;
    const lower = feedbackText.toLowerCase();
    const pos = ['good', 'tasty', 'delicious', 'fresh', 'love', 'great', 'clean', 'excellent'];
    const neg = ['bad', 'poor', 'oily', 'cold', 'salty', 'spicy', 'hair', 'dirty', 'stale', 'worst'];

    let pCount = pos.filter((w) => lower.includes(w)).length;
    let nCount = neg.filter((w) => lower.includes(w)).length;

    if (pCount > nCount) return 'positive';
    if (nCount > pCount) return 'negative';
    return 'neutral';
  };

  const sentimentPreview = estimateSentiment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await ratingsApi.submitRating({
        mealId: meal._id,
        taste,
        quality,
        hygiene,
        freshness,
        quantity,
        variety,
        overall,
        tags: selectedTags,
        feedbackText: feedbackText.trim() || undefined,
        anonymous,
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Rating submitted successfully!');
        setTimeout(() => {
          onRatingSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mealTitle = meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rate ${mealTitle} Menu`}
      subtitle={`${meal.date} • ${meal.servingTime}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Meal Dishes preview */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Dishes in this meal:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {meal.dishes.map((dish) => (
              <span
                key={dish._id}
                className="px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs"
              >
                {dish.name}
              </span>
            ))}
          </div>
        </div>

        {/* Overall Star Rating */}
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            Overall Meal Experience
          </span>
          <StarRating value={overall} onChange={setOverall} size="lg" showValue />
          <span className="text-xs text-slate-500">
            {overall === 5
              ? '⭐⭐⭐⭐⭐ Outstanding Meal'
              : overall === 4
              ? '⭐⭐⭐⭐ Very Good'
              : overall === 3
              ? '⭐⭐⭐ Average'
              : overall === 2
              ? '⭐⭐ Needs Improvement'
              : '⭐ Poor Quality'}
          </span>
        </div>

        {/* 6-Parameter Breakdown Matrix */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Food Quality Breakdown (1 - 5 Stars)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Taste & Flavor</span>
              <StarRating value={taste} onChange={setTaste} size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Food Quality</span>
              <StarRating value={quality} onChange={setQuality} size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Cleanliness & Hygiene</span>
              <StarRating value={hygiene} onChange={setHygiene} size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Freshness</span>
              <StarRating value={freshness} onChange={setFreshness} size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Quantity & Portions</span>
              <StarRating value={quantity} onChange={setQuantity} size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Menu Variety</span>
              <StarRating value={variety} onChange={setVariety} size="sm" />
            </div>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Quick Tags (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const isNegative = ['Too spicy', 'Too salty', 'Too oily', 'Cold food', 'Poor taste', 'Poor hygiene'].includes(tag);

              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? isNegative
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Feedback with live NLP preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Written Feedback (Optional)
            </label>
            {sentimentPreview && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  sentimentPreview === 'positive'
                    ? 'text-emerald-700 bg-emerald-50'
                    : sentimentPreview === 'negative'
                    ? 'text-red-700 bg-red-50'
                    : 'text-slate-600 bg-slate-100'
                }`}
              >
                {sentimentPreview === 'positive' ? (
                  <Smile className="w-3 h-3" />
                ) : sentimentPreview === 'negative' ? (
                  <Frown className="w-3 h-3" />
                ) : (
                  <Meh className="w-3 h-3" />
                )}
                AI Sentiment: {sentimentPreview}
              </span>
            )}
          </div>
          <textarea
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us what you liked or disliked about this meal..."
            className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            maxLength={600}
          />
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymousRating"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <label htmlFor="anonymousRating" className="text-xs font-medium text-slate-600 cursor-pointer">
            Submit rating anonymously (only hostel wing will be recorded for analytics)
          </label>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <span>Submit Feedback</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
