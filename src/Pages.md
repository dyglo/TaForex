# Forex Trading Journal - Pages Implementation Guide

This document provides detailed implementation guidelines for each page of the Forex Trading Journal application. Each section includes component structures, functionality requirements, and animation specifications.

## Table of Contents
1. [Trade Entry Page](#trade-entry-page)
2. [Journal Page](#journal-page)
3. [Trades History Page](#trades-history-page)
4. [Analytics Page](#analytics-page)
5. [Settings Page](#settings-page)
6. [Global Components](#global-components)
7. [State Management](#state-management)
8. [Animation Guidelines](#animation-guidelines)

---

## Trade Entry Page

The Trade Entry page allows users to add new trades to their journal with comprehensive details.

### Component Structure

```tsx
// app/trades/new/page.tsx
import TradeEntryForm from '@/components/trades/TradeEntryForm';

export default function NewTradePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Trade Entry</h1>
      <TradeEntryForm />
    </div>
  );
}
```

### Main Form Component

```tsx
// components/trades/TradeEntryForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTradeStore } from '@/store/tradeStore';
import CurrencyPairSelector from './CurrencyPairSelector';
import DateTimePicker from './DateTimePicker';
import ImageUploader from '../shared/ImageUploader';
import { v4 as uuidv4 } from 'uuid';

export default function TradeEntryForm() {
  const router = useRouter();
  const addTrade = useTradeStore((state) => state.addTrade);
  
  const [formState, setFormState] = useState({
    pair: '',
    direction: 'LONG',
    entryPrice: '',
    exitPrice: '',
    size: '',
    entryDate: new Date(),
    exitDate: new Date(),
    stopLoss: '',
    takeProfit: '',
    commission: '0',
    swap: '0',
    tags: [],
    setup: '',
    screenshots: [],
    notes: '',
    rating: 3,
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedPips, setCalculatedPips] = useState(0);
  const [calculatedProfit, setCalculatedProfit] = useState(0);
  
  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    
    // Recalculate pips and profit when relevant fields change
    if (['entryPrice', 'exitPrice', 'size', 'direction'].includes(name)) {
      calculateResults();
    }
  };
  
  const handleTagChange = (selectedTags) => {
    setFormState({
      ...formState,
      tags: selectedTags,
    });
  };
  
  const handleImageUpload = (imageUrls) => {
    setFormState({
      ...formState,
      screenshots: [...formState.screenshots, ...imageUrls],
    });
  };
  
  const calculateResults = () => {
    const { entryPrice, exitPrice, size, direction } = formState;
    
    if (!entryPrice || !exitPrice || !size) return;
    
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const lotSize = parseFloat(size);
    
    // Calculate pips based on direction
    let pips;
    if (direction === 'LONG') {
      pips = (exit - entry) * 10000; // Assuming 4 decimal places for most pairs
    } else {
      pips = (entry - exit) * 10000;
    }
    
    // Calculate profit
    // This is simplified - you'd need proper pip value calculations based on pair
    const profit = pips * lotSize * 10; // Simplified calculation
    
    setCalculatedPips(pips.toFixed(1));
    setCalculatedProfit(profit.toFixed(2));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create trade object
    const newTrade = {
      id: uuidv4(),
      ...formState,
      pips: parseFloat(calculatedPips),
      profit: parseFloat(calculatedProfit),
      entryPrice: parseFloat(formState.entryPrice),
      exitPrice: parseFloat(formState.exitPrice),
      size: parseFloat(formState.size),
      stopLoss: parseFloat(formState.stopLoss || 0),
      takeProfit: parseFloat(formState.takeProfit || 0),
      commission: parseFloat(formState.commission || 0),
      swap: parseFloat(formState.swap || 0),
      rating: parseInt(formState.rating),
      createdAt: new Date(),
    };
    
    // Add to store
    addTrade(newTrade);
    
    // Navigate to trades list
    router.push('/trades');
  };
  
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  
  // Form steps animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      transition: { ease: 'easeInOut' }
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <motion.div
            key="step1"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-white">Trade Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Currency Pair
                </label>
                <CurrencyPairSelector 
                  value={formState.pair}
                  onChange={(pair) => setFormState({...formState, pair})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Direction
                </label>
                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormState({...formState, direction: 'LONG'})}
                    className={`px-4 py-2 rounded-md w-full ${
                      formState.direction === 'LONG' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    LONG
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormState({...formState, direction: 'SHORT'})}
                    className={`px-4 py-2 rounded-md w-full ${
                      formState.direction === 'SHORT' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    SHORT
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Entry Price
                </label>
                <input
                  type="number"
                  name="entryPrice"
                  step="0.00001"
                  value={formState.entryPrice}
                  onChange={handleChange}
                  className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Exit Price
                </label>
                <input
                  type="number"
                  name="exitPrice"
                  step="0.00001"
                  value={formState.exitPrice}
                  onChange={handleChange}
                  className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Lot Size
                </label>
                <input
                  type="number"
                  name="size"
                  step="0.01"
                  value={formState.size}
                  onChange={handleChange}
                  className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Stop Loss
                </label>
                <input
                  type="number"
                  name="stopLoss"
                  step="0.00001"
                  value={formState.stopLoss}
                  onChange={handleChange}
                  className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Take Profit
                </label>
                <input
                  type="number"
                  name="takeProfit"
                  step="0.00001"
                  value={formState.takeProfit}
                  onChange={handleChange}
                  className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Entry Date & Time
                </label>
                <DateTimePicker
                  value={formState.entryDate}
                  onChange={(date) => setFormState({...formState, entryDate: date})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Exit Date & Time
                </label>
                <DateTimePicker
                  value={formState.exitDate}
                  onChange={(date) => setFormState({...formState, exitDate: date})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Calculated Pips
                </label>
                <div className={`text-xl font-bold py-2 px-3 rounded-md ${
                  parseFloat(calculatedPips) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {calculatedPips > 0 ? '+' : ''}{calculatedPips} pips
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Calculated Profit/Loss
                </label>
                <div className={`text-xl font-bold py-2 px-3 rounded-md ${
                  parseFloat(calculatedProfit) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {calculatedProfit > 0 ? '+' : ''}${calculatedProfit}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Next: Trade Analysis
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {currentStep === 2 && (
          <motion.div
            key="step2"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-white">Trade Analysis</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Trading Setup
              </label>
              <select
                name="setup"
                value={formState.setup}
                onChange={handleChange}
                className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your setup</option>
                <option value="Breakout">Breakout</option>
                <option value="Trend Following">Trend Following</option>
                <option value="Range Trading">Range Trading</option>
                <option value="News Event">News Event</option>
                <option value="Support/Resistance">Support/Resistance</option>
                <option value="Fibonacci Retracement">Fibonacci Retracement</option>
                <option value="Moving Average Crossover">Moving Average Crossover</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                placeholder="Enter tags separated by commas"
                value={formState.tags.join(', ')}
                onChange={(e) => handleTagChange(e.target.value.split(',').map(tag => tag.trim()))}
                className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Rate this trade execution
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormState({...formState, rating: star})}
                    className={`text-2xl ${
                      formState.rating >= star ? 'text-yellow-400' : 'text-gray-500'
                    }`}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Trade Notes
              </label>
              <textarea
                name="notes"
                value={formState.notes}
                onChange={handleChange}
                rows={6}
                className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="What worked? What didn't? What will you do differently next time?"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Chart Screenshots
              </label>
              <ImageUploader onUpload={handleImageUpload} />
              
              {formState.screenshots.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formState.screenshots.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={img} 
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newScreenshots = [...formState.screenshots];
                          newScreenshots.splice(index, 1);
                          setFormState({...formState, screenshots: newScreenshots});
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <motion.button
                type="button"
                onClick={prevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Back
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
              >
                Save Trade
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
```

### Helper Components

#### CurrencyPairSelector.tsx
```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const commonPairs = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD', 
  'AUD/USD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
];

export default function CurrencyPairSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredPairs, setFilteredPairs] = useState(commonPairs);
  
  useEffect(() => {
    if (search) {
      setFilteredPairs(
        commonPairs.filter(pair => 
          pair.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredPairs(commonPairs);
    }
  }, [search]);
  
  const handleSelect = (pair) => {
    onChange(pair);
    setIsOpen(false);
    setSearch('');
  };
  
  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || 'Select currency pair'}</span>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg"
          >
            <div className="p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 rounded py-1 px-2 text-white text-sm"
                placeholder="Search pairs..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredPairs.map((pair) => (
                <motion.div
                  key={pair}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.5)' }}
                  className="px-3 py-2 cursor-pointer text-white hover:bg-blue-500/50"
                  onClick={() => handleSelect(pair)}
                >
                  {pair}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

#### DateTimePicker.tsx
```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DateTimePicker({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  
  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };
  
  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white cursor-pointer"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span>{formatDate(value)}</span>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg p-4"
          >
            <input 
              type="datetime-local" 
              value={value.toISOString().slice(0, 16)}
              onChange={handleDateChange}
              className="bg-gray-700 border-gray-600 rounded text-white py-1 px-2"
            />
            
            <div className="flex mt-2 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => setShowPicker(false)}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

#### ImageUploader.tsx
```tsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ImageUploader({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const urls = fileArray.map(file => URL.createObjectURL(file));
    onUpload(urls);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div>
      <motion.div
        initial={{ borderColor: 'rgba(75, 85, 99, 0.5)' }}
        animate={{ 
          borderColor: isDragging 
            ? 'rgba(59, 130, 246, 0.8)' 
            : 'rgba(75, 85, 99, 0.5)' 
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragging ? 'bg-blue-500/10' : 'bg-gray-700/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2 text-sm text-gray-300">
          Drag & drop chart screenshots or click to browse
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </motion.div>
    </div>
  );
}
```

### Implementation Notes

1. **State Management**:
   - Use Zustand for global state management of trades
   - Implement proper persistence with localStorage

2. **Validation**:
   - Add validation for price, lot size, and date fields
   - Ensure entry date precedes exit date

3. **Animations**:
   - Use multi-step form transitions with Framer Motion
   - Add micro-animations for form interactions

4. **Features to Add**:
   - Risk calculator based on account balance and stop loss
   - Trade template feature for commonly used setups
   - Auto-calculation of R:R ratio

5. **Data Storage**:
   - Initially store trades in localStorage
   - Add export/import functionality for data backup

---

## Journal Page

The Journal page provides a calendar-based interface for traders to document their thoughts, market analysis, and general trading notes.

