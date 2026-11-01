import { Form8606Data, IraContributionRecord, IraConversionRecord, ExcessRothRemoval } from '../types/ira';

export const HISTORICAL_CONTRIBUTIONS: IraContributionRecord[] = [
  {
    year: 2019,
    type: 'traditional',
    amount: 6000.00,
    nondeductibleBasis: 6000.00,
    isDeducted: false,
    notes: '2019 Non-deductible Traditional IRA contribution reported on Form 8606.',
  },
  {
    year: 2022,
    type: 'traditional',
    amount: 6000.00,
    nondeductibleBasis: 6000.00,
    isDeducted: false,
    notes: '2022 Non-deductible Traditional IRA contribution reported on Form 8606.',
  },
];

export const HISTORICAL_CONVERSIONS: IraConversionRecord[] = [
  {
    id: 'conv-2023',
    year: 2023,
    date: '2023-11-14',
    sourceAccount: 'Vanguard Traditional IRA (••••1092)',
    destinationAccount: 'Vanguard Roth IRA (••••8491)',
    amountConverted: 2993.56,
    nontaxablePortion: 2662.21,
    taxablePortion: 331.35,
    notes: 'Partial conversion in 2023. Pro-rata calculation applied across year-end traditional balance.',
  },
  {
    id: 'conv-2024',
    year: 2024,
    date: '2024-08-22',
    sourceAccount: 'Vanguard Traditional IRA (••••1092)',
    destinationAccount: 'Vanguard Roth IRA (••••8491)',
    amountConverted: 14556.27,
    nontaxablePortion: 9337.79,
    taxablePortion: 5218.48,
    notes: 'Complete conversion of remaining Traditional balance. Dec 31 Traditional balance reaches $0.',
  },
];

export const FORM_8606_HISTORICAL: Record<number, Form8606Data> = {
  2023: {
    year: 2023,
    line1NondeductibleContrib: 0.00,
    line2PriorYearBasis: 12000.00, // $6k (2019) + $6k (2022)
    line3TotalBasis: 12000.00,
    line4ContribAfterYearEnd: 0.00,
    line5NetBasis: 12000.00,
    line6YearEndFmv: 10500.00,
    line7Distributions: 0.00,
    line8Conversions: 2993.56,
    line9TotalIraPool: 13493.56, // $10,500 + $2,993.56
    line10NontaxableRatio: 0.889313, // $12,000 / $13,493.56
    line11NontaxableConversions: 2662.21,
    line12NontaxableDistributions: 0.00,
    line13TotalNontaxable: 2662.21,
    line14RemainingBasis: 9337.79, // $12,000 - $2,662.21
    line15TaxableAmount: 331.35, // $2,993.56 - $2,662.21
  },
  2024: {
    year: 2024,
    line1NondeductibleContrib: 0.00,
    line2PriorYearBasis: 9337.79, // Carried from 2023 Line 14
    line3TotalBasis: 9337.79,
    line4ContribAfterYearEnd: 0.00,
    line5NetBasis: 9337.79,
    line6YearEndFmv: 0.00, // Fully emptied before Dec 31, 2024
    line7Distributions: 0.00,
    line8Conversions: 14556.27,
    line9TotalIraPool: 14556.27,
    line10NontaxableRatio: 0.641496, // $9,337.79 / $14,556.27
    line11NontaxableConversions: 9337.79, // Consumed entire remaining basis
    line12NontaxableDistributions: 0.00,
    line13TotalNontaxable: 9337.79,
    line14RemainingBasis: 0.00, // Basis fully utilized!
    line15TaxableAmount: 5218.48, // $14,556.27 - $9,337.79
  },
};

export const EXCESS_ROTH_REMOVAL_2024: ExcessRothRemoval = {
  id: 'excess-roth-2024',
  taxYear: 2024,
  contributionAmount: 7000.00,
  contributionDate: '2024-01-15',
  removalDate: '2024-11-20',
  netIncomeAttributable: 1017.76,
  totalDistributed: 8017.76,
  exciseTaxAvoided: 420.00, // 6% on $7,000 per year avoided
  taxableEarningsYear: 2024,
  form5329Reported: true,
  notes: 'Removed before October 15 extended filing deadline pursuant to IRC § 408A(d)(5). Avoided continuous 6% excise penalty ($420/yr). $1,017.76 earnings recognized as taxable ordinary income for 2024.',
};
