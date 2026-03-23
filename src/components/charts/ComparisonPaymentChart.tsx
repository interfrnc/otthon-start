import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { MortgageResult, Scenario } from '../../types/mortgage';
import { formatHUFCompact } from '../../utils/formatters';

interface ComparisonPaymentChartProps {
  scenarios: Scenario[];
  results: Map<string, MortgageResult>;
}

export function ComparisonPaymentChart({ scenarios, results }: ComparisonPaymentChartProps) {
  if (scenarios.length < 2) return null;

  // Find max months across all scenarios
  const maxMonths = Math.max(
    ...scenarios.map((s) => results.get(s.id)?.amortization.length ?? 0),
  );
  if (maxMonths === 0) return null;

  // Build merged data: one row per sampled month, with remaining balance per scenario
  const step = Math.max(1, Math.floor(maxMonths / 120));
  const data: Record<string, number | string>[] = [];

  for (let m = 0; m < maxMonths; m += step) {
    const row: Record<string, number | string> = { month: m + 1 };
    for (const s of scenarios) {
      const amort = results.get(s.id)?.amortization;
      if (amort && amort[m]) {
        row[`${s.id}_balance`] = Math.round(amort[m].remainingBalance);
        row[`${s.id}_payment`] = Math.round(amort[m].payment);
      }
    }
    data.push(row);
  }

  // Also add last month
  const lastRow: Record<string, number | string> = { month: maxMonths };
  for (const s of scenarios) {
    const amort = results.get(s.id)?.amortization;
    if (amort && amort[maxMonths - 1]) {
      lastRow[`${s.id}_balance`] = Math.round(amort[maxMonths - 1].remainingBalance);
      lastRow[`${s.id}_payment`] = Math.round(amort[maxMonths - 1].payment);
    }
  }
  data.push(lastRow);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Remaining balance comparison
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(m: number) => `Yr ${Math.floor(m / 12)}`}
            interval={Math.max(0, Math.floor(data.length / 8))}
          />
          <YAxis tickFormatter={(v: number) => formatHUFCompact(v)} width={80} />
          <Tooltip
            formatter={(value, name) => {
              const label = scenarios.find((s) => `${s.id}_balance` === name)?.name ?? '';
              return [formatHUFCompact(Number(value)), label];
            }}
            labelFormatter={(m) => {
              const month = Number(m);
              return `Year ${Math.floor(month / 12)}, Month ${(month % 12) + 1}`;
            }}
          />
          <Legend
            formatter={(value: string) =>
              scenarios.find((s) => `${s.id}_balance` === value)?.name ?? value
            }
          />
          {scenarios.map((s) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={`${s.id}_balance`}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
