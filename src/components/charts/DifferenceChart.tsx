import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { MortgageResult } from '../../types/mortgage';
import { formatHUFCompact, formatHUF } from '../../utils/formatters';

interface DifferenceChartProps {
  nameA: string;
  nameB: string;
  colorA: string;
  colorB: string;
  resultA: MortgageResult;
  resultB: MortgageResult;
}

interface ChartRow {
  month: number;
  cumulativeA: number;
  cumulativeB: number;
  difference: number;
}

export function DifferenceChart({ nameA, nameB, colorA, colorB, resultA, resultB }: DifferenceChartProps) {
  if (resultA.loanAmount === 0 && resultB.loanAmount === 0) return null;

  const maxMonths = Math.max(resultA.amortization.length, resultB.amortization.length);
  if (maxMonths === 0) return null;

  // Build cumulative data
  const allData: ChartRow[] = [];
  let cumA = 0;
  let cumB = 0;
  for (let m = 0; m < maxMonths; m++) {
    cumA += resultA.amortization[m]?.payment ?? 0;
    cumB += resultB.amortization[m]?.payment ?? 0;
    allData.push({
      month: m + 1,
      cumulativeA: Math.round(cumA),
      cumulativeB: Math.round(cumB),
      difference: Math.round(cumB - cumA),
    });
  }

  // Sample for performance
  const step = Math.max(1, Math.floor(allData.length / 120));
  const data = allData.filter((_, i) => i % step === 0 || i === allData.length - 1);

  const finalDiff = allData[allData.length - 1]?.difference ?? 0;
  const bCostsMore = finalDiff > 0;

  return (
    <div className="bg-white rounded-xl shadow p-3">
      <h2 className="text-xs font-semibold text-gray-800 mb-0.5">
        Cumulative cost over time
      </h2>
      <p className="text-[11px] text-gray-500 mb-2">
        {finalDiff !== 0 ? (
          <>
            <span className="font-semibold" style={{ color: bCostsMore ? colorA : colorB }}>
              {bCostsMore ? nameA : nameB}
            </span>
            {' saves you '}
            <span className="font-semibold text-green-600">{formatHUF(Math.abs(finalDiff))}</span>
            {' over the full term'}
          </>
        ) : (
          'Both options cost the same'
        )}
      </p>
      <ResponsiveContainer width="100%" height={200}>
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
              const label = name === 'cumulativeA' ? nameA
                : name === 'cumulativeB' ? nameB
                : 'Difference';
              return [formatHUFCompact(Number(value)), label];
            }}
            labelFormatter={(m) => {
              const month = Number(m);
              return `Year ${Math.floor(month / 12)}, Month ${(month % 12) + 1}`;
            }}
          />
          <Legend
            formatter={(value: string) =>
              value === 'cumulativeA' ? nameA
                : value === 'cumulativeB' ? nameB
                : 'Difference'
            }
          />
          <Line
            type="monotone"
            dataKey="cumulativeA"
            stroke={colorA}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="cumulativeB"
            stroke={colorB}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="difference"
            stroke="#9ca3af"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
          <ReferenceLine y={0} stroke="#d1d5db" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
