import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'emerald' | 'blue' | 'amber' | 'purple' | 'red';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'emerald',
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-200',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'hover:border-blue-200',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-200',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-200',
    },
    red: {
      bg: 'bg-red-50 text-red-600',
      border: 'hover:border-red-200',
    },
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md ${c.border}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-amber-700 bg-amber-50'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-slate-500 truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
