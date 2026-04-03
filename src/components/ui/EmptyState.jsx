import React from 'react';

function EmptyState({ emoji = '📭', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="text-5xl select-none">{emoji}</div>
      <div>
        <h3 className="text-lg font-bold text-slate-200 dark:text-slate-200 mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
