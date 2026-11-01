import React from 'react';
import { Landmark, RefreshCw, Download, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onResetDefaults: () => void;
  onExportAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetDefaults, onExportAll }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Tax Hub</h1>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Personal Ops Suite
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                California FTB Non-Conformity • Backdoor Roth Basis (8606) • Quarterly Safe Harbor • Schedule C Aggregator
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FTB Non-Conformity Engine Active</span>
            </div>

            <button
              onClick={onExportAll}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
              title="Export complete Tax Hub portfolio to JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Portfolio</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all Tax Hub data back to canonical pre-seeded historical defaults?')) {
                  onResetDefaults();
                }
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/60 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-800/40 transition-colors"
              title="Reset state to default seeds"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
