import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Braces, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { exportCSV, exportJSON } from '../../utils/exportData';
import { COLORS } from '../../constants/color';

function ExportMenu() {
  const [open, setOpen]       = useState(false);
  const [coords, setCoords]   = useState({ top: 0, right: 0 });
  const dropdownRef           = useRef(null);
  const triggerRef            = useRef(null);
  const transactions          = useStore((s) => s.transactions);
  const addToast              = useStore((s) => s.addToast);

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  const handleToggle = () => {
    updateCoords();
    setOpen((p) => !p);
  };

  useEffect(() => {
    if (!dropdownRef.current || !open) return;
    gsap.fromTo(
      dropdownRef.current,
      { opacity: 0, y: -6, scaleY: 0.95 },
      { opacity: 1, y: 0, scaleY: 1, duration: 0.18, ease: 'power3.out', transformOrigin: 'top' }
    );
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (open) updateCoords(); };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [open]);

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
    <>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="flex items-center gap-2 px-3.5 py-2 rounded-btn text-sm font-medium transition-all duration-200 bg-surface border border-border-subtle text-text-secondary"
      >
        <Download size={14} />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="rounded-xl overflow-hidden min-w-[160px] bg-card border border-border-subtle"
          style={{
            position: 'fixed',
            top: coords.top,
            right: coords.right,
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors text-text-secondary hover:bg-overlay-light"
          >
            <FileText size={14} style={{ color: COLORS.primary }} />
            Export CSV
          </button>

          <div className="h-px mx-3 bg-border-subtle" />

          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors text-text-secondary hover:bg-overlay-light"
          >
            <Braces size={14} style={{ color: COLORS.secondary }} />
            Export JSON
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

export default ExportMenu;