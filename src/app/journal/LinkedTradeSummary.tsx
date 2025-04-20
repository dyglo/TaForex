import { useTradeStore } from '../../store/tradeStore';
import React from 'react';

interface LinkedTradeSummaryProps {
  tradeId: string;
}

export default function LinkedTradeSummary({ tradeId }: LinkedTradeSummaryProps) {
  const trade = useTradeStore(s => s.trades.find(t => t.id === tradeId));
  if (!trade) return null;

  return (
    <div className="my-3 p-3 rounded bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
      <div className="font-semibold text-blue-700 dark:text-blue-200 mb-1">Linked Trade</div>
      <div className="flex flex-wrap gap-4 text-sm">
        <div><span className="font-medium">Pair:</span> {trade.pair}</div>
        <div><span className="font-medium">Direction:</span> {trade.direction}</div>
        <div><span className="font-medium">Entry:</span> {new Date(trade.entryDate).toLocaleDateString()}</div>
        <div><span className="font-medium">Profit:</span> <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-500'}>{trade.profit}</span></div>
        <div><span className="font-medium">Pips:</span> {trade.pips}</div>
      </div>
      <div className="mt-2 text-xs text-blue-600 dark:text-blue-300 underline cursor-pointer" onClick={() => window.location.href = '/trades'}>
        View Trade Details
      </div>
    </div>
  );
}
