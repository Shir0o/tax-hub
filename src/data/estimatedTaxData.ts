import { EstimatedTaxYearPlan } from '../types/estimatedTax';

export const INITIAL_ESTIMATED_TAX_PLANS: Record<number, EstimatedTaxYearPlan> = {
  2024: {
    year: 2024,
    priorYearAgi: 142000,
    priorYearTaxLiability: 22400,
    estimatedCurrentYearGross: 165000,
    estimatedSelfEmploymentNet: 48000,
    estimatedW2WithholdingFederal: 14500,
    estimatedW2WithholdingCalifornia: 4800,
    safeHarborType: 'prior_year_100', // Prior year AGI <= $150k
    totalFederalEstimatedTax: 24800,
    totalCaliforniaEstimatedTax: 7900,
    federalSafeHarborTarget: 7900, // $22,400 prior tax - $14,500 W-2 withholding = $7,900
    californiaSafeHarborTarget: 3100, // Estimated CA required balance
    installments: [
      {
        quarter: 'Q1',
        federalDueDate: '2024-04-15',
        californiaDueDate: '2024-04-15',
        federalPercentage: 25,
        californiaPercentage: 30,
        federalTarget: 1975.00,
        californiaTarget: 930.00,
        federalPaid: 1975.00,
        californiaPaid: 930.00,
        federalConfirmation: 'IRS-PAY-882194',
        californiaConfirmation: 'FTB-WEB-491028',
        federalPaidDate: '2024-04-12',
        californiaPaidDate: '2024-04-12',
        status: 'paid',
      },
      {
        quarter: 'Q2',
        federalDueDate: '2024-06-17', // June 15 was weekend
        californiaDueDate: '2024-06-17',
        federalPercentage: 25,
        californiaPercentage: 40,
        federalTarget: 1975.00,
        californiaTarget: 1240.00,
        federalPaid: 1975.00,
        californiaPaid: 1240.00,
        federalConfirmation: 'IRS-PAY-904128',
        californiaConfirmation: 'FTB-WEB-581903',
        federalPaidDate: '2024-06-14',
        californiaPaidDate: '2024-06-14',
        status: 'paid',
      },
      {
        quarter: 'Q3',
        federalDueDate: '2024-09-16', // Sept 15 was weekend
        californiaDueDate: '2024-09-16',
        federalPercentage: 25,
        californiaPercentage: 0, // California Q3 is 0% installment!
        federalTarget: 1975.00,
        californiaTarget: 0.00,
        federalPaid: 1975.00,
        californiaPaid: 0.00,
        federalConfirmation: 'IRS-PAY-932847',
        californiaConfirmation: 'N/A (0% CA Q3)',
        federalPaidDate: '2024-09-13',
        californiaPaidDate: '2024-09-13',
        status: 'paid',
      },
      {
        quarter: 'Q4',
        federalDueDate: '2025-01-15',
        californiaDueDate: '2025-01-15',
        federalPercentage: 25,
        californiaPercentage: 30,
        federalTarget: 1975.00,
        californiaTarget: 930.00,
        federalPaid: 1975.00,
        californiaPaid: 930.00,
        federalConfirmation: 'IRS-PAY-981240',
        californiaConfirmation: 'FTB-WEB-640192',
        federalPaidDate: '2025-01-14',
        californiaPaidDate: '2025-01-14',
        status: 'paid',
      },
    ],
  },
  2025: {
    year: 2025,
    priorYearAgi: 165000,
    priorYearTaxLiability: 27500,
    estimatedCurrentYearGross: 185000,
    estimatedSelfEmploymentNet: 55000,
    estimatedW2WithholdingFederal: 16000,
    estimatedW2WithholdingCalifornia: 5200,
    safeHarborType: 'prior_year_110', // Prior year AGI > $150k requires 110% safe harbor
    totalFederalEstimatedTax: 31200,
    totalCaliforniaEstimatedTax: 9800,
    federalSafeHarborTarget: 14250, // ($27,500 * 1.10 = $30,250) - $16,000 withholding = $14,250
    californiaSafeHarborTarget: 4600, // ($9,800 total - $5,200 withholding = $4,600)
    installments: [
      {
        quarter: 'Q1',
        federalDueDate: '2025-04-15',
        californiaDueDate: '2025-04-15',
        federalPercentage: 25,
        californiaPercentage: 30, // CA Q1 is 30%
        federalTarget: 3562.50,
        californiaTarget: 1380.00, // 30% of $4,600
        federalPaid: 0.00,
        californiaPaid: 0.00,
        status: 'pending',
      },
      {
        quarter: 'Q2',
        federalDueDate: '2025-06-16',
        californiaDueDate: '2025-06-16',
        federalPercentage: 25,
        californiaPercentage: 40, // CA Q2 is 40%
        federalTarget: 3562.50,
        californiaTarget: 1840.00, // 40% of $4,600
        federalPaid: 0.00,
        californiaPaid: 0.00,
        status: 'pending',
      },
      {
        quarter: 'Q3',
        federalDueDate: '2025-09-15',
        californiaDueDate: '2025-09-15',
        federalPercentage: 25,
        californiaPercentage: 0, // CA Q3 is 0%
        federalTarget: 3562.50,
        californiaTarget: 0.00,
        federalPaid: 0.00,
        californiaPaid: 0.00,
        status: 'pending',
      },
      {
        quarter: 'Q4',
        federalDueDate: '2026-01-15',
        californiaDueDate: '2026-01-15',
        federalPercentage: 25,
        californiaPercentage: 30, // CA Q4 is 30%
        federalTarget: 3562.50,
        californiaTarget: 1380.00, // 30% of $4,600
        federalPaid: 0.00,
        californiaPaid: 0.00,
        status: 'pending',
      },
    ],
  },
};
