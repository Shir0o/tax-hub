import React, { useState } from 'react';
import { 
  HISTORICAL_CONTRIBUTIONS, 
  HISTORICAL_CONVERSIONS, 
  FORM_8606_HISTORICAL, 
  EXCESS_ROTH_REMOVAL_2024 
} from '../../data/iraData';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Form8606View } from './Form8606View';
import { ExcessRemovalCard } from './ExcessRemovalCard';
import { 
  ArrowRightLeft, 
  History, 
  ShieldCheck, 
  Calculator, 
  CheckCircle2 
} from 'lucide-react';

export const IraBasisTracker: React.FC = () => {
  // Pro-rata interactive sandbox state
  const [simBasis, setSimBasis] = useState<number>(0);
  const [simConversion, setSimConversion] = useState<number>(7000);
  const [simYearEndFmv, setSimYearEndFmv] = useState<number>(0);

  // Pro-rata calculation
  const totalPool = simYearEndFmv + simConversion;
  const ratio = totalPool > 0 ? Math.min(1, simBasis / totalPool) : 1;
  const nonTaxableConversion = simConversion * ratio;
  const taxableConversion = simConversion - nonTaxableConversion;
  const remainingBasis = Math.max(0, simBasis - nonTaxableConversion);

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Original Traditional Basis
          </span>
          <div className="text-2xl font-bold text-slate-100 mt-1">$12,000.00</div>
          <p className="text-[11px] text-slate-400 mt-1">2019 ($6,000) + 2022 ($6,000) nondeductible</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Converted to Roth
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">$17,549.83</div>
          <p className="text-[11px] text-slate-400 mt-1">2023 ($2,993.56) + 2024 ($14,556.27)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Basis Remaining in Trad IRA
          </span>
          <div className="text-2xl font-bold text-purple-400 mt-1">$0.00</div>
          <p className="text-[11px] text-slate-400 mt-1">100% converted & basis fully absorbed by 2024</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Excise Penalty Avoided (5329)
          </span>
          <div className="text-2xl font-bold text-amber-400 mt-1">$420.00/yr</div>
          <p className="text-[11px] text-slate-400 mt-1">Timely removed $7k excess on 11/20/24</p>
        </div>
      </div>

      {/* 2024 Excess Roth Removal Spotlight */}
      <ExcessRemovalCard removal={EXCESS_ROTH_REMOVAL_2024} />

      {/* Basis History and Conversions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nondeductible Contributions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Nondeductible Contributions (Basis Seed)</span>
            </h4>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Total: $12,000.00
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Year</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4 text-right">Contribution</th>
                  <th className="py-2.5 px-4 text-right">After-Tax Basis</th>
                  <th className="py-2.5 px-4">Filing Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-slate-200">
                {HISTORICAL_CONTRIBUTIONS.map((c) => (
                  <tr key={c.year} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-bold text-white font-sans">{c.year}</td>
                    <td className="py-2.5 px-4 font-sans capitalize text-slate-300">{c.type}</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(c.amount)}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                      {formatCurrency(c.nondeductibleBasis)}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-400">Form 8606 Line 1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-950/50 text-[11px] text-slate-400 border-t border-slate-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Cumulative basis of $12,000 established and verified on 2019 and 2022 tax returns prior to conversions.
            </span>
          </div>
        </div>

        {/* Conversions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-400" />
              <span>Backdoor Roth Conversions Executed</span>
            </h4>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              Total: $17,549.83
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4 text-right">Converted</th>
                  <th className="py-2.5 px-4 text-right text-emerald-400">Nontaxable</th>
                  <th className="py-2.5 px-4 text-right text-amber-400">Taxable</th>
                  <th className="py-2.5 px-4">Accounts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-slate-200">
                {HISTORICAL_CONVERSIONS.map((conv) => (
                  <tr key={conv.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-sans text-slate-300">{conv.date}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-white">
                      {formatCurrency(conv.amountConverted)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-emerald-400">
                      {formatCurrency(conv.nontaxablePortion)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-amber-400">
                      {formatCurrency(conv.taxablePortion)}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-[11px] text-slate-400">Trad → Roth</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-950/50 text-[11px] text-slate-400 border-t border-slate-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              All traditional IRA assets converted by end of 2024. Future Backdoor conversions will have 100% nontaxable ratio if funded and converted cleanly in same tax year.
            </span>
          </div>
        </div>
      </div>

      {/* Form 8606 View */}
      <Form8606View formsData={FORM_8606_HISTORICAL} />

      {/* Pro-Rata Interactive Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-100">
              Interactive Backdoor Roth Pro-Rata Simulator (What-If Sandbox)
            </h4>
          </div>
          <span className="text-xs text-slate-400">Simulate IRC § 408(d)(2) aggregate rule</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Remaining Trad IRA Basis (Line 5)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                step="100"
                value={simBasis}
                onChange={(e) => setSimBasis(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Non-deductible basis carried forward</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Planned Roth Conversion (Line 8)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                step="100"
                value={simConversion}
                onChange={(e) => setSimConversion(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Amount converted to Roth</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Dec 31 Pre-Tax Trad/SEP/SIMPLE FMV (Line 6)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                step="100"
                value={simYearEndFmv}
                onChange={(e) => setSimYearEndFmv(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Keep $0 to avoid pro-rata tax penalty!</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[11px] text-slate-400 font-sans block">Nontaxable Ratio (Line 10)</span>
            <span className="text-base font-bold text-emerald-400 block mt-0.5">{formatPercent(ratio, 2)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-sans block">Nontaxable Portion</span>
            <span className="text-base font-bold text-emerald-400 block mt-0.5">{formatCurrency(nonTaxableConversion)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-sans block">Taxable Portion (Line 15)</span>
            <span className="text-base font-bold text-amber-400 block mt-0.5">{formatCurrency(taxableConversion)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-sans block">Ending Remaining Basis</span>
            <span className="text-base font-bold text-purple-400 block mt-0.5">{formatCurrency(remainingBasis)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
