import React, { useMemo } from 'react';
import { CreditCard, Building2, Smartphone, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import useStore from '../../store/useStore';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';
import {
  getTotalIncome,
  getTotalExpenses,
  getNetBalance,
  getSavingsRate,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const PLACEHOLDER_ACCOUNTS = [
  { icon: Building2, label: 'Bank Account', sub: 'Connect your savings account', color: 'text-accent-teal' },
  { icon: CreditCard, label: 'Credit Card',  sub: 'Track spending & rewards',    color: 'text-accent-indigo' },
  { icon: Smartphone, label: 'UPI / Wallet', sub: 'GPay, PhonePe, Paytm',        color: 'text-warning' },
];

function WalletPage() {
  const transactions = useStore((s) => s.transactions);

  const { balance, income, expenses, savingsRate, incomeRatio } = useMemo(() => {
    const inc = getTotalIncome(transactions);
    const exp = getTotalExpenses(transactions);
    const bal = getNetBalance(transactions);
    const rate = getSavingsRate(transactions);
    const ratio = inc > 0 ? (inc / (inc + exp)) * 100 : 50;
    return { balance: bal, income: inc, expenses: exp, savingsRate: rate, incomeRatio: ratio };
  }, [transactions]);

  const animatedBalance = useAnimatedCounter(balance);

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-br from-accent-teal/10 via-card-dark to-accent-indigo/10 border border-white/[0.09] rounded-card p-8 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent-teal/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent-indigo/5 blur-3xl pointer-events-none" />

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Total Balance
        </p>
        <p className="text-5xl font-bold font-mono text-slate-100 mb-1">
          {formatCurrency(animatedBalance)}
        </p>
        <p className="text-sm text-slate-500">
          Savings rate:{' '}
          <span className={`font-semibold ${savingsRate >= 0 ? 'text-success' : 'text-danger'}`}>
            {savingsRate.toFixed(1)}%
          </span>
        </p>
      </div>


      <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-5">Income vs Expense Ratio</h2>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center">
              <TrendingUp size={14} className="text-success" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Total Income</p>
              <p className="text-sm font-bold font-mono text-success">
                {formatCurrency(income, { compact: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[11px] text-slate-500 font-medium text-right">Total Expenses</p>
              <p className="text-sm font-bold font-mono text-danger text-right">
                {formatCurrency(expenses, { compact: true })}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-danger/15 flex items-center justify-center">
              <TrendingDown size={14} className="text-danger" />
            </div>
          </div>
        </div>


        <div className="h-3 rounded-full bg-danger/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-success to-accent-teal transition-all duration-1000 ease-out"
            style={{ width: `${Math.max(5, Math.min(95, incomeRatio))}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-success font-medium">{incomeRatio.toFixed(0)}% income</span>
          <span className="text-[11px] text-danger font-medium">{(100 - incomeRatio).toFixed(0)}% expenses</span>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-dark border border-white/[0.07] rounded-card p-5">
          <div className="w-9 h-9 rounded-xl bg-accent-teal/15 flex items-center justify-center mb-3">
            <DollarSign size={15} className="text-accent-teal" />
          </div>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Net Savings</p>
          <p className={`text-xl font-bold font-mono mt-1 ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(balance, { compact: true })}
          </p>
        </div>
        <div className="bg-card-dark border border-white/[0.07] rounded-card p-5">
          <div className="w-9 h-9 rounded-xl bg-accent-indigo/15 flex items-center justify-center mb-3">
            <TrendingUp size={15} className="text-accent-indigo" />
          </div>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Savings Rate</p>
          <p className={`text-xl font-bold font-mono mt-1 ${savingsRate >= 30 ? 'text-success' : savingsRate >= 10 ? 'text-warning' : 'text-danger'}`}>
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>


      <div className="bg-card-dark border border-white/[0.07] rounded-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Connected Accounts</h2>
            <p className="text-xs text-slate-500 mt-0.5">Link your bank accounts & wallets</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent-indigo/15 text-accent-indigo border border-accent-indigo/25">
            Coming Soon
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {PLACEHOLDER_ACCOUNTS.map((acct) => {
            const Icon = acct.icon;
            return (
              <div
                key={acct.label}
                className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/[0.08] hover:border-white/[0.14] transition-colors cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className={acct.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-300">{acct.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{acct.sub}</p>
                </div>
                <div className="w-7 h-7 rounded-full border border-white/[0.1] flex items-center justify-center text-slate-600">
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
