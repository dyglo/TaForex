# Forex Trading Journal Application

## Architecture Overview

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Landing/Login page
│   ├── dashboard/        # Dashboard page
│   ├── journal/          # Journal entries page
│   ├── trades/           # Trade history page
│   ├── analytics/        # Analytics page
│   ├── settings/         # Settings page
│   └── layout.tsx        # Main layout with navigation
├── components/
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── trades/           # Trade-specific components
│   ├── journal/          # Journal-specific components
│   ├── analytics/        # Analytics-specific components
│   └── shared/           # Shared components like Navbar, Sidebar
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── context/              # Context providers
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Key Data Models

### Trade
```typescript
interface Trade {
  id: string;
  pair: string;             // Currency pair (e.g., "EUR/USD")
  direction: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  size: number;             // Lot size
  entryDate: Date;
  exitDate: Date;
  pips: number;             // Gain/loss in pips
  profit: number;           // Gain/loss in account currency
  stopLoss: number;
  takeProfit: number;
  commission: number;
  swap: number;             // Overnight fees
  tags: string[];           // For categorization
  setup: string;            // Trading setup used
  screenshots: string[];    // Trade screenshots (stored URLs)
  notes: string;            // Trade notes
  rating: 1 | 2 | 3 | 4 | 5; // Self-rating of trade execution
}
```

### JournalEntry
```typescript
interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: "Confident" | "Neutral" | "Anxious" | "Frustrated" | "Excited";
  tags: string[];
  relatedTrades: string[];  // Trade IDs
}
```

### UserSettings
```typescript
interface UserSettings {
  accountCurrency: string;
  initialBalance: number;
  riskPercentage: number;  // Default risk % per trade
  darkMode: boolean;
  defaultPairs: string[];  // Favorite/common pairs
  tags: string[];          // Predefined tags
  setups: string[];        // Trading setups
}
```

## Page Designs

### 1. Dashboard

![Dashboard Layout](https://placeholder-image)

The dashboard will include:

- **Performance Summary Card**
  - Current balance
  - Total P/L ($ and %)
  - Win rate
  - Average RRR (Risk Reward Ratio)

- **Equity Curve Chart**
  - Line chart showing account balance over time
  - Option to overlay drawdown visualization

- **Recent Trades Table**
  - Last 5-10 trades with quick metrics
  - Click to expand for details

- **Win/Loss Distribution**
  - Donut chart showing win vs loss percentage
  - Breakdown by currency pair

- **Trade Statistics Cards**
  - Best trade
  - Worst trade
  - Average win/loss size
  - Total number of trades

- **Performance by Day/Time**
  - Heatmap showing performance by weekday and time

### 2. Trade Entry Form

A comprehensive form for capturing trade details with:

- Currency pair selector with popular pairs
- Entry/Exit price and date/time pickers
- Stop-loss and take-profit inputs
- P/L calculation (auto-calculated and editable)
- Tags and setup selection
- Screenshot upload area
- Detailed notes textarea
- Trade rating system

### 3. Trade History

- Sortable and filterable table of all trades
- Advanced filters (by pair, date range, outcome, etc.)
- Bulk actions (delete, tag, export)
- Pagination or infinite scroll
- Click to expand for complete trade details
- Option to edit past trades

### 4. Analytics

- **Performance by Currency Pair**
  - Bar chart showing win rate and average P/L by pair
  
- **Performance by Setup**
  - Compare different trading strategies
  
- **Performance Trends**
  - Line charts showing improvements over time
  
- **Risk Analysis**
  - Average risk per trade
  - Risk-adjusted returns
  
- **Drawdown Analysis**
  - Maximum drawdown
  - Drawdown duration
  
- **Trade Duration Analysis**
  - Performance by trade holding time

### 5. Journal Notes

- Calendar view for daily entries
- Rich text editor for detailed journal entries
- Option to link trades to journal entries
- Mood tracking
- Tagging system for easy categorization

### 6. Settings

- Account preferences
- Default risk parameters
- Visual theme options
- Data import/export
- Backup settings

## UI/UX Considerations

- **Color Scheme**: Use a professional color scheme with:
  - Primary color for main actions and navigation
  - Success/Failure colors for P/L visualization
  - Neutral tones for backgrounds and containers
  - Dark mode support

- **Typography**:
  - Clear, readable font for data and metrics
  - Appropriate hierarchy with headings and labels

- **Layout**:
  - Responsive design that works on desktop and tablets
  - Collapsible sidebar for navigation
  - Cards and containers with subtle shadows
  - Adequate spacing for readability

- **Motion & Animation**:
  - Subtle transitions between pages
  - Animation for data loading and updates
  - Chart animations for better data visualization
  - Micro-interactions for better feedback

## Animation Specifications

Using Framer Motion for animations:

1. **Page Transitions**:
   - Fade in/out with slight scaling
   - Staggered animations for dashboard components

2. **Chart Animations**:
   - Animated data points appearing
   - Smooth transitions when filtering or changing timeframes

3. **Micro-interactions**:
   - Button hover/press effects
   - Success/error animations for form submissions
   - Loading states for data fetching

4. **Card Interactions**:
   - Subtle hover effects
   - Expand/collapse animations for details

## Implementation Plan

### Phase 1: Core Structure
1. Set up Next.js with TypeScript and Tailwind CSS
2. Create basic layout with navigation
3. Implement basic state management

### Phase 2: Core Features
1. Build Trade Entry form
2. Implement Trade History with local storage
3. Create basic Dashboard with key metrics

### Phase 3: Advanced Features
1. Add Analytics page with charts
2. Build Journal functionality
3. Implement Settings page

### Phase 4: Polish
1. Add animations and transitions
2. Implement responsive design
3. Add dark mode and theme options
4. Performance optimization

## Component Examples

Here are key components you'll need:

1. **TradeForm**: For entering new trades
2. **TradeCard**: For displaying individual trades
3. **PerformanceChart**: For equity curves and analysis
4. **StatisticsCard**: For displaying key metrics
5. **JournalEditor**: For writing journal entries
6. **CurrencyPairSelector**: For selecting forex pairs
7. **DateRangePicker**: For filtering by date
8. **ProfitLossIndicator**: Visual indicator for P/L