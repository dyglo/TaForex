export interface Trade {
  id: string;
  pair: string;
  direction: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  size: number;
  entryDate: Date;
  exitDate: Date;
  pips: number;
  profit: number;
  stopLoss: number;
  takeProfit: number;
  commission: number;
  swap: number;
  tags: string[];
  setup: string;
  screenshots: string[];
  notes: string;
  rating: 1 | 2 | 3 | 4 | 5;
}
