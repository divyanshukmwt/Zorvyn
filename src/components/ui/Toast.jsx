import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import useStore from '../../store/useStore';
import { COLORS } from '../../constants/color';

const AUTO_DISMISS_MS = 3200;

// Brand/semantic colors only — these never change with theme
const TOAST_CONFIG = {
  success: { icon: CheckCircle,   borderColor: COLORS.success, iconColor: COLORS.success },
  error:   { icon: XCircle,       borderColor: COLORS.danger,  iconColor: COLORS.danger  },
  info:    { icon: Info,          borderColor: COLORS.primary, iconColor: COLORS.primary },
  warning: { icon: AlertTriangle, borderColor: COLORS.warning, iconColor: COLORS.warning },
};

function ToastItem({ id, msg, kind }) {
  const ref         = useRef(null);
  const removeToast = useStore((s) => s.removeToast);
  const config      = TOAST_CONFIG[kind] || TOAST_CONFIG.info;
  const Icon        = config.icon;

  const dismiss = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 110, opacity: 0,
      duration: 0.25, ease: 'power3.in',
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
      className="rounded-xl px-4 py-3.5 flex items-center gap-3 min-w-[280px] max-w-[360px] pointer-events-auto bg-card border border-border-subtle"
      style={{
        borderLeft: `4px solid ${config.borderColor}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <Icon size={16} className="flex-shrink-0" style={{ color: config.iconColor }} />
      <span className="flex-1 text-sm font-medium text-text-primary">{msg}</span>
      <button
        onClick={dismiss}
        className="transition-colors ml-1 flex-shrink-0 text-text-muted"
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
