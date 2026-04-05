import React, { useRef } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, BarChart2,
  Wallet, Shield, Eye, Sun, Moon
} from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { COLORS } from '../../constants/colors';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'transactions',  label: 'Transactions',  icon: ArrowLeftRight },
  { id: 'analytics',     label: 'Analytics',     icon: BarChart2 },
  { id: 'wallet',        label: 'Wallet',        icon: Wallet },
];

function NavItem({ item, isActive, onClick }) {
  const ref = useRef(null);
  const Icon = item.icon;

  const handleMouseEnter = () => {
    gsap.to(ref.current, { x: 3, duration: 0.2, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, { x: 0, duration: 0.2, ease: 'power2.out' });
  };

  return (
    <button
      ref={ref}
      onClick={() => onClick(item.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-sm font-medium transition-colors duration-200 text-left
      "
      style={{
        background: isActive
          ? `linear-gradient(to right, ${COLORS.primary}15, ${COLORS.secondary}15)`
          : 'transparent',
        color: isActive ? COLORS.primary : COLORS.textSecondary
      }}
    >
      {isActive && (
        <span
          className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
          style={{ background: COLORS.primary }}
        />
      )}

      <Icon size={17} strokeWidth={isActive ? 2 : 1.75} className="flex-shrink-0" />
      <span>{item.label}</span>
    </button>
  );
}

function Sidebar() {
  const page = useStore((s) => s.page);
  const role = useStore((s) => s.role);
  const theme = useStore((s) => s.theme);
  const setPage = useStore((s) => s.setPage);
  const setRole = useStore((s) => s.setRole);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <aside
      className="
        hidden lg:flex flex-col
        w-[230px] min-h-screen fixed left-0 top-0 bottom-0 z-50
        px-4 py-6
        transition-colors duration-300
      "
      style={{
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`
      }}
    >
      <div className="flex items-center mb-9 px-1">
        <img
          src="https://companyasset.blob.core.windows.net/assets/zorvynfulllogolight.png"
          alt="Logo"
          className="h-8 object-contain"
        />
      </div>

      <p
        className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
        style={{ color: COLORS.textMuted }}
      >
        Navigation
      </p>

      <nav className="flex flex-col gap-1 mb-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={page === item.id}
            onClick={setPage}
          />
        ))}
      </nav>

      <div
        className="mt-6 pt-5"
        style={{ borderTop: `1px solid ${COLORS.border}` }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: COLORS.textMuted }}
        >
          Access Role
        </p>

        <div className="flex gap-1.5">
          <button
            onClick={() => setRole('admin')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-semibold border transition-all duration-200"
            style={{
              background: role === 'admin'
                ? `linear-gradient(to right, ${COLORS.primary}20, ${COLORS.secondary}20)`
                : 'transparent',
              border: role === 'admin'
                ? `1px solid ${COLORS.primary}40`
                : `1px solid ${COLORS.border}`,
              color: role === 'admin' ? COLORS.primary : COLORS.textMuted
            }}
          >
            <Shield size={11} strokeWidth={2.5} />
            Admin
          </button>

          <button
            onClick={() => setRole('viewer')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-semibold border transition-all duration-200"
            style={{
              background: role === 'viewer'
                ? `linear-gradient(to right, ${COLORS.primary}20, ${COLORS.secondary}20)`
                : 'transparent',
              border: role === 'viewer'
                ? `1px solid ${COLORS.primary}40`
                : `1px solid ${COLORS.border}`,
              color: role === 'viewer' ? COLORS.primary : COLORS.textMuted
            }}
          >
            <Eye size={11} strokeWidth={2.5} />
            Viewer
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="
            w-full mt-3 flex items-center justify-center gap-2
            py-2.5 rounded-xl text-xs font-medium transition-all duration-200
          "
          style={{
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textMuted
          }}
        >
          {theme === 'dark'
            ? <><Sun size={13} /> Light Mode</>
            : <><Moon size={13} /> Dark Mode</>
          }
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;