import React, { useMemo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import useDebounce from '../../hooks/useDebounce';
import TransactionFilters from './TransactionFilters';
import TransactionRow from './TransactionRow';
import EmptyState from '../ui/EmptyState';

function TransactionTable() {
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);
  const role = useStore((s) => s.role);
  const listRef = useRef(null);

  const clearFilters = () => {
    setFilter('search', '');
    setFilter('category', 'all');
    setFilter('type', 'all');
    setFilter('sort', 'date');
  };

  const debouncedSearch = useDebounce(filters.search, 280);

  const filtered = useMemo(() => {
    let result = [...transactions];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Type
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // Sort
    if (filters.sort === 'amount') {
      result.sort((a, b) => b.amount - a.amount);
    } else {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [transactions, debouncedSearch, filters.type, filters.category, filters.sort]);

  // Stagger animate rows when filtered list changes
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

  const hasNoResults = filtered.length === 0 && transactions.length > 0;
  const hasNoTransactions = transactions.length === 0;

  return (
    <div className="bg-card-dark border border-white/[0.07] rounded-card p-6 transition-colors duration-300">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-200">All Transactions</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage and filter your transaction history</p>
      </div>

      <TransactionFilters />

      <p className="text-xs text-slate-500 mt-3 mb-4">
        {filtered.length} of {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </p>

      {hasNoTransactions ? (
        <EmptyState
          emoji="🧾"
          title="No transactions yet"
          subtitle="Your transaction history will appear here once you start adding entries."
          action={
            role === 'admin' ? (
              <span className="text-xs text-slate-500">
                Use the <span className="text-accent-teal font-semibold">+ Add</span> button above to get started.
              </span>
            ) : (
              <span className="text-xs text-slate-500">Contact an admin to add transactions.</span>
            )
          }
        />
      ) : hasNoResults ? (
        <EmptyState
          emoji="🔍"
          title="No results found"
          subtitle="Try a different search term or clear your filters."
          action={
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-btn text-sm font-semibold bg-accent-teal/10 text-accent-teal border border-accent-teal/20 hover:bg-accent-teal/15 transition-colors"
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
