import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
  PieChart, Pie
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES, MONTHLY_SUMMARY } from '../../data/mockData';
import {
  getExpensesByCategory,
  getMonthlySavingsTrend,
  getMonthlyAnalytics,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../ui/EmptyState';
import { COLORS } from '../../constants/color';

const Primary   = COLORS.primary;
const Secondary = COLORS.secondary;
const GREEN     = COLORS.success;

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-surface border border-border-subtle">
      <p className="text-xs font-semibold mb-2 text-text-secondary">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="text-xs font-bold font-mono text-text-primary">
            {formatCurrency(p.value, { compact: true })}
          </span>
        </div>
      ))}
    </div>
  );
}

function SummaryStatBox({ label, value, sub, color = 'var(--ff-text-primary)' }) {
  return (
    <div className="rounded-card p-5 text-center bg-card border border-border-subtle">
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-text-muted">
        {label}
      </p>
      <p className="text-xl font-bold font-mono" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-1 text-text-muted">{sub}</p>}
    </div>
  );
}

function AnalyticsPage() {
  const transactions = useStore((s) => s.transactions);
  const [activeIndex, setActiveIndex] = React.useState(null);

  const categoryData = useMemo(
    () => getExpensesByCategory(transactions).slice(0, 8),
    [transactions]
  );

  const savingsTrend = useMemo(
    () => getMonthlySavingsTrend(transactions),
    [transactions]
  );

  const { best, worst, avgSavings } = useMemo(
    () => getMonthlyAnalytics(transactions),
    [transactions]
  );

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No data to analyse"
        subtitle="Add some transactions to unlock your full analytics dashboard."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryStatBox
          label="Best Month"
          value={best ? formatCurrency(best.savings, { compact: true }) : '—'}
          sub={best ? `${best.month} — highest savings` : ''}
          color={COLORS.success}
        />
        <SummaryStatBox
          label="Worst Month"
          value={worst ? formatCurrency(worst.savings, { compact: true }) : '—'}
          sub={worst ? `${worst.month} — lowest savings` : ''}
          color={COLORS.danger}
        />
        <SummaryStatBox
          label="Avg Monthly Savings"
          value={formatCurrency(avgSavings, { compact: true })}
          sub="Across recorded months"
          color={COLORS.primary}
        />
      </div>

      <div className="rounded-card p-6 bg-card border border-border-subtle">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Monthly Overview</h2>
            <p className="text-xs mt-0.5 text-text-muted">Income vs Expenses — 12 months</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.primary }} />
              Income
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.secondary }} />
              Expenses
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY_SUMMARY} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ff-border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--ff-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--ff-text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--ff-overlay)' }} />
            <Bar dataKey="income"   name="Income"   fill={Primary}   fillOpacity={0.8} radius={[4, 4, 0, 0]} animationDuration={900} />
            <Bar dataKey="expenses" name="Expenses" fill={Secondary} fillOpacity={0.8} radius={[4, 4, 0, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6">
        <div className="rounded-card p-6 bg-card border border-border-subtle">
          <h2 className="text-sm font-semibold mb-4 text-text-primary">Spending by Category</h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-[50%] h-[240px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={2}
                    animationDuration={900}
                    animationEasing="ease-out"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {categoryData.map((entry, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <Cell
                          key={index}
                          fill={CATEGORIES[entry.category]?.color || Secondary}
                          stroke={isActive ? 'var(--ff-text-primary)' : 'none'}
                          strokeWidth={isActive ? 2 : 0}
                          style={{
                            opacity: activeIndex === null || isActive ? 1 : 0.4,
                            transition: 'opacity 0.2s ease, stroke 0.2s ease',
                            cursor: 'pointer',
                          }}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:flex-1 space-y-3">
              {categoryData.map((entry, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className="flex items-center justify-between px-2 py-1 rounded-md transition-colors duration-150"
                    style={{
                      background: isActive ? 'var(--ff-overlay)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: CATEGORIES[entry.category]?.color || Secondary,
                          transform: isActive ? 'scale(1.2)' : 'scale(1)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: isActive ? 'var(--ff-text-primary)' : 'var(--ff-text-secondary)',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {entry.category}
                      </span>
                    </div>
                    <span
                      className="text-xs font-semibold font-mono"
                      style={{
                        color: 'var(--ff-text-primary)',
                        opacity: isActive ? 1 : 0.8,
                      }}
                    >
                      {formatCurrency(entry.total, { compact: true })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-card p-6 bg-card border border-border-subtle">
          <h2 className="text-sm font-semibold mb-1 text-text-primary">Savings Trend</h2>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ff-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--ff-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--ff-text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--ff-overlay)' }} />
              <Line
                type="monotone"
                dataKey="savings"
                stroke={GREEN}
                strokeWidth={2.5}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
