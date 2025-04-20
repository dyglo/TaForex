import { useTradeStore } from '../store/tradeStore';

// Helper function to aggregate trades for dashboard
export function useDashboardStats(timeframe: string) {
  // Get trades from the store
  const trades = useTradeStore((s: { trades: any[]; }) => s.trades);
  // Define the starting balance
  const initialBalance = 100.00; // Set to $100.00 as requested
  let balance = initialBalance;
  let equityData: {date: string, balance: number}[] = [];
  let performanceMap: Record<string, {win: number, total: number}> = {};

  // Sort trades chronologically by entry date
  const sortedTrades = [...trades].sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

  // Filter trades based on the selected timeframe for the equity curve
  let filteredTrades = sortedTrades;
  const today = new Date();
  if (timeframe !== 'ALL') {
    let startDate = new Date(today);
    // Calculate start date based on timeframe
    if (timeframe === '1D') startDate.setDate(today.getDate() - 1); // Note: This will only show trades *today* if any exist. Consider if '24H' is more appropriate.
    if (timeframe === '1W') startDate.setDate(today.getDate() - 7);
    if (timeframe === '1M') startDate.setMonth(today.getMonth() - 1);
    if (timeframe === '3M') startDate.setMonth(today.getMonth() - 3);
    if (timeframe === 'YTD') startDate = new Date(today.getFullYear(), 0, 1); // Start of the current year
    // Apply the filter
    filteredTrades = sortedTrades.filter(t => new Date(t.entryDate) >= startDate);
  }

  // Calculate equity curve data based on *filtered* trades
  let currentBalance = initialBalance;
  // Start the equity curve with the initial balance point
  equityData = [{ date: 'Start', balance: initialBalance }];
  filteredTrades.forEach((t) => {
    currentBalance += t.profit; // Add profit/loss of each trade
    // Add a data point for each trade's closing date (or entry date if exit not available)
    equityData.push({ date: new Date(t.entryDate).toISOString().split('T')[0], balance: currentBalance });
  });

  // Calculate all-time statistics based on *all* trades
  let totalProfitAll = 0;
  let winCountAll = 0, lossCountAll = 0;
  let tradesThisMonth = 0;
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  sortedTrades.forEach((t) => {
    totalProfitAll += t.profit; // Accumulate total profit/loss for final balance
    // Count wins and losses
    if (t.profit > 0) winCountAll++;
    if (t.profit < 0) lossCountAll++;
    // Count trades in the current calendar month
    const tradeDate = new Date(t.entryDate);
    if (tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear) {
        tradesThisMonth++;
    }
    // Aggregate performance by trading pair
    if (!performanceMap[t.pair]) performanceMap[t.pair] = { win: 0, total: 0 };
    performanceMap[t.pair].total++;
    if (t.profit > 0) performanceMap[t.pair].win++;
  });

  // Calculate final balance (initial balance + total profit/loss from all trades)
  balance = initialBalance + totalProfitAll;

  // Calculate derived statistics
  const totalTradesAll = winCountAll + lossCountAll;
  const winRate = totalTradesAll ? Math.round((winCountAll / totalTradesAll) * 100) : 0;
  const avgProfit = totalTradesAll ? (totalProfitAll / totalTradesAll).toFixed(2) : '0.00';
  // Get the 5 most recent trades
  const recentTrades = [...sortedTrades].slice(-5).reverse();
  // Format performance by pair data
  const performanceByPair = Object.entries(performanceMap).map(([pair, stats]) => ({
    pair,
    winRate: stats.total ? Math.round((stats.win / stats.total) * 100) : 0,
    trades: stats.total
  }));

  // Return all calculated statistics
  return {
    initialBalance, // <-- Return initialBalance
    balance,
    winRate,
    avgProfit,
    recentTrades,
    performanceByPair,
    equityData,
    trades: sortedTrades, // Return all sorted trades for the calendar
    tradesThisMonth
  };
}
