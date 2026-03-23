import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AmortizationEntry } from '../../types/mortgage';
import { formatHUFCompact } from '../../utils/formatters';

interface AmortizationChartProps {
  data: AmortizationEntry[];
}

export function AmortizationChart({ data }: AmortizationChartProps) {
  if (data.length === 0) return null;

  // Sample data for performance (max ~120 points)
  const step = Math.max(1, Math.floor(data.length / 120));
  const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Törlesztés alakulása</h2>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={sampled}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(m: number) => `${Math.floor(m / 12)}. év`}
            interval={Math.max(0, Math.floor(sampled.length / 8))}
          />
          <YAxis tickFormatter={(v: number) => formatHUFCompact(v)} width={80} />
          <Tooltip
            formatter={(value, name) => [
              formatHUFCompact(Math.round(Number(value))),
              name === 'principal' ? 'Tőke' : 'Kamat',
            ]}
            labelFormatter={(m) => {
              const month = Number(m);
              return `${Math.floor(month / 12)}. év ${month % 12 + 1}. hónap`;
            }}
          />
          <Legend formatter={(value: string) => (value === 'principal' ? 'Tőke' : 'Kamat')} />
          <Area
            type="monotone"
            dataKey="principal"
            stackId="1"
            stroke="#3b82f6"
            fill="#93c5fd"
          />
          <Area
            type="monotone"
            dataKey="interest"
            stackId="1"
            stroke="#f59e0b"
            fill="#fcd34d"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
