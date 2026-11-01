import React, { useState } from 'react';
import { EstimatedTaxYearPlan, QuarterlyInstallment } from '../../types/estimatedTax';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SafeHarborCalculator } from './SafeHarborCalculator';
import { PaymentModal } from './PaymentModal';
import { 
  CalendarClock, 
  ExternalLink, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

interface EstimatedTaxTrackerProps {
  plans: Record<number, EstimatedTaxYearPlan>;
  onUpdatePlans: (plans: Record<number, EstimatedTaxYearPlan>) => void;
}

export const EstimatedTaxTracker: React.FC<EstimatedTaxTrackerProps> = ({
  plans,
  onUpdatePlans,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [activeInstallment, setActiveInstallment] = useState<QuarterlyInstallment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPlan = plans[selectedYear] || plans[2025];

  const handleUpdatePlan = (updatedPlan: EstimatedTaxYearPlan) => {
    onUpdatePlans({
      ...plans,
      [updatedPlan.year]: updatedPlan,
    });
  };

  const handleSaveInstallment = (updatedInstallment: QuarterlyInstallment) => {
    const updatedInstallments = currentPlan.installments.map((inst) =>
      inst.quarter === updatedInstallment.quarter ? updatedInstallment : inst
    );
    handleUpdatePlan({
      ...currentPlan,
      installments: updatedInstallments,
    });
  };

  const totalFedPaid = currentPlan.installments.reduce((sum, i) => sum + i.federalPaid, 0);
  const totalCaPaid = currentPlan.installments.reduce((sum, i) => sum + i.californiaPaid, 0);
  const fedRemaining = Math.max(0, currentPlan.federalSafeHarborTarget - totalFedPaid);
  const caRemaining = Math.max(0, currentPlan.californiaSafeHarborTarget - totalCaPaid);

  return (
    <div className="space-y-6">
      {/* Top Banner and Year Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-400" />
            <span>Quarterly Estimated Tax Tracker & Safe Harbor Engine</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manages IRS Form 1040-ES installments and California Form 540-ES (30/40/0/30) statutory requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {[2024, 2025].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
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

      {/* Safe Harbor Calculator */}
      <SafeHarborCalculator plan={currentPlan} onUpdatePlan={handleUpdatePlan} />

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Federal Paid</span>
          <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">{formatCurrency(totalFedPaid)}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Target: {formatCurrency(currentPlan.federalSafeHarborTarget)} ({formatCurrency(fedRemaining)} remaining)
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">California Paid</span>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{formatCurrency(totalCaPaid)}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Target: {formatCurrency(currentPlan.californiaSafeHarborTarget)} ({formatCurrency(caRemaining)} remaining)
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Federal Safe Harbor</span>
          <div className="flex items-center space-x-2 mt-1">
            {totalFedPaid >= currentPlan.federalSafeHarborTarget ? (
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Target Met
              </span>
            ) : (
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 mr-1" />
                In Progress
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">No IRS underpayment penalties</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">California 30/40/0/30</span>
          <div className="flex items-center space-x-2 mt-1">
            {totalCaPaid >= currentPlan.californiaSafeHarborTarget ? (
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Target Met
              </span>
            ) : (
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 mr-1" />
                In Progress
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Complies with FTB R&TC § 19136</p>
        </div>
      </div>

      {/* Quarterly Installments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{selectedYear} Quarterly Installment Schedule</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              California requires 30% in Q1, 40% in Q2, 0% in Q3, and 30% in Q4. Federal requires 25% each quarter.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="https://www.irs.gov/payments/direct-pay"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition-colors"
            >
              <span>IRS Direct Pay</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.ftb.ca.gov/pay/index.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 transition-colors"
            >
              <span>FTB Web Pay</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-sans font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Quarter</th>
                <th className="py-3 px-4 font-sans">Federal (1040-ES)</th>
                <th className="py-3 px-4 text-right">Fed Target (25%)</th>
                <th className="py-3 px-4 text-right">Fed Paid</th>
                <th className="py-3 px-4 font-sans">California (540-ES)</th>
                <th className="py-3 px-4 text-right">CA Target</th>
                <th className="py-3 px-4 text-right">CA Paid</th>
                <th className="py-3 px-4 font-sans text-center">Status</th>
                <th className="py-3 px-4 font-sans text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {currentPlan.installments.map((inst) => (
                <tr key={inst.quarter} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white font-sans">
                    <div className="text-sm">{inst.quarter}</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(inst.federalDueDate)}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <div className="text-slate-200">25% Federal Due</div>
                    {inst.federalConfirmation ? (
                      <span className="text-[10px] text-blue-400 font-mono block">
                        Conf: {inst.federalConfirmation}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-sans">Pending</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-300">
                    {formatCurrency(inst.federalTarget)}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-blue-400">
                    {formatCurrency(inst.federalPaid)}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <div className="text-slate-200">{inst.californiaPercentage}% California Due</div>
                    {inst.californiaPercentage === 0 ? (
                      <span className="text-[10px] text-emerald-400/80 font-mono">Statutory 0% Q3</span>
                    ) : inst.californiaConfirmation ? (
                      <span className="text-[10px] text-amber-400 font-mono block">
                        Conf: {inst.californiaConfirmation}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-sans">Pending</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-300">
                    {formatCurrency(inst.californiaTarget)}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-amber-400">
                    {formatCurrency(inst.californiaPaid)}
                  </td>

                  <td className="py-3 px-4 text-center font-sans">
                    {inst.status === 'paid' ? (
                      <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Paid
                      </span>
                    ) : inst.status === 'partial' ? (
                      <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Partial
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center font-sans">
                    <button
                      onClick={() => {
                        setActiveInstallment(inst);
                        setIsModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeInstallment && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveInstallment(null);
          }}
          installment={activeInstallment}
          year={selectedYear}
          onSavePayment={handleSaveInstallment}
        />
      )}
    </div>
  );
};
