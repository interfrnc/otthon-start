import type { InterestTier } from '../../types/mortgage';
import { formatHUFInput, parseHUFInput } from '../../utils/formatters';
import { useState, useCallback } from 'react';

interface InterestTierEditorProps {
  tiers: InterestTier[];
  onChange: (tiers: InterestTier[]) => void;
}

function TierRow({
  tier,
  index,
  isLast,
  prevThreshold,
  onUpdate,
  onRemove,
}: {
  tier: InterestTier;
  index: number;
  isLast: boolean;
  prevThreshold: number;
  onUpdate: (id: string, updates: Partial<InterestTier>) => void;
  onRemove: (id: string) => void;
}) {
  const [thresholdFocused, setThresholdFocused] = useState(false);
  const [rawThreshold, setRawThreshold] = useState('');

  const handleThresholdFocus = useCallback(() => {
    setThresholdFocused(true);
    setRawThreshold(tier.threshold > 0 ? String(tier.threshold) : '');
  }, [tier.threshold]);

  const handleThresholdBlur = useCallback(() => {
    setThresholdFocused(false);
    onUpdate(tier.id, { threshold: parseHUFInput(rawThreshold) });
  }, [rawThreshold, onUpdate, tier.id]);

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded">
      <div className="flex-1 min-w-0">
        <div className="text-[9px] text-gray-500">
          {isLast
            ? `${formatHUFInput(prevThreshold)} Ft above`
            : `${formatHUFInput(prevThreshold)} Ft —`}
        </div>
        {!isLast && (
          <input
            type="text"
            inputMode="numeric"
            className="w-full px-1.5 py-0.5 border border-gray-300 rounded text-right text-xs"
            value={thresholdFocused ? rawThreshold : formatHUFInput(tier.threshold)}
            onChange={(e) => setRawThreshold(e.target.value)}
            onFocus={handleThresholdFocus}
            onBlur={handleThresholdBlur}
            placeholder="Threshold"
          />
        )}
      </div>
      <div className="w-16">
        <div className="text-[9px] text-gray-500">Rate</div>
        <div className="flex items-center">
          <input
            type="number"
            step="0.1"
            min="0"
            max="30"
            className="w-12 px-1 py-0.5 border border-gray-300 rounded text-right text-xs"
            value={((tier.rate * 100 * 10) | 0) / 10}
            onChange={(e) => onUpdate(tier.id, { rate: Number(e.target.value) / 100 })}
          />
          <span className="ml-0.5 text-gray-500 text-[10px]">%</span>
        </div>
      </div>
      {index > 0 && (
        <button
          onClick={() => onRemove(tier.id)}
          className="p-0.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Remove tier"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function InterestTierEditor({ tiers, onChange }: InterestTierEditorProps) {
  const handleUpdate = useCallback(
    (id: string, updates: Partial<InterestTier>) => {
      onChange(tiers.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    },
    [tiers, onChange],
  );

  const handleRemove = useCallback(
    (id: string) => {
      if (tiers.length <= 1) return;
      onChange(tiers.filter((t) => t.id !== id));
    },
    [tiers, onChange],
  );

  const handleAdd = useCallback(() => {
    const lastNonCatchAll = tiers.filter((t) => t.threshold > 0).sort((a, b) => b.threshold - a.threshold)[0];
    const newThreshold = lastNonCatchAll ? lastNonCatchAll.threshold + 10_000_000 : 50_000_000;
    const newTier: InterestTier = {
      id: crypto.randomUUID(),
      threshold: newThreshold,
      rate: 0.05,
    };
    const newTiers = [...tiers];
    newTiers.splice(tiers.length - 1, 0, newTier);
    onChange(newTiers);
  }, [tiers, onChange]);

  const sorted = [...tiers].sort((a, b) => {
    if (a.threshold === 0) return 1;
    if (b.threshold === 0) return -1;
    return a.threshold - b.threshold;
  });

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
        Interest rate tiers
      </label>
      <div className="space-y-1">
        {sorted.map((tier, i) => {
          const prevThreshold = i === 0 ? 0 : sorted[i - 1].threshold;
          return (
            <TierRow
              key={tier.id}
              tier={tier}
              index={i}
              isLast={tier.threshold === 0}
              prevThreshold={prevThreshold}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          );
        })}
      </div>
      <button
        onClick={handleAdd}
        className="mt-1 w-full py-1 border border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-[11px]"
      >
        + Add tier
      </button>
    </div>
  );
}
