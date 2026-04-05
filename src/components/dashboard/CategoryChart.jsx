import React, { useMemo, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import useStore from '../../store/useStore';
import { getExpensesByCategory } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../constants/colors';

function CategoryBreakdown() {
  const transactions = useStore((s) => s.transactions);
  const tooltipRef = useRef(null);

  const data = useMemo(() => {
    const raw = getExpensesByCategory(transactions);
    const total = raw.reduce((sum, item) => sum + item.total, 0);

    const sorted = raw
      .map((item) => ({
        ...item,
        percent: total > 0 ? (item.total / total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const top = sorted.slice(0, 5);
    const rest = sorted.slice(5);

    if (rest.length > 0) {
      const othersTotal = rest.reduce((sum, i) => sum + i.total, 0);
      top.push({
        category: 'Others',
        total: othersTotal,
        percent: (othersTotal / total) * 100,
      });
    }

    return top;
  }, [transactions]);

  const getMutedColor = (index) => {
    const shades = [
      `${COLORS.primary}cc`,
      `${COLORS.primary}99`,
      `${COLORS.primary}66`,
      `${COLORS.primary}44`,
      `${COLORS.primary}33`,
      `${COLORS.secondary}55`,
    ];
    return shades[index % shades.length];
  };

  const [animated, setAnimated] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [style, setStyle] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setStyle((prev) =>
        prev
          ? { ...prev, opacity: 0, transform: 'scale(0.96)' }
          : null
      );
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const updatePosition = (x, y) => {
    const offset = 8;

    const rect = tooltipRef.current?.getBoundingClientRect();
    const width = rect?.width || 140;
    const height = rect?.height || 50;

    let left = x + offset;
    let top = y + offset;

    if (left + width > window.innerWidth) {
      left = x - width - offset;
    }

    if (top + height > window.innerHeight) {
      top = y - height - offset;
    }

    return { top, left };
  };

  if (data.length === 0) return null;

  return (
    <div
      className="h-full flex flex-col rounded-card p-6"
      style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
    >
      <h2 className="text-sm font-semibold mb-5" style={{ color: COLORS.textPrimary }}>
        Category Breakdown
      </h2>

      <div className="h-6 w-full rounded-full overflow-hidden flex">
        {data.map((item, index) => (
          <div
            key={item.category}
            onMouseMove={(e) => {
              const pos = updatePosition(e.clientX, e.clientY);
              setTooltip(item);
              setStyle({
                top: pos.top,
                left: pos.left,
                opacity: 1,
                transform: 'scale(1)',
              });
            }}
            onMouseEnter={(e) => {
              const pos = updatePosition(e.clientX, e.clientY);
              setTooltip(item);
              setStyle({
                top: pos.top,
                left: pos.left,
                opacity: 1,
                transform: 'scale(1)',
              });
            }}
            onMouseLeave={() => {
              setStyle((prev) =>
                prev
                  ? { ...prev, opacity: 0, transform: 'scale(0.96)' }
                  : null
              );
            }}
            onClick={(e) => {
              e.stopPropagation();
              const pos = updatePosition(e.clientX, e.clientY);
              setTooltip(item);
              setStyle({
                top: pos.top,
                left: pos.left,
                opacity: 1,
                transform: 'scale(1)',
              });
            }}
            style={{
              width: animated ? `${item.percent}%` : '0%',
              background: getMutedColor(index),
              transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {style &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: 'fixed',
              top: style.top,
              left: style.left,
              opacity: style.opacity,
              transform: style.transform,
              transition: 'top 0.20s cubic-bezier(0.22,1,0.36,1), left 0.18s cubic-bezier(0.22,1,0.36,1), opacity 0.18s ease, transform 0.18s ease',
              willChange: 'top, left, opacity, transform',
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textPrimary,
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              zIndex: 999999,
              pointerEvents: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {tooltip && (
              <>
                <div style={{ fontWeight: 600 }}>
                  {tooltip.category}
                </div>
                <div style={{ color: COLORS.textMuted }}>
                  {formatCurrency(tooltip.total, { compact: true })} •{' '}
                  {tooltip.percent.toFixed(1)}%
                </div>
              </>
            )}
          </div>,
          document.body
        )}

      <div className="flex flex-col gap-3 mt-6">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: getMutedColor(index) }}
              />
              <span style={{ color: COLORS.textPrimary }} className="text-sm">
                {item.category}
              </span>
            </div>

            <div className="text-right">
              <p
                className="text-sm font-semibold font-mono"
                style={{ color: COLORS.textPrimary }}
              >
                {formatCurrency(item.total, { compact: true })}
              </p>
              <p className="text-[11px]" style={{ color: COLORS.textMuted }}>
                {item.percent.toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryBreakdown;