import React, { useRef, useEffect, useMemo, useState } from 'react';
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

const INITIAL_LIMIT = 6;
const LOAD_STEP = 5;

function DashboardPage() {
  const transactions = useStore((s) => s.transactions);
  const isLoading = useStore((s) => s.isLoading);
  const containerRef = useRef(null);

  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  const metrics = useMemo(
    () => getStatCardMetrics(transactions),
    [transactions]
  );

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions]
  );

  const recentTransactions = useMemo(
    () => sortedTransactions.slice(0, visibleCount),
    [sortedTransactions, visibleCount]
  );

  const hasMore = visibleCount < sortedTransactions.length;

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
        <div data-animate=""><StatCard icon={Wallet} label="Total Balance" value={metrics.balance} change={metrics.balanceChange} /></div>
        <div data-animate=""><StatCard icon={TrendingUp} label="This Month Income" value={metrics.income} change={metrics.incomeChange} /></div>
        <div data-animate=""><StatCard icon={TrendingDown} label="This Month Expenses" value={metrics.expenses} change={-metrics.expenseChange} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div data-animate className="h-full"><RevenueChart /></div>
        <div data-animate className="h-full"><CategoryChart /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch auto-rows-[552px]">

        <div data-animate className="lg:col-span-2 h-full">
          <div className="h-full flex flex-col rounded-card p-6 bg-card border border-border-subtle transition-colors duration-300">
            
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Recent Transactions
                </h2>
                <p className="text-xs mt-0.5 text-text-muted">
                  Showing {recentTransactions.length} of {sortedTransactions.length}
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
              <>
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
                  {recentTransactions.map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} />
                  ))}
                </div>

                {hasMore && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + LOAD_STEP)}
                    className="mt-4 py-2 text-xs font-medium rounded-lg border border-border-subtle hover:bg-surface transition"
                  >
                    Load More
                  </button>
                )}
              </>
            )}

          </div>
        </div>

        <div data-animate className="h-full">
          <InsightsPanel />
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;