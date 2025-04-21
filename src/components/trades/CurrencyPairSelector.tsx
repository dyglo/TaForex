import React from 'react';

const pairs = [
  'EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD',
  'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
  'EUR/AUD', 'AUD/JPY', 'GBP/CHF', 'EUR/CAD', 'USD/SGD', 'XAU/USD', // Gold/US Dollar
];

export default function CurrencyPairSelector({ value, onChange }: { value: string; onChange: (pair: string) => void }) {
  return (
    <select
      className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      aria-label="Currency Pair"
      title="Currency Pair"
    >
      <option value="">Select Pair</option>
      {pairs.map(pair => (
        <option key={pair} value={pair}>{pair}</option>
      ))}
    </select>
  );
}
