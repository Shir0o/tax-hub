import React, { useState } from 'react';
import { VehicleHubExport, BudgetHubExport } from '../../types/scheduleC';
import { MOCK_VEHICLE_HUB_EXPORT_2025, MOCK_BUDGET_HUB_EXPORT_2025 } from '../../data/scheduleCData';
import { X, RefreshCw, Upload, FileCode } from 'lucide-react';

interface VehicleBudgetIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngest: (vehicleData: VehicleHubExport, budgetData: BudgetHubExport) => void;
}

export const VehicleBudgetIngestionModal: React.FC<VehicleBudgetIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngest,
}) => {
  const [vehicleJson, setVehicleJson] = useState<string>(
    JSON.stringify(MOCK_VEHICLE_HUB_EXPORT_2025, null, 2)
  );
  const [budgetJson, setBudgetJson] = useState<string>(
    JSON.stringify(MOCK_BUDGET_HUB_EXPORT_2025, null, 2)
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoadDefaults = () => {
    setVehicleJson(JSON.stringify(MOCK_VEHICLE_HUB_EXPORT_2025, null, 2));
    setBudgetJson(JSON.stringify(MOCK_BUDGET_HUB_EXPORT_2025, null, 2));
    setError(null);
  };

  const handleApply = () => {
    try {
      const parsedVehicle = JSON.parse(vehicleJson) as VehicleHubExport;
      const parsedBudget = JSON.parse(budgetJson) as BudgetHubExport;

      if (!parsedVehicle.mileage || !parsedBudget.expenses) {
        throw new Error('Manifest JSON missing required schema keys (mileage or expenses).');
      }

      onIngest(parsedVehicle, parsedBudget);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              <span>Cross-App Manifest Ingestion Protocol</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ingest read-only JSON exports from <code className="text-emerald-400 font-mono">~/vehicle-hub</code> and{' '}
              <code className="text-emerald-400 font-mono">~/budget</code>.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>~/vehicle-hub (export-tax.json)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">vehicle-hub export-tax</span>
            </div>
            <textarea
              rows={12}
              value={vehicleJson}
              onChange={(e) => setVehicleJson(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>~/budget (budget-export.json)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">budget export --tagged-business</span>
            </div>
            <textarea
              rows={12}
              value={budgetJson}
              onChange={(e) => setBudgetJson(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLoadDefaults}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Canonical Export Data</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md"
            >
              Parse & Update Schedule C
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
