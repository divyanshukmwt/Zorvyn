import React, { useRef, useEffect } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, BarChart2, Wallet,
  Shield, Eye, Sun, Moon, X
} from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { COLORS } from '../../constants/color';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Home',   icon: LayoutDashboard },
  { id: 'transactions', label: 'Txns',   icon: ArrowLeftRight },
  { id: 'analytics',    label: 'Charts', icon: BarChart2 },
  { id: 'wallet',       label: 'Wallet', icon: Wallet },
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

  const navigate = (id) => { setPage(id); onClose(); };

  if (!open && drawerRef.current?.style.transform === 'translateX(-100%)') return null;

  return (
    <div className="fixed inset-0 z-[200] lg:hidden" style={{ pointerEvents: open ? 'auto' : 'none' }}>
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm bg-overlay-light"
        style={{ opacity: 0 }}
      />

      <aside
        ref={drawerRef}
        className="absolute left-0 top-0 bottom-0 w-64 flex flex-col p-5 bg-surface border-r border-border-subtle"
        style={{ transform: 'translateX(-100%)' }}
      >
        <div className="flex items-center justify-between mb-8">
          <img
            src="https://companyasset.blob.core.windows.net/assets/zorvynfulllogolight.png"
            alt="Logo"
            className="h-8 object-contain"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-surface text-text-secondary"
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
                  color: isActive ? COLORS.primary : undefined,
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.75}
                  className={isActive ? '' : 'text-text-secondary'}
                />
                <span className={isActive ? '' : 'text-text-secondary'}>{item.label}</span>
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

        <div className="mt-6 pt-5 flex flex-col gap-2 border-t border-border-subtle">
          <div className="flex gap-1.5">
            {['admin', 'viewer'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-semibold transition-all"
                style={role === r ? {
                  background: `${COLORS.primary}15`,
                  border: `1px solid ${COLORS.primary}30`,
                  color: COLORS.primary,
                } : undefined}
                {...(role !== r ? { className: 'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-semibold border border-border-subtle text-text-muted transition-all' } : {})}
              >
                {r === 'admin' ? <Shield size={10} /> : <Eye size={10} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-bg border border-border-subtle text-text-muted"
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex pb-safe bg-surface border-t border-border-subtle">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold transition-colors"
            style={{ color: isActive ? COLORS.primary : undefined }}
          >
            <Icon
              size={19}
              strokeWidth={isActive ? 2.25 : 1.75}
              className={isActive ? '' : 'text-text-muted'}
              style={isActive ? { color: COLORS.primary } : undefined}
            />
            <span className={isActive ? '' : 'text-text-muted'}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export { MobileDrawer };
export default MobileNav;
