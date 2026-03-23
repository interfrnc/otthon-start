interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}

export function SliderInput({ label, value, min, max, step = 1, unit, onChange }: SliderInputProps) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex items-center gap-0.5">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= min && v <= max) onChange(v);
            }}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center text-xs"
          />
          <span className="text-gray-500 text-[11px]">{unit}</span>
        </div>
      </div>
    </div>
  );
}
