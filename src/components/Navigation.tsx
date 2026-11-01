import React from 'react';
import { 
  HeartPulse, 
  Layers, 
  CalendarClock, 
  CheckSquare, 
  Briefcase 
} from 'lucide-react';

export type TabType = 'hsa' | 'ira' | 'estimated' | 'checklist' | 'scheduleC';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'hsa' as TabType,
      label: 'California FTB HSA Non-Conformity',
      shortLabel: 'CA HSA Non-Conformity',
      icon: <HeartPulse className="w-4 h-4" />,
      badge: 'R&TC § 17131',
    },
    {
      id: 'ira' as TabType,
      label: 'IRA Basis & Conversions (Form 8606 / 5329)',
      shortLabel: 'Form 8606 / 5329 Basis',
      icon: <Layers className="w-4 h-4" />,
      badge: '$12k Basis',
    },
    {
      id: 'estimated' as TabType,
      label: 'Quarterly Estimated Taxes (1040-ES / 540-ES)',
      shortLabel: 'Quarterly 1040-ES / 540-ES',
      icon: <CalendarClock className="w-4 h-4" />,
      badge: 'CA 30/40/0/30',
    },
    {
      id: 'checklist' as TabType,
      label: 'Annual Checklists & Deductibles (2021–2025)',
      shortLabel: 'Checklists & Deductibles',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: '2021–2025',
    },
    {
      id: 'scheduleC' as TabType,
      label: 'Schedule C Deduction Aggregator',
      shortLabel: 'Schedule C Aggregator',
      icon: <Briefcase className="w-4 h-4" />,
      badge: 'Vehicle & Budget Sync',
    },
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
