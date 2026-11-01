import React from 'react';
import { EstimatedTaxYearPlan } from '../../types/estimatedTax';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Scale } from 'lucide-react';

interface SafeHarborCalculatorProps {
  plan: EstimatedTaxYearPlan;
  onUpdatePlan: (updated: EstimatedTaxYearPlan) => void;
}

export const SafeHarborCalculator: React.FC<SafeHarborCalculatorProps> = ({
  plan,
  onUpdatePlan,
}) => {
  const isHighIncomePriorYear = plan.priorYearAgi > 150000;

  const handleInputChange = (field: keyof EstimatedTaxYearPlan, val: number | string) => {
    const updated = { ...plan, [field]: val };

    // Recalculate safe harbor targets
    const priorTax = field === 'priorYearTaxLiability' ? (val as number) : plan.priorYearTaxLiability;
    const fedWithholding = field === 'estimatedW2WithholdingFederal' ? (val as number) : plan.estimatedW2WithholdingFederal;
    const caWithholding = field === 'estimatedW2WithholdingCalifornia' ? (val as number) : plan.estimatedW2WithholdingCalifornia;
    const estFedTotal = field === 'totalFederalEstimatedTax' ? (val as number) : plan.totalFederalEstimatedTax;
    const estCaTotal = field === 'totalCaliforniaEstimatedTax' ? (val as number) : plan.totalCaliforniaEstimatedTax;
    const currentSafeHarborType = field === 'safeHarborType' ? val : plan.safeHarborType;

    let fedBase = priorTax;
    if (currentSafeHarborType === 'prior_year_110') {
      fedBase = priorTax * 1.10;
    } else if (currentSafeHarborType === 'prior_year_100') {
      fedBase = priorTax * 1.00;
    } else if (currentSafeHarborType === 'current_year_90') {
      fedBase = estFedTotal * 0.90;
    }

    const fedRemainingTarget = Math.max(0, fedBase - fedWithholding);
    const caRemainingTarget = Math.max(0, estCaTotal - caWithholding);

    updated.federalSafeHarborTarget = fedRemainingTarget;
    updated.californiaSafeHarborTarget = caRemainingTarget;

    // Update installments targets (Fed 25% each; CA 30%, 40%, 0%, 30%)
    updated.installments = plan.installments.map((inst) => {
      const fTarget = (fedRemainingTarget * inst.federalPercentage) / 100;
      const cTarget = (caRemainingTarget * inst.californiaPercentage) / 100;
      return {
        ...inst,
        federalTarget: fTarget,
        californiaTarget: cTarget,
      };
    });

    onUpdatePlan(updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-slate-100">
            IRS & California Safe Harbor Rules Engine ({plan.year})
          </h4>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          {plan.safeHarborType === 'prior_year_110' ? (
            <span className="px-2.5 py-1 rounded-full font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              110% Prior Year Safe Harbor (AGI &gt; $150k)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Prior Year Safe Harbor
            </span>
          )}
        </div>
      </div>

      {/* Input parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Prior Year ({plan.year - 1}) AGI
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">$</span>
            <input
              type="number"
              step="1000"
              value={plan.priorYearAgi}
              onChange={(e) => handleInputChange('priorYearAgi', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          {isHighIncomePriorYear && (
            <p className="text-[10px] text-amber-400 mt-1">Exceeds $150k limit: 110% rule mandated</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Prior Year ({plan.year - 1}) Total Tax
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">$</span>
            <input
              type="number"
              step="500"
              value={plan.priorYearTaxLiability}
              onChange={(e) => handleInputChange('priorYearTaxLiability', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">From prior Form 1040 Line 24</p>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Est. W-2 Fed Withholding ({plan.year})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">$</span>
            <input
              type="number"
              step="500"
              value={plan.estimatedW2WithholdingFederal}
              onChange={(e) => handleInputChange('estimatedW2WithholdingFederal', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Reduces quarterly 1040-ES due</p>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Safe Harbor Selection
          </label>
          <select
            value={plan.safeHarborType}
            onChange={(e) => handleInputChange('safeHarborType', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="prior_year_100">100% of Prior Year Tax (AGI ≤ $150k)</option>
            <option value="prior_year_110">110% of Prior Year Tax (AGI &gt; $150k)</option>
            <option value="current_year_90">90% of Current Year Tax Estimate</option>
          </select>
          <p className="text-[10px] text-emerald-400 mt-1">Recommended: {isHighIncomePriorYear ? '110%' : '100%'}</p>
        </div>
      </div>

      {/* Target results banner */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Federal Quarterly Requirement:</span>
            <span className="font-bold text-blue-400 font-mono">
              {formatCurrency(plan.federalSafeHarborTarget)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Divided equally into 4 installments of {formatCurrency(plan.federalSafeHarborTarget / 4)} each.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total California Requirement (540-ES):</span>
            <span className="font-bold text-amber-400 font-mono">
              {formatCurrency(plan.californiaSafeHarborTarget)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Apportioned using CA 30% / 40% / 0% / 30% schedule.
          </p>
        </div>
      </div>
    </div>
  );
};
