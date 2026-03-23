interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
}

export function MetricCard({ label, value, sublabel, accent }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg p-2.5 ${
        accent
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <div className="text-[11px] text-gray-500">{label}</div>
      <div
        className={`text-sm font-bold ${
          accent ? 'text-blue-700' : 'text-gray-800'
        }`}
      >
        {value}
      </div>
      {sublabel && <div className="text-[10px] text-gray-400">{sublabel}</div>}
    </div>
  );
}
