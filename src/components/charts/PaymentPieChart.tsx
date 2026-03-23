import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { MortgageResult } from '../../types/mortgage';
import { formatHUF } from '../../utils/formatters';

interface PaymentPieChartProps {
  result: MortgageResult;
}

const COLORS = ['#3b82f6', '#f59e0b'];

export function PaymentPieChart({ result }: PaymentPieChartProps) {
  if (result.loanAmount === 0) return null;

  const data = [
    { name: 'Tőke', value: Math.round(result.loanAmount) },
    { name: 'Kamat', value: Math.round(result.totalInterest) },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tőke vs Kamat</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatHUF(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
