import React, { useRef } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, BarChart2,
  Wallet, Shield, Eye, Sun, Moon, Zap,
} from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'transactions',  label: 'Transactions',  icon: ArrowLeftRight },
  { id: 'analytics',     label: 'Analytics',     icon: BarChart2 },
  { id: 'wallet',        label: 'Wallet',         icon: Wallet },
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
      className={`
        relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-sm font-medium transition-colors duration-200 text-left
        ${isActive
          ? 'bg-gradient-to-r from-accent-teal/10 to-accent-indigo/10 text-accent-teal'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }
      `}
    >
      {isActive && (
        <span className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent-teal rounded-full" />
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
    <aside className="
      hidden lg:flex flex-col
      w-[230px] min-h-screen fixed left-0 top-0 bottom-0 z-50
      bg-surface-dark border-r border-white/[0.06]
      px-4 py-6
      transition-colors duration-300
    ">
      <div className="flex items-center gap-2.5 mb-9 px-1">
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center flex-shrink-0">
          <Zap size={15} className="text-bg-dark" strokeWidth={2.5} />
        </div>
        <span className="text-[17px] font-bold bg-gradient-to-r from-accent-teal to-accent-indigo bg-clip-text text-transparent">
          Zorvyn
        </span>
      </div>

      <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">
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

      <div className="mt-6 pt-5 border-t border-white/[0.06]">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">
          Access Role
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={() => setRole('admin')}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              py-2 rounded-[10px] text-xs font-semibold
              border transition-all duration-200
              ${role === 'admin'
                ? 'bg-gradient-to-r from-accent-teal/15 to-accent-indigo/15 border-accent-teal/40 text-accent-teal'
                : 'bg-transparent border-white/[0.07] text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <Shield size={11} strokeWidth={2.5} />
            Admin
          </button>
          <button
            onClick={() => setRole('viewer')}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              py-2 rounded-[10px] text-xs font-semibold
              border transition-all duration-200
              ${role === 'viewer'
                ? 'bg-gradient-to-r from-accent-teal/15 to-accent-indigo/15 border-accent-teal/40 text-accent-teal'
                : 'bg-transparent border-white/[0.07] text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <Eye size={11} strokeWidth={2.5} />
            Viewer
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="
            w-full mt-3 flex items-center justify-center gap-2
            py-2.5 rounded-xl bg-bg-dark border border-white/[0.06]
            text-slate-500 hover:text-slate-300 hover:border-white/[0.12]
            text-xs font-medium transition-all duration-200
          "
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
