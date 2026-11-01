import React, { useState } from 'react';
import { DeductibleLedgerItem, DeductibleCategory } from '../../types/checklist';
import { X, Save } from 'lucide-react';

interface AddDeductibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  onSave: (item: DeductibleLedgerItem) => void;
  initialItem?: DeductibleLedgerItem | null;
}

export const AddDeductibleModal: React.FC<AddDeductibleModalProps> = ({
  isOpen,
  onClose,
  year,
  onSave,
  initialItem,
}) => {
  const [description, setDescription] = useState(initialItem?.description || '');
  const [date, setDate] = useState(initialItem?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<DeductibleCategory>(initialItem?.category || 'Ministry & Religious');
  const [amount, setAmount] = useState<number>(initialItem?.amount || 0);
  const [scheduleCategory, setScheduleCategory] = useState<DeductibleLedgerItem['scheduleCategory']>(
    initialItem?.scheduleCategory || 'Schedule A (Charity)'
  );
  const [receiptStatus, setReceiptStatus] = useState<DeductibleLedgerItem['receiptStatus']>(
    initialItem?.receiptStatus || 'verified'
  );
  const [notes, setNotes] = useState(initialItem?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: DeductibleLedgerItem = {
      id: initialItem?.id || `ded-${year}-${Date.now()}`,
      year,
      date,
      description,
      category,
      amount,
      isExemptOrDeductible: true,
      scheduleCategory,
      receiptStatus,
      notes,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {initialItem ? 'Edit Deductible Entry' : `Record Deductible / Exempt Expense (${year})`}
            </h3>
            <p className="text-xs text-slate-400">Track ministry, professional, education, and retreat write-offs.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Ministry books subscription, Pro support"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Expense Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DeductibleCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Ministry & Religious">Ministry & Religious</option>
                <option value="Professional & Subscriptions">Professional & Subscriptions</option>
                <option value="Education & Language">Education & Language</option>
                <option value="Community & Retreat">Community & Retreat</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tax Schedule Target</label>
              <select
                value={scheduleCategory}
                onChange={(e) => setScheduleCategory(e.target.value as DeductibleLedgerItem['scheduleCategory'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Schedule A (Charity)">Schedule A (Charitable / Religious)</option>
                <option value="Schedule C (Business/Self-Employed)">Schedule C (Business / Self-Employed)</option>
                <option value="Unreimbursed/Exempt">Unreimbursed / Tax-Exempt</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Receipt Verification Status</label>
            <select
              value={receiptStatus}
              onChange={(e) => setReceiptStatus(e.target.value as DeductibleLedgerItem['receiptStatus'])}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="verified">Verified Receipt on File</option>
              <option value="pending">Pending Receipt Ingestion</option>
              <option value="none">No Receipt / Bank Record Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Audit Notes / Item Purpose</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Young adult spring retreat registration, pro support tooling..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Deductible</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
