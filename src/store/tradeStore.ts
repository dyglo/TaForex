import { create } from 'zustand';

export interface Trade {
  id: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  size: number;
  entryDate: Date;
  exitDate: Date;
  stopLoss: string;
  takeProfit: string;
  commission: string;
  swap: string;
  tags: string[];
  setup: string;
  screenshots: string[];
  notes: string;
  rating: number;
  pips: number;
  profit: number;
}

interface TradeStore {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  removeTrade: (id: string) => void;
  loadTrades: () => void;
  updateTrade: (trade: Trade) => void;
}

export const useTradeStore = create<TradeStore>((set, get) => ({
  trades: [],
  addTrade: (trade) => {
    set(state => {
      const updated = [...state.trades, trade];
      localStorage.setItem('trades', JSON.stringify(updated));
      return { trades: updated };
    });
  },
  removeTrade: (id) => {
    set(state => {
      const updated = state.trades.filter(t => t.id !== id);
      localStorage.setItem('trades', JSON.stringify(updated));
      return { trades: updated };
    });
  },
  loadTrades: () => {
    const data = localStorage.getItem('trades');
    if (data) {
      set({ trades: JSON.parse(data) });
    }
  },
  updateTrade: (trade) => {
    set(state => {
      const updated = state.trades.map(t => t.id === trade.id ? { ...t, ...trade } : t);
      localStorage.setItem('trades', JSON.stringify(updated));
      return { trades: updated };
    });
  }
}));
