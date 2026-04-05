import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { MONTHLY_SUMMARY } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../constants/color';

const Primary = COLORS.primary;
const Secondary = COLORS.secondary;

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-surface border border-border-subtle">
      <p className="text-xs font-semibold mb-2 text-text-secondary">{label}</p>

      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.dataKey === 'income' ? 'Income' : 'Expenses'}
          </span>
          <span className="text-xs font-semibold font-mono text-text-primary">
            {formatCurrency(p.value, { compact: true })}
          </span>
        </div>
      ))}
    </div>
  );
}

function RevenueChart() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-full flex flex-col rounded-card p-6 bg-card border border-border-subtle transition-colors duration-300">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Revenue Overview</h2>
          <p className="text-xs mt-0.5 text-text-muted">12-month income vs expenses</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: Primary }} />
            Income
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: Secondary }} />
            Expenses
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={MONTHLY_SUMMARY}
            margin={{
              top: 5,
              right: isMobile ? 1 : 5,
              left: isMobile ? -19 : -20,
              bottom: 10
            }}
          > 
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={Primary} stopOpacity={0.25} />
                <stop offset="95%" stopColor={Primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={Secondary} stopOpacity={0.2} />
                <stop offset="95%" stopColor={Secondary} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--ff-border)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              interval={0}
              padding={{
                left: isMobile ? 1 : 10,
                right: isMobile ? 9 : 10
              }}
              tick={({ x, y, payload, index }) => {

                if (isMobile) {
                  const isLast = index === MONTHLY_SUMMARY.length - 1;
                  if (index % 2 === 0) return null;
                }

                return (
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fill="var(--ff-text-secondary)"
                    fontSize={isMobile ? 10 : 11}
                    fontFamily="Sora"
                  >
                    {payload.value}
                  </text>
                );
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: 'var(--ff-text-secondary)',
                fontSize: 10,
                fontFamily: 'Sora'
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v / 1000}K`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--ff-overlay)' }}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke={Primary}
              strokeWidth={2}
              fill="url(#incomeGrad)"
              dot={false}
              activeDot={{ r: 4, fill: Primary, strokeWidth: 0 }}
              animationDuration={600}
              animationEasing="ease-out"
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke={Secondary}
              strokeWidth={2}
              fill="url(#expenseGrad)"
              dot={false}
              activeDot={{ r: 4, fill: Secondary, strokeWidth: 0 }}
              animationDuration={600}
              animationEasing="ease-out"
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;