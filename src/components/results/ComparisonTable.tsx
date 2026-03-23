import type { MortgageResult } from '../../types/mortgage';
import { formatHUF, formatPercentDisplay } from '../../utils/formatters';

interface ComparisonTableProps {
  nameA: string;
  nameB: string;
  colorA: string;
  colorB: string;
  resultA: MortgageResult;
  resultB: MortgageResult;
}

export function ComparisonTable({ nameA, nameB, colorA, colorB, resultA, resultB }: ComparisonTableProps) {
  if (resultA.loanAmount === 0 && resultB.loanAmount === 0) return null;

  const rows: { label: string; getA: () => string; getB: () => string; diff: () => string; bestIsLower: boolean }[] = [
    {
      label: 'Monthly payment',
      getA: () => formatHUF(Math.round(resultA.monthlyPayment)),
      getB: () => formatHUF(Math.round(resultB.monthlyPayment)),
      diff: () => {
        const d = resultB.monthlyPayment - resultA.monthlyPayment;
        return `${d > 0 ? '+' : ''}${formatHUF(Math.round(d))}`;
      },
      bestIsLower: true,
    },
    {
      label: 'Total paid',
      getA: () => formatHUF(Math.round(resultA.totalPaid)),
      getB: () => formatHUF(Math.round(resultB.totalPaid)),
      diff: () => {
        const d = resultB.totalPaid - resultA.totalPaid;
        return `${d > 0 ? '+' : ''}${formatHUF(Math.round(d))}`;
      },
      bestIsLower: true,
    },
    {
      label: 'Total interest',
      getA: () => formatHUF(Math.round(resultA.totalInterest)),
      getB: () => formatHUF(Math.round(resultB.totalInterest)),
      diff: () => {
        const d = resultB.totalInterest - resultA.totalInterest;
        return `${d > 0 ? '+' : ''}${formatHUF(Math.round(d))}`;
      },
      bestIsLower: true,
    },
    {
      label: 'Interest ratio',
      getA: () => formatPercentDisplay(resultA.costVsPrice),
      getB: () => formatPercentDisplay(resultB.costVsPrice),
      diff: () => '',
      bestIsLower: true,
    },
    {
      label: 'Loan amount',
      getA: () => formatHUF(resultA.loanAmount),
      getB: () => formatHUF(resultB.loanAmount),
      diff: () => {
        const d = resultB.loanAmount - resultA.loanAmount;
        return `${d > 0 ? '+' : ''}${formatHUF(Math.round(d))}`;
      },
      bestIsLower: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-3">
      <h2 className="text-xs font-semibold text-gray-800 mb-2">Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-1.5 pr-3 text-gray-500 font-medium" />
              <th className="text-right py-1.5 px-2 font-semibold">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorA }} />
                  <span className="text-gray-800">{nameA}</span>
                </div>
              </th>
              <th className="text-right py-1.5 px-2 font-semibold">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorB }} />
                  <span className="text-gray-800">{nameB}</span>
                </div>
              </th>
              <th className="text-right py-1.5 px-2 font-medium text-gray-500">
                Diff
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rawA = row.label === 'Monthly payment' ? resultA.monthlyPayment
                : row.label === 'Total interest' ? resultA.totalInterest
                : row.label === 'Total paid' ? resultA.totalPaid : 0;
              const rawB = row.label === 'Monthly payment' ? resultB.monthlyPayment
                : row.label === 'Total interest' ? resultB.totalInterest
                : row.label === 'Total paid' ? resultB.totalPaid : 0;

              const aBetter = row.bestIsLower && rawA < rawB && rawA > 0;
              const bBetter = row.bestIsLower && rawB < rawA && rawB > 0;

              return (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 text-gray-600 font-medium">{row.label}</td>
                  <td className={`py-1.5 px-2 text-right font-mono ${aBetter ? 'text-green-600 font-semibold' : 'text-gray-800'}`}>
                    {row.getA()}
                  </td>
                  <td className={`py-1.5 px-2 text-right font-mono ${bBetter ? 'text-green-600 font-semibold' : 'text-gray-800'}`}>
                    {row.getB()}
                  </td>
                  <td className="py-1.5 px-2 text-right font-mono text-gray-500">
                    {row.diff()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
