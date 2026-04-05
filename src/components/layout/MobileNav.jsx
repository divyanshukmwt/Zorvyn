import React, { useRef, useEffect } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, BarChart2, Wallet,
  Shield, Eye, Sun, Moon, X
} from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { COLORS } from '../../constants/colors';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Home',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Txns',    icon: ArrowLeftRight },
  { id: 'analytics',    label: 'Charts',  icon: BarChart2 },
  { id: 'wallet',       label: 'Wallet',  icon: Wallet },
];

function MobileDrawer({ open, onClose }) {
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);
  const role = useStore((s) => s.role);
  const theme = useStore((s) => s.theme);
  const page = useStore((s) => s.page);
  const setPage = useStore((s) => s.setPage);
  const setRole = useStore((s) => s.setRole);
  const toggleTheme = useStore((s) => s.toggleTheme);

  useEffect(() => {
    if (!drawerRef.current || !backdropRef.current) return;

    if (open) {
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.fromTo(
        drawerRef.current,
        { x: '-100%' },
        { x: '0%', duration: 0.3, ease: 'power3.out' }
      );
    } else {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(drawerRef.current, { x: '-100%', duration: 0.25, ease: 'power3.in' });
    }
  }, [open]);

  const navigate = (id) => {
    setPage(id);
    onClose();
  };

  if (!open && drawerRef.current?.style.transform === 'translateX(-100%)') return null;

  return (
    <div className="fixed inset-0 z-[200] lg:hidden" style={{ pointerEvents: open ? 'auto' : 'none' }}>
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ opacity: 0, background: COLORS.overlay }}
      />

      <aside
        ref={drawerRef}
        className="absolute left-0 top-0 bottom-0 w-64 flex flex-col p-5"
        style={{
          transform: 'translateX(-100%)',
          background: COLORS.surface,
          borderRight: `1px solid ${COLORS.border}`
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <img
            src="https://companyasset.blob.core.windows.net/assets/zorvynfulllogolight.png"
            alt="Logo"
            className="h-8 object-contain"
          />

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: COLORS.surface,
              color: COLORS.textSecondary
            }}
          >
            <X size={15} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 mb-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: isActive
                    ? `linear-gradient(to right, ${COLORS.primary}15, ${COLORS.secondary}15)`
                    : 'transparent',
                  color: isActive ? COLORS.primary : COLORS.textSecondary
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.75} />
                {item.label}
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: COLORS.primary }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div
          className="mt-6 pt-5 flex flex-col gap-2"
          style={{ borderTop: `1px solid ${COLORS.border}` }}
        >
          <div className="flex gap-1.5">
            {['admin', 'viewer'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-semibold border transition-all"
                style={{
                  background: role === r ? `${COLORS.primary}15` : 'transparent',
                  border: role === r
                    ? `1px solid ${COLORS.primary}30`
                    : `1px solid ${COLORS.border}`,
                  color: role === r ? COLORS.primary : COLORS.textMuted
                }}
              >
                {r === 'admin' ? <Shield size={10} /> : <Eye size={10} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium"
            style={{
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textMuted
            }}
          >
            {theme === 'dark'
              ? <><Sun size={12} /> Light Mode</>
              : <><Moon size={12} /> Dark Mode</>
            }
          </button>
        </div>
      </aside>
    </div>
  );
}

function MobileNav({ onMenuClick }) {
  const page = useStore((s) => s.page);
  const setPage = useStore((s) => s.setPage);

  return (
    <nav
      className="
        lg:hidden fixed bottom-0 left-0 right-0 z-50
        flex pb-safe
      "
      style={{
        background: COLORS.surface,
        borderTop: `1px solid ${COLORS.border}`
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold transition-colors"
            style={{
              color: isActive ? COLORS.primary : COLORS.textMuted
            }}
          >
            <Icon
              size={19}
              strokeWidth={isActive ? 2.25 : 1.75}
              style={{ color: isActive ? COLORS.primary : COLORS.textMuted }}
            />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export { MobileDrawer };
export default MobileNav;