export interface HsaRecord {
  id: string;
  year: number;
  institution: string;
  accountNumberMasked: string;
  yearEndFmv: number; // Form 5498-SA Box 5
  annualContributions: number; // Form 5498-SA Box 2 / Schedule 1 line 13 deduction on Federal
  distributions: number; // Form 1099-SA Box 1
  distributionCode: string; // Form 1099-SA Box 3 (e.g. "1 - Normal", "2 - Excess contrib returned")
  interestEarned: number; // Realized interest inside HSA
  dividendsEarned: number; // Realized dividends inside HSA
  capitalGainsEarned: number; // Realized capital gains inside HSA
  scheduleCaAddition: number; // Total to add back on CA Schedule CA (540)
  excessContributionsReturned?: number;
  excessEarningsTaxableCA?: number;
  notes?: string;
}

export interface HsaSummary {
  totalFmv: number;
  totalCaAdditions: number;
  totalEarningsTaxedCA: number;
}
