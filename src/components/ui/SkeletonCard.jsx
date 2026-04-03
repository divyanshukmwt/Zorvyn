import React from 'react';

function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`rounded-lg shimmer-bg ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
      <SkeletonBlock className="w-11 h-11 rounded-xl mb-4" />
      <SkeletonBlock className="w-24 h-3 mb-3" />
      <SkeletonBlock className="w-36 h-7 mb-4" />
      <SkeletonBlock className="w-20 h-5 rounded-full" />
    </div>
  );
}

export function SkeletonChartCard() {
  return (
    <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
      <div className="flex items-center justify-between mb-6">
        <SkeletonBlock className="w-32 h-4" />
        <SkeletonBlock className="w-20 h-4" />
      </div>
      <div className="flex items-end gap-2 h-40">
        {[60, 80, 45, 90, 55, 75, 65, 85, 50, 70, 95, 60].map((h, i) => (
          <SkeletonBlock
            key={i}
            className="flex-1 rounded"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <SkeletonStatCard />;
}

export default SkeletonCard;
