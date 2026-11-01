export type DocumentStatus = 'received' | 'pending' | 'missing' | 'not_applicable';

export interface TaxDocumentItem {
  id: string;
  year: number;
  name: string;
  code: string;
  category: 'Income' | 'Healthcare' | 'Retirement' | 'Investments' | 'Education' | 'Returns';
  issuer: string;
  status: DocumentStatus;
  dateReceived?: string;
  referenceOrLink?: string;
  notes?: string;
}

export type DeductibleCategory = 'Ministry & Religious' | 'Professional & Subscriptions' | 'Education & Language' | 'Community & Retreat' | 'Other';

export interface DeductibleLedgerItem {
  id: string;
  year: number;
  date: string;
  description: string;
  category: DeductibleCategory;
  amount: number;
  isExemptOrDeductible: boolean;
  scheduleCategory?: 'Schedule A (Charity)' | 'Schedule C (Business/Self-Employed)' | 'Unreimbursed/Exempt' | 'Other';
  receiptStatus: 'verified' | 'pending' | 'none';
  notes?: string;
}

export interface YearTaxProfile {
  year: number;
  filingStatus: 'Single' | 'Married Filing Jointly' | 'Married Filing Separately' | 'Head of Household';
  deductionType: 'Itemized' | 'Standard';
  standardDeductionAmount: number;
  totalItemizedOrDeductible: number;
  status: 'Draft' | 'Ready to File' | 'Filed' | 'Accepted';
}
