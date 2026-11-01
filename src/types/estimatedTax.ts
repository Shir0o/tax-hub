export type QuarterKey = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface QuarterlyInstallment {
  quarter: QuarterKey;
  federalDueDate: string;
  californiaDueDate: string;
  federalPercentage: number; // 25% for all
  californiaPercentage: number; // 30%, 40%, 0%, 30%
  federalTarget: number;
  californiaTarget: number;
  federalPaid: number;
  californiaPaid: number;
  federalConfirmation?: string;
  californiaConfirmation?: string;
  federalPaidDate?: string;
  californiaPaidDate?: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

export interface EstimatedTaxYearPlan {
  year: number;
  priorYearAgi: number;
  priorYearTaxLiability: number;
  estimatedCurrentYearGross: number;
  estimatedSelfEmploymentNet: number;
  estimatedW2WithholdingFederal: number;
  estimatedW2WithholdingCalifornia: number;
  safeHarborType: 'prior_year_100' | 'prior_year_110' | 'current_year_90';
  totalFederalEstimatedTax: number;
  totalCaliforniaEstimatedTax: number;
  federalSafeHarborTarget: number;
  californiaSafeHarborTarget: number;
  installments: QuarterlyInstallment[];
}
