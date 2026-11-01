import React, { useState } from 'react';
import { QuarterlyInstallment } from '../../types/estimatedTax';
import { X, Save } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  installment: QuarterlyInstallment;
  year: number;
  onSavePayment: (updated: QuarterlyInstallment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  installment,
  year,
  onSavePayment,
}) => {
  const [fedPaid, setFedPaid] = useState<number>(installment.federalPaid);
  const [caPaid, setCaPaid] = useState<number>(installment.californiaPaid);
  const [fedConfirm, setFedConfirm] = useState<string>(installment.federalConfirmation || '');
  const [caConfirm, setCaConfirm] = useState<string>(installment.californiaConfirmation || '');
  const [fedDate, setFedDate] = useState<string>(installment.federalPaidDate || new Date().toISOString().split('T')[0]);
  const [caDate, setCaDate] = useState<string>(installment.californiaPaidDate || new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFullyPaid = fedPaid >= installment.federalTarget && caPaid >= installment.californiaTarget;
    const isPartial = fedPaid > 0 || caPaid > 0;

    const updated: QuarterlyInstallment = {
      ...installment,
      federalPaid: fedPaid,
      californiaPaid: caPaid,
      federalConfirmation: fedConfirm,
      californiaConfirmation: caConfirm,
      federalPaidDate: fedDate,
      californiaPaidDate: caDate,
      status: isFullyPaid ? 'paid' : isPartial ? 'partial' : 'pending',
    };
    onSavePayment(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Record {installment.quarter} Estimated Tax Payment ({year})
            </h3>
            <p className="text-xs text-slate-400">
              Update IRS Form 1040-ES and CA Form 540-ES remittance records.
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
          {/* Federal Section */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-400">Federal 1040-ES (25% Installment)</span>
              <span className="text-xs font-mono text-slate-400">Target: ${installment.federalTarget.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Amount Paid</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={fedPaid}
                    onChange={(e) => setFedPaid(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Date Paid</label>
                <input
                  type="date"
                  value={fedDate}
                  onChange={(e) => setFedDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">IRS Direct Pay Confirmation #</label>
              <input
                type="text"
                placeholder="e.g. IRS-PAY-123456"
                value={fedConfirm}
                onChange={(e) => setFedConfirm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* California Section */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400">
                California 540-ES ({installment.californiaPercentage}% Installment)
              </span>
              <span className="text-xs font-mono text-slate-400">Target: ${installment.californiaTarget.toFixed(2)}</span>
            </div>
            {installment.californiaPercentage === 0 ? (
              <p className="text-xs text-slate-400 italic">
                California Q3 installment is 0% pursuant to R&TC § 19136 (30/40/0/30 rule). No payment due.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Amount Paid</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500 text-xs">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={caPaid}
                        onChange={(e) => setCaPaid(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Date Paid</label>
                    <input
                      type="date"
                      value={caDate}
                      onChange={(e) => setCaDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">FTB Web Pay Confirmation #</label>
                  <input
                    type="text"
                    placeholder="e.g. FTB-WEB-987654"
                    value={caConfirm}
                    onChange={(e) => setCaConfirm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </>
            )}
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
              <span>Save Remittance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
