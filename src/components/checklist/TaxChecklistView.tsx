import React, { useState } from 'react';
import { TaxDocumentItem, DeductibleLedgerItem } from '../../types/checklist';
import { TAX_YEAR_PROFILES } from '../../data/checklistData';
import { DeductiblesLedger } from './DeductiblesLedger';
import { AddDocumentModal } from './AddDocumentModal';
import { 
  CheckSquare, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MinusCircle, 
  Edit3, 
  Trash2, 
  Receipt 
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface TaxChecklistViewProps {
  documents: TaxDocumentItem[];
  deductibles: DeductibleLedgerItem[];
  onUpdateDocuments: (docs: TaxDocumentItem[]) => void;
  onUpdateDeductibles: (items: DeductibleLedgerItem[]) => void;
}

export const TaxChecklistView: React.FC<TaxChecklistViewProps> = ({
  documents,
  deductibles,
  onUpdateDocuments,
  onUpdateDeductibles,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [subView, setSubView] = useState<'documents' | 'deductibles'>('documents');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<TaxDocumentItem | null>(null);

  const profile = TAX_YEAR_PROFILES[selectedYear] || TAX_YEAR_PROFILES[2025];
  const yearDocs = documents.filter((d) => d.year === selectedYear);

  const receivedCount = yearDocs.filter((d) => d.status === 'received').length;
  const pendingCount = yearDocs.filter((d) => d.status === 'pending').length;
  const missingCount = yearDocs.filter((d) => d.status === 'missing').length;

  const handleStatusToggle = (doc: TaxDocumentItem) => {
    const nextStatusMap: Record<TaxDocumentItem['status'], TaxDocumentItem['status']> = {
      received: 'pending',
      pending: 'missing',
      missing: 'not_applicable',
      not_applicable: 'received',
    };
    const nextStatus = nextStatusMap[doc.status];
    const updated = documents.map((d) =>
      d.id === doc.id
        ? {
            ...d,
            status: nextStatus,
            dateReceived: nextStatus === 'received' ? new Date().toISOString().split('T')[0] : d.dateReceived,
          }
        : d
    );
    onUpdateDocuments(updated);
  };

  const handleSaveDoc = (savedDoc: TaxDocumentItem) => {
    const exists = documents.some((d) => d.id === savedDoc.id);
    let updated: TaxDocumentItem[];
    if (exists) {
      updated = documents.map((d) => (d.id === savedDoc.id ? savedDoc : d));
    } else {
      updated = [...documents, savedDoc];
    }
    onUpdateDocuments(updated);
  };

  const handleDeleteDoc = (id: string) => {
    if (window.confirm('Delete this tax checklist document?')) {
      onUpdateDocuments(documents.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Year Switcher and Filing Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>Annual Tax Checklists & Deductibles Ledger</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-seeded master forms (2021–2025), filing modes, and 2025 expense ledger write-offs.
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start md:self-auto overflow-x-auto">
          {[2021, 2022, 2023, 2024, 2025].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedYear === yr
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Tax Year Profile Callout Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-slate-100">Tax Year {selectedYear} Profile</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  profile.deductionType === 'Itemized'
                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                    : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                }`}
              >
                {profile.deductionType} Deductions Mode
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {profile.filingStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {selectedYear <= 2022
                ? 'Historical itemized return (Schedule A mortgage/interest, state taxes, charitable contributions).'
                : 'Standard deduction elected ($14.6k+ for Single). Deductibles categorized for Schedule C & tax-exempt records.'}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setSubView('documents')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              subView === 'documents'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Master Checklist ({yearDocs.length})</span>
          </button>
          <button
            onClick={() => setSubView('deductibles')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              subView === 'deductibles'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Deductibles Ledger</span>
          </button>
        </div>
      </div>

      {subView === 'deductibles' ? (
        <DeductiblesLedger
          items={deductibles}
          year={selectedYear}
          onUpdateItems={onUpdateDeductibles}
        />
      ) : (
        <div className="space-y-4">
          {/* Status Counter Chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              {receivedCount} Received
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {pendingCount} Pending Issuer
            </span>
            {missingCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                {missingCount} Missing / Action Required
              </span>
            )}
          </div>

          {/* Master Document Checklist Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>{selectedYear} Master Tax Document Checklist</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Click status pill to toggle between Received / Pending / Missing / N/A.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingDoc(null);
                  setIsDocModalOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Form / Doc</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Code / Form</th>
                    <th className="py-2.5 px-4">Document Description</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Issuer</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4">Received / Path</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {yearDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {doc.code}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        <div>{doc.name}</div>
                        {doc.notes && (
                          <div className="text-[11px] text-slate-400 font-sans mt-0.5">{doc.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{doc.issuer}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleStatusToggle(doc)}
                          className={`inline-flex items-center text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                            doc.status === 'received'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : doc.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                              : doc.status === 'missing'
                              ? 'bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                          title="Click to cycle status"
                        >
                          {doc.status === 'received' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {doc.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {doc.status === 'missing' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {doc.status === 'not_applicable' && <MinusCircle className="w-3 h-3 mr-1" />}
                          <span className="capitalize">{doc.status.replace('_', ' ')}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {doc.referenceOrLink ? (
                          <div className="flex items-center space-x-1 text-slate-300">
                            <span className="truncate max-w-[140px]">{doc.referenceOrLink}</span>
                            <span className="text-[10px] text-slate-500">({formatDate(doc.dateReceived)})</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Not on file</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingDoc(doc);
                              setIsDocModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            title="Edit document"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
                            title="Delete document"
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
        </div>
      )}

      <AddDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => {
          setIsDocModalOpen(false);
          setEditingDoc(null);
        }}
        year={selectedYear}
        onSave={handleSaveDoc}
        initialDoc={editingDoc}
      />
    </div>
  );
};
