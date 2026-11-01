export interface IraContributionRecord {
  year: number;
  type: 'traditional' | 'roth';
  amount: number;
  nondeductibleBasis: number;
  isDeducted: boolean;
  notes?: string;
}

export interface IraConversionRecord {
  id: string;
  year: number;
  date: string;
  sourceAccount: string;
  destinationAccount: string;
  amountConverted: number;
  taxablePortion: number;
  nontaxablePortion: number;
  notes?: string;
}

export interface Form8606Data {
  year: number;
  line1NondeductibleContrib: number; // Current year nondeductible traditional IRA contributions
  line2PriorYearBasis: number; // Total basis in traditional IRAs from prior years
  line3TotalBasis: number; // Line 1 + Line 2
  line4ContribAfterYearEnd: number; // Contributions made between Jan 1 and April 15 of next year for this year
  line5NetBasis: number; // Line 3 - Line 4
  line6YearEndFmv: number; // Value of all traditional/SEP/SIMPLE IRAs on Dec 31
  line7Distributions: number; // Distributions from traditional/SEP/SIMPLE IRAs
  line8Conversions: number; // Net amount converted from traditional to Roth
  line9TotalIraPool: number; // Line 6 + Line 7 + Line 8
  line10NontaxableRatio: number; // Line 5 / Line 9 (up to 8 decimal places or rounded to 5 per IRS instructions)
  line11NontaxableConversions: number; // Line 8 * Line 10
  line12NontaxableDistributions: number; // Line 7 * Line 10
  line13TotalNontaxable: number; // Line 11 + Line 12
  line14RemainingBasis: number; // Line 3 - Line 13 (Basis for future years)
  line15TaxableAmount: number; // Line 8 - Line 11 (Taxable conversion amount)
}

export interface ExcessRothRemoval {
  id: string;
  taxYear: number;
  contributionAmount: number;
  contributionDate: string;
  removalDate: string;
  netIncomeAttributable: number; // Earnings distributed with excess
  totalDistributed: number; // contributionAmount + netIncomeAttributable
  exciseTaxAvoided: number; // 6% excise tax avoided ($7000 * 0.06 = $420)
  taxableEarningsYear: number;
  form5329Reported: boolean;
  notes: string;
}
