import { useState } from 'react';
import type { MortgageInputs } from './types/mortgage';
import { calculateMortgage } from './utils/mortgageCalculator';
import { Header } from './components/Header';
import { MortgageForm } from './components/inputs/MortgageForm';
import { ComparisonTable } from './components/results/ComparisonTable';
import { DifferenceChart } from './components/charts/DifferenceChart';

const COLORS = ['#3b82f6', '#ef4444'];

function makeDefaultInputs(): MortgageInputs {
  return {
    flatPrice: 90_000_000,
    downPayment: 30_000_000,
    loanTermYears: 20,
    tiers: [
      { id: crypto.randomUUID(), threshold: 50_000_000, rate: 0.03 },
      { id: crypto.randomUUID(), threshold: 0, rate: 0.06 },
    ],
  };
}

function App() {
  const [inputsA, setInputsA] = useState<MortgageInputs>(makeDefaultInputs());
  const [inputsB, setInputsB] = useState<MortgageInputs>(makeDefaultInputs());
  const [nameA, setNameA] = useState('Option A');
  const [nameB, setNameB] = useState('Option B');

  const resultA = calculateMortgage(inputsA);
  const resultB = calculateMortgage(inputsB);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-3 py-3">
        <Header />

        {/* Two options side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[0] }} />
              <input
                className="text-sm font-semibold bg-transparent outline-none text-gray-800 border-b border-transparent focus:border-blue-400"
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
              />
            </div>
            <MortgageForm
              inputs={inputsA}
              onChange={setInputsA}
              scenarioColor={COLORS[0]}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[1] }} />
              <input
                className="text-sm font-semibold bg-transparent outline-none text-gray-800 border-b border-transparent focus:border-red-400"
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
              />
            </div>
            <MortgageForm
              inputs={inputsB}
              onChange={setInputsB}
              scenarioColor={COLORS[1]}
            />
          </div>
        </div>

        {/* Comparison */}
        <div className="space-y-3">
          <ComparisonTable
            nameA={nameA}
            nameB={nameB}
            colorA={COLORS[0]}
            colorB={COLORS[1]}
            resultA={resultA}
            resultB={resultB}
          />
          <DifferenceChart
            nameA={nameA}
            nameB={nameB}
            colorA={COLORS[0]}
            colorB={COLORS[1]}
            resultA={resultA}
            resultB={resultB}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
