import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Braces, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { exportCSV, exportJSON } from '../../utils/exportData';
import { COLORS } from '../../constants/colors';

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
        className="flex items-center gap-2 px-3.5 py-2 rounded-btn text-sm font-medium transition-all duration-200"
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          color: COLORS.textSecondary
        }}
      >
        <Download size={14} />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-[calc(100%+8px)] rounded-xl overflow-hidden min-w-[160px] z-50"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}
        >
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors"
            style={{
              color: COLORS.textSecondary
            }}
          >
            <FileText size={14} style={{ color: COLORS.primary }} />
            Export CSV
          </button>

          <div
            className="h-px mx-3"
            style={{ background: COLORS.border }}
          />

          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors"
            style={{
              color: COLORS.textSecondary
            }}
          >
            <Braces size={14} style={{ color: COLORS.secondary }} />
            Export JSON
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportMenu;