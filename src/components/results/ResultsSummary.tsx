import type { MortgageResult } from '../../types/mortgage';
import { formatHUF, formatPercentDisplay } from '../../utils/formatters';
import { MetricCard } from './MetricCard';

interface ResultsSummaryProps {
  result: MortgageResult;
  flatPrice: number;
  scenarioColor?: string;
}

export function ResultsSummary({ result, flatPrice, scenarioColor }: ResultsSummaryProps) {
  if (result.loanAmount === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-3 text-center text-gray-400 text-sm">
        Enter loan parameters to see results.
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow p-3 border-t-3"
      style={{ borderTopColor: scenarioColor ?? '#3b82f6' }}
    >
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          label="Monthly payment"
          value={formatHUF(Math.round(result.monthlyPayment))}
          accent
        />
        <MetricCard
          label="Total paid"
          value={formatHUF(Math.round(result.totalPaid))}
        />
        <MetricCard
          label="Total interest"
          value={formatHUF(Math.round(result.totalInterest))}
          sublabel={`${formatPercentDisplay(result.costVsPrice)} of price`}
        />
        <MetricCard
          label="Loan amount"
          value={formatHUF(result.loanAmount)}
          sublabel={`LTV ${formatPercentDisplay(result.loanToValue)}`}
        />
      </div>

      {result.subLoans.length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="space-y-0.5">
            {result.subLoans.map((sub, i) => (
              <div key={sub.tierId} className="flex justify-between text-xs text-gray-500">
                <span>
                  Tier {i + 1}: {formatHUF(Math.round(sub.principal))} @ {(sub.rate * 100).toFixed(1)}%
                </span>
                <span className="font-medium text-gray-700">
                  {formatHUF(Math.round(sub.monthlyPayment))}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
