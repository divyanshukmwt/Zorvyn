import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { COLORS } from '../../constants/colors';

function Badge({ value, suffix = '%', showIcon = true, size = 'sm' }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const bgColor = isNeutral
    ? `${COLORS.textMuted}20`
    : isPositive
    ? `${COLORS.success}20`
    : `${COLORS.danger}20`;

  const textColor = isNeutral
    ? COLORS.textMuted
    : isPositive
    ? COLORS.success
    : COLORS.danger;

  const sizeClasses = size === 'md' ? 'text-xs px-2.5 py-1' : 'text-[11px] px-2 py-0.5';

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-badge font-semibold ${sizeClasses}`}
      style={{
        background: bgColor,
        color: textColor
      }}
    >
      {showIcon && <Icon size={10} strokeWidth={2.5} />}
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

export default Badge;