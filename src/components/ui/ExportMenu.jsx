import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Braces, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { exportCSV, exportJSON } from '../../utils/exportData';

function ExportMenu() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const transactions = useStore((s) => s.transactions);
  const addToast = useStore((s) => s.addToast);

  useEffect(() => {
    if (!dropdownRef.current) return;
    if (open) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -6, scaleY: 0.95 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.18, ease: 'power3.out', transformOrigin: 'top' }
      );
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.parentElement.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleExport = (type) => {
    if (transactions.length === 0) {
      addToast({ msg: 'No transactions to export.', kind: 'warning' });
      setOpen(false);
      return;
    }

    if (type === 'csv') {
      exportCSV(transactions);
      addToast({ msg: 'Exported as CSV successfully.', kind: 'success' });
    } else {
      exportJSON(transactions);
      addToast({ msg: 'Exported as JSON successfully.', kind: 'success' });
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="
          flex items-center gap-2 px-3.5 py-2 rounded-btn
          bg-surface-dark border border-white/[0.08]
          text-slate-300 hover:text-slate-100 hover:border-white/[0.15]
          text-sm font-medium transition-all duration-200
        "
      >
        <Download size={14} />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="
            absolute right-0 top-[calc(100%+8px)]
            bg-card-dark border border-white/[0.08] rounded-xl
            overflow-hidden min-w-[160px] z-50
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          "
        >
          <button
            onClick={() => handleExport('csv')}
            className="
              w-full flex items-center gap-3 px-4 py-3
              text-sm font-medium text-slate-300 hover:text-slate-100
              hover:bg-surface-dark transition-colors text-left
            "
          >
            <FileText size={14} className="text-accent-teal" />
            Export CSV
          </button>
          <div className="h-px bg-white/[0.05] mx-3" />
          <button
            onClick={() => handleExport('json')}
            className="
              w-full flex items-center gap-3 px-4 py-3
              text-sm font-medium text-slate-300 hover:text-slate-100
              hover:bg-surface-dark transition-colors text-left
            "
          >
            <Braces size={14} className="text-accent-indigo" />
            Export JSON
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportMenu;
