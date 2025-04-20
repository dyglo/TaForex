"use client";
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Wallet, TrendingUp, ChevronUp, ChevronDown, BarChart2, Calendar, Clock } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTradeStore } from '../store/tradeStore';
import ClerkZustandSync from '../components/ClerkZustandSync';
import BalanceEditor from '../components/BalanceEditor';
import { useUser } from '@clerk/nextjs';
import { useDashboardStats } from './useDashboardStats';

// CalendarModal component: Displays trades on a calendar grid
function CalendarModal({ trades }: { trades: any[] }) {
  // State for modal visibility and the selected date
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  // Group trades by date string (YYYY-MM-DD) for quick lookup
  const tradesByDate: Record<string, any[]> = React.useMemo(() => {
      const grouped: Record<string, any[]> = {};
      trades.forEach(trade => {
          const dateStr = new Date(trade.entryDate).toISOString().slice(0, 10);
          if (!grouped[dateStr]) grouped[dateStr] = [];
          grouped[dateStr].push(trade);
      });
      return grouped;
  }, [trades]); // Recalculate only when trades change


  // Get current month details for calendar display
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed (January is 0)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the last day of the current month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week for the 1st (0=Sun, 1=Mon, ...)
  // Calculate the number of empty cells needed before the 1st day to align with Monday start
  const startOffset = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);

  // Helper function to determine the background color of a calendar day based on trades
  function getDayColor(tradesForDay: any[]) {
    if (!tradesForDay || tradesForDay.length === 0) {
        return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'; // Style for days with no trades
    }
    // Calculate total profit for the day
    const totalProfit = tradesForDay.reduce((sum, t) => sum + t.profit, 0);
    // Return color based on profitability
    if (totalProfit > 0) return 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-800 dark:text-green-200'; // Profitable day
    if (totalProfit < 0) return 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200'; // Losing day
    return 'bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200'; // Break-even day
  }

  // Get trades for the selected date to display in the modal
  const modalTrades = selectedDate ? tradesByDate[selectedDate] || [] : [];

  return (
    <>
      {/* Calendar Grid Container */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers (Mon-Sun) */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
            {day}
          </div>
        ))}
        {/* Empty cells for offsetting the start of the month */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`offset-${i}`} className="h-8"></div> // Placeholder div
        ))}
        {/* Calendar Day Buttons */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const date = new Date(year, month, dayNumber);
          const dateStr = date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
          const tradesForDay = tradesByDate[dateStr] || [];
          const colorClasses = getDayColor(tradesForDay);
          const isToday = date.toDateString() === today.toDateString(); // Check if the day is today
          const hasTrades = tradesForDay.length > 0;

          return (
            <button
              key={i}
              // Apply dynamic classes for color, today's highlight, and base styles
              className={`${colorClasses} ${isToday ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800' : ''} rounded h-8 flex items-center justify-center text-xs w-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-150 font-medium`}
              onClick={() => {
                  if (hasTrades) { // Only open modal if there are trades
                      setSelectedDate(dateStr);
                      setModalOpen(true);
                  }
              }}
              title={hasTrades ? `View trades for ${date.toLocaleDateString()}` : `${date.toLocaleDateString()} - No trades`}
              disabled={!hasTrades} // Disable button if there are no trades for the day
            >
              {dayNumber}
            </button>
          );
        })}
      </div>

      {/* Modal for displaying trades of a selected day */}
      {modalOpen && (
        // Modal backdrop
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-5 max-w-md w-full relative"
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              {/* SVG X icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Modal Title */}
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white pr-6"> {/* Added padding-right */}
              Trades for {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString()} {/* Ensure consistent date formatting */}
            </h3>
            {/* Trades List */}
            {modalTrades.length === 0 ? (
              // Message when no trades exist for the selected day
              <div className="text-gray-500 dark:text-gray-400 text-center py-4">No trades recorded for this day.</div>
            ) : (
              // Scrollable list of trades
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto -mr-2 pr-2"> {/* Negative margin + padding for scrollbar */}
                {modalTrades.map((trade, idx) => (
                  <li key={trade.id || idx} className="py-3 flex justify-between items-start">
                    {/* Left side: Pair, Direction, Time */}
                    <div>
                      <div className="font-medium text-sm text-gray-800 dark:text-gray-100">{trade.pair}</div>
                      <div className={`text-xs font-semibold ${trade.direction === 'LONG' ? 'text-blue-500' : 'text-purple-500'}`}>{trade.direction}</div>
                       <div className="text-xs text-gray-400 mt-1">
                         {/* Format entry time */}
                         {new Date(trade.entryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                    {/* Right side: Profit/Loss, Pips, Prices, Notes */}
                    <div className="text-right flex-shrink-0 ml-4">
                       {/* Profit/Loss Display */}
                      <div className={`text-sm font-semibold ${
                        trade.profit > 0 ? 'text-green-600 dark:text-green-400' : trade.profit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {/* Format profit/loss as currency */}
                        {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                      </div>
                      {/* Pips Display */}
                      <div className={`text-xs ${
                         trade.pips > 0 ? 'text-green-500' : trade.pips < 0 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                         ({trade.pips > 0 ? '+' : ''}{trade.pips.toFixed(1)} pips) {/* Using 1 decimal for pips */}
                      </div>
                      {/* Entry/Exit Prices */}
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">E: {trade.entryPrice} | X: {trade.exitPrice}</div>
                      {/* Notes (truncated with tooltip) */}
                      {trade.notes && (
                        <div className="mt-1 text-xs text-blue-500 dark:text-blue-400 italic truncate max-w-[150px] sm:max-w-xs" title={trade.notes}>
                          Note: {trade.notes}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}


// Main Page Component
export default function Page() {
  const { isSignedIn } = useUser();
  // State for loading status and selected timeframe
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('ALL'); // Default to ALL to show full curve initially

  // Fetch dashboard statistics using the custom hook
  const {
    initialBalance, // <-- Destructure initialBalance here
    balance,
    winRate,
    avgProfit,
    recentTrades,
    performanceByPair,
    equityData,
    trades,
    tradesThisMonth
  } = useDashboardStats(timeframe);

  // Simulate data loading on initial component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after a short delay
    }, 500); // Delay in milliseconds
    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Framer Motion variants for container and item animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Time delay between animating child elements
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 }, // Initial state (slightly down and transparent)
    visible: {
      y: 0, // Final state (original position)
      opacity: 1, // Final state (fully opaque)
      transition: {
        type: 'spring', // Animation type
        stiffness: 120, // Spring stiffness
        damping: 15 // Spring damping
      }
    }
  };

  // Custom Tooltip component for Recharts charts
  const CustomTooltip = ({ active, payload, label }: any) => {
      // Only display tooltip if it's active and has data
      if (active && payload && payload.length) {
          return (
          // Tooltip container styling
          <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg text-xs">
              {/* Display date/label */}
              <p className="label font-semibold text-gray-700 dark:text-gray-200">{`Date: ${label}`}</p>
              {/* Display balance value */}
              <p className="intro text-blue-600 dark:text-blue-400">{`Balance: ${payload[0].value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`}</p>
          </div>
          );
      }
      // Return null if tooltip is not active
      return null;
  };


  return (
    // Main page container with background, padding, and minimum height
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 font-sans"> {/* Added font-sans */}
      <ClerkZustandSync />
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Trading Dashboard</h1>

      {/* Loading Spinner - Displayed while isLoading is true */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        // Grid Layout for Dashboard Components - Animates in
        <motion.div
          variants={containerVariants} // Apply container animation variants
          initial="hidden" // Start in hidden state
          animate="visible" // Animate to visible state
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6" // Responsive grid layout
        >
          {/* Summary Cards Section */}

          {/* Card 1: Current Balance */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none"> {/* Subtle shadow */}
            <div className="flex items-center">
              {/* Icon */}
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400 mr-4 flex-shrink-0">
                <Wallet size={20} />
              </div>
              {/* Text Content */}
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{balance.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}</h3>
                {isSignedIn && <BalanceEditor />}

              </div>
            </div>
            {/* Percentage Change */}
            <div className="mt-3 flex items-center text-xs sm:text-sm">
              <span className={`flex items-center font-medium ${balance >= initialBalance ? 'text-green-500' : 'text-red-500'}`}>
                {balance >= initialBalance ? <ChevronUp size={14} className="-ml-0.5 mr-0.5"/> : <ChevronDown size={14} className="-ml-0.5 mr-0.5"/>}
                {Math.abs(((balance - initialBalance) / initialBalance) * 100).toFixed(2)}%
              </span>
              <span className="text-gray-400 dark:text-gray-500 ml-1.5">from initial</span>
            </div>
          </motion.div>

          {/* Card 2: Win Rate */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none">
            <div className="flex items-center">
              {/* Icon */}
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-500 dark:text-green-400 mr-4 flex-shrink-0">
                <TrendingUp size={20} />
              </div>
              {/* Text Content */}
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{winRate}%</h3>
              </div>
            </div>
             {/* Additional Info */}
             <div className="mt-3 flex items-center text-xs sm:text-sm">
               <span className="text-gray-400 dark:text-gray-500">{trades.filter(t=>t.profit > 0).length} winning trades</span>
            </div>
          </motion.div>

          {/* Card 3: Average Profit/Loss */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none">
            <div className="flex items-center">
              {/* Icon */}
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-500 dark:text-purple-400 mr-4 flex-shrink-0">
                <BarChart2 size={20} />
              </div>
              {/* Text Content */}
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Avg P/L</p>
                <h3 className={`text-lg sm:text-xl font-bold ${Number(avgProfit) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {Number(avgProfit) >= 0 ? '+' : ''}{Number(avgProfit).toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
             {/* Additional Info */}
             <div className="mt-3 flex items-center text-xs sm:text-sm">
               <span className="text-gray-400 dark:text-gray-500">per trade</span>
            </div>
          </motion.div>

          {/* Card 4: Trades This Month */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none">
            <div className="flex items-center">
              {/* Icon */}
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500 dark:text-yellow-400 mr-4 flex-shrink-0">
                <Clock size={20} />
              </div>
              {/* Text Content */}
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Trades This Month</p>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{tradesThisMonth}</h3>
              </div>
            </div>
             {/* Placeholder to maintain height */}
             <div className="mt-3 flex items-center text-xs sm:text-sm">
               <span className="text-transparent select-none">placeholder</span> {/* Keep height consistent */}
            </div>
          </motion.div>

          {/* Equity Curve Chart */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">Equity Curve</h3>
              {/* Timeframe Buttons */}
              <div className="flex flex-wrap gap-1">
                {['1W', '1M', '3M', 'YTD', 'ALL'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    // Dynamic classes for selected/unselected buttons
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors duration-150 ${
                      timeframe === tf
                        ? 'bg-blue-600 text-white shadow-sm' // Style for selected button
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' // Style for unselected buttons
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            {/* Chart Container */}
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                {/* Area Chart Component */}
                <AreaChart
                    // Provide data, using placeholder if only initial balance exists
                    data={equityData.length > 1 ? equityData : [{date: 'Start', balance: initialBalance}, {date: 'Now', balance: balance}]}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }} // Chart margins
                >
                  {/* Gradient definition for area fill */}
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/> {/* Gradient start */}
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>{/* Gradient end */}
                    </linearGradient>
                  </defs>
                  {/* Cartesian Grid */}
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20.2% 95%)" vertical={false} />
                  {/* X-Axis Configuration */}
                  <XAxis
                    dataKey="date" // Data key for x-axis
                    fontSize={10}
                    tick={{ fill: 'hsl(215 20.2% 65%)' }} // Tick label color
                    axisLine={false}
                    tickLine={false}
                    dy={10} // Offset labels down
                  />
                  {/* Y-Axis Configuration */}
                  <YAxis
                    fontSize={10}
                    tick={{ fill: 'hsl(215 20.2% 65%)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`} // Format tick labels as currency
                    dx={-10} // Offset labels left
                    domain={['auto', 'auto']} // Automatically determine domain
                   />
                  {/* Tooltip Configuration */}
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                  {/* Area Series Configuration */}
                  <Area
                    type="monotone" // Curve type
                    dataKey="balance" // Data key for y-axis
                    stroke="#3B82F6" // Line color
                    fillOpacity={1}
                    fill="url(#colorBalance)" // Fill with defined gradient
                    strokeWidth={2} // Line thickness
                    animationDuration={1000} // Animation speed
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Trades List */}
           <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none col-span-1 lg:col-span-1 flex flex-col"> {/* Added flex flex-col */}
             {/* Card Header */}
             <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
               <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Trades</h3>
             </div>
             {/* Trades List Container */}
             <div className="p-3 flex-grow overflow-hidden flex flex-col"> {/* Reduced padding, added flex-grow and overflow */}
               {recentTrades.length === 0 ? (
                  // Message when no trades are found
                  <div className="flex-grow flex items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400 py-8">No recent trades found.</div>
               ) : (
                 // Scrollable list of recent trades
                 <ul className="divide-y divide-gray-100 dark:divide-gray-700/50 flex-grow overflow-y-auto -mr-2 pr-2"> {/* Max height and scroll */}
                   {recentTrades.map((trade) => (
                     <li key={trade.id} className="py-2.5 px-1">
                       <div className="flex justify-between items-center space-x-2">
                         {/* Left: Pair & Date */}
                         <div>
                           <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{trade.pair}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(trade.entryDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                         </div>
                         {/* Right: Profit & Direction */}
                         <div className="text-right flex-shrink-0">
                           <p className={`text-xs sm:text-sm font-semibold ${
                             trade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                           }`}>
                             {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                           </p>
                           <p className={`text-xs font-medium ${
                             trade.direction === 'LONG' ? 'text-blue-500' : 'text-purple-500'
                           }`}>
                             {trade.direction}
                           </p>
                         </div>
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
               {/* View All Button (Conditional) */}
               {trades.length > 5 && ( // Only show if total trades exceed displayed recent trades
                 <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50 flex-shrink-0">
                   <button className="w-full py-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-150">
                     View All Trades
                   </button>
                 </div>
               )}
             </div>
           </motion.div>

          {/* Calendar View */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none">
            {/* Calendar Header */}
            <div className="flex items-center mb-4">
              <Calendar size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Trading Calendar</h3>
            </div>
            {/* Calendar Component */}
            <CalendarModal trades={trades} />
          </motion.div>

           {/* Performance by Pair */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-none flex flex-col"> {/* Added flex */}
                {/* Card Header */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex-shrink-0">Performance by Pair</h3>
                {/* List Container */}
                <div className="flex-grow overflow-hidden"> {/* Added flex-grow and overflow */}
                    {performanceByPair.length === 0 ? (
                        // Message when no data is available
                        <div className="flex items-center justify-center h-full text-center text-sm text-gray-500 dark:text-gray-400 py-8">No pair data available.</div>
                    ) : (
                        // Scrollable list of pairs
                        <ul className="space-y-3 h-full overflow-y-auto -mr-2 pr-2"> {/* Added h-full */}
                            {/* Sort pairs by number of trades (descending) and map */}
                            {performanceByPair.sort((a, b) => b.trades - a.trades).map((p) => (
                                <li key={p.pair}>
                                    {/* Pair name and trade count */}
                                    <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-200">{p.pair}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{p.trades} trade{p.trades !== 1 ? 's' : ''}</span>
                                    </div>
                                    {/* Win Rate Progress Bar */}
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden"> {/* Added overflow-hidden */}
                                        <div
                                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${p.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'} w-[${p.winRate}%]`} // Color and width reflect win rate
                                            title={`Win Rate: ${p.winRate}%`}
                                        ></div>
                                    </div>
                                    {/* Win Rate Percentage Text */}
                                    <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{p.winRate}% win rate</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </motion.div>


        </motion.div>
      )}
    </div>
  );
}
