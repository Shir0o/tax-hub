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
  const navRef = React.useRef<HTMLElement>(null);
  const [fade, setFade] = React.useState({ left: false, right: false });

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

  // Only fade the edges that actually hide content, so tabs never look dimmed
  // when everything fits (e.g. 1280px desktops).
  React.useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const next = {
        left: max > 1 && el.scrollLeft > 1,
        right: max > 1 && el.scrollLeft < max - 1,
      };
      setFade((prev) =>
        prev.left === next.left && prev.right === next.right ? prev : next
      );
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, []);

  const maskStops = [
    ...(fade.left ? ['transparent 0', '#000 2rem'] : ['#000 0']),
    ...(fade.right ? ['#000 calc(100% - 2rem)', 'transparent'] : ['#000 100%']),
  ];
  const maskImage =
    fade.left || fade.right
      ? `linear-gradient(to right, ${maskStops.join(', ')})`
      : undefined;

  // Keep the selected tab fully in view when it changes (keyboard or click).
  React.useEffect(() => {
    navRef.current
      ?.querySelector<HTMLButtonElement>(`#id-${activeTab}`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeTab]);

  // Roving focus for the tablist: arrows/Home/End select and focus the next tab.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    event.preventDefault();

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const lastIndex = tabs.length - 1;
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else {
      nextIndex = lastIndex;
    }

    const nextTab = tabs[nextIndex];
    onTabChange(nextTab.id);
    navRef.current
      ?.querySelector<HTMLButtonElement>(`#id-${nextTab.id}`)
      ?.focus();
  };

  return (
    <div className="border-b border-slate-800 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          ref={navRef}
          role="tablist"
          aria-label="Tax Hub Modules"
          onKeyDown={handleKeyDown}
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
          }}
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth motion-reduce:scroll-auto"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`id-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                title={tab.label}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center space-x-2 py-2.5 sm:py-2 px-3 sm:px-3.5 min-h-[44px] sm:min-h-0 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span className="flex flex-col items-start">
                  <span>{tab.shortLabel}</span>
                  {tab.badge && (
                    <span
                      className={`hidden sm:block mt-0.5 text-[10px] leading-none font-mono ${
                        isActive ? 'text-emerald-300/90' : 'text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
