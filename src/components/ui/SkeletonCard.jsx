import React from 'react';

// Uses the shimmer-dark CSS class defined in index.css,
// which handles both dark and light themes automatically.
function SkeletonBlock({ className = '', style = {} }) {
  return (
    <div
      className={`rounded-lg shimmer-dark ${className}`}
      style={style}
    />
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-card p-6 bg-card border border-border-subtle">
      <SkeletonBlock className="w-11 h-11 rounded-xl mb-4" />
      <SkeletonBlock className="w-24 h-3 mb-3" />
      <SkeletonBlock className="w-36 h-7 mb-4" />
      <SkeletonBlock className="w-20 h-5 rounded-full" />
    </div>
  );
}

export function SkeletonChartCard() {
  return (
    <div className="rounded-card p-6 bg-card border border-border-subtle">
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
