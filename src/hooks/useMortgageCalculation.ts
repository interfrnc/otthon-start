import { useMemo } from 'react';
import type { MortgageInputs, MortgageResult, Scenario } from '../types/mortgage';
import { calculateMortgage } from '../utils/mortgageCalculator';

export function useMortgageCalculation(inputs: MortgageInputs): MortgageResult {
  return useMemo(() => calculateMortgage(inputs), [
    inputs.flatPrice,
    inputs.downPayment,
    inputs.loanTermYears,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(inputs.tiers),
  ]);
}

export function useMultiScenarioCalculation(scenarios: Scenario[]): Map<string, MortgageResult> {
  return useMemo(() => {
    const map = new Map<string, MortgageResult>();
    for (const s of scenarios) {
      map.set(s.id, calculateMortgage(s.inputs));
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(scenarios)]);
}
