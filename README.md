# Tax Hub (`~/tax-hub`)

Personal tax compliance, FTB non-conformity engine, and deduction aggregator dashboard built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

## Features & Compliance Rules

### 1. California FTB HSA Non-Conformity Engine
Under California Revenue and Taxation Code (R&TC), California **does not conform** to IRC § 223:
- **Contributions**: Cannot be deducted on California state return (Schedule CA 540 line 13 additions).
- **Earnings**: Interest, dividends, and capital gains realized inside the HSA are fully taxable by California in the year earned.
- **Account Balance Tracking**: Records annual Form 5498-SA / HSA end-of-year sum + exact interest & dividend totals for Form 540 Schedule CA additions.
- **Corrected Excess Contributions**: 1099-SA distribution code for excess contribution removals differentiates between return of contribution vs taxable earnings.
- Pre-seeded with historical records from 2021 to 2025.

### 2. Traditional & Roth IRA Basis Engine (Form 8606 & Form 5329)
Prevents double taxation on Backdoor Roth conversions:
- **Historical Cumulative Basis**:
  - 2019 Traditional IRA contribution: $6,000 (after-tax basis)
  - 2022 Traditional IRA contribution: $6,000 (after-tax basis)
  - Total reported Traditional basis: $12,000
- **Conversions**:
  - 2023 Traditional -> Roth: $2,993.56
  - 2024 Traditional -> Roth: $14,556.27
- **Pro-Rata Calculation Rule**: Implements complete IRS Form 8606 lines 1–15 pro-rata ratio calculation, tracking year-end traditional balance and basis drawdown.
- **2024 Excess Roth Removal Tracking (Form 5329)**:
  - $7,000 contributed in 2024; excess removed on 11/20/24 with $1,017.76 net earnings attributable.
  - Avoided 6% ongoing excise penalty ($420/yr). Logs earnings as taxable ordinary income in 2024 on Form 1040 line 4b.

### 3. Estimated Quarterly Tax & Safe Harbor Tracker (IRS 1040-ES & CA 540-ES)
- **Federal Deadlines**: Q1 (April 15), Q2 (June 15), Q3 (September 15), Q4 (January 15).
- **California Deadlines & Unequal Percentages**: California requires payment installments of 30% (Q1), 40% (Q2), 0% (Q3), and 30% (Q4) pursuant to R&TC § 19136.
- **Safe Harbor Calculations**:
  - Standard: 100% of prior year's tax liability (or 110% if prior year AGI > $150,000).
  - Current year: 90% of current year estimated tax.
- Tracks confirmation numbers (IRS Direct Pay, FTB Web Pay) and payment statuses.

### 4. Annual Tax Checklists & Deductibles Ledger (2021–2025)
- **Filing Mode**:
  - 2021, 2022: Itemized deductions.
  - 2023, 2024, 2025: Standard deduction.
- **Master Document Checklist (2021–2025)**:
  - `Form 1040` (Federal Return)
  - `W-2` (Capital One)
  - `CoveredCalifornia Form 1095-A` (Health Insurance Marketplace statement)
  - `Vanguard Form 5498 / 5498-SA` (IRA / HSA contributions)
  - `Form 1099-SA` (HSA distribution & excess removal)
  - `Fidelity 1099-INT / 1099-DIV / 1099-B`
  - `Capital One 1099-INT / 1099-DIV`
  - `OnePay Stock records`
  - `Nelnet 1098-E` (Student loan interest)
- **2025 Deductible / Exempt Ledger**:
  - Ministry books subscription
  - Webcast subscription
  - YA Retreat Spring 2025 ($136)
  - Pimsleur subscription
  - 3/7 group meeting cooking
  - 3/8 track festival
  - Pro support ($44.99)

### 5. Schedule C Deduction Aggregator & Cross-App Integration
Read-only manifest and export protocol integration with `~/budget` and `~/vehicle-hub`:
- Ingests `business_miles`, `parking_tolls`, and vehicle operating expenses from `~/vehicle-hub`.
- Ingests categorized business expenses from `~/budget`.
- Compares:
  - **Option 1**: Standard Mileage Rate ($0.70 × business_miles + tolls/parking).
  - **Option 2**: Actual Expenses ((gas + repairs + insurance + depreciation) × business_pct + tolls/parking).
  - Highlights winning method and tax savings advantage.
- Generates audit-ready IRS Schedule C Preparation Packet with Line 1, Line 9, Line 18, Line 22, Line 24a/b (50% meals limit), Line 48, Line 28, Line 31, and Schedule SE self-employment tax.

## Development

```bash
# Start development server
npm run dev

# Run typecheck and production build
npm run build

# Preview build
npm run preview
```
