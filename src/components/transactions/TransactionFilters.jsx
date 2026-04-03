import React from 'react';
import { Search, X } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORY_NAMES } from '../../data/mockData';

function TransactionFilters() {
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.type !== 'all';

  const clearFilters = () => {
    setFilter('search', '');
    setFilter('category', 'all');
    setFilter('type', 'all');
    setFilter('sort', 'date');
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search transactions…"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="
            w-full pl-9 pr-4 py-2.5 rounded-input
            bg-card-dark border border-white/[0.07]
            text-sm text-slate-200 placeholder-slate-600
            focus:border-accent-teal/50 focus:outline-none
            transition-colors duration-200
          "
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Type filter */}
      <select
        value={filters.type}
        onChange={(e) => setFilter('type', e.target.value)}
        className="
          px-3.5 py-2.5 rounded-input
          bg-card-dark border border-white/[0.07]
          text-sm text-slate-300
          focus:border-accent-teal/50 focus:outline-none
          transition-colors duration-200 cursor-pointer
        "
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category filter */}
      <select
        value={filters.category}
        onChange={(e) => setFilter('category', e.target.value)}
        className="
          px-3.5 py-2.5 rounded-input
          bg-card-dark border border-white/[0.07]
          text-sm text-slate-300
          focus:border-accent-teal/50 focus:outline-none
          transition-colors duration-200 cursor-pointer
        "
      >
        <option value="all">All Categories</option>
        {CATEGORY_NAMES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sort}
        onChange={(e) => setFilter('sort', e.target.value)}
        className="
          px-3.5 py-2.5 rounded-input
          bg-card-dark border border-white/[0.07]
          text-sm text-slate-300
          focus:border-accent-teal/50 focus:outline-none
          transition-colors duration-200 cursor-pointer
        "
      >
        <option value="date">Sort: Newest</option>
        <option value="amount">Sort: Amount</option>
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="
            flex items-center gap-1.5 px-3.5 py-2.5 rounded-input
            text-sm font-medium text-danger
            bg-danger/10 border border-danger/20
            hover:bg-danger/15 transition-colors
          "
        >
          <X size={13} />
          Clear
        </button>
      )}
    </div>
  );
}

export default TransactionFilters;
