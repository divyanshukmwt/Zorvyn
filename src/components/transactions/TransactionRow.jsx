import React, { useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * @param {{ transaction: import('../../store/useStore').Transaction }} props
 */
function TransactionRow({ transaction }) {
  const ref = useRef(null);
  const role = useStore((s) => s.role);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const addToast = useStore((s) => s.addToast);

  const catMeta = CATEGORIES[transaction.category] || { emoji: '💸', color: '#818CF8' };
  const isIncome = transaction.type === 'income';

  const handleMouseEnter = () => {
    gsap.to(ref.current, {
      backgroundColor: 'rgba(255,255,255,0.03)',
      duration: 0.15,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      backgroundColor: 'transparent',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleDelete = () => {
    // Animate out before removing
    gsap.to(ref.current, {
      x: 20,
      opacity: 0,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: 0,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        deleteTransaction(transaction.id);
        addToast({ msg: `"${transaction.desc}" deleted.`, kind: 'success' });
      },
    });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        flex items-center gap-3 sm:gap-4 p-3.5 rounded-xl
        border border-white/[0.06] bg-card-dark
        transition-colors duration-200
      "
    >
      {/* Category emoji */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${catMeta.color}18` }}
      >
        {catMeta.emoji}
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-200 truncate">{transaction.desc}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-slate-500">{formatDate(transaction.date, 'short')}</span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${catMeta.color}18`, color: catMeta.color }}
          >
            {transaction.category}
          </span>
        </div>
      </div>

      {/* Amount */}
      <span
        className={`font-mono text-sm font-bold flex-shrink-0 ${
          isIncome ? 'text-success' : 'text-danger'
        }`}
      >
        {isIncome ? '+' : '−'}{formatCurrency(transaction.amount, { compact: true })}
      </span>

      {/* Delete (admin only) */}
      {role === 'admin' && (
        <button
          onClick={handleDelete}
          aria-label="Delete transaction"
          className="
            w-8 h-8 rounded-lg flex items-center justify-center
            bg-danger/10 text-danger hover:bg-danger/20
            transition-colors flex-shrink-0
          "
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

export default TransactionRow;
