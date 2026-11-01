import React, { useState } from 'react';
import { HsaRecord } from '../../types/hsa';
import { formatCurrency } from '../../utils/formatters';
import { HsaModal } from './HsaModal';
import { 
  HeartPulse, 
  Plus, 
  Edit3, 
  Trash2, 
  Info, 
  AlertTriangle, 
  Download, 
  CheckCircle2 
} from 'lucide-react';
import { downloadCsvFile, convertArrayToCsv } from '../../utils/exportHelpers';

interface HsaTrackerProps {
  records: HsaRecord[];
  onUpdateRecords: (records: HsaRecord[]) => void;
}

export const HsaTracker: React.FC<HsaTrackerProps> = ({ records, onUpdateRecords }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HsaRecord | null>(null);

  // Compute metrics
  const latestRecord = [...records].sort((a, b) => b.year - a.year)[0];
  const latestFmv = latestRecord?.yearEndFmv || 0;
  const totalAdditions = records.reduce((sum, r) => sum + r.scheduleCaAddition, 0);
  const totalGrowthTaxed = records.reduce(
    (sum, r) => sum + r.interestEarned + r.dividendsEarned + r.capitalGainsEarned,
    0
  );

  const handleSave = (savedRecord: HsaRecord) => {
    const exists = records.some((r) => r.id === savedRecord.id);
    let updated: HsaRecord[];
    if (exists) {
      updated = records.map((r) => (r.id === savedRecord.id ? savedRecord : r));
    } else {
      updated = [...records, savedRecord].sort((a, b) => a.year - b.year);
    }
    onUpdateRecords(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this HSA tax record?')) {
      onUpdateRecords(records.filter((r) => r.id !== id));
    }
  };

  const exportHsaCsv = () => {
    const csv = convertArrayToCsv(records as unknown as Record<string, unknown>[], [
      { key: 'year', label: 'Year' },
      { key: 'institution', label: 'Institution' },
      { key: 'accountNumberMasked', label: 'Account' },
      { key: 'yearEndFmv', label: 'Year-End FMV' },
      { key: 'annualContributions', label: 'Federal Contributions' },
      { key: 'interestEarned', label: 'HSA Interest' },
      { key: 'dividendsEarned', label: 'HSA Dividends' },
      { key: 'capitalGainsEarned', label: 'HSA Capital Gains' },
      { key: 'scheduleCaAddition', label: 'CA Schedule CA Addition' },
      { key: 'distributions', label: 'Distributions' },
      { key: 'distributionCode', label: '1099-SA Code' },
      { key: 'notes', label: 'Audit Notes' },
    ]);
    downloadCsvFile('california-hsa-schedule-ca-additions.csv', csv);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining CA Non-Conformity */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-r-xl bg-slate-900">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-300 text-sm">
              California Revenue & Taxation Code (R&TC) Non-Conformity Notice
            </h4>
            <p className="text-slate-300 leading-relaxed">
              California <strong>does not conform</strong> to Internal Revenue Code § 223. HSA contributions deducted on federal Form 1040 Schedule 1 (Line 13) cannot be deducted on the California state return and must be added back as an addition on <strong>Schedule CA (Form 540)</strong>. Furthermore, all interest, dividends, and capital gains realized inside the HSA are <strong>fully taxable California income</strong> in the calendar year earned.
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Latest HSA Balance (FMV)</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">{formatCurrency(latestFmv)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Form 5498-SA Box 5 ({latestRecord?.year || 'Current'})</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cumulative CA Additions</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(totalAdditions)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total added to CA 540 state taxable income</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Inside-HSA Taxed Earnings</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalGrowthTaxed)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total interest, dividends & gains taxed by CA</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estimated CA Tax Incurred</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(totalAdditions * 0.093)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Estimated at CA 9.3% marginal tax bracket</p>
        </div>
      </div>

      {/* Historical Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
              <span>California HSA Non-Conformity Ledger (2021–2025)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks annual Form 5498-SA sums, exact interest/dividends, and Schedule CA 540 additions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportHsaCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Year Record</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tax Year</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4 text-right">Year-End FMV</th>
                <th className="py-3 px-4 text-right">Fed Contribution</th>
                <th className="py-3 px-4 text-right">Interest</th>
                <th className="py-3 px-4 text-right">Dividends</th>
                <th className="py-3 px-4 text-right">Cap Gains</th>
                <th className="py-3 px-4 text-right bg-amber-500/5 text-amber-300 font-bold">
                  CA Sch CA Addition
                </th>
                <th className="py-3 px-4">1099-SA Dist.</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white font-sans">{rec.year}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    <div>{rec.institution}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{rec.accountNumberMasked}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-100">{formatCurrency(rec.yearEndFmv)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(rec.annualContributions)}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">{formatCurrency(rec.interestEarned)}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">{formatCurrency(rec.dividendsEarned)}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">{formatCurrency(rec.capitalGainsEarned)}</td>
                  <td className="py-3 px-4 text-right font-bold text-amber-300 bg-amber-500/5">
                    {formatCurrency(rec.scheduleCaAddition)}
                  </td>
                  <td className="py-3 px-4 font-sans text-[11px]">
                    {rec.distributions > 0 ? (
                      <div>
                        <span className="font-mono text-slate-200">{formatCurrency(rec.distributions)}</span>
                        <div className="text-[10px] text-slate-400">{rec.distributionCode}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500">$0.00 (None)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingRecord(rec);
                          setIsModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        title="Edit record"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit & Compliance Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Form 540 Schedule CA Line-by-Line Mechanics</span>
          </h4>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">•</span>
              <span><strong>Schedule CA (540) Part I, Section B, Line 13:</strong> Enter total HSA contributions from federal Form 1040 Schedule 1 Line 13 in Column C (Additions).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">•</span>
              <span><strong>Interest & Dividend Additions:</strong> Enter total HSA interest in Line 2b Column C, and total HSA dividends in Line 3b Column C to prevent underreporting state gross income.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">•</span>
              <span><strong>Tax Basis in HSA:</strong> California grants you cost basis equal to your nondeductible contributions plus taxed earnings. When non-qualified distributions occur, only earnings not previously taxed are taxed again.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Corrected Excess Contributions Protocol</span>
          </h4>
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              When an excess HSA contribution is removed before the tax filing deadline:
            </p>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 font-mono text-[11px]">
              <div><strong>Form 1099-SA Box 3 Code 2:</strong> Excess contributions returned</div>
              <div><strong>Distribution Breakdown:</strong> Return of contribution (not subject to 20% penalty) + Net Income Attributable (taxable ordinary income).</div>
            </div>
            <p className="text-[11px] text-slate-400">
              For California, the original contribution was never deducted, so its return is non-taxable. Only the net earnings attributable are added to California income (if not already reported).
            </p>
          </div>
        </div>
      </div>

      <HsaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSave}
        initialRecord={editingRecord}
      />
    </div>
  );
};
