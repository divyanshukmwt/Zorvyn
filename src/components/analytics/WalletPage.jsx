import React, { useMemo, useEffect, useState } from 'react';
import {
  CreditCard, Building2, Smartphone, Plus,
  TrendingUp, TrendingDown, DollarSign
} from 'lucide-react';
import useStore from '../../store/useStore';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';
import {
  getTotalIncome,
  getTotalExpenses,
  getNetBalance,
  getSavingsRate,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../constants/colors';

const PLACEHOLDER_ACCOUNTS = [
  { icon: Building2,   label: 'Bank Account', sub: 'Connect your savings account', color: COLORS.primary },
  { icon: CreditCard,  label: 'Credit Card',  sub: 'Track spending & rewards',      color: COLORS.secondary },
  { icon: Smartphone,  label: 'UPI / Wallet', sub: 'GPay, PhonePe, Paytm',          color: COLORS.warning },
];

function WalletPage() {
  const transactions = useStore((s) => s.transactions);

  const { balance, income, expenses, savingsRate, incomeRatio } = useMemo(() => {
    const inc   = getTotalIncome(transactions);
    const exp   = getTotalExpenses(transactions);
    const bal   = getNetBalance(transactions);
    const rate  = getSavingsRate(transactions);
    const ratio = inc > 0 ? (inc / (inc + exp)) * 100 : 50;
    return { balance: bal, income: inc, expenses: exp, savingsRate: rate, incomeRatio: ratio };
  }, [transactions]);

  const animatedBalance = useAnimatedCounter(balance);

  const [animatedRatio, setAnimatedRatio] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimatedRatio(incomeRatio), 150);
    return () => clearTimeout(t);
  }, [incomeRatio]);

  return (
    <div className="space-y-6">

      {/* Balance Card */}
      <div
        className="rounded-card p-8 relative overflow-hidden border border-border-subtle"
        style={{
          background: `linear-gradient(to bottom right, ${COLORS.primary}10, var(--ff-card), ${COLORS.secondary}10)`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: COLORS.primary, opacity: 0.05 }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: COLORS.secondary, opacity: 0.05 }}
        />

        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-text-muted">
          Total Balance
        </p>
        <p className="text-5xl font-bold font-mono mb-1 text-text-primary">
          {formatCurrency(animatedBalance)}
        </p>
        <p className="text-sm text-text-muted">
          Savings rate:{' '}
          <span style={{ color: savingsRate >= 0 ? COLORS.success : COLORS.danger, fontWeight: 600 }}>
            {savingsRate.toFixed(1)}%
          </span>
        </p>
      </div>

      {/* Ratio Card */}
      <div className="rounded-card p-6 bg-card border border-border-subtle">
        <h2 className="text-sm font-semibold mb-5 text-text-primary">Income vs Expense Ratio</h2>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${COLORS.success}20` }}
            >
              <TrendingUp size={14} style={{ color: COLORS.success }} />
            </div>
            <div>
              <p className="text-[11px] text-text-muted">Total Income</p>
              <p className="text-sm font-bold font-mono" style={{ color: COLORS.success }}>
                {formatCurrency(income, { compact: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <p className="text-[11px] text-right text-text-muted">Total Expenses</p>
              <p className="text-sm font-bold font-mono text-right" style={{ color: COLORS.danger }}>
                {formatCurrency(expenses, { compact: true })}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${COLORS.danger}20` }}
            >
              <TrendingDown size={14} style={{ color: COLORS.danger }} />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `${COLORS.danger}25` }}
          />
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${Math.max(4, animatedRatio)}%`,
              background: `linear-gradient(to right, ${COLORS.success}, ${COLORS.success}cc)`,
              boxShadow: `0 0 10px ${COLORS.success}40`,
            }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span style={{ color: COLORS.success }} className="text-[11px] font-medium">
            {incomeRatio.toFixed(0)}% income
          </span>
          <span style={{ color: COLORS.danger }} className="text-[11px] font-medium">
            {(100 - incomeRatio).toFixed(0)}% expenses
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-card p-5 bg-card border border-border-subtle">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ background: `${COLORS.primary}20` }}
          >
            <DollarSign size={15} style={{ color: COLORS.primary }} />
          </div>
          <p className="text-[11px] text-text-muted">Net Savings</p>
          <p
            className="text-xl font-bold font-mono mt-1"
            style={{ color: balance >= 0 ? COLORS.success : COLORS.danger }}
          >
            {formatCurrency(balance, { compact: true })}
          </p>
        </div>

        <div className="rounded-card p-5 bg-card border border-border-subtle">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ background: `${COLORS.secondary}20` }}
          >
            <TrendingUp size={15} style={{ color: COLORS.secondary }} />
          </div>
          <p className="text-[11px] text-text-muted">Savings Rate</p>
          <p
            className="text-xl font-bold font-mono mt-1"
            style={{
              color: savingsRate >= 30
                ? COLORS.success
                : savingsRate >= 10
                ? COLORS.warning
                : COLORS.danger,
            }}
          >
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Accounts */}
      <div className="rounded-card p-6 bg-card border border-border-subtle">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Connected Accounts</h2>
            <p className="text-xs mt-0.5 text-text-muted">Link your bank accounts & wallets</p>
          </div>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full"
            style={{
              background: `${COLORS.secondary}20`,
              color: COLORS.secondary,
              border: `1px solid ${COLORS.secondary}40`,
            }}
          >
            Coming Soon
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {PLACEHOLDER_ACCOUNTS.map((acct) => {
            const Icon = acct.icon;
            return (
              <div
                key={acct.label}
                className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border-subtle"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface"
                >
                  <Icon size={17} style={{ color: acct.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-text-primary">{acct.label}</p>
                  <p className="text-xs text-text-muted">{acct.sub}</p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center border border-border-subtle text-text-muted">
                  <Plus size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default WalletPage;
