import { useTradeStore } from '../../store/tradeStore';
import React from 'react';

interface TradeLinkDropdownProps {
  selectedTradeId?: string;
  onSelect: (tradeId: string) => void;
}

export default function TradeLinkDropdown({ selectedTradeId, onSelect }: TradeLinkDropdownProps) {
  const trades = useTradeStore(s => s.trades);

  return (
    <div className="flex items-center gap-1">
      <label htmlFor="journal-trade-link" className="sr-only">Link to Trade</label>
      <select
        id="journal-trade-link"
        className="border rounded px-2 py-1 text-sm"
        value={selectedTradeId || ''}
        aria-label="Link to Trade"
        onChange={e => onSelect(e.target.value)}
      >
        <option value="">No Trade Linked</option>
        {trades.map(trade => (
          <option key={trade.id} value={trade.id}>
            {trade.pair} | {trade.direction} | {new Date(trade.entryDate).toLocaleDateString()} | {trade.profit >= 0 ? '+' : ''}{trade.profit}
          </option>
        ))}
      </select>
    </div>
  );
}
