import { useState, useCallback } from 'react';
import { formatHUFInput, parseHUFInput } from '../../utils/formatters';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  step?: number;
}

export function CurrencyInput({ label, value, onChange, placeholder, step = 1_000_000 }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [rawValue, setRawValue] = useState('');

  const handleFocus = useCallback(() => {
    setFocused(true);
    setRawValue(value > 0 ? String(value) : '');
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    onChange(parseHUFInput(rawValue));
  }, [rawValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRawValue(e.target.value);
  }, []);

  const decrement = useCallback(() => {
    onChange(Math.max(0, value - step));
  }, [value, step, onChange]);

  const increment = useCallback(() => {
    onChange(value + step);
  }, [value, step, onChange]);

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">{label}</label>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={decrement}
          className="flex-shrink-0 w-6 h-7 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-xs font-medium transition-colors"
        >
          −
        </button>
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            inputMode="numeric"
            className="w-full px-1.5 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right text-xs transition-colors"
            value={focused ? rawValue : formatHUFInput(value)}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder ?? '0'}
          />
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]">
            {focused ? '' : 'Ft'}
          </span>
        </div>
        <button
          type="button"
          onClick={increment}
          className="flex-shrink-0 w-6 h-7 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-xs font-medium transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
