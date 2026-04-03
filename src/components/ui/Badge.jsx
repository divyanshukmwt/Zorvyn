import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function Badge({ value, suffix = '%', showIcon = true, size = 'sm' }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const colorClasses = isNeutral
    ? 'bg-slate-700/40 text-slate-400 dark:bg-slate-700/40'
    : isPositive
    ? 'bg-success/15 text-success'
    : 'bg-danger/15 text-danger';

  const sizeClasses = size === 'md' ? 'text-xs px-2.5 py-1' : 'text-[11px] px-2 py-0.5';

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-badge font-semibold ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon size={10} strokeWidth={2.5} />}
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

export default Badge;
