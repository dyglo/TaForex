"use client";
import React from "react";

import { useTradeStore } from '../../store/tradeStore';
import { useJournalStore } from '../../store/journalStore';
import { useMemo } from 'react';
import Card from '../../components/ui/Card';

// Helper for formatting numbers
function fmt(n: number, digits = 2) {
  return n?.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function getStats(trades: any[]) {
  const totalPnl = trades.reduce((sum, t) => sum + t.profit, 0);
  const avgTradePnl = trades.length ? totalPnl / trades.length : 0;
  const wins = trades.filter(t => t.profit > 0);
  const losses = trades.filter(t => t.profit < 0);
  const winRate = trades.length ? (wins.length / trades.length) * 100 : 0;
  const largestProfit = Math.max(0, ...trades.map(t => t.profit));
  const largestLoss = Math.min(0, ...trades.map(t => t.profit));
  const totalVolume = trades.reduce((sum, t) => sum + (t.size || 0), 0);
  const avgVolume = trades.length ? totalVolume / trades.length : 0;
  // More stats can be added as needed
  return {
    totalPnl, avgTradePnl, winRate, largestProfit, largestLoss, totalVolume, avgVolume,
    totalTrades: trades.length,
    winningTrades: wins.length,
    losingTrades: losses.length,
  };
}

function getEquityCurve(trades: any[]) {
  let curve = [];
  let sum = 0;
  for (let t of trades) {
    sum += t.profit;
    curve.push(sum);
  }
  return curve;
}

import AnalyticsCharts from './AnalyticsCharts';
import AIInsightsPanel from './AIInsightsPanel';

export default function AnalyticsPage() {
  const trades = useTradeStore(s => s.trades);
  const journalEntries = useJournalStore(s => s.entries);
  const stats = useMemo(() => getStats(trades), [trades]);
  const equityCurve = useMemo(() => getEquityCurve(trades), [trades]);

  // Dates for chart x-axis
  const dates = trades.map(t => t.exitDate ? new Date(t.exitDate) : new Date()).map(d => d.toLocaleDateString());

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4 md:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Analytics</h1>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <Card glow className="flex-1 min-w-[220px]">
          <div className="text-xs text-gray-400 mb-1">Total P&L</div>
          <div className="text-2xl font-bold">${fmt(stats.totalPnl)}</div>
        </Card>
        <Card glow className="flex-1 min-w-[220px]">
          <div className="text-xs text-gray-400 mb-1">Average Trade P&L</div>
          <div className="text-2xl font-bold">${fmt(stats.avgTradePnl)}</div>
        </Card>
        <Card glow className="flex-1 min-w-[220px]">
          <div className="text-xs text-gray-400 mb-1">Win Rate</div>
          <div className="text-2xl font-bold">{fmt(stats.winRate, 1)}%</div>
        </Card>
        <Card glow className="flex-1 min-w-[220px]">
          <div className="text-xs text-gray-400 mb-1">Largest Profit</div>
          <div className="text-2xl font-bold text-green-400">${fmt(stats.largestProfit)}</div>
        </Card>
        <Card glow className="flex-1 min-w-[220px]">
          <div className="text-xs text-gray-400 mb-1">Largest Loss</div>
          <div className="text-2xl font-bold text-red-400">${fmt(stats.largestLoss)}</div>
        </Card>
      </div>
      {/* Equity Curve Chart */}
      <div className="bg-gray-900 rounded-xl p-6 shadow mb-6">
        <div className="text-lg font-semibold text-white mb-2">Net P&L Over Time</div>
        <div className="w-full h-56">
          {/* Simple SVG line chart for equity curve */}
          {equityCurve.length > 1 ? (
            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full">
              <polyline
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
                points={equityCurve.map((v, i) => `${(i/(equityCurve.length-1))*600},${200-((v-Math.min(...equityCurve))/(Math.max(...equityCurve)-Math.min(...equityCurve)||1)*180)}`).join(' ')}
              />
              {/* X-axis labels */}
              {dates.length > 0 && dates.map((d, i) => i % Math.ceil(dates.length/6) === 0 ? (
                <text key={i} x={(i/(dates.length-1))*600} y={195} fontSize="10" fill="#a3a3a3" textAnchor="middle">{d}</text>
              ) : null)}
            </svg>
          ) : (
            <div className="text-gray-400 text-sm flex items-center justify-center h-full">Add trades to see your equity curve.</div>
          )}
        </div>
      </div>
      {/* Additional Analytics Charts */}
      <AnalyticsCharts trades={trades} />
      {/* Performance Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <Card glow>
          <div className="text-xs text-gray-400 mb-1">Total Trades</div>
          <div className="text-2xl font-bold">{stats.totalTrades}</div>
          <div className="text-xs text-gray-400 mt-2">Winning Trades: <span className="text-green-400 font-bold">{stats.winningTrades}</span></div>
          <div className="text-xs text-gray-400">Losing Trades: <span className="text-red-400 font-bold">{stats.losingTrades}</span></div>
        </Card>
        <Card glow>
          <div className="text-xs text-gray-400 mb-1">Total Volume</div>
          <div className="text-2xl font-bold">{fmt(stats.totalVolume)}</div>
          <div className="text-xs text-gray-400 mt-2">Average Volume: <span className="font-bold">{fmt(stats.avgVolume)}</span></div>
        </Card>
        <Card glow>
          <div className="text-xs text-gray-400 mb-1">Journal Entries</div>
          <div className="text-2xl font-bold">{journalEntries.length}</div>
          <div className="text-xs text-gray-400 mt-2">Linked to Trades: <span className="font-bold">{journalEntries.filter(e => e.relatedTradeId).length}</span></div>
        </Card>
      </div>
      {/* AI Insights Summary Panel */}
      <AIInsightsPanel trades={trades} journalEntries={journalEntries} />
    </div>
  );
}
