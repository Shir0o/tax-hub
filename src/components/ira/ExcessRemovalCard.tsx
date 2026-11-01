import React from 'react';
import { ExcessRothRemoval } from '../../types/ira';
import { formatCurrency } from '../../utils/formatters';
import { AlertOctagon, CheckCircle2, FileText } from 'lucide-react';

interface ExcessRemovalCardProps {
  removal: ExcessRothRemoval;
}

export const ExcessRemovalCard: React.FC<ExcessRemovalCardProps> = ({ removal }) => {
  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-100">
                2024 Excess Roth Removal & Form 5329 Compliance
              </h3>
              <span className="text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Timely Removed (11/20/2024)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Removed before extended deadline under IRC § 408A(d)(5) to prevent ongoing 6% excise penalty.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-emerald-400 font-semibold block">Excise Tax Saved</span>
          <span className="text-lg font-mono font-bold text-emerald-300">
            {formatCurrency(removal.exciseTaxAvoided)}/year
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Original Contribution
          </span>
          <span className="text-xl font-bold font-mono text-slate-100 mt-1 block">
            {formatCurrency(removal.contributionAmount)}
          </span>
          <span className="text-[10px] text-slate-500">Date: {removal.contributionDate}</span>
        </div>

        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Net Income Attributable (NIA)
          </span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
            +{formatCurrency(removal.netIncomeAttributable)}
          </span>
          <span className="text-[10px] text-amber-400/80">Taxable Ordinary Income in 2024</span>
        </div>

        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Total Distribution Received
          </span>
          <span className="text-xl font-bold font-mono text-slate-100 mt-1 block">
            {formatCurrency(removal.totalDistributed)}
          </span>
          <span className="text-[10px] text-slate-500">Distributed: {removal.removalDate}</span>
        </div>

        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Form 5329 Excise Tax
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            $0.00
          </span>
          <span className="text-[10px] text-emerald-400/80">Excise Penalty Avoided (IRC § 4973)</span>
        </div>
      </div>

      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Filing Instructions & Tax Reporting Rules</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Form 1040 Line 4b:</strong> Report the $1,017.76 net earnings attributable on Line 4b as taxable IRA distributions for tax year 2024.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>1099-R Custodian Form:</strong> Vanguard issues Form 1099-R showing Code 8 or P in Box 7 ("Excess contribution plus earnings/additions to an IRA").
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Form 5329 Part I:</strong> The 10% early withdrawal penalty on net earnings ($101.78) is calculated on Form 5329 Part I unless an exception applies.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Ongoing Clean Slate:</strong> Because the $7,000 was timely removed on 11/20/2024, no Form 5329 Part IV 6% cumulative excise tax is triggered.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
