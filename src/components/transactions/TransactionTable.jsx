import React, { useMemo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Receipt, Search } from 'lucide-react';
import useStore from '../../store/useStore';
import useDebounce from '../../hooks/useDebounce';
import TransactionFilters from './TransactionFilters';
import TransactionRow from './TransactionRow';
import EmptyState from '../ui/EmptyState';
import { COLORS } from '../../constants/color';

function TransactionTable() {
  const transactions = useStore((s) => s.transactions);
  const filters      = useStore((s) => s.filters);
  const setFilter    = useStore((s) => s.setFilter);
  const role         = useStore((s) => s.role);
  const listRef      = useRef(null);

  const clearFilters = () => {
    setFilter('search', '');
    setFilter('category', 'all');
    setFilter('type', 'all');
    setFilter('sort', 'date');
  };

  const debouncedSearch = useDebounce(filters.search, 280);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) => t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== 'all')     result = result.filter((t) => t.type === filters.type);
    if (filters.category !== 'all') result = result.filter((t) => t.category === filters.category);

    if (filters.sort === 'amount') {
      result.sort((a, b) => b.amount - a.amount);
    } else {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [transactions, debouncedSearch, filters.type, filters.category, filters.sort]);

  useEffect(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll('[data-tx-row]');
    if (!rows.length) return;
    gsap.fromTo(
      rows,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power3.out' }
    );
  }, [filtered]);

  const hasNoResults      = filtered.length === 0 && transactions.length > 0;
  const hasNoTransactions = transactions.length === 0;

  return (
    <div className="rounded-card p-4 sm:p-6 bg-card border border-border-subtle transition-colors duration-300 overflow-x-hidden w-full">
      <div className="mb-5">
        <h2 className="text-base font-bold text-text-primary">All Transactions</h2>
        <p className="text-xs mt-0.5 text-text-muted">
          Manage and filter your transaction history
        </p>
      </div>

      <TransactionFilters />

      <p className="text-xs mt-3 mb-4 text-text-muted">
        {filtered.length} of {transactions.length} transaction
        {transactions.length !== 1 ? 's' : ''}
      </p>

      {hasNoTransactions ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          subtitle="Your transaction history will appear here once you start adding entries."
          action={
            role === 'admin' ? (
              <span className="text-xs text-text-muted">
                Use the{' '}
                <span style={{ color: COLORS.primary }} className="font-semibold">+ Add</span>
                {' '}button above to get started.
              </span>
            ) : (
              <span className="text-xs text-text-muted">
                Contact an admin to add transactions.
              </span>
            )
          }
        />
      ) : hasNoResults ? (
        <EmptyState
          icon={Search}
          title="No results found"
          subtitle="Try a different search term or clear your filters."
          action={
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-btn text-sm font-semibold transition-colors"
              style={{
                background: `${COLORS.primary}15`,
                color: COLORS.primary,
                border: `1px solid ${COLORS.primary}30`,
              }}
            >
              Clear Filters
            </button>
          }
        />
      ) : (
        <div ref={listRef} className="flex flex-col gap-2">
          {filtered.map((tx) => (
            <div key={tx.id} data-tx-row="">
              <TransactionRow transaction={tx} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionTable;