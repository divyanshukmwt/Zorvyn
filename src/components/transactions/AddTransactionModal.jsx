import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORY_NAMES } from '../../data/mockData';

const INITIAL_FORM = {
  desc: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  category: 'Food',
  type: 'expense',
};

/**
 * @param {{ onClose: () => void }} props
 */
function AddTransactionModal({ onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const addTransaction = useStore((s) => s.addTransaction);
  const addToast = useStore((s) => s.addToast);

  // Open animation
  useEffect(() => {
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    );
    gsap.fromTo(
      modalRef.current,
      { scale: 0.94, opacity: 0, y: 10 },
      { scale: 1, opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' }
    );
  }, []);

  const close = useCallback(() => {
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(modalRef.current, {
      scale: 0.94,
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power3.in',
      onComplete: onClose,
    });
  }, [onClose]);

  // Close on Escape
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
      id: Date.now(),
      desc: form.desc.trim(),
      amount: parseFloat(form.amount),
      date: form.date,
      category: form.category,
      type: form.type,
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

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={close}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        style={{ opacity: 0 }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="
          relative w-full max-w-md
          bg-card-dark border border-white/[0.09] rounded-[20px] p-8
          shadow-[0_24px_80px_rgba(0,0,0,0.6)]
        "
        style={{ opacity: 0 }}
      >
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
        >
          <X size={15} />
        </button>

        <h2 className="text-lg font-bold text-slate-200 mb-6">New Transaction</h2>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Description
          </label>
          <input
            type="text"
            value={form.desc}
            onChange={(e) => setField('desc', e.target.value)}
            placeholder="e.g. Uber Ride, Monthly Salary…"
            className={`
              w-full px-4 py-3 rounded-input bg-surface-dark
              border text-sm text-slate-200 placeholder-slate-600
              focus:outline-none focus:border-accent-teal/50 transition-colors
              ${errors.desc ? 'border-danger/60' : 'border-white/[0.07]'}
            `}
          />
          {errors.desc && <p className="text-xs text-danger mt-1.5">{errors.desc}</p>}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setField('amount', e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={`
              w-full px-4 py-3 rounded-input bg-surface-dark font-mono
              border text-sm text-slate-200 placeholder-slate-600
              focus:outline-none focus:border-accent-teal/50 transition-colors
              ${errors.amount ? 'border-danger/60' : 'border-white/[0.07]'}
            `}
          />
          {errors.amount && <p className="text-xs text-danger mt-1.5">{errors.amount}</p>}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setField('date', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-input bg-surface-dark
              border text-sm text-slate-200
              focus:outline-none focus:border-accent-teal/50 transition-colors
              ${errors.date ? 'border-danger/60' : 'border-white/[0.07]'}
            `}
          />
          {errors.date && <p className="text-xs text-danger mt-1.5">{errors.date}</p>}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className="
              w-full px-4 py-3 rounded-input bg-surface-dark
              border border-white/[0.07] text-sm text-slate-200
              focus:outline-none focus:border-accent-teal/50 transition-colors cursor-pointer
            "
          >
            {CATEGORY_NAMES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Type toggle */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Type
          </label>
          <div className="flex gap-2">
            {['income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setField('type', t)}
                className={`
                  flex-1 py-2.5 rounded-[10px] text-sm font-semibold
                  border transition-all duration-200
                  ${form.type === t
                    ? t === 'income'
                      ? 'bg-success/15 border-success/40 text-success'
                      : 'bg-danger/15 border-danger/40 text-danger'
                    : 'bg-transparent border-white/[0.07] text-slate-500 hover:text-slate-300'
                  }
                `}
              >
                {t === 'income' ? '+ Income' : '− Expense'}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={close}
            className="
              flex-1 py-2.5 rounded-btn text-sm font-semibold
              bg-white/[0.05] border border-white/[0.08] text-slate-300
              hover:bg-white/[0.08] transition-colors
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="
              flex-1 py-2.5 rounded-btn text-sm font-semibold
              bg-gradient-to-r from-accent-teal to-accent-indigo text-bg-dark
              hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            {submitting ? 'Adding…' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTransactionModal;
