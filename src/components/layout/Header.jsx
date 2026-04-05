import React, { useRef, useEffect } from 'react';
import { Plus, Shield, Eye, Menu } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import ExportMenu from '../ui/ExportMenu';
import { formatHeaderDate } from '../../utils/formatters';
import { COLORS } from '../../constants/colors';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  analytics: 'Analytics',
  wallet: 'Wallet',
};

function Header({ onMenuClick, onAddTransaction }) {
  const page = useStore((s) => s.page);
  const role = useStore((s) => s.role);
  const titleRef = useRef(null);
  const prevPage = useRef(page);

  useEffect(() => {
    if (!titleRef.current || prevPage.current === page) return;
    prevPage.current = page;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
    );
  }, [page]);

  return (
    <header className="sticky top-0 z-[300] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 bg-surface border-b border-border-subtle transition-colors duration-300 w-full overflow-hidden">

      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-colors bg-surface border border-border-subtle text-text-secondary"
          aria-label="Open menu"
        >
          <Menu size={15} />
        </button>

        <div ref={titleRef} className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold leading-tight truncate text-text-primary">
            {PAGE_TITLES[page]}
          </h1>
          <p className="text-xs font-medium hidden sm:block mt-0.5 text-text-muted">
            {formatHeaderDate()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        <span
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-badge text-xs font-semibold"
          style={{
            background: `${COLORS.primary}15`,
            color: COLORS.primary,
            border: `1px solid ${COLORS.primary}30`,
          }}
        >
          {role === 'admin'
            ? <><Shield size={11} strokeWidth={2.5} /> Admin</>
            : <><Eye size={11} strokeWidth={2.5} /> Viewer</>
          }
        </span>

        <ExportMenu />

        {role === 'admin' && (
          <button
            onClick={onAddTransaction}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-btn text-xs sm:text-sm font-semibold transition-all duration-200 hover:brightness-110 active:brightness-95 flex-shrink-0"
            style={{
              background: COLORS.primary,
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>

    </header>
  );
}

export default Header;