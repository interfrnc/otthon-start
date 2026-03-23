import type { MortgageInputs } from '../../types/mortgage';
import { CurrencyInput } from './CurrencyInput';
import { SliderInput } from './SliderInput';
import { InterestTierEditor } from './InterestTierEditor';

interface MortgageFormProps {
  inputs: MortgageInputs;
  onChange: (inputs: MortgageInputs) => void;
  scenarioColor?: string;
}

export function MortgageForm({ inputs, onChange, scenarioColor }: MortgageFormProps) {
  return (
    <div
      className="bg-white rounded-xl shadow p-2.5 space-y-2 border-t-3"
      style={{ borderTopColor: scenarioColor ?? '#3b82f6' }}
    >
      <div className="grid grid-cols-2 gap-2">
        <CurrencyInput
          label="Property price"
          value={inputs.flatPrice}
          onChange={(v) => onChange({ ...inputs, flatPrice: v })}
          placeholder="e.g. 40 000 000"
        />

        <CurrencyInput
          label="Down payment"
          value={inputs.downPayment}
          onChange={(v) => onChange({ ...inputs, downPayment: v })}
          placeholder="e.g. 8 000 000"
        />
      </div>

      {inputs.downPayment > inputs.flatPrice && (
        <p className="text-red-500 text-xs">Down payment cannot exceed property price.</p>
      )}

      <SliderInput
        label="Loan term"
        value={inputs.loanTermYears}
        min={1}
        max={35}
        unit="yrs"
        onChange={(v) => onChange({ ...inputs, loanTermYears: v })}
      />

      <InterestTierEditor
        tiers={inputs.tiers}
        onChange={(tiers) => onChange({ ...inputs, tiers })}
      />
    </div>
  );
}
