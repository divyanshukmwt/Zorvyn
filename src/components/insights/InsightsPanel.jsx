import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, TrendingDown, PiggyBank, Target, Activity } from 'lucide-react';
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
import { COLORS } from '../../constants/colors';

function InsightRow({ icon: Icon, iconBg, label, value, sub, index }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, duration: 0.4, delay: index * 0.08, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-surface border border-border-subtle"
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={15} strokeWidth={2} className="text-text-secondary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </p>
        <p className="text-sm font-bold font-mono mt-0.5 truncate text-text-primary">
          {value}
        </p>
        {sub && (
          <p className="text-[11px] mt-0.5 truncate text-text-muted">{sub}</p>
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

    const income      = getTotalIncome(transactions);
    const expenses    = getTotalExpenses(transactions);
    const savingsRate = getSavingsRate(transactions);
    const avgTx       = getAvgTransaction(transactions);
    const topCat      = getTopSpendingCategory(transactions);

    const currExpenses = getTotalExpenses(currTx);
    const prevExpenses = getTotalExpenses(prevTx);
    const monthChange  = getPercentChange(currExpenses, prevExpenses);

    return { income, expenses, savingsRate, avgTx, topCat, monthChange };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="rounded-card p-6 bg-card border border-border-subtle">
        <h2 className="text-sm font-semibold mb-1 text-text-primary">Insights</h2>
        <p className="text-xs mb-6 text-text-muted">Financial health summary</p>
        <p className="text-sm text-center py-8 text-text-muted">
          Add transactions to see insights
        </p>
      </div>
    );
  }

  const topCatMeta = insights.topCat ? CATEGORIES[insights.topCat.category] : null;
  const TopIcon    = topCatMeta?.icon || Activity;
  const isExpenseUp = insights.monthChange > 0;

  const rows = [
    {
      icon:   PiggyBank,
      iconBg: `${COLORS.success}20`,
      label:  'Savings Rate',
      value:  `${insights.savingsRate.toFixed(1)}%`,
      sub:    `Net ₹${((insights.income - insights.expenses) / 100000).toFixed(1)}L saved`,
    },
    {
      icon:   TopIcon,
      iconBg: `${COLORS.warning}20`,
      label:  'Top Category',
      value:  insights.topCat ? insights.topCat.category : '—',
      sub:    insights.topCat
        ? formatCurrency(insights.topCat.total, { compact: true }) + ' total spent'
        : '',
    },
    {
      icon:   Activity,
      iconBg: `${COLORS.primary}20`,
      label:  'Avg Transaction',
      value:  formatCurrency(insights.avgTx, { compact: true }),
      sub:    `Across ${transactions.length} transactions`,
    },
    {
      icon:   isExpenseUp ? TrendingUp : TrendingDown,
      iconBg: isExpenseUp ? `${COLORS.danger}20` : `${COLORS.success}20`,
      label:  'Monthly Change',
      value:  formatPercent(insights.monthChange),
      sub:    'Expenses vs last month',
    },
    {
      icon:   Activity,
      iconBg: `${COLORS.secondary}20`,
      label:  'Net Balance',
      value:  formatCurrency(insights.income - insights.expenses, { compact: true }),
      sub:    'Income − Expenses',
    },
  ];

  return (
    <div className="rounded-card p-6 bg-card border border-border-subtle transition-colors duration-300">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-text-primary">Insights</h2>
        <p className="text-xs mt-0.5 text-text-muted">Financial health summary</p>
      </div>

      {rows.map((row, i) => (
        <InsightRow key={row.label} {...row} index={i} />
      ))}
    </div>
  );
}

export default InsightsPanel;
