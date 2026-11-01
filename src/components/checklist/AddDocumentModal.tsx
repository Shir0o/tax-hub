import React, { useState } from 'react';
import { TaxDocumentItem } from '../../types/checklist';
import { X, Save } from 'lucide-react';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  onSave: (doc: TaxDocumentItem) => void;
  initialDoc?: TaxDocumentItem | null;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  year,
  onSave,
  initialDoc,
}) => {
  const [name, setName] = useState(initialDoc?.name || '');
  const [code, setCode] = useState(initialDoc?.code || '');
  const [category, setCategory] = useState<TaxDocumentItem['category']>(initialDoc?.category || 'Income');
  const [issuer, setIssuer] = useState(initialDoc?.issuer || '');
  const [status, setStatus] = useState<TaxDocumentItem['status']>(initialDoc?.status || 'received');
  const [dateReceived, setDateReceived] = useState(initialDoc?.dateReceived || new Date().toISOString().split('T')[0]);
  const [referenceOrLink, setReferenceOrLink] = useState(initialDoc?.referenceOrLink || '');
  const [notes, setNotes] = useState(initialDoc?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc: TaxDocumentItem = {
      id: initialDoc?.id || `doc-${year}-${Date.now()}`,
      year,
      name,
      code,
      category,
      issuer,
      status,
      dateReceived: status === 'received' ? dateReceived : undefined,
      referenceOrLink,
      notes,
    };
    onSave(doc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {initialDoc ? 'Edit Tax Document' : `Add Tax Document (${year})`}
            </h3>
            <p className="text-xs text-slate-400">Track required tax forms, schedules, and issuer records.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Document Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Form W-2 Wage Statement"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tax Code / Form Identifier</label>
              <input
                type="text"
                required
                placeholder="e.g. W2-CAPONE, 1099-INT"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaxDocumentItem['category'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Income">Income (W-2, 1099-NEC)</option>
                <option value="Healthcare">Healthcare (1095-A, 1099-SA)</option>
                <option value="Retirement">Retirement (5498, 1099-R)</option>
                <option value="Investments">Investments (1099-DIV/INT/B)</option>
                <option value="Education">Education (1098-E)</option>
                <option value="Returns">Returns (Form 1040, CA 540)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Issuer / Entity</label>
              <input
                type="text"
                placeholder="e.g. Fidelity, Vanguard"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaxDocumentItem['status'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="received">Received / Uploaded</option>
                <option value="pending">Pending Issuer Delivery</option>
                <option value="missing">Missing / Action Needed</option>
                <option value="not_applicable">Not Applicable</option>
              </select>
            </div>
          </div>

          {status === 'received' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date Received</label>
                <input
                  type="date"
                  value={dateReceived}
                  onChange={(e) => setDateReceived(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">File Ref / PDF Path</label>
                <input
                  type="text"
                  placeholder="e.g. tax_docs_2024/w2.pdf"
                  value={referenceOrLink}
                  onChange={(e) => setReferenceOrLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Box 12 codes, excess removal notes..."
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
              <span>Save Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
