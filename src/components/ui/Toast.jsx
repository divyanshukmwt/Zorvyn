import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import useStore from '../../store/useStore';

const AUTO_DISMISS_MS = 3200;

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    borderColor: 'border-l-success',
    iconColor: 'text-success',
    bg: 'bg-card-dark',
  },
  error: {
    icon: XCircle,
    borderColor: 'border-l-danger',
    iconColor: 'text-danger',
    bg: 'bg-card-dark',
  },
  info: {
    icon: Info,
    borderColor: 'border-l-accent-teal',
    iconColor: 'text-accent-teal',
    bg: 'bg-card-dark',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-l-warning',
    iconColor: 'text-warning',
    bg: 'bg-card-dark',
  },
};

function ToastItem({ id, msg, kind }) {
  const ref = useRef(null);
  const removeToast = useStore((s) => s.removeToast);
  const config = TOAST_CONFIG[kind] || TOAST_CONFIG.info;
  const Icon = config.icon;

  const dismiss = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 110,
      opacity: 0,
      duration: 0.25,
      ease: 'power3.in',
      onComplete: () => removeToast(id),
    });
  };

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { x: 110, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }
    );
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={ref}
      className={`
        ${config.bg} border border-white/[0.08] border-l-4 ${config.borderColor}
        rounded-xl px-4 py-3.5 flex items-center gap-3
        min-w-[280px] max-w-[360px] shadow-card
        pointer-events-auto
      `}
    >
      <Icon size={16} className={`flex-shrink-0 ${config.iconColor}`} />
      <span className="flex-1 text-sm font-medium text-slate-200">{msg}</span>
      <button
        onClick={dismiss}
        className="text-slate-500 hover:text-slate-300 transition-colors ml-1 flex-shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function Toast() {
  const toasts = useStore((s) => s.toasts);

  return (
    <div
      className="fixed bottom-6 right-6 z-[2000] flex flex-col-reverse gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

export default Toast;
