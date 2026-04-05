import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORY_NAMES, CATEGORIES } from '../../data/mockData';

function TransactionFilters() {
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategory =
    filters.category === 'all' ? null : CATEGORIES[filters.category];

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

      {/* Category filter (Custom Dropdown with Icons) */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2 px-3.5 py-2.5 rounded-input
            bg-card-dark border border-white/[0.07]
            text-sm text-slate-300
            focus:border-accent-teal/50 transition-colors
          "
        >
          {selectedCategory ? (
            <>
              {selectedCategory.icon && (
                <selectedCategory.icon size={16} />
              )}
              {filters.category}
            </>
          ) : (
            'All Categories'
          )}
          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="absolute mt-2 w-48 bg-card-dark border border-white/[0.07] rounded-lg shadow-lg z-50">
            <div
              onClick={() => {
                setFilter('category', 'all');
                setOpen(false);
              }}
              className="px-3 py-2 text-sm hover:bg-white/5 cursor-pointer"
            >
              All Categories
            </div>

            {CATEGORY_NAMES.map((cat) => {
              const Icon = CATEGORIES[cat].icon;

              return (
                <div
                  key={cat}
                  onClick={() => {
                    setFilter('category', cat);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 cursor-pointer"
                >
                  {Icon && <Icon size={16} />}
                  {cat}
                </div>
              );
            })}
          </div>
        )}
      </div>

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