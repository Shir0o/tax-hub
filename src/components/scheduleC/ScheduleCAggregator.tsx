import React, { useState } from 'react';
import { 
  VehicleHubExport, 
  BudgetHubExport, 
  ScheduleCPacket, 
  ScheduleCComparisonResult 
} from '../../types/scheduleC';
import { 
  MOCK_VEHICLE_HUB_EXPORT_2025, 
  MOCK_BUDGET_HUB_EXPORT_2025
} from '../../data/scheduleCData';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { VehicleBudgetIngestionModal } from './VehicleBudgetIngestionModal';
import { ScheduleCExportModal } from './ScheduleCExportModal';
import { 
  Briefcase, 
  Car, 
  Wallet, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Zap 
} from 'lucide-react';

export const ScheduleCAggregator: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<VehicleHubExport>(MOCK_VEHICLE_HUB_EXPORT_2025);
  const [budgetData, setBudgetData] = useState<BudgetHubExport>(MOCK_BUDGET_HUB_EXPORT_2025);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [grossReceipts, setGrossReceipts] = useState<number>(72000);
  const [mileageRate, setMileageRate] = useState<number>(0.70); // 2025 standard rate

  // Compute mileage calculations
  const totalMiles = vehicleData.mileage.total_miles || 1;
  const businessMiles = vehicleData.mileage.business_miles;
  const businessPct = businessMiles / totalMiles;
  const tollsParking = vehicleData.tolls_and_parking;

  // Option 1: Standard Mileage
  const standardMileageDeduction = (businessMiles * mileageRate) + tollsParking;

  // Option 2: Actual Expenses
  const actualOps = 
    vehicleData.actual_vehicle_expenses.gas_and_fuel +
    vehicleData.actual_vehicle_expenses.repairs_and_maintenance +
    vehicleData.actual_vehicle_expenses.insurance +
    vehicleData.actual_vehicle_expenses.license_and_registration +
    vehicleData.actual_vehicle_expenses.lease_or_depreciation;
  const actualExpensesDeduction = (actualOps * businessPct) + tollsParking;

  const isStandardBetter = standardMileageDeduction >= actualExpensesDeduction;
  const recommendedMethod = isStandardBetter ? 'standard_mileage' : 'actual_expenses';
  const savingsAdvantage = Math.abs(standardMileageDeduction - actualExpensesDeduction);

  const [selectedMethod, setSelectedMethod] = useState<'Standard Mileage' | 'Actual Expenses'>(
    isStandardBetter ? 'Standard Mileage' : 'Actual Expenses'
  );

  const appliedCarDeduction = selectedMethod === 'Standard Mileage' ? standardMileageDeduction : actualExpensesDeduction;

  // Aggregate budget business expenses
  const officeExpense = budgetData.expenses
    .filter((e) => e.category === 'Office')
    .reduce((sum, e) => sum + e.amount, 0);

  const suppliesExpense = budgetData.expenses
    .filter((e) => e.category === 'Supplies')
    .reduce((sum, e) => sum + e.amount, 0);

  const travelExpense = budgetData.expenses
    .filter((e) => e.category === 'Travel')
    .reduce((sum, e) => sum + e.amount, 0);

  const mealsTotal = budgetData.expenses
    .filter((e) => e.category === 'Meals')
    .reduce((sum, e) => sum + e.amount, 0);
  const mealsDeductible = mealsTotal * 0.50; // 50% IRS limitation!

  const otherExpenses = budgetData.expenses
    .filter((e) => ['Software & Subscriptions', 'Equipment', 'Education', 'Other'].includes(e.category))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalDeductions = 
    appliedCarDeduction +
    officeExpense +
    suppliesExpense +
    travelExpense +
    mealsDeductible +
    otherExpenses;

  const netProfit = grossReceipts - totalDeductions;
  const estimatedScheduleSE = Math.max(0, netProfit * 0.9235 * 0.153);

  const comparisonResult: ScheduleCComparisonResult = {
    year: vehicleData.year,
    standardMileageRate: mileageRate,
    businessMiles,
    totalMiles,
    businessPercentage: businessPct,
    parkingAndTolls: tollsParking,
    standardMileageDeduction,
    totalActualOperatingExpenses: actualOps,
    actualExpensesDeduction,
    recommendedMethod,
    savingsAdvantage,
    appliedCarAndTruckDeduction: appliedCarDeduction,
  };

  const currentPacket: ScheduleCPacket = {
    year: vehicleData.year,
    businessName: 'Personal Engineering & Software Consulting',
    principalActivity: 'Computer Software & Technology Consulting (NAICS 541511)',
    gross1099Receipts: grossReceipts,
    carAndTruckExpensesLine9: appliedCarDeduction,
    carExpenseMethod: selectedMethod,
    officeExpenseLine18: officeExpense,
    suppliesLine22: suppliesExpense,
    travelLine24a: travelExpense,
    mealsLine24bTotal: mealsTotal,
    mealsLine24bDeductible50Pct: mealsDeductible,
    otherExpensesLine48: otherExpenses,
    totalExpensesLine28: totalDeductions,
    netProfitOrLossLine31: netProfit,
    estimatedScheduleSETax: estimatedScheduleSE,
  };

  const handleIngest = (v: VehicleHubExport, b: BudgetHubExport) => {
    setVehicleData(v);
    setBudgetData(b);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Integration Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span>Schedule C Deduction Aggregator & Vehicle Optimization</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingests live exports from <code className="text-emerald-400 font-mono">~/vehicle-hub</code> and{' '}
            <code className="text-blue-400 font-mono">~/budget</code> via read-only manifest protocol.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ingest Manifests</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Schedule C Packet</span>
          </button>
        </div>
      </div>

      {/* Integration Status Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white">~/vehicle-hub Manifest Active</span>
              <p className="text-[11px] text-slate-400 font-mono">
                {vehicleData.vehicle.year} {vehicleData.vehicle.make} {vehicleData.vehicle.model} • {vehicleData.mileage.business_miles.toLocaleString()} business mi ({(businessPct * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
            Synced
          </span>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white">~/budget Manifest Active</span>
              <p className="text-[11px] text-slate-400 font-mono">
                {budgetData.expenses.length} tagged business expenses • Total {formatCurrency(budgetData.totalBusinessExpenses)}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
            Synced
          </span>
        </div>
      </div>

      {/* Standard Mileage vs Actual Expenses Comparison Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Vehicle Deduction Comparison: Standard Mileage vs. Actual Expenses</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              IRS allows choosing either the Standard Mileage Rate or Actual Vehicle Operating Expenses for Schedule C Line 9.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">IRS Mileage Rate:</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1 text-slate-500 text-xs">$</span>
              <input
                type="number"
                step="0.005"
                value={mileageRate}
                onChange={(e) => setMileageRate(parseFloat(e.target.value) || 0.70)}
                className="w-20 bg-slate-950 border border-slate-700 rounded px-2 pl-5 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* The Two Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Standard Mileage */}
          <div
            onClick={() => setSelectedMethod('Standard Mileage')}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              selectedMethod === 'Standard Mileage'
                ? 'bg-emerald-950/20 border-emerald-500 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-100">Option 1: Standard Mileage Rate</span>
                {isStandardBetter && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                    RECOMMENDED (+{formatCurrency(savingsAdvantage)})
                  </span>
                )}
              </div>
              <input
                type="radio"
                checked={selectedMethod === 'Standard Mileage'}
                onChange={() => setSelectedMethod('Standard Mileage')}
                className="text-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="mt-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Business Miles:</span>
                <span>{businessMiles.toLocaleString()} miles</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Rate ({vehicleData.year}):</span>
                <span>${mileageRate.toFixed(2)} / mile</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Base Mileage Deduction:</span>
                <span>{formatCurrency(businessMiles * mileageRate)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Business Tolls & Parking:</span>
                <span>+{formatCurrency(tollsParking)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-emerald-400">
                <span>Total Line 9 Deduction:</span>
                <span>{formatCurrency(standardMileageDeduction)}</span>
              </div>
            </div>
          </div>

          {/* Option 2: Actual Expenses */}
          <div
            onClick={() => setSelectedMethod('Actual Expenses')}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              selectedMethod === 'Actual Expenses'
                ? 'bg-emerald-950/20 border-emerald-500 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-100">Option 2: Actual Vehicle Expenses</span>
                {!isStandardBetter && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                    RECOMMENDED (+{formatCurrency(savingsAdvantage)})
                  </span>
                )}
              </div>
              <input
                type="radio"
                checked={selectedMethod === 'Actual Expenses'}
                onChange={() => setSelectedMethod('Actual Expenses')}
                className="text-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="mt-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Total Vehicle Operating Costs:</span>
                <span>{formatCurrency(actualOps)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Business Use Percentage:</span>
                <span>{formatPercent(businessPct, 2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Operating Portion ({formatPercent(businessPct, 1)}):</span>
                <span>{formatCurrency(actualOps * businessPct)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Business Tolls & Parking:</span>
                <span>+{formatCurrency(tollsParking)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-blue-400">
                <span>Total Line 9 Deduction:</span>
                <span>{formatCurrency(actualExpensesDeduction)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule C Master Preparation Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>IRS Schedule C (Form 1040) Preparation Sheet</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Audit-ready line items with 50% meals limitation and automatic Schedule SE tax calculation.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Gross 1099 Receipts:</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
              <input
                type="number"
                step="1000"
                value={grossReceipts}
                onChange={(e) => setGrossReceipts(parseFloat(e.target.value) || 0)}
                className="w-28 bg-slate-950 border border-slate-700 rounded px-2 pl-6 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-sans font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Line #</th>
                <th className="py-2.5 px-4 font-sans">Schedule C Category</th>
                <th className="py-2.5 px-4 font-sans">Source App</th>
                <th className="py-2.5 px-4 text-right">Gross Claimed</th>
                <th className="py-2.5 px-4 text-right">Allowable Deduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-white font-sans">Line 1</td>
                <td className="py-2.5 px-4 font-sans text-slate-200">Gross receipts or sales</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">1099-NEC / Direct</td>
                <td className="py-2.5 px-4 text-right">{formatCurrency(grossReceipts)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-white">{formatCurrency(grossReceipts)}</td>
              </tr>

              <tr className="hover:bg-slate-800/30 bg-emerald-950/15">
                <td className="py-2.5 px-4 font-bold text-emerald-400 font-sans">Line 9</td>
                <td className="py-2.5 px-4 font-sans text-emerald-200 font-semibold">
                  Car and truck expenses ({selectedMethod})
                </td>
                <td className="py-2.5 px-4 font-sans text-emerald-400 font-mono">~/vehicle-hub</td>
                <td className="py-2.5 px-4 text-right text-slate-300">{formatCurrency(appliedCarDeduction)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                  {formatCurrency(appliedCarDeduction)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-400 font-sans">Line 18</td>
                <td className="py-2.5 px-4 font-sans text-slate-300">Office expense</td>
                <td className="py-2.5 px-4 font-sans text-blue-400 font-mono">~/budget</td>
                <td className="py-2.5 px-4 text-right text-slate-300">{formatCurrency(officeExpense)}</td>
                <td className="py-2.5 px-4 text-right text-slate-100">{formatCurrency(officeExpense)}</td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-400 font-sans">Line 22</td>
                <td className="py-2.5 px-4 font-sans text-slate-300">Supplies</td>
                <td className="py-2.5 px-4 font-sans text-blue-400 font-mono">~/budget</td>
                <td className="py-2.5 px-4 text-right text-slate-300">{formatCurrency(suppliesExpense)}</td>
                <td className="py-2.5 px-4 text-right text-slate-100">{formatCurrency(suppliesExpense)}</td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-400 font-sans">Line 24a</td>
                <td className="py-2.5 px-4 font-sans text-slate-300">Travel</td>
                <td className="py-2.5 px-4 font-sans text-blue-400 font-mono">~/budget</td>
                <td className="py-2.5 px-4 text-right text-slate-300">{formatCurrency(travelExpense)}</td>
                <td className="py-2.5 px-4 text-right text-slate-100">{formatCurrency(travelExpense)}</td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-400 font-sans">Line 24b</td>
                <td className="py-2.5 px-4 font-sans text-slate-300">
                  <div>Deductible meals (Subject to 50% IRS limitation)</div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Total spent: {formatCurrency(mealsTotal)} × 50%
                  </span>
                </td>
                <td className="py-2.5 px-4 font-sans text-blue-400 font-mono">~/budget</td>
                <td className="py-2.5 px-4 text-right text-slate-400 line-through">
                  {formatCurrency(mealsTotal)}
                </td>
                <td className="py-2.5 px-4 text-right text-slate-100">{formatCurrency(mealsDeductible)}</td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-400 font-sans">Line 48</td>
                <td className="py-2.5 px-4 font-sans text-slate-300">
                  Other expenses (Software, cloud hosting, developer tooling)
                </td>
                <td className="py-2.5 px-4 font-sans text-blue-400 font-mono">~/budget</td>
                <td className="py-2.5 px-4 text-right text-slate-300">{formatCurrency(otherExpenses)}</td>
                <td className="py-2.5 px-4 text-right text-slate-100">{formatCurrency(otherExpenses)}</td>
              </tr>

              <tr className="hover:bg-slate-800/30 bg-slate-950/60 font-bold border-t border-slate-700">
                <td className="py-3 px-4 text-amber-400 font-sans">Line 28</td>
                <td className="py-3 px-4 font-sans text-slate-100">Total Expenses</td>
                <td className="py-3 px-4 font-sans text-slate-400">Aggregated</td>
                <td className="py-3 px-4 text-right text-slate-300">
                  {formatCurrency(appliedCarDeduction + officeExpense + suppliesExpense + travelExpense + mealsTotal + otherExpenses)}
                </td>
                <td className="py-3 px-4 text-right text-amber-400 text-sm">
                  {formatCurrency(totalDeductions)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30 bg-emerald-950/30 font-bold border-t border-slate-700">
                <td className="py-3 px-4 text-emerald-400 font-sans text-sm">Line 31</td>
                <td className="py-3 px-4 font-sans text-emerald-200 text-sm">Net Business Profit (or Loss)</td>
                <td className="py-3 px-4 font-sans text-slate-400">Line 1 − Line 28</td>
                <td className="py-3 px-4 text-right text-slate-400">—</td>
                <td className="py-3 px-4 text-right text-emerald-300 text-base">
                  {formatCurrency(netProfit)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30 bg-purple-950/20 font-bold">
                <td className="py-3 px-4 text-purple-400 font-sans">Sched. SE</td>
                <td className="py-3 px-4 font-sans text-purple-200">
                  Self-Employment Tax Estimate (15.3% on 92.35% of profit)
                </td>
                <td className="py-3 px-4 font-sans text-slate-400">IRC § 1402</td>
                <td className="py-3 px-4 text-right text-slate-400">—</td>
                <td className="py-3 px-4 text-right text-purple-300">
                  {formatCurrency(estimatedScheduleSE)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingested Budget Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Ingested Business Transactions from ~/budget</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">
            {budgetData.expenses.length} records ingested
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-sans font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 font-sans">Merchant</th>
                <th className="py-2.5 px-4 font-sans">Description</th>
                <th className="py-2.5 px-4 font-sans">Tag / Category</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {budgetData.expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 text-slate-400">{formatDate(exp.date)}</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-white">{exp.merchant}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">
                    <div>{exp.description}</div>
                    {exp.notes && <div className="text-[10px] text-slate-500 font-sans">{exp.notes}</div>}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-100">
                    {formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleBudgetIngestionModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onIngest={handleIngest}
      />

      <ScheduleCExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        packet={currentPacket}
        comparison={comparisonResult}
      />
    </div>
  );
};
