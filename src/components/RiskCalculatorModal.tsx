import React, { useState } from "react";

interface RiskCalculatorModalProps {
  open: boolean;
  onClose: () => void;
}

const currencyPairs = [
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD", "XAU/USD"
];

export default function RiskCalculatorModal({ open, onClose }: RiskCalculatorModalProps) {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLoss, setStopLoss] = useState(20);
  const [lotSize, setLotSize] = useState(1);
  const [pair, setPair] = useState(currencyPairs[0]);
  const [leverage, setLeverage] = useState(100);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleCalculate = () => {
    setError(null);
    if (!balance || !riskPercent || !stopLoss || !pair) {
      setError("Please fill in all required fields.");
      return;
    }
    const riskAmount = (balance * riskPercent) / 100;
    const pipValue = (lotSize * 10); // Simplified for major pairs
    const positionSize = riskAmount / stopLoss / pipValue;
    const marginRequired = (positionSize * 100000) / leverage;
    setResult({
      riskAmount: riskAmount.toFixed(2),
      pipValue: pipValue.toFixed(2),
      positionSize: positionSize.toFixed(2),
      marginRequired: marginRequired.toFixed(2)
    });
  };

  const handlePreset = (percent: number) => setRiskPercent(percent);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-700">✕</button>
        <h2 className="text-xl font-semibold mb-4">Risk Calculator</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Inputs */}
          <div className="flex-1 flex flex-col gap-3">
            <label>
              Account Balance
              <input type="number" className="journal-input w-full" value={balance} min={0} onChange={e => setBalance(Number(e.target.value))} />
            </label>
            <label>
              Risk % per Trade
              <div className="flex gap-2 items-center">
                <input type="number" className="journal-input w-full" value={riskPercent} min={0.1} max={100} step={0.1} onChange={e => setRiskPercent(Number(e.target.value))} />
                {[1, 2, 5].map(p => (
                  <button key={p} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => handlePreset(p)}>{p}%</button>
                ))}
              </div>
            </label>
            <label>
              Stop Loss (pips)
              <input type="number" className="journal-input w-full" value={stopLoss} min={1} onChange={e => setStopLoss(Number(e.target.value))} />
            </label>
            <label>
              Lot Size
              <input type="number" className="journal-input w-full" value={lotSize} min={0.01} step={0.01} onChange={e => setLotSize(Number(e.target.value))} />
            </label>
            <label>
              Currency Pair
              <select className="journal-input w-full" value={pair} onChange={e => setPair(e.target.value)}>
                {currencyPairs.map(cp => <option key={cp}>{cp}</option>)}
              </select>
            </label>
            <label>
              Leverage
              <input type="number" className="journal-input w-full" value={leverage} min={1} step={1} onChange={e => setLeverage(Number(e.target.value))} />
            </label>
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow mt-2 w-full" onClick={handleCalculate}>Calculate</button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
          {/* Results */}
          <div className="flex-1 flex flex-col justify-center">
            {result && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-6 text-lg shadow-inner">
                <div className="mb-2">Risk Amount: <b>${result.riskAmount}</b></div>
                <div className="mb-2">Pip Value: <b>${result.pipValue}</b></div>
                <div className="mb-2">Position Size: <b>{result.positionSize} lots</b></div>
                <div className="mb-2">Margin Required: <b>${result.marginRequired}</b></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
