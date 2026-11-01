import { TaxDocumentItem, DeductibleLedgerItem, YearTaxProfile } from '../types/checklist';

export const TAX_YEAR_PROFILES: Record<number, YearTaxProfile> = {
  2021: {
    year: 2021,
    filingStatus: 'Single',
    deductionType: 'Itemized',
    standardDeductionAmount: 12550,
    totalItemizedOrDeductible: 14820,
    status: 'Filed',
  },
  2022: {
    year: 2022,
    filingStatus: 'Single',
    deductionType: 'Itemized',
    standardDeductionAmount: 12950,
    totalItemizedOrDeductible: 15340,
    status: 'Filed',
  },
  2023: {
    year: 2023,
    filingStatus: 'Single',
    deductionType: 'Standard',
    standardDeductionAmount: 13850,
    totalItemizedOrDeductible: 13850,
    status: 'Filed',
  },
  2024: {
    year: 2024,
    filingStatus: 'Single',
    deductionType: 'Standard',
    standardDeductionAmount: 14600,
    totalItemizedOrDeductible: 14600,
    status: 'Ready to File',
  },
  2025: {
    year: 2025,
    filingStatus: 'Single',
    deductionType: 'Standard',
    standardDeductionAmount: 15000,
    totalItemizedOrDeductible: 15000,
    status: 'Draft',
  },
};

const MASTER_DOC_TEMPLATES = [
  { code: 'FORM-1040', name: 'Form 1040 (U.S. Individual Income Tax Return)', category: 'Returns' as const, issuer: 'IRS' },
  { code: 'W2-CAPONE', name: 'Form W-2 Wage and Tax Statement', category: 'Income' as const, issuer: 'Capital One Services LLC' },
  { code: '1095-A', name: 'CoveredCalifornia Form 1095-A (Health Insurance Marketplace)', category: 'Healthcare' as const, issuer: 'Covered California' },
  { code: '5498-VANGUARD', name: 'Form 5498 / 5498-SA (IRA & HSA Contributions)', category: 'Retirement' as const, issuer: 'Vanguard Group' },
  { code: '1099-SA', name: 'Form 1099-SA (Distributions from HSA / Excess Removal)', category: 'Healthcare' as const, issuer: 'HealthEquity / Vanguard' },
  { code: '1099-FIDELITY', name: 'Fidelity Consolidated 1099 (1099-INT / 1099-DIV / 1099-B)', category: 'Investments' as const, issuer: 'Fidelity Brokerage' },
  { code: '1099-CAPONE', name: 'Capital One 360 Consolidated 1099-INT / 1099-DIV', category: 'Investments' as const, issuer: 'Capital One N.A.' },
  { code: 'ONEPAY-STOCK', name: 'OnePay Stock & Equity Records (Option grants, W-2 equity)', category: 'Income' as const, issuer: 'OnePay / Shareworks' },
  { code: '1098-E', name: 'Nelnet Form 1098-E (Student Loan Interest Statement)', category: 'Education' as const, issuer: 'Nelnet Loan Servicing' },
];

export const INITIAL_CHECKLIST_DOCUMENTS: TaxDocumentItem[] = [];

// Seed 2021-2025 documents
[2021, 2022, 2023, 2024, 2025].forEach((year) => {
  MASTER_DOC_TEMPLATES.forEach((tmpl, idx) => {
    let status: TaxDocumentItem['status'] = 'received';
    let dateReceived: string | undefined = `${year + 1}-02-15`;
    let referenceOrLink: string | undefined = `tax_docs_${year}/${tmpl.code}.pdf`;

    if (year === 2024) {
      if (tmpl.code === '5498-VANGUARD') {
        status = 'received';
        dateReceived = '2025-05-15'; // Form 5498 arrives in May
      } else if (tmpl.code === 'ONEPAY-STOCK') {
        status = 'received';
      }
    } else if (year === 2025) {
      if (idx < 2) {
        status = 'pending';
        dateReceived = undefined;
        referenceOrLink = undefined;
      } else {
        status = 'pending';
        dateReceived = undefined;
        referenceOrLink = undefined;
      }
    }

    INITIAL_CHECKLIST_DOCUMENTS.push({
      id: `doc-${year}-${tmpl.code.toLowerCase()}`,
      year,
      name: tmpl.name,
      code: tmpl.code,
      category: tmpl.category,
      issuer: tmpl.issuer,
      status,
      dateReceived,
      referenceOrLink,
      notes: year === 2024 && tmpl.code === '1099-SA' 
        ? 'Reflects $140.00 qualified distribution. Excess Roth removal handled on separate 1099-R from Vanguard.'
        : undefined,
    });
  });
});

export const INITIAL_DEDUCTIBLE_LEDGER: DeductibleLedgerItem[] = [
  {
    id: 'ded-2025-01',
    year: 2025,
    date: '2025-01-05',
    description: 'Ministry books subscription',
    category: 'Ministry & Religious',
    amount: 35.00,
    isExemptOrDeductible: true,
    scheduleCategory: 'Schedule A (Charity)',
    receiptStatus: 'verified',
    notes: 'Monthly theological literature & ministry study materials subscription.',
  },
  {
    id: 'ded-2025-02',
    year: 2025,
    date: '2025-01-18',
    description: 'Webcast subscription',
    category: 'Ministry & Religious',
    amount: 19.99,
    isExemptOrDeductible: true,
    scheduleCategory: 'Schedule A (Charity)',
    receiptStatus: 'verified',
    notes: 'Ministry international webcast and training video streaming access.',
  },
  {
    id: 'ded-2025-03',
    year: 2025,
    date: '2025-02-14',
    description: 'YA Retreat Spring 2025',
    category: 'Community & Retreat',
    amount: 136.00,
    isExemptOrDeductible: true,
    scheduleCategory: 'Schedule A (Charity)',
    receiptStatus: 'verified',
    notes: 'Young Adults Spring 2025 Retreat registration, lodging, and materials fee.',
  },
  {
    id: 'ded-2025-04',
    year: 2025,
    date: '2025-02-28',
    description: 'Pimsleur language subscription',
    category: 'Education & Language',
    amount: 20.95,
    isExemptOrDeductible: true,
    scheduleCategory: 'Schedule C (Business/Self-Employed)',
    receiptStatus: 'verified',
    notes: 'Language learning curriculum for translation work & global consulting.',
  },
  {
    id: 'ded-2025-05',
    year: 2025,
    date: '2025-03-07',
    description: '3/7 group meeting cooking',
    category: 'Ministry & Religious',
    amount: 68.42,
    isExemptOrDeductible: true,
    scheduleCategory: 'Schedule A (Charity)',
    receiptStatus: 'verified',
    notes: 'Ingredients and hospitality dinner provision for Friday fellowship group meeting.',
  },
  {
    id: 'ded-2025-06',
    year: 2025,
    date: '2025-03-08',
    description: '3/8 track festival',
    category: 'Community & Retreat',
    amount: 45.00,
    isExemptOrDeductible: true,
    scheduleCategory: 'Schedule A (Charity)',
    receiptStatus: 'verified',
    notes: 'Entry & participation sponsorship for youth community athletics track festival.',
  },
  {
    id: 'ded-2025-07',
    year: 2025,
    date: '2025-03-15',
    description: 'Pro support subscription',
    category: 'Professional & Subscriptions',
    amount: 44.99,
    isExemptOrDeductible: true,
    scheduleCategory: 'Schedule C (Business/Self-Employed)',
    receiptStatus: 'verified',
    notes: 'Professional developer tool priority support and cloud tooling maintenance.',
  },
];
