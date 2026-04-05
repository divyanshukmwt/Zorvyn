import React from 'react';
import { COLORS } from '../../constants/colors';

function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      
      <div className="select-none">
        {Icon && (
          <Icon size={44} strokeWidth={1.5} style={{ color: COLORS.textSecondary }} />
        )}
      </div>

      <div>
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: COLORS.textPrimary }}
        >
          {title}
        </h3>

        {subtitle && (
          <p
            className="text-sm max-w-xs mx-auto leading-relaxed"
            style={{ color: COLORS.textMuted }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;