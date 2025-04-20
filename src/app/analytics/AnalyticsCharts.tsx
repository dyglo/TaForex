import { useMemo } from 'react';
import './analytics-charts.css';
import styles from './bar-heights.module.css';

function getBarHeightClass(heightPx: number) {
  // Clamp and round to nearest 5px step for class naming
  const clamped = Math.max(0, Math.min(90, Math.round(heightPx / 5) * 5));
  return styles[`bar-height-${clamped}`] || styles['bar-height-0'];
}

export default function AnalyticsCharts({ trades }: { trades: any[] }) {
  // Breakdown by pair
  const byPair = useMemo(() => {
    const map: Record<string, {count: number, profit: number}> = {};
    for (const t of trades) {
      if (!map[t.pair]) map[t.pair] = { count: 0, profit: 0 };
      map[t.pair].count++;
      map[t.pair].profit += t.profit;
    }
    return map;
  }, [trades]);

  // Win/Loss breakdown
  const winLoss = useMemo(() => {
    let win = 0, loss = 0;
    for (const t of trades) {
      if (t.profit > 0) win++;
      else if (t.profit < 0) loss++;
    }
    return { win, loss };
  }, [trades]);

  // Rating breakdown
  const byRating = useMemo(() => {
    const map: Record<number, number> = {};
    for (const t of trades) {
      if (typeof t.rating === 'number') {
        map[t.rating] = (map[t.rating] || 0) + 1;
      }
    }
    return map;
  }, [trades]);

  // Pie chart helper
  function getPieSegments(data: number[]) {
    const total = data.reduce((a, b) => a + b, 0);
    let acc = 0;
    return data.map((v, i) => {
      const start = acc / total * 2 * Math.PI;
      acc += v;
      const end = acc / total * 2 * Math.PI;
      return { start, end };
    });
  }

  // Colors
  const pieColors = ['#60a5fa', '#f87171', '#fbbf24', '#34d399', '#a78bfa', '#f472b6', '#facc15'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Win/Loss Pie */}
      <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center">
        <div className="text-white font-semibold mb-2">Win/Loss Ratio</div>
        <svg width="120" height="120" viewBox="0 0 32 32">
          {getPieSegments([winLoss.win, winLoss.loss]).map((seg, i) => {
            const x1 = 16 + 16 * Math.sin(seg.start);
            const y1 = 16 - 16 * Math.cos(seg.start);
            const x2 = 16 + 16 * Math.sin(seg.end);
            const y2 = 16 - 16 * Math.cos(seg.end);
            const large = seg.end - seg.start > Math.PI ? 1 : 0;
            return (
              <path key={i} d={`M16,16 L${x1},${y1} A16,16 0 ${large} 1 ${x2},${y2} Z`} fill={pieColors[i]} />
            );
          })}
        </svg>
        <div className="flex gap-2 mt-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full analytics-bar-blue"></span>Win: {winLoss.win}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full analytics-bar-red"></span>Loss: {winLoss.loss}</span>
        </div>
      </div>
      {/* By Pair Bar Chart */}
      <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center">
        <div className="text-white font-semibold mb-2">Performance by Pair</div>
        <div className="w-full h-32 flex items-end gap-2">
          {Object.entries(byPair).map(([pair, d], i) => (
            <div key={pair} className="flex-1 flex flex-col items-center justify-end">
              <div
                className={`analytics-bar ${d.profit >= 0 ? 'analytics-bar-blue' : 'analytics-bar-red'} ${getBarHeightClass((Math.abs(d.profit) / Math.max(...Object.values(byPair).map(x => Math.abs(x.profit) || 1)) * 90 || 0))}`}
              ></div>
              <div className="analytics-bar-label">{pair}</div>
              <div className={`text-xs font-bold ${d.profit >= 0 ? 'analytics-bar-profit' : 'analytics-bar-loss'}`}>{d.profit >= 0 ? '+' : ''}{d.profit.toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Rating Distribution (if present) */}
      <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center">
        <div className="text-white font-semibold mb-2">Trade Rating Distribution</div>
        <div className="w-full h-32 flex items-end gap-2">
          {Object.entries(byRating).map(([rating, count], i) => (
            <div key={rating} className="flex-1 flex flex-col items-center justify-end">
              <div
                className={`analytics-bar analytics-bar-yellow ${getBarHeightClass(((count as number) / Math.max(...Object.values(byRating)) * 90 || 0))}`}
              ></div>
              <div className="analytics-bar-label">{rating}★</div>
              <div className="text-xs font-bold analytics-bar-rating">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
