import React, { useRef } from 'react';
import { Trash2, CircleDollarSign } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { COLORS } from '../../constants/colors';

function TransactionRow({ transaction }) {
  const ref = useRef(null);
  const role = useStore((s) => s.role);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const addToast = useStore((s) => s.addToast);

  const catMeta =
    CATEGORIES[transaction.category] || {
      color: COLORS.secondary,
      icon: CircleDollarSign,
    };

  const Icon = catMeta.icon;
  const isIncome = transaction.type === 'income';

  const handleMouseEnter = () => {
    gsap.to(ref.current, {
      backgroundColor: COLORS.overlay,
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
        transition-colors duration-200
      "
      style={{
        border: `1px solid ${COLORS.border}`,
        background: COLORS.card
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${catMeta.color}18` }}
      >
        <Icon size={18} strokeWidth={1.5} style={{ color: catMeta.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: COLORS.textPrimary }}
        >
          {transaction.desc}
        </p>

        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[11px]"
            style={{ color: COLORS.textMuted }}
          >
            {formatDate(transaction.date, 'short')}
          </span>

          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${catMeta.color}18`,
              color: catMeta.color,
            }}
          >
            {transaction.category}
          </span>
        </div>
      </div>

      <span
        className="font-mono text-sm font-bold flex-shrink-0"
        style={{
          color: isIncome ? COLORS.success : COLORS.danger
        }}
      >
        {isIncome ? '+' : '−'}
        {formatCurrency(transaction.amount, { compact: true })}
      </span>

      {role === 'admin' && (
        <button
          onClick={handleDelete}
          aria-label="Delete transaction"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          style={{
            background: `${COLORS.danger}15`,
            color: COLORS.danger
          }}
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

export default TransactionRow;