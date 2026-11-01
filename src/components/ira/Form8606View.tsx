import React, { useState } from 'react';
import { Form8606Data } from '../../types/ira';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { FileSpreadsheet, Info } from 'lucide-react';

interface Form8606ViewProps {
  formsData: Record<number, Form8606Data>;
}

export const Form8606View: React.FC<Form8606ViewProps> = ({ formsData }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const data = formsData[selectedYear] || formsData[2024];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>IRS Form 8606 — Nondeductible IRAs & Pro-Rata Engine</span>
            </h3>
            <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
              Parts I & II
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculates exact pro-rata non-taxable vs taxable percentage to eliminate double taxation on Backdoor Roth conversions.
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {[2023, 2024].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedYear === yr
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tax Year {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Pro-Rata summary bar */}
      <div className="bg-slate-950/70 border-b border-slate-800 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
          <span className="text-[11px] text-slate-400 font-sans block">Total Nontaxable Ratio (Line 10)</span>
          <span className="text-lg font-bold text-emerald-400 block mt-0.5">
            {formatPercent(data.line10NontaxableRatio, 4)}
          </span>
          <span className="text-[10px] text-slate-500 font-sans">Line 5 ÷ Line 9</span>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
          <span className="text-[11px] text-slate-400 font-sans block">Nontaxable Conversion (Line 11)</span>
          <span className="text-lg font-bold text-emerald-400 block mt-0.5">
            {formatCurrency(data.line11NontaxableConversions)}
          </span>
          <span className="text-[10px] text-slate-500 font-sans">Shielded from tax by basis</span>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
          <span className="text-[11px] text-slate-400 font-sans block">Taxable Conversion (Line 15)</span>
          <span className="text-lg font-bold text-amber-400 block mt-0.5">
            {formatCurrency(data.line15TaxableAmount)}
          </span>
          <span className="text-[10px] text-slate-500 font-sans">Reported on Form 1040 Line 4b</span>
        </div>
      </div>

      {/* Line-by-Line Table matching official Form 8606 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4 w-16">Line</th>
              <th className="py-2.5 px-4">Form 8606 Description</th>
              <th className="py-2.5 px-4 text-right w-44 font-mono">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-emerald-400">Line 1</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Nondeductible contributions to traditional IRAs for {selectedYear}
              </td>
              <td className="py-2 px-4 text-right text-slate-300">{formatCurrency(data.line1NondeductibleContrib)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-emerald-400">Line 2</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Total basis in traditional IRAs from prior years (from Line 14 of prior Form 8606)
              </td>
              <td className="py-2 px-4 text-right font-bold text-slate-100">{formatCurrency(data.line2PriorYearBasis)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30 bg-slate-950/30">
              <td className="py-2 px-4 font-bold text-emerald-400">Line 3</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Add line 1 and line 2 (Total available basis)
              </td>
              <td className="py-2 px-4 text-right font-bold text-slate-100">{formatCurrency(data.line3TotalBasis)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-slate-400">Line 4</td>
              <td className="py-2 px-4 font-sans text-slate-400">
                Contributions made from Jan 1 to Apr 15 of next year for {selectedYear}
              </td>
              <td className="py-2 px-4 text-right text-slate-400">{formatCurrency(data.line4ContribAfterYearEnd)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30 bg-slate-950/30">
              <td className="py-2 px-4 font-bold text-emerald-400">Line 5</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Subtract line 4 from line 3 (Net basis for calculations)
              </td>
              <td className="py-2 px-4 text-right font-bold text-emerald-400">{formatCurrency(data.line5NetBasis)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-slate-400">Line 6</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Value of all traditional/SEP/SIMPLE IRAs on Dec 31, {selectedYear}
              </td>
              <td className="py-2 px-4 text-right text-slate-300">{formatCurrency(data.line6YearEndFmv)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-slate-400">Line 7</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Distributions from traditional/SEP/SIMPLE IRAs in {selectedYear}
              </td>
              <td className="py-2 px-4 text-right text-slate-400">{formatCurrency(data.line7Distributions)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-blue-400">Line 8</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Net amount converted from traditional to Roth IRAs in {selectedYear}
              </td>
              <td className="py-2 px-4 text-right font-bold text-blue-400">{formatCurrency(data.line8Conversions)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30 bg-slate-950/30">
              <td className="py-2 px-4 font-bold text-slate-400">Line 9</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Add lines 6, 7, and 8 (Total traditional IRA pool value)
              </td>
              <td className="py-2 px-4 text-right font-bold text-slate-200">{formatCurrency(data.line9TotalIraPool)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30 bg-emerald-950/20">
              <td className="py-2 px-4 font-bold text-emerald-400">Line 10</td>
              <td className="py-2 px-4 font-sans text-emerald-200">
                Divide line 5 by line 9 (Decimal ratio of nontaxable portion)
              </td>
              <td className="py-2 px-4 text-right font-bold text-emerald-400">
                {data.line10NontaxableRatio.toFixed(6)}
              </td>
            </tr>
            <tr className="hover:bg-slate-800/30 bg-emerald-950/30">
              <td className="py-2 px-4 font-bold text-emerald-400">Line 11</td>
              <td className="py-2 px-4 font-sans text-emerald-200 font-semibold">
                Multiply line 8 by line 10 (Nontaxable portion of conversion)
              </td>
              <td className="py-2 px-4 text-right font-bold text-emerald-300">{formatCurrency(data.line11NontaxableConversions)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-slate-400">Line 12</td>
              <td className="py-2 px-4 font-sans text-slate-400">
                Multiply line 7 by line 10 (Nontaxable portion of distributions)
              </td>
              <td className="py-2 px-4 text-right text-slate-400">{formatCurrency(data.line12NontaxableDistributions)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-2 px-4 font-bold text-slate-300">Line 13</td>
              <td className="py-2 px-4 font-sans text-slate-300">
                Add line 11 and line 12 (Total nontaxable distributions & conversions)
              </td>
              <td className="py-2 px-4 text-right text-slate-200">{formatCurrency(data.line13TotalNontaxable)}</td>
            </tr>
            <tr className="hover:bg-slate-800/30 bg-purple-950/20">
              <td className="py-2.5 px-4 font-bold text-purple-400">Line 14</td>
              <td className="py-2.5 px-4 font-sans text-purple-200 font-bold">
                Remaining total basis in traditional IRAs for future years (Line 3 minus Line 13)
              </td>
              <td className="py-2.5 px-4 text-right font-bold text-purple-300 text-sm">
                {formatCurrency(data.line14RemainingBasis)}
              </td>
            </tr>
            <tr className="hover:bg-slate-800/30 bg-amber-950/20">
              <td className="py-2.5 px-4 font-bold text-amber-400">Line 15</td>
              <td className="py-2.5 px-4 font-sans text-amber-200 font-bold">
                Taxable amount of Roth conversion (Line 8 minus Line 11)
              </td>
              <td className="py-2.5 px-4 text-right font-bold text-amber-300 text-sm">
                {formatCurrency(data.line15TaxableAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span>
            {selectedYear === 2024
              ? '2024 outcome: Entire remaining traditional basis ($9,337.79) was absorbed; Dec 31 Traditional balance is $0.00.'
              : '2023 outcome: $2,662.21 of conversion was nontaxable; $9,337.79 remaining basis carried forward into 2024.'}
          </span>
        </div>
      </div>
    </div>
  );
};
