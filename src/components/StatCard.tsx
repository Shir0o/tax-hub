import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'neutral';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
}) => {
  const badgeClasses = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    neutral: 'bg-slate-700/50 text-slate-300 border-slate-600',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition-all hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="p-2.5 bg-slate-800/80 rounded-lg text-emerald-400 border border-slate-700/60">
          {icon}
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <span
            className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border ${badgeClasses[badge.variant]}`}
          >
            {badge.text}
          </span>
        </div>
      )}
    </div>
  );
};
