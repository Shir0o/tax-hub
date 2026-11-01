import React, { useState } from 'react';
import { DeductibleLedgerItem } from '../../types/checklist';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { AddDeductibleModal } from './AddDeductibleModal';
import { 
  Receipt, 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { downloadCsvFile, convertArrayToCsv } from '../../utils/exportHelpers';

interface DeductiblesLedgerProps {
  items: DeductibleLedgerItem[];
  year: number;
  onUpdateItems: (items: DeductibleLedgerItem[]) => void;
}

export const DeductiblesLedger: React.FC<DeductiblesLedgerProps> = ({
  items,
  year,
  onUpdateItems,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeductibleLedgerItem | null>(null);

  const yearItems = items.filter((i) => i.year === year);
  const totalAmount = yearItems.reduce((sum, i) => sum + i.amount, 0);

  // Totals by schedule
  const totalSchA = yearItems
    .filter((i) => i.scheduleCategory === 'Schedule A (Charity)')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalSchC = yearItems
    .filter((i) => i.scheduleCategory === 'Schedule C (Business/Self-Employed)')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleSave = (item: DeductibleLedgerItem) => {
    const exists = items.some((i) => i.id === item.id);
    let updated: DeductibleLedgerItem[];
    if (exists) {
      updated = items.map((i) => (i.id === item.id ? item : i));
    } else {
      updated = [...items, item];
    }
    onUpdateItems(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this deductible expense item?')) {
      onUpdateItems(items.filter((i) => i.id !== id));
    }
  };

  const handleExportCsv = () => {
    const csv = convertArrayToCsv(yearItems as unknown as Record<string, unknown>[], [
      { key: 'date', label: 'Date' },
      { key: 'description', label: 'Description' },
      { key: 'category', label: 'Category' },
      { key: 'amount', label: 'Amount' },
      { key: 'scheduleCategory', label: 'Target Schedule' },
      { key: 'receiptStatus', label: 'Receipt Status' },
      { key: 'notes', label: 'Notes' },
    ]);
    downloadCsvFile(`tax-deductibles-ledger-${year}.csv`, csv);
  };

  return (
    <div className="space-y-4">
      {/* Category Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total {year} Deductibles
          </span>
          <div className="text-2xl font-bold text-slate-100 mt-1 font-mono">
            {formatCurrency(totalAmount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{yearItems.length} logged items</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Schedule A (Religious / Charity)
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
            {formatCurrency(totalSchA)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ministry books, retreat, hospitality</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Schedule C (Business / Pro)
          </span>
          <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">
            {formatCurrency(totalSchC)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pimsleur, Pro support ($44.99)</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>{year} Deductible & Tax-Exempt Ledger</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks ministry, educational, and professional expenses with receipt audit verification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deductible</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-sans font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 font-sans">Description</th>
                <th className="py-2.5 px-4 font-sans">Category</th>
                <th className="py-2.5 px-4 font-sans">Tax Schedule</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 font-sans text-center">Receipt</th>
                <th className="py-2.5 px-4 font-sans text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {yearItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 text-slate-400">{formatDate(item.date)}</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-white">
                    <div>{item.description}</div>
                    {item.notes && <div className="text-[10px] text-slate-400 font-sans">{item.notes}</div>}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-sans text-xs">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.scheduleCategory?.includes('Schedule A')
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : item.scheduleCategory?.includes('Schedule C')
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.scheduleCategory || 'General'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-2.5 px-4 text-center font-sans">
                    {item.receiptStatus === 'verified' ? (
                      <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    ) : item.receiptStatus === 'pending' ? (
                      <span className="inline-flex items-center text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        Bank Only
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-center font-sans">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        title="Edit entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete entry"
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

      <AddDeductibleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        year={year}
        onSave={handleSave}
        initialItem={editingItem}
      />
    </div>
  );
};
