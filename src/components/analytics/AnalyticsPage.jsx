import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
} from 'recharts';
import useStore from '../../store/useStore';
import { CATEGORIES, MONTHLY_SUMMARY } from '../../data/mockData';
import {
  getExpensesByCategory,
  getMonthlySavingsTrend,
  getMonthlyAnalytics,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../ui/EmptyState';

const TEAL = '#5EEAD4';
const INDIGO = '#818CF8';
const GREEN = '#34D399';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-dark border border-white/[0.1] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <p className="text-xs font-semibold text-slate-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="text-xs font-bold font-mono text-slate-200">
            {formatCurrency(p.value, { compact: true })}
          </span>
        </div>
      ))}
    </div>
  );
}

function SummaryStatBox({ label, value, sub, color = 'text-slate-200' }) {
  return (
    <div className="bg-card-dark border border-white/[0.07] rounded-card p-5 text-center">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function AnalyticsPage() {
  const transactions = useStore((s) => s.transactions);

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

  const CustomYAxisTick = ({ x, y, payload }) => {
    const catMeta = CATEGORIES[payload.value];
    const Icon = catMeta?.icon;

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-40} y={-10} width={140} height={20}>
          <div className="flex items-center gap-1 text-xs text-slate-300">
            {Icon && <Icon size={12} />}
            <span>{payload.value}</span>
          </div>
        </foreignObject>
      </g>
    );
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        emoji="📊"
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
          color="text-success"
        />
        <SummaryStatBox
          label="Worst Month"
          value={worst ? formatCurrency(worst.savings, { compact: true }) : '—'}
          sub={worst ? `${worst.month} — lowest savings` : ''}
          color="text-danger"
        />
        <SummaryStatBox
          label="Avg Monthly Savings"
          value={formatCurrency(avgSavings, { compact: true })}
          sub="Across recorded months"
          color="text-accent-teal"
        />
      </div>

      <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Monthly Overview</h2>
            <p className="text-xs text-slate-500 mt-0.5">Income vs Expenses — 12 months</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY_SUMMARY}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="income" fill={TEAL} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill={INDIGO} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">Spending by Category</h2>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart layout="vertical" data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="category"
                tick={<CustomYAxisTick />}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={CATEGORIES[entry.category]?.color || INDIGO}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">Savings Trend</h2>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="savings"
                stroke={GREEN}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsPage;