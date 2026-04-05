import React, { useRef } from 'react';
import { gsap } from 'gsap';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../constants/colors';

function StatCard({ icon: Icon, iconBg, iconColor, label, value, change, prefix = '₹' }) {
  const cardRef = useRef(null);
  const animatedValue = useAnimatedCounter(value);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -4,
      boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const displayValue = formatCurrency(animatedValue, { prefix });

  const resolvedIconColor = iconColor || COLORS.primary;
  const resolvedIconBg = iconBg || `${COLORS.primary}20`;

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        rounded-card p-6
        cursor-default transition-colors duration-300
        relative overflow-hidden
      "
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${resolvedIconColor} 0%, transparent 60%)`,
        }}
      />

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: resolvedIconBg }}
      >
        <Icon size={20} style={{ color: resolvedIconColor }} strokeWidth={2} />
      </div>

      <p
        className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: COLORS.textMuted }}
      >
        {label}
      </p>

      <p
        className="font-bold mb-3 font-mono text-2xl leading-none"
        style={{ color: COLORS.textPrimary }}
      >
        {displayValue}
      </p>

      <Badge value={change} />
      <span
        className="text-[11px] ml-1.5"
        style={{ color: COLORS.textMuted }}
      >
        vs last month
      </span>
    </div>
  );
}

export default StatCard;