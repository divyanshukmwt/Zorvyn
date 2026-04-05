import React, { useMemo } from 'react';
import useStore from '../../store/useStore';
import { getExpensesByCategory } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../constants/colors';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function CategoryBreakdown() {
  const transactions = useStore((s) => s.transactions);

  const data = useMemo(() => {
    const raw = getExpensesByCategory(transactions);

    const sorted = raw
      .map((item) => ({
        ...item,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    return sorted;
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

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
      <div className="rounded-xl px-4 py-3 shadow-lg bg-surface border border-border-subtle">
        <p className="text-xs font-semibold text-text-secondary mb-1">
          {data.category}
        </p>
        <p className="text-sm font-semibold text-text-primary font-mono">
          {formatCurrency(data.total, { compact: true })}
        </p>
      </div>
    );
  };

  if (data.length === 0) return null;

  return (
    <div className="h-full flex flex-col rounded-card p-6 bg-card border border-border-subtle">
      <h2 className="text-sm font-semibold mb-5 text-text-primary">
        Category Breakdown
      </h2>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            
            <XAxis
              dataKey="category"
              tick={{ fill: 'var(--ff-text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: 'var(--ff-text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v / 1000}K`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--ff-overlay)' }} />

            <Bar
              dataKey="total"
              radius={[6, 6, 0, 0]}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={getMutedColor(index)} />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CategoryBreakdown;