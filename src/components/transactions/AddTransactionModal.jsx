import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { X, ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORY_NAMES } from '../../data/mockData';
import { COLORS } from '../../constants/colors';

const INITIAL_FORM = {
  desc: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  category: 'Food',
  type: 'expense',
};

function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);
  const containerRef = useRef(null);

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

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-input text-sm bg-surface border border-border-subtle text-text-primary focus:outline-none focus:border-accent-primary/50 transition-colors"
      >
        <span>{value}</span>
        <ChevronDown
          size={13}
          className={`flex-shrink-0 transition-transform duration-200 text-text-muted ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[600] rounded-xl overflow-y-auto max-h-48 bg-card border border-border-subtle"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          {CATEGORY_NAMES.map((cat) => {
            const isSelected = cat === value;
            return (
              <button
                key={cat}
                onClick={() => { onChange(cat); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/[0.05]"
                style={{
                  color: isSelected ? COLORS.primary : undefined,
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {cat}
                {isSelected && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
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

function AddTransactionModal({ onClose }) {
  const [form, setForm]             = useState(INITIAL_FORM);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);

  const modalRef    = useRef(null);
  const backdropRef = useRef(null);
  const addTransaction = useStore((s) => s.addTransaction);
  const addToast       = useStore((s) => s.addToast);

  useEffect(() => {
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    gsap.fromTo(
      modalRef.current,
      { scale: 0.94, opacity: 0, y: 10 },
      { scale: 1, opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' }
    );
  }, []);

  const close = useCallback(() => {
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(modalRef.current, {
      scale: 0.94, opacity: 0, y: 10,
      duration: 0.2, ease: 'power3.in', onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  const validate = () => {
    const errs = {};
    if (!form.desc.trim()) errs.desc = 'Description is required.';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid positive amount.';
    if (!form.date) errs.date = 'Date is required.';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    const tx = {
      id:       Date.now(),
      desc:     form.desc.trim(),
      amount:   parseFloat(form.amount),
      date:     form.date,
      category: form.category,
      type:     form.type,
    };
    setTimeout(() => {
      addTransaction(tx);
      addToast({ msg: `Transaction "${tx.desc}" added.`, kind: 'success' });
      close();
    }, 300);
  };

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const isValid = form.desc.trim() && form.amount && Number(form.amount) > 0 && form.date;

  const fieldBase =
    'w-full px-4 py-3 rounded-input text-sm bg-surface border text-text-primary ' +
    'placeholder:text-text-muted focus:outline-none transition-colors';
  const fieldNormal = `${fieldBase} border-border-subtle focus:border-accent-primary/50`;
  const fieldError  = `${fieldBase} border-danger/60`;
  const labelClass  = 'block text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-2';

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        onClick={close}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        style={{ opacity: 0 }}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-card border border-border-subtle rounded-[20px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        style={{ opacity: 0 }}
      >
        <button
          onClick={close}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-overlay-light hover:bg-surface text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors"
        >
          <X size={15} />
        </button>

        <h2 className="text-lg font-bold text-text-primary mb-6">New Transaction</h2>

        <div className="mb-4">
          <label className={labelClass}>Description</label>
          <input
            type="text"
            value={form.desc}
            onChange={(e) => setField('desc', e.target.value)}
            placeholder="e.g. Uber Ride, Monthly Salary…"
            className={errors.desc ? fieldError : fieldNormal}
          />
          {errors.desc && <p className="text-xs text-danger mt-1.5">{errors.desc}</p>}
        </div>

        <div className="mb-4">
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setField('amount', e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={`font-mono ${errors.amount ? fieldError : fieldNormal}`}
          />
          {errors.amount && <p className="text-xs text-danger mt-1.5">{errors.amount}</p>}
        </div>

        <div className="mb-4">
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setField('date', e.target.value)}
            className={errors.date ? fieldError : fieldNormal}
          />
          {errors.date && <p className="text-xs text-danger mt-1.5">{errors.date}</p>}
        </div>

        <div className="mb-4">
          <label className={labelClass}>Category</label>
          <CategoryDropdown
            value={form.category}
            onChange={(val) => setField('category', val)}
          />
        </div>

        <div className="mb-6">
          <label className={labelClass}>Type</label>
          <div className="flex gap-2">
            {['income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setField('type', t)}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-semibold border transition-all duration-200"
                style={form.type === t ? {
                  background: t === 'income' ? `${COLORS.success}15` : `${COLORS.danger}15`,
                  border:     t === 'income' ? `1px solid ${COLORS.success}40` : `1px solid ${COLORS.danger}40`,
                  color:      t === 'income' ? COLORS.success : COLORS.danger,
                } : undefined}
                {...(form.type !== t ? {
                  className: 'flex-1 py-2.5 rounded-[10px] text-sm font-semibold border border-border-subtle text-text-muted hover:text-text-secondary transition-all duration-200'
                } : {})}
              >
                {t === 'income' ? '+ Income' : '− Expense'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={close}
            className="flex-1 py-2.5 rounded-btn text-sm font-semibold bg-overlay-light border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="flex-1 py-2.5 rounded-btn text-sm font-semibold text-slate-900 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            style={{
              background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`,
            }}
          >
            {submitting ? 'Adding…' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTransactionModal;