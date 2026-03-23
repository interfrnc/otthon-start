import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AmortizationEntry } from '../../types/mortgage';
import { formatHUFCompact } from '../../utils/formatters';

interface MonthlyBreakdownChartProps {
  data: AmortizationEntry[];
  loanTermYears: number;
}

interface GroupedEntry {
  label: string;
  principal: number;
  interest: number;
}

export function MonthlyBreakdownChart({ data, loanTermYears }: MonthlyBreakdownChartProps) {
  if (data.length === 0) return null;

  // Group by year if term > 10 years, otherwise show monthly
  const groupByYear = loanTermYears > 10;
  const grouped: GroupedEntry[] = [];

  if (groupByYear) {
    const years = new Map<number, { principal: number; interest: number }>();
    for (const entry of data) {
      const year = Math.ceil(entry.month / 12);
      const existing = years.get(year) ?? { principal: 0, interest: 0 };
      existing.principal += entry.principal;
      existing.interest += entry.interest;
      years.set(year, existing);
    }
    for (const [year, totals] of years) {
      grouped.push({
        label: `${year}. év`,
        principal: Math.round(totals.principal),
        interest: Math.round(totals.interest),
      });
    }
  } else {
    // Sample monthly data (max 120 entries)
    const step = Math.max(1, Math.floor(data.length / 120));
    for (let i = 0; i < data.length; i += step) {
      const entry = data[i];
      grouped.push({
        label: `${entry.month}. hó`,
        principal: Math.round(entry.principal),
        interest: Math.round(entry.interest),
      });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {groupByYear ? 'Éves bontás' : 'Havi bontás'}
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={grouped}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            interval={Math.max(0, Math.floor(grouped.length / 10))}
            fontSize={12}
          />
          <YAxis tickFormatter={(v: number) => formatHUFCompact(v)} width={80} />
          <Tooltip
            formatter={(value, name) => [
              formatHUFCompact(Number(value)),
              name === 'principal' ? 'Tőke' : 'Kamat',
            ]}
          />
          <Legend formatter={(value: string) => (value === 'principal' ? 'Tőke' : 'Kamat')} />
          <Bar dataKey="principal" stackId="a" fill="#3b82f6" />
          <Bar dataKey="interest" stackId="a" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
