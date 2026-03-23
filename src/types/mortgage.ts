export interface InterestTier {
  id: string;
  threshold: number; // HUF amount up to which this rate applies (0 = unlimited / catch-all)
  rate: number; // annual interest rate as decimal, e.g. 0.06 for 6%
}

export interface MortgageInputs {
  flatPrice: number;
  downPayment: number;
  loanTermYears: number;
  tiers: InterestTier[];
}

export interface SubLoanScheduleEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface SubLoan {
  tierId: string;
  principal: number;
  rate: number;
  monthlyPayment: number;
  schedule: SubLoanScheduleEntry[];
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  loanToValue: number;
  costVsPrice: number; // how much extra as percentage of flat price
  subLoans: SubLoan[];
  amortization: AmortizationEntry[];
}

export interface Scenario {
  id: string;
  name: string;
  color: string;
  inputs: MortgageInputs;
}
