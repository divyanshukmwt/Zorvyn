import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { MONTHLY_SUMMARY } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

const TEAL = '#5EEAD4';
const INDIGO = '#818CF8';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-dark border border-white/[0.1] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <p className="text-xs font-semibold text-slate-400 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.dataKey === 'income' ? 'Income' : 'Expenses'}
          </span>
          <span className="text-xs font-semibold font-mono text-slate-200">
            {formatCurrency(p.value, { compact: true })}
          </span>
        </div>
      ))}
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="bg-card-dark border border-white/[0.07] rounded-card p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Revenue Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">12-month income vs expenses</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: TEAL }} />
            Income
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: INDIGO }} />
            Expenses
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={MONTHLY_SUMMARY} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={TEAL} stopOpacity={0.25} />
              <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={INDIGO} stopOpacity={0.2} />
              <stop offset="95%" stopColor={INDIGO} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Sora' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'Sora' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}K`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="income"
            stroke={TEAL}
            strokeWidth={2}
            fill="url(#incomeGrad)"
            dot={false}
            activeDot={{ r: 4, fill: TEAL, strokeWidth: 0 }}
            animationDuration={900}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={INDIGO}
            strokeWidth={2}
            fill="url(#expenseGrad)"
            dot={false}
            activeDot={{ r: 4, fill: INDIGO, strokeWidth: 0 }}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
