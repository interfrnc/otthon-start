import type {
  InterestTier,
  MortgageInputs,
  MortgageResult,
  SubLoan,
  SubLoanScheduleEntry,
  AmortizationEntry,
} from '../types/mortgage';

function calcMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  if (principal <= 0) return 0;
  if (annualRate === 0) return principal / termMonths;
  const r = annualRate / 12;
  const n = termMonths;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function generateSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  monthlyPayment: number,
): SubLoanScheduleEntry[] {
  const schedule: SubLoanScheduleEntry[] = [];
  let balance = principal;
  const r = annualRate / 12;

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * r;
    let principalPart = monthlyPayment - interest;

    // Last month: adjust for rounding
    if (month === termMonths) {
      principalPart = balance;
    }

    balance = Math.max(0, balance - principalPart);

    schedule.push({
      month,
      payment: principalPart + interest,
      principal: principalPart,
      interest,
      remainingBalance: balance,
    });
  }

  return schedule;
}

function allocateTiers(loanAmount: number, tiers: InterestTier[]): { principal: number; rate: number; tierId: string }[] {
  // Sort tiers by threshold ascending; tiers with threshold 0 go last (catch-all)
  const sorted = [...tiers].sort((a, b) => {
    if (a.threshold === 0) return 1;
    if (b.threshold === 0) return -1;
    return a.threshold - b.threshold;
  });

  const allocations: { principal: number; rate: number; tierId: string }[] = [];
  let remaining = loanAmount;
  let allocated = 0;

  for (const tier of sorted) {
    if (remaining <= 0) break;

    let tierAmount: number;
    if (tier.threshold === 0) {
      // Catch-all tier: takes everything remaining
      tierAmount = remaining;
    } else {
      // This tier covers from `allocated` up to `tier.threshold`
      const tierCapacity = Math.max(0, tier.threshold - allocated);
      tierAmount = Math.min(remaining, tierCapacity);
    }

    if (tierAmount > 0) {
      allocations.push({
        principal: tierAmount,
        rate: tier.rate,
        tierId: tier.id,
      });
      remaining -= tierAmount;
      allocated += tierAmount;
    }
  }

  return allocations;
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const loanAmount = Math.max(0, inputs.flatPrice - inputs.downPayment);
  const termMonths = inputs.loanTermYears * 12;

  if (loanAmount === 0 || termMonths === 0) {
    return {
      loanAmount,
      monthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      loanToValue: 0,
      costVsPrice: 0,
      subLoans: [],
      amortization: [],
    };
  }

  const allocations = allocateTiers(loanAmount, inputs.tiers);

  const subLoans: SubLoan[] = allocations.map((alloc) => {
    const mp = calcMonthlyPayment(alloc.principal, alloc.rate, termMonths);
    const schedule = generateSchedule(alloc.principal, alloc.rate, termMonths, mp);
    return {
      tierId: alloc.tierId,
      principal: alloc.principal,
      rate: alloc.rate,
      monthlyPayment: mp,
      schedule,
    };
  });

  // Merge schedules by month
  const amortization: AmortizationEntry[] = [];
  for (let m = 1; m <= termMonths; m++) {
    let payment = 0;
    let principal = 0;
    let interest = 0;
    let remainingBalance = 0;

    for (const sub of subLoans) {
      const entry = sub.schedule[m - 1];
      if (entry) {
        payment += entry.payment;
        principal += entry.principal;
        interest += entry.interest;
        remainingBalance += entry.remainingBalance;
      }
    }

    amortization.push({ month: m, payment, principal, interest, remainingBalance });
  }

  const monthlyPayment = subLoans.reduce((sum, s) => sum + s.monthlyPayment, 0);
  const totalPaid = amortization.reduce((sum, e) => sum + e.payment, 0);
  const totalInterest = totalPaid - loanAmount;
  const loanToValue = inputs.flatPrice > 0 ? loanAmount / inputs.flatPrice : 0;
  const costVsPrice = inputs.flatPrice > 0 ? totalInterest / inputs.flatPrice : 0;

  return {
    loanAmount,
    monthlyPayment,
    totalPaid,
    totalInterest,
    loanToValue,
    costVsPrice,
    subLoans,
    amortization,
  };
}
