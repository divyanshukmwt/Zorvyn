import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { CATEGORY_NAMES } from '../../data/mockData';
import { COLORS } from '../../constants/color';

function CustomDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  useEffect(() => {
    if (!listRef.current) return;
    if (open) {
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: -6, scaleY: 0.95 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.18, ease: 'power3.out', transformOrigin: 'top' }
      );
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-input text-sm bg-card border border-border-subtle text-text-primary transition-colors duration-200"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={13}
          className={`flex-shrink-0 transition-transform duration-200 text-text-muted ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] rounded-xl overflow-hidden bg-card border border-border-subtle"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="w-full flex items-center px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/[0.05]"
                style={{
                  color: isSelected ? COLORS.primary : undefined,
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {opt.label}
                {isSelected && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: COLORS.primary }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const TYPE_OPTIONS = [
  { value: 'all',     label: 'All Types' },
  { value: 'income',  label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const SORT_OPTIONS = [
  { value: 'date',   label: 'Sort: Newest' },
  { value: 'amount', label: 'Sort: Amount' },
];

function TransactionFilters() {
  const filters   = useStore((s) => s.filters);
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

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORY_NAMES.map((cat) => ({ value: cat, label: cat })),
  ];

  const inputClass =
    'bg-card border border-border-subtle text-text-primary placeholder:text-text-muted ' +
    'focus:outline-none focus:border-accent-primary/50 transition-colors duration-200';

  return (
    <div className="flex flex-col gap-2">

      <div className="relative w-full">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
        />
        <input
          type="text"
          placeholder="Search transactions…"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className={`w-full pl-9 pr-4 py-2.5 rounded-input text-[16px] sm:text-sm ${inputClass}`}
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-text-muted"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <CustomDropdown
          value={filters.type}
          onChange={(val) => setFilter('type', val)}
          options={TYPE_OPTIONS}
          placeholder="All Types"
        />
        <CustomDropdown
          value={filters.category}
          onChange={(val) => setFilter('category', val)}
          options={categoryOptions}
          placeholder="All Categories"
        />
      </div>

      <div className="flex gap-2 items-center">
        <CustomDropdown
          value={filters.sort}
          onChange={(val) => setFilter('sort', val)}
          options={SORT_OPTIONS}
          placeholder="Sort: Newest"
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-input text-sm font-medium transition-colors flex-shrink-0"
            style={{
              color: COLORS.danger,
              background: `${COLORS.danger}15`,
              border: `1px solid ${COLORS.danger}30`,
            }}
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

    </div>
  );
}

export default TransactionFilters;