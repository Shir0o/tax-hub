import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { StatCard } from './components/StatCard';
import { HsaTracker } from './components/hsa/HsaTracker';
import { IraBasisTracker } from './components/ira/IraBasisTracker';
import { EstimatedTaxTracker } from './components/estimatedTax/EstimatedTaxTracker';
import { TaxChecklistView } from './components/checklist/TaxChecklistView';
import { ScheduleCAggregator } from './components/scheduleC/ScheduleCAggregator';

import { HsaRecord } from './types/hsa';
import { EstimatedTaxYearPlan } from './types/estimatedTax';
import { TaxDocumentItem, DeductibleLedgerItem } from './types/checklist';

import { INITIAL_HSA_RECORDS } from './data/hsaData';
import { INITIAL_ESTIMATED_TAX_PLANS } from './data/estimatedTaxData';
import { INITIAL_CHECKLIST_DOCUMENTS, INITIAL_DEDUCTIBLE_LEDGER } from './data/checklistData';
import { FORM_8606_HISTORICAL, EXCESS_ROTH_REMOVAL_2024 } from './data/iraData';

import { loadFromStorage, saveToStorage, clearTaxHubStorage } from './utils/storage';
import { downloadJsonFile } from './utils/exportHelpers';
import { formatCurrency } from './utils/formatters';

import { 
  HeartPulse, 
  Layers, 
  CalendarClock, 
  FileCheck2 
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hsa');

  // Persistent States
  const [hsaRecords, setHsaRecords] = useState<HsaRecord[]>(() =>
    loadFromStorage('hsa_records', INITIAL_HSA_RECORDS)
  );

  const [estimatedPlans, setEstimatedPlans] = useState<Record<number, EstimatedTaxYearPlan>>(() =>
    loadFromStorage('estimated_plans', INITIAL_ESTIMATED_TAX_PLANS)
  );

  const [documents, setDocuments] = useState<TaxDocumentItem[]>(() =>
    loadFromStorage('checklist_documents', INITIAL_CHECKLIST_DOCUMENTS)
  );

  const [deductibles, setDeductibles] = useState<DeductibleLedgerItem[]>(() =>
    loadFromStorage('deductible_ledger', INITIAL_DEDUCTIBLE_LEDGER)
  );

  // Sync to localStorage
  useEffect(() => {
    saveToStorage('hsa_records', hsaRecords);
  }, [hsaRecords]);

  useEffect(() => {
    saveToStorage('estimated_plans', estimatedPlans);
  }, [estimatedPlans]);

  useEffect(() => {
    saveToStorage('checklist_documents', documents);
  }, [documents]);

  useEffect(() => {
    saveToStorage('deductible_ledger', deductibles);
  }, [deductibles]);

  // Handle Full Reset to Canonical Seeds
  const handleResetDefaults = () => {
    clearTaxHubStorage();
    setHsaRecords(INITIAL_HSA_RECORDS);
    setEstimatedPlans(INITIAL_ESTIMATED_TAX_PLANS);
    setDocuments(INITIAL_CHECKLIST_DOCUMENTS);
    setDeductibles(INITIAL_DEDUCTIBLE_LEDGER);
  };

  // Export Full JSON Portfolio
  const handleExportAll = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      hsaNonConformityRecords: hsaRecords,
      iraBasisForm8606: FORM_8606_HISTORICAL,
      excessRothRemoval: EXCESS_ROTH_REMOVAL_2024,
      estimatedQuarterlyTaxPlans: estimatedPlans,
      masterChecklistDocuments: documents,
      deductibleLedgerItems: deductibles,
    };
    downloadJsonFile(`tax-hub-complete-portfolio-${new Date().toISOString().split('T')[0]}.json`, backup);
  };

  // Global Stat Calculations
  const latestHsaFmv = hsaRecords[hsaRecords.length - 1]?.yearEndFmv || 21250;
  const plan2025 = estimatedPlans[2025];
  const fedSafeHarbor2025 = plan2025?.federalSafeHarborTarget || 14250;
  const docsReceived2024 = documents.filter((d) => d.year === 2024 && d.status === 'received').length;
  const docsTotal2024 = documents.filter((d) => d.year === 2024).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header onResetDefaults={handleResetDefaults} onExportAll={handleExportAll} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Overview Stat Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="California HSA Non-Conformity"
            value={formatCurrency(latestHsaFmv)}
            subtitle="Form 5498-SA FMV Balance"
            icon={<HeartPulse className="w-5 h-5 text-emerald-400" />}
            badge={{
              text: 'Sch CA Addition: $4,745.00',
              variant: 'warning',
            }}
          />

          <StatCard
            title="Traditional IRA Basis (8606)"
            value="$0.00"
            subtitle="Fully utilized in 2024 Roth conversion"
            icon={<Layers className="w-5 h-5 text-purple-400" />}
            badge={{
              text: '$12k Basis Absorbed • Zero Double Tax',
              variant: 'success',
            }}
          />

          <StatCard
            title="2025 Quarterly Safe Harbor"
            value={formatCurrency(fedSafeHarbor2025)}
            subtitle="110% Prior Year Safe Harbor Target"
            icon={<CalendarClock className="w-5 h-5 text-blue-400" />}
            badge={{
              text: 'CA 30/40/0/30 Mode Active',
              variant: 'info',
            }}
          />

          <StatCard
            title="Tax Readiness (2024)"
            value={`${docsReceived2024}/${docsTotal2024}`}
            subtitle="Master Checklist Documents Verified"
            icon={<FileCheck2 className="w-5 h-5 text-emerald-400" />}
            badge={{
              text: 'Ready to File',
              variant: 'success',
            }}
          />
        </div>

        {/* Tab Route Switching */}
        {activeTab === 'hsa' && (
          <HsaTracker records={hsaRecords} onUpdateRecords={setHsaRecords} />
        )}

        {activeTab === 'ira' && (
          <IraBasisTracker />
        )}

        {activeTab === 'estimated' && (
          <EstimatedTaxTracker plans={estimatedPlans} onUpdatePlans={setEstimatedPlans} />
        )}

        {activeTab === 'checklist' && (
          <TaxChecklistView
            documents={documents}
            deductibles={deductibles}
            onUpdateDocuments={setDocuments}
            onUpdateDeductibles={setDeductibles}
          />
        )}

        {activeTab === 'scheduleC' && (
          <ScheduleCAggregator />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="font-medium text-slate-400">
            Tax Hub • Personal Operations Suite
          </p>
          <p>
            Compliant with IRC § 223 (HSA), § 408A (Roth conversions), § 4973 / 5329 (Excess removals), and CA R&TC § 17131 / 19136.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
