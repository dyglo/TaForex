import React, { useState } from 'react';
import { useTradeStore } from '../../store/tradeStore';

interface TradeEditModalProps {
  trade: any;
  onClose: () => void;
}

const TradeEditModal: React.FC<TradeEditModalProps> = ({ trade, onClose }) => {
  const updateTrade = useTradeStore(s => s.updateTrade);
  const [form, setForm] = useState({ ...trade });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrade({ ...form, entryPrice: Number(form.entryPrice), exitPrice: Number(form.exitPrice), size: Number(form.size) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Edit Trade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-pair" className="block text-sm font-medium mb-1">Pair</label>
            <input id="edit-pair" name="pair" value={form.pair} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-neutral-800" title="Pair" placeholder="e.g. EUR/USD" />
          </div>
          <div>
            <label htmlFor="edit-direction" className="block text-sm font-medium mb-1">Direction</label>
            <select id="edit-direction" name="direction" value={form.direction} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-neutral-800" title="Direction">
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="edit-entryPrice" className="block text-sm font-medium mb-1">Entry Price</label>
              <input id="edit-entryPrice" name="entryPrice" type="number" value={form.entryPrice} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-neutral-800" title="Entry Price" placeholder="e.g. 1.2345" />
            </div>
            <div className="flex-1">
              <label htmlFor="edit-exitPrice" className="block text-sm font-medium mb-1">Exit Price</label>
              <input id="edit-exitPrice" name="exitPrice" type="number" value={form.exitPrice} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-neutral-800" title="Exit Price" placeholder="e.g. 1.2450" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="edit-size" className="block text-sm font-medium mb-1">Size</label>
              <input id="edit-size" name="size" type="number" value={form.size} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-neutral-800" title="Size" placeholder="e.g. 1.0" />
            </div>
            <div className="flex-1">
              <label htmlFor="edit-entryDate" className="block text-sm font-medium mb-1">Date</label>
              <input id="edit-entryDate" name="entryDate" type="date" value={form.entryDate ? (typeof form.entryDate === 'string' ? form.entryDate.slice(0,10) : form.entryDate instanceof Date ? form.entryDate.toISOString().slice(0,10) : '') : ''} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-neutral-800" title="Entry Date" placeholder="YYYY-MM-DD" />
            </div>
          </div>
          <div>
            <label htmlFor="edit-notes" className="block text-sm font-medium mb-1">Notes</label>
            <input id="edit-notes" name="notes" value={form.notes || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-neutral-800" title="Notes" placeholder="Optional notes..." />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-gray-100">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeEditModal;
