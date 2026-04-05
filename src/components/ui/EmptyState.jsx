import React from 'react';

function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="select-none">
        {Icon && <Icon size={44} strokeWidth={1.5} className="text-text-secondary" />}
      </div>

      <div>
        <h3 className="text-lg font-bold mb-1 text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-sm max-w-xs mx-auto leading-relaxed text-text-muted">{subtitle}</p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
