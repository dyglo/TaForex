"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TradeEditModal from './TradeEditModal';
import Card from '../ui/Card';
import { useTradeStore } from '../../store/tradeStore';
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  PieChart,
  BarChart2,
  Activity
} from 'lucide-react';

const TradesView = () => {
  const trades = useTradeStore((state) => state.trades);
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'profit' | 'pair'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [editTrade, setEditTrade] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    pairs: [] as string[],
    directions: [] as string[],
    dateRange: { start: '' as string | null, end: '' as string | null },
    resultRange: { min: null as number | null, max: null as number | null }
  });

  // Filtering logic
  const filteredTrades = trades.filter(trade => {
    const pairOk = filters.pairs.length === 0 || filters.pairs.includes(trade.pair);
    const dirOk = filters.directions.length === 0 || filters.directions.includes(trade.direction);
    // Date filtering (entryDate)
    let dateOk = true;
    if (filters.dateRange.start) {
      dateOk = dateOk && new Date(trade.entryDate) >= new Date(filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      dateOk = dateOk && new Date(trade.entryDate) <= new Date(filters.dateRange.end);
    }
    return pairOk && dirOk && dateOk;
  });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Calculate summary stats
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.profit > 0).length;
  const winRate = ((winningTrades / totalTrades) * 100).toFixed(1);
  const totalPnL = trades.reduce((sum, t) => sum + t.profit, 0).toFixed(2);

  // Unique pairs for filtering
  const uniquePairs = Array.from(new Set(trades.map(t => t.pair)));

  // Sort trades
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    if (sortField === 'date') {
      const timeA = a.entryDate.getTime();
      const timeB = b.entryDate.getTime();
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    } else if (sortField === 'profit') {
      return sortDirection === 'asc' ? a.profit - b.profit : b.profit - a.profit;
    } else {
      return sortDirection === 'asc' ? a.pair.localeCompare(b.pair) : b.pair.localeCompare(a.pair);
    }
  });

  const handleSort = (field: 'date' | 'profit' | 'pair') => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleTradeDetails = (id: string) => {
    setExpandedTrade(prev => prev === id ? null : id);
  };

  const handleExportCSV = () => {
    // Export filtered trades to CSV
    const csvRows = [
      [
        'Pair', 'Direction', 'Entry', 'Exit', 'Size', 'P&L', 'Date', 'Notes'
      ],
      ...filteredTrades.map(trade => [
        trade.pair,
        trade.direction,
        trade.entryPrice,
        trade.exitPrice,
        trade.size,
        trade.profit,
        new Date(trade.entryDate).toLocaleDateString(),
        trade.notes?.replace(/\n/g, ' ')
      ])
    ];
    const csvContent = csvRows.map(row => row.map(String).map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trades.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Ensure all functions and blocks are properly closed before return
  return (
    <div className="bg-white text-neutral-900 dark:bg-primary-dark dark:text-neutral-100 min-h-screen py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Trade History</h1>
          <p className="text-gray-400">Analyze and optimize your trading performance with detailed insights</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {/* total Trades */}
          <Card className="h-full flex flex-col justify-between">
  <div className="flex items-center justify-between">
    <span className="text-gray-400 text-sm">Total Trades</span>
    <Activity className="text-blue-400 h-5 w-5" />
  </div>
  <div className="text-2xl font-bold mt-2">{totalTrades}</div>
</Card>
          {/* Win Rate */}
          <Card className="h-full flex flex-col justify-between">
  <div className="flex items-center justify-between">
    <span className="text-gray-400 text-sm">Win Rate</span>
    <PieChart className="text-green-400 h-5 w-5" />
  </div>
  <div className="text-2xl font-bold mt-2">{winRate}%</div>
</Card>
          {/* Total P&L */}
          <Card className="h-full flex flex-col justify-between">
  <div className="flex items-center justify-between">
    <span className="text-gray-400 text-sm">Total P&L</span>
    <BarChart2 className="text-purple-400 h-5 w-5" />
  </div>
  <div className={`text-2xl font-bold mt-2 ${parseFloat(totalPnL) >= 0 ? 'text-green-400' : 'text-red-400'}`}>${totalPnL}</div>
</Card>
          {/* Avg Duration */}
          <Card className="h-full flex flex-col justify-between">
  <div className="flex items-center justify-between">
    <span className="text-gray-400 text-sm">Avg. Duration</span>
    <Calendar className="text-yellow-400 h-5 w-5" />
  </div>
  <div className="text-2xl font-bold mt-2">2d 5h</div>
</Card>
        </motion.div>

        {/* Controls */}
        <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="flex space-x-2">
            <button onClick={() => setViewMode('table')} className={`px-3 py-2 rounded-md ${viewMode==='table' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Table View</button>
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 rounded-md ${viewMode==='grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Grid View</button>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md text-sm">
                <Filter className="h-4 w-4" /><span>Filters</span>
              </button>
              {filterOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-md shadow-lg z-10 p-4 border border-gray-700">
                  {/* filter options here */}
                </motion.div>
              )}
            </div>
            <button onClick={handleExportCSV} className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md text-sm">
              <Download className="h-4 w-4" /><span>Export</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium" onClick={() => window.location.href='/trades/new'}>Add New Trade</button>
          </div>
        </motion.div>

        {/* Listing */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div key="table" className="bg-surface-card dark:bg-surface-cardDark rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-surface-card dark:bg-surface-cardDark text-neutral-900 dark:text-neutral-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('pair')}>
                        <div className="flex items-center">
                          <span>Pair</span>
                          {sortField === 'pair' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Direction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Entry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Exit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('profit')}>
                        <div className="flex items-center">
                          <span>P&L</span>
                          {sortField === 'profit' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                        <div className="flex items-center">
                          <span>Date</span>
                          {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sortedTrades.map((trade) => (
                      <React.Fragment key={trade.id}>
                        <tr className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                              {trade.pair}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${trade.direction === 'LONG' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                              {trade.direction === 'LONG' ? (
                                <div className="flex items-center"><TrendingUp className="h-3 w-3 mr-1" /><span>LONG</span></div>
                              ) : (
                                <div className="flex items-center"><TrendingDown className="h-3 w-3 mr-1" /><span>SHORT</span></div>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.entryPrice}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.exitPrice}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.size}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(trade.entryDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => toggleTradeDetails(trade.id)} className="text-blue-400 hover:text-blue-300">
                              {expandedTrade === trade.id ? 'Hide' : 'View'}
                            </button>
                          </td>
                        </tr>
                        {expandedTrade === trade.id && (
                          <tr>
                            <td colSpan={8} className="px-6 py-4 bg-gray-750">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <div><span className="text-gray-400">Status:</span> <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-900 text-blue-300 text-xs">Closed</span></div>
                                    <div><span className="text-gray-400">Duration:</span> <span className="ml-2">2d 3h</span></div>
                                    <div><span className="text-gray-400">Risk/Reward:</span> <span className="ml-2">1:2.5</span></div>
                                  </div>
                                  <div className="space-y-2">
                                    <div><span className="text-gray-400">Notes:</span> <p className="mt-1 text-gray-300">{trade.notes}</p></div>
                                  </div>
                                  <div className="flex flex-col space-y-2">
                                    <div className="ml-auto space-x-2">
                                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs" onClick={() => alert('Edit functionality coming soon!')}>Edit</button>
                                      <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs" onClick={() => {
                                        if (confirm('Are you sure you want to delete this trade?')) {
                                          useTradeStore.getState().removeTrade(trade.id);
                                        }
                                      }}>Delete</button>
                                    </div>
                                    <div className="ml-auto mt-2">
                                      <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center">
                                        <span>View Chart Screenshot</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {sortedTrades.map((trade) => (
                <Card className="overflow-hidden" style={{ animation: 'fadeIn 0.2s' }}>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                        <h3 className="font-medium">{trade.pair}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${trade.direction === 'LONG' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {trade.direction === 'LONG' ? (
                          <div className="flex items-center"><TrendingUp className="h-3 w-3 mr-1" /><span>LONG</span></div>
                        ) : (
                          <div className="flex items-center"><TrendingDown className="h-3 w-3 mr-1" /><span>SHORT</span></div>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                      <div><span className="text-gray-400">Entry:</span> <span className="ml-1">{trade.entryPrice}</span></div>
                      <div><span className="text-gray-400">Exit:</span> <span className="ml-1">{trade.exitPrice}</span></div>
                      <div><span className="text-gray-400">Size:</span> <span className="ml-1">{trade.size}</span></div>
                      <div><span className="text-gray-400">P&L:</span> <span className={`ml-1 ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}</span></div>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">{new Date(trade.entryDate).toLocaleDateString()} {/* Duration logic here */}</div>
                    {trade.notes && (
                      <div className="text-xs mb-3 bg-gray-750 p-2 rounded border border-gray-700">{trade.notes}</div>
                    )}
                    <div className="flex justify-end space-x-2 mt-2">
                      <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs" onClick={() => setEditTrade(trade)}>Edit</button>
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs">Details</button>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {editTrade && <TradeEditModal trade={editTrade} onClose={() => setEditTrade(null)} />}
    </div>
  );
};

export default TradesView;
