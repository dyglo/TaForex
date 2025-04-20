import React, { useState } from 'react';
import Card from './ui/Card';
import { useTradeStore } from '../store/tradeStore';
import { useDashboardStats } from '../app/useDashboardStats'; 
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function LandingDashboard() {
  const trades = useTradeStore(state => state.trades);
  const { initialBalance, balance, winRate, avgProfit, tradesThisMonth, recentTrades, equityData } = useDashboardStats('ALL');
  const [timeframe, setTimeframe] = useState('1M');

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Card glow className="overflow-hidden w-full max-w-4xl">
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-neutral-400 text-xs tracking-widest uppercase">Statistics</span>
          {/* Timeframe selector */}
          <select aria-label="Select timeframe" value={timeframe} onChange={e => setTimeframe(e.target.value)} className="text-xs bg-transparent text-white">
            {['1D','1W','1M','3M','YTD','ALL'].map(tf => <option key={tf} value={tf}>{tf}</option>)}
          </select>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Balance */}
          <div className="text-center">
            <div className="text-sm text-neutral-400 uppercase">Current Balance</div>
            <div className="text-2xl font-bold text-white">{new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',minimumFractionDigits:2}).format(Number(balance))}</div>
          </div>
          {/* Win Rate */}
          <div className="text-center">
            <div className="text-sm text-neutral-400 uppercase">Win Rate</div>
            <div className="text-2xl font-bold text-white">{winRate.toFixed(2)}%</div>
          </div>
          {/* Avg Profit */}
          <div className="text-center">
            <div className="text-sm text-neutral-400 uppercase">Avg Profit</div>
            <div className="text-2xl font-bold text-white">{new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',minimumFractionDigits:2}).format(Number(avgProfit))}</div>
          </div>
          {/* Trades This Month */}
          <div className="text-center">
            <div className="text-sm text-neutral-400 uppercase">Trades This Month</div>
            <div className="text-2xl font-bold text-white">{tradesThisMonth}</div>
          </div>
        </div>
        {/* Equity Curve */}
        <div className="px-6 py-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={equityData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<div className="text-xs p-2 bg-white dark:bg-gray-700" />} />
              <Area type="monotone" dataKey="balance" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Recent Trades */}
        <div className="px-6 pb-4">
          <div className="text-sm text-neutral-400 uppercase mb-2">Recent Trades</div>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {recentTrades.map(t => (
              <li key={t.id} className="flex justify-between text-xs">
                <span>{new Date(t.entryDate).toLocaleDateString()}</span>
                <span>{t.pair}</span>
                <span className={t.profit>=0?'text-green-400':'text-red-400'}>{new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(Number(t.profit))}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
