import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import useStore from '../../store/useStore';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import CategoryChart from './CategoryChart';
import InsightsPanel from '../insights/InsightsPanel';
import TransactionRow from '../transactions/TransactionRow';
import EmptyState from '../ui/EmptyState';
import SkeletonCard, { SkeletonChartCard } from '../ui/SkeletonCard';
import { getStatCardMetrics } from '../../utils/calculations';
import { COLORS } from '../../constants/colors';

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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div data-animate=""><StatCard icon={Wallet} label="Total Balance" value={metrics.balance} change={metrics.balanceChange} /></div>
        <div data-animate=""><StatCard icon={TrendingUp} label="This Month Income" value={metrics.income} change={metrics.incomeChange} /></div>
        <div data-animate=""><StatCard icon={TrendingDown} label="This Month Expenses" value={metrics.expenses} change={-metrics.expenseChange} /></div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div data-animate className="h-full">
          <RevenueChart />
        </div>
        <div data-animate className="h-full">
          <CategoryChart />
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch auto-rows-[552px]">

        {/* Recent Transactions */}
        <div data-animate className="lg:col-span-2 h-full">
          <div
            className="h-full flex flex-col rounded-card p-6 transition-colors duration-300"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                  Recent Transactions
                </h2>
                <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
                  Last {RECENT_TX_LIMIT} entries
                </p>
              </div>
            </div>

            {recentTransactions.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No transactions yet"
                subtitle="Your recent activity will show up here."
              />
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
                {recentTransactions.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div data-animate className="h-full">
          <InsightsPanel />
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;