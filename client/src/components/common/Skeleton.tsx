import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-72' }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm ${height} flex flex-col justify-between`}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-end gap-3 h-48 pt-6">
        <Skeleton className="h-32 flex-1 rounded-t-lg" />
        <Skeleton className="h-44 flex-1 rounded-t-lg" />
        <Skeleton className="h-28 flex-1 rounded-t-lg" />
        <Skeleton className="h-36 flex-1 rounded-t-lg" />
        <Skeleton className="h-40 flex-1 rounded-t-lg" />
        <Skeleton className="h-48 flex-1 rounded-t-lg" />
      </div>
    </div>
  );
};
