export interface VehicleHubExport {
  year: number;
  exportDate: string;
  source: 'vehicle-hub';
  vehicle: {
    make: string;
    model: string;
    year: number;
    placedInServiceDate: string;
  };
  mileage: {
    total_miles: number;
    business_miles: number;
    commute_miles: number;
    personal_miles: number;
  };
  tolls_and_parking: number;
  actual_vehicle_expenses: {
    gas_and_fuel: number;
    repairs_and_maintenance: number;
    insurance: number;
    license_and_registration: number;
    lease_or_depreciation: number;
  };
}

export interface BudgetBusinessExpense {
  id: string;
  date: string;
  merchant: string;
  description: string;
  category: 'Supplies' | 'Office' | 'Travel' | 'Meals' | 'Software & Subscriptions' | 'Equipment' | 'Education' | 'Vehicle Maintenance' | 'Other';
  amount: number;
  isDeductible: boolean;
  notes?: string;
}

export interface BudgetHubExport {
  year: number;
  exportDate: string;
  source: 'budget';
  totalBusinessExpenses: number;
  expenses: BudgetBusinessExpense[];
}

export interface ScheduleCComparisonResult {
  year: number;
  standardMileageRate: number; // e.g. $0.67 (2024), $0.70 (2025)
  businessMiles: number;
  totalMiles: number;
  businessPercentage: number;
  parkingAndTolls: number;
  
  // Option 1
  standardMileageDeduction: number;
  
  // Option 2
  totalActualOperatingExpenses: number;
  actualExpensesDeduction: number;
  
  // Decision
  recommendedMethod: 'standard_mileage' | 'actual_expenses';
  savingsAdvantage: number;
  appliedCarAndTruckDeduction: number;
}

export interface ScheduleCPacket {
  year: number;
  businessName: string;
  principalActivity: string;
  gross1099Receipts: number;
  
  // Expenses
  carAndTruckExpensesLine9: number;
  carExpenseMethod: 'Standard Mileage' | 'Actual Expenses';
  officeExpenseLine18: number;
  suppliesLine22: number;
  travelLine24a: number;
  mealsLine24bTotal: number;
  mealsLine24bDeductible50Pct: number;
  otherExpensesLine48: number;
  
  totalExpensesLine28: number;
  netProfitOrLossLine31: number;
  
  // Self-employment tax estimate
  estimatedScheduleSETax: number;
}
