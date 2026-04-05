import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Zap,
  Target,
  Activity,
} from 'lucide-react';
import useStore from '../../store/useStore';
import {
  getTotalIncome,
  getTotalExpenses,
  getSavingsRate,
  getAvgTransaction,
  getTopSpendingCategory,
  getTransactionsByMonth,
  getCurrentAndPreviousMonth,
  getPercentChange,
} from '../../utils/calculations';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CATEGORIES } from '../../data/mockData';

function InsightRow({ icon: Icon, iconBg, label, value, sub, index }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: 12 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        delay: index * 0.08,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-white/[0.06] mb-2"
    >
      <div
        className={`w-9 h-9 rounded-[10px] ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={15} strokeWidth={2} className="text-slate-300" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          {label}
        </p>

        {/* UPDATED: supports JSX values */}
        <div className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
          {value}
        </div>

        {sub && (
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function InsightsPanel() {
  const transactions = useStore((s) => s.transactions);

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const { current, previous } = getCurrentAndPreviousMonth();
    const currTx = getTransactionsByMonth(transactions, current);
    const prevTx = getTransactionsByMonth(transactions, previous);

    const income = getTotalIncome(transactions);
    const expenses = getTotalExpenses(transactions);
    const savingsRate = getSavingsRate(transactions);
    const avgTx = getAvgTransaction(transactions);
    const topCat = getTopSpendingCategory(transactions);

    const currExpenses = getTotalExpenses(currTx);
    const prevExpenses = getTotalExpenses(prevTx);
    const monthChange = getPercentChange(currExpenses, prevExpenses);

    return {
      income,
      expenses,
      savingsRate,
      avgTx,
      topCat,
      monthChange,
      currExpenses,
      prevExpenses,
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-1">
          Insights
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Financial health summary
        </p>
        <p className="text-sm text-slate-600 text-center py-8">
          Add transactions to see insights
        </p>
      </div>
    );
  }

  const topCatMeta = insights.topCat
    ? CATEGORIES[insights.topCat.category]
    : null;

  const isExpenseUp = insights.monthChange > 0;

  const rows = [
    {
      icon: PiggyBank,
      iconBg: 'bg-success/15',
      label: 'Savings Rate',
      value: `${insights.savingsRate.toFixed(1)}%`,
      sub: `Net ₹${((insights.income - insights.expenses) / 100000).toFixed(1)}L saved`,
    },
    {
      icon: Target,
      iconBg: 'bg-warning/15',
      label: 'Top Category',
      value: topCatMeta ? (
        <div className="flex items-center gap-1.5">
          {topCatMeta.icon && <topCatMeta.icon size={14} />}
          {insights.topCat.category}
        </div>
      ) : (
        '—'
      ),
      sub: insights.topCat
        ? formatCurrency(insights.topCat.total, { compact: true }) +
          ' total spent'
        : '',
    },
    {
      icon: Zap,
      iconBg: 'bg-accent-teal/15',
      label: 'Avg Transaction',
      value: formatCurrency(insights.avgTx, { compact: true }),
      sub: `Across ${transactions.length} transactions`,
    },
    {
      icon: isExpenseUp ? TrendingUp : TrendingDown,
      iconBg: isExpenseUp ? 'bg-danger/15' : 'bg-success/15',
      label: 'Monthly Change',
      value: formatPercent(insights.monthChange),
      sub: `Expenses vs last month`,
    },
    {
      icon: Activity,
      iconBg: 'bg-accent-indigo/15',
      label: 'Net Balance',
      value: formatCurrency(
        insights.income - insights.expenses,
        { compact: true }
      ),
      sub: `Income − Expenses`,
    },
  ];

  return (
    <div className="bg-card-dark border border-white/[0.07] rounded-card p-6 transition-colors duration-300">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-200">
          Insights
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Financial health summary
        </p>
      </div>

      {rows.map((row, i) => (
        <InsightRow key={row.label} {...row} index={i} />
      ))}
    </div>
  );
}

export default InsightsPanel;