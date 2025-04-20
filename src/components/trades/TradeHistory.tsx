import { useTradeStore } from '../../store/tradeStore';
import React from 'react';

export default function TradeHistory() {
  const trades = useTradeStore((state) => state.trades);

  if (!trades.length) {
    return <div className="text-gray-400">No trades yet. Click "Add New Trade" to get started!</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4">Pair</th>
            <th className="py-2 px-4">Direction</th>
            <th className="py-2 px-4">Entry</th>
            <th className="py-2 px-4">Exit</th>
            <th className="py-2 px-4">Size</th>
            <th className="py-2 px-4">Result</th>
            <th className="py-2 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, idx) => (
            <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700">
              <td className="py-2 px-4">{trade.pair}</td>
              <td className="py-2 px-4">{trade.direction}</td>
              <td className="py-2 px-4">{trade.entryPrice}</td>
              <td className="py-2 px-4">{trade.exitPrice}</td>
              <td className="py-2 px-4">{trade.size}</td>
              <td className="py-2 px-4">{Number(trade.exitPrice) - Number(trade.entryPrice)}</td>
              <td className="py-2 px-4">{new Date(trade.entryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
