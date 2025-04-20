'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTradeStore } from '../../store/tradeStore';
import CurrencyPairSelector from './CurrencyPairSelector';
import DateTimePicker from './DateTimePicker';
import ImageUploader from '../shared/ImageUploader';

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

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

  // Handlers (implement full logic as in Pages.md)
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    // TODO: recalculate results
  };

  const handleTagChange = (selectedTags: any) => {
    setFormState({
      ...formState,
      tags: selectedTags,
    });
  };

  const handleImageUpload = (imageUrls: string[]) => {
    setFormState({
      ...formState,
      screenshots: [...formState.screenshots, ...imageUrls],
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Create a unique id (timestamp-based fallback)
    const id = Date.now().toString();
    const entryPrice = Number(formState.entryPrice);
    const exitPrice = Number(formState.exitPrice);
    const size = Number(formState.size);
    const direction = formState.direction as 'LONG' | 'SHORT';
    // Determine pip factor (JPY pairs use 100, others 10000)
    const isJPY = formState.pair && formState.pair.includes('JPY');
    const pipFactor = isJPY ? 100 : 10000;
    let pips = 0;
    if (direction === 'LONG') {
      pips = (exitPrice - entryPrice) * pipFactor;
    } else {
      pips = (entryPrice - exitPrice) * pipFactor;
    }
    // Pip value calculation
    let pipValue = 0;
    if (isJPY) {
      // pipValue in USD for JPY pairs
      pipValue = ((100000 * 0.01) / exitPrice) * size;
    } else {
      // pipValue in USD for USD-quoted pairs
      pipValue = 10 * size;
    }
    const profit = pips * pipValue;
    const trade = {
      id,
      pair: formState.pair,
      direction,
      entryPrice,
      exitPrice,
      size,
      entryDate: formState.entryDate,
      exitDate: formState.exitDate,
      stopLoss: formState.stopLoss,
      takeProfit: formState.takeProfit,
      commission: formState.commission,
      swap: formState.swap,
      tags: formState.tags,
      setup: formState.setup,
      screenshots: formState.screenshots,
      notes: formState.notes,
      rating: formState.rating,
      pips,
      profit
    };
    addTrade(trade);
    router.push('/trades');
  };

  return (
    <>
      <SignedOut>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-4 my-8 text-center">
          Please <SignInButton mode="modal">sign in</SignInButton> to add a trade.
        </div>
      </SignedOut>
      <SignedIn>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit}>
        {/* Step 1: Trade details (expand as in Pages.md) */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
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
                <CurrencyPairSelector value={formState.pair} onChange={pair => setFormState({...formState, pair})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Direction
                </label>
                <select
                  name="direction"
                  value={formState.direction}
                  onChange={handleChange}
                  className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                  title="Trade Direction"
                >
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Entry Date</label>
              <DateTimePicker value={formState.entryDate} onChange={date => setFormState({...formState, entryDate: date})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Exit Date</label>
              <DateTimePicker value={formState.exitDate} onChange={date => setFormState({...formState, exitDate: date})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Entry Price</label>
              <input type="number" name="entryPrice" value={formState.entryPrice} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" required placeholder="Entry Price" title="Entry Price" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Exit Price</label>
              <input type="number" name="exitPrice" value={formState.exitPrice} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" required placeholder="Exit Price" title="Exit Price" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lot Size</label>
              <input type="number" name="size" value={formState.size} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" required placeholder="Lot Size" title="Lot Size" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stop Loss</label>
              <input type="number" name="stopLoss" value={formState.stopLoss} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Stop Loss" title="Stop Loss" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Take Profit</label>
              <input type="number" name="takeProfit" value={formState.takeProfit} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Take Profit" title="Take Profit" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Commission</label>
              <input type="number" name="commission" value={formState.commission} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Commission" title="Commission" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Swap</label>
              <input type="number" name="swap" value={formState.swap} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Swap" title="Swap" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
              <textarea name="notes" value={formState.notes} onChange={handleChange} className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Notes" title="Notes" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Screenshots</label>
              <ImageUploader onUpload={handleImageUpload} />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Trade
              </button>
            </div>
          </motion.div>
        )}
      </form>
        </motion.div>
      </SignedIn>
    </>
  );
}
