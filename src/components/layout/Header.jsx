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
    <header
      className="
        sticky top-0 z-40
        px-6 lg:px-8 py-4
        flex items-center justify-between gap-4
        transition-colors duration-300
      "
      style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textSecondary
          }}
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>

        <div ref={titleRef} className="min-w-0">
          <h1
            className="text-lg font-bold leading-tight truncate"
            style={{ color: COLORS.textPrimary }}
          >
            {PAGE_TITLES[page]}
          </h1>
          <p
            className="text-xs font-medium hidden sm:block mt-0.5"
            style={{ color: COLORS.textMuted }}
          >
            {formatHeaderDate()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-badge text-xs font-semibold"
          style={{
            background: `${COLORS.primary}15`,
            color: COLORS.primary,
            border: `1px solid ${COLORS.primary}30`
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
            className="
              flex items-center gap-2 px-3.5 py-2 rounded-btn
              text-sm font-semibold
              hover:opacity-90 active:opacity-80
              transition-all duration-200
              shadow-glow
            "
            style={{
              background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`,
              color: COLORS.bg
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;