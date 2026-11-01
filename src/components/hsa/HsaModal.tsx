import React, { useState } from 'react';
import { HsaRecord } from '../../types/hsa';
import { X, Save, AlertCircle } from 'lucide-react';

interface HsaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: HsaRecord) => void;
  initialRecord?: HsaRecord | null;
}

export const HsaModal: React.FC<HsaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
}) => {
  const [year, setYear] = useState<number>(initialRecord?.year || 2025);
  const [institution, setInstitution] = useState<string>(initialRecord?.institution || 'HealthEquity');
  const [accountNumberMasked, setAccountNumberMasked] = useState<string>(initialRecord?.accountNumberMasked || '••••7204');
  const [yearEndFmv, setYearEndFmv] = useState<number>(initialRecord?.yearEndFmv || 0);
  const [annualContributions, setAnnualContributions] = useState<number>(initialRecord?.annualContributions || 0);
  const [distributions, setDistributions] = useState<number>(initialRecord?.distributions || 0);
  const [distributionCode, setDistributionCode] = useState<string>(initialRecord?.distributionCode || '1 - Normal distribution');
  const [interestEarned, setInterestEarned] = useState<number>(initialRecord?.interestEarned || 0);
  const [dividendsEarned, setDividendsEarned] = useState<number>(initialRecord?.dividendsEarned || 0);
  const [capitalGainsEarned, setCapitalGainsEarned] = useState<number>(initialRecord?.capitalGainsEarned || 0);
  const [notes, setNotes] = useState<string>(initialRecord?.notes || '');

  if (!isOpen) return null;

  const calculatedAddition = annualContributions + interestEarned + dividendsEarned + capitalGainsEarned;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: HsaRecord = {
      id: initialRecord?.id || `hsa-${year}-${Date.now()}`,
      year,
      institution,
      accountNumberMasked,
      yearEndFmv,
      annualContributions,
      distributions,
      distributionCode,
      interestEarned,
      dividendsEarned,
      capitalGainsEarned,
      scheduleCaAddition: calculatedAddition,
      notes,
    };
    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {initialRecord ? `Edit HSA Record (${initialRecord.year})` : 'Add California HSA Non-Conformity Record'}
            </h3>
            <p className="text-xs text-slate-400">
              California R&TC requires tracking interest, dividends, and full contribution add-back.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tax Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2025)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Custodian / Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Masked Account #</label>
              <input
                type="text"
                value={accountNumberMasked}
                onChange={(e) => setAccountNumberMasked(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Year-End FMV (Form 5498-SA Box 5)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={yearEndFmv}
                  onChange={(e) => setYearEndFmv(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Annual Contributions (Fed 1040 Sch 1 Line 13)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={annualContributions}
                  onChange={(e) => setAnnualContributions(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              California Taxable Growth Elements (Inside HSA)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Realized Interest</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={interestEarned}
                    onChange={(e) => setInterestEarned(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Realized Dividends</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={dividendsEarned}
                    onChange={(e) => setDividendsEarned(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Capital Gains</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={capitalGainsEarned}
                    onChange={(e) => setCapitalGainsEarned(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Distributions (Form 1099-SA Box 1)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={distributions}
                  onChange={(e) => setDistributions(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                1099-SA Distribution Code (Box 3)
              </label>
              <select
                value={distributionCode}
                onChange={(e) => setDistributionCode(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="1 - Normal distribution">1 - Normal qualified medical distribution</option>
                <option value="2 - Excess contributions returned">2 - Excess contributions returned with earnings</option>
                <option value="3 - Disability">3 - Disability</option>
                <option value="4 - Death distribution">4 - Death distribution</option>
                <option value="5 - Prohibited transaction">5 - Prohibited transaction</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-emerald-400">Total CA Schedule CA (540) Addition</span>
              <p className="text-[11px] text-slate-400">Contributions + Interest + Dividends + Cap Gains</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-400">${calculatedAddition.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Audit Notes / Document Ref</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Form 5498-SA confirmed, excess contribution return code 2 details..."
              className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-750 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
