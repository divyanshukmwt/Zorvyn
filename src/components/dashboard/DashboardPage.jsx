import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import useStore from '../../store/useStore';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import CategoryChart from './CategoryChart';
import InsightsPanel from '../insights/InsightsPanel';
import TransactionRow from '../transactions/TransactionRow';
import EmptyState from '../ui/EmptyState';
import SkeletonCard, { SkeletonChartCard } from '../ui/SkeletonCard';
import { getStatCardMetrics } from '../../utils/calculations';

const RECENT_TX_LIMIT = 8;

function DashboardPage() {
  const transactions = useStore((s) => s.transactions);
  const isLoading = useStore((s) => s.isLoading);
  const containerRef = useRef(null);

  const metrics = useMemo(
    () => getStatCardMetrics(transactions),
    [transactions]
  );

  const recentTransactions = useMemo(
    () => [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, RECENT_TX_LIMIT),
    [transactions]
  );

  useEffect(() => {
    if (!containerRef.current || isLoading) return;
    const cards = containerRef.current.querySelectorAll('[data-animate]');
    gsap.fromTo(
      cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
    );
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkeletonChartCard /><SkeletonChartCard />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div data-animate="">
          <StatCard
            icon={Wallet}
            iconBg="bg-accent-teal/15"
            iconColor="text-accent-teal"
            label="Total Balance"
            value={metrics.balance}
            change={metrics.balanceChange}
          />
        </div>
        <div data-animate="">
          <StatCard
            icon={TrendingUp}
            iconBg="bg-success/15"
            iconColor="text-success"
            label="This Month Income"
            value={metrics.income}
            change={metrics.incomeChange}
          />
        </div>
        <div data-animate="">
          <StatCard
            icon={TrendingDown}
            iconBg="bg-danger/15"
            iconColor="text-danger"
            label="This Month Expenses"
            value={metrics.expenses}
            change={-metrics.expenseChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div data-animate=""><RevenueChart /></div>
        <div data-animate=""><CategoryChart /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div data-animate="" className="lg:col-span-2">
          <div className="bg-card-dark border border-white/[0.07] rounded-card p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Recent Transactions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Last {RECENT_TX_LIMIT} entries</p>
              </div>
            </div>

            {recentTransactions.length === 0 ? (
              <EmptyState
                emoji="🧾"
                title="No transactions yet"
                subtitle="Your recent activity will show up here."
              />
            ) : (
              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                {recentTransactions.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div data-animate="">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
