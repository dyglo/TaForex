"use client";
import React, { useState, useEffect } from 'react';

// Constants
const FOREX_ASSETS = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"];
const COMMODITIES = ["XAUUSD", "XAGUSD", "WTIUSD (Oil)"];
const CATEGORIES = ["Market Analysis", "Trade Setup", "Trade Review", "Lesson Learned", "Psychology"];

// Helper
const getFormattedDate = (date = new Date()) => date.toISOString().split('T')[0];

type EntryData = {
  id?: number;
  title: string;
  content: string;
  category: string;
  asset: string;
  date: string;
  image?: string;
};

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EntryData) => void;
  initialData?: EntryData;
  isDarkMode: boolean;
}

export default function EntryModal({ isOpen, onClose, onSave, initialData, isDarkMode }: EntryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [asset, setAsset] = useState(FOREX_ASSETS[0]);
  const [date, setDate] = useState(getFormattedDate());
  const [image, setImage] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategory(initialData.category);
      setAsset(initialData.asset);
      setDate(initialData.date);
      setImage(initialData.image || '');
    } else {
      setTitle(''); setContent(''); setCategory(CATEGORIES[0]); setAsset(FOREX_ASSETS[0]);
      setDate(getFormattedDate()); setImage('');
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title cannot be empty');
    onSave({ title, content, category, asset, date, image });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className={`w-full max-w-lg p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{initialData ? 'Edit Entry' : 'Create New Entry'}</h2>
          <button onClick={onClose} aria-label="Close modal" className="p-1 rounded-full">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 rounded-md border" />
          </div>
          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Content / Notes</label>
            <textarea id="content" rows={4} value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2 rounded-md border" />
          </div>
          {/* Image Upload */}
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium mb-1">Upload Image</label>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-xs text-gray-500" />
            {image && <img src={image} alt="Preview" className="mt-2 max-h-40 rounded border" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
              <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 rounded-md border" />
            </div>
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-md border">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            {/* Asset */}
            <div>
              <label htmlFor="asset" className="block text-sm font-medium mb-1">Asset</label>
              <select id="asset" value={asset} onChange={e => setAsset(e.target.value)} className="w-full px-3 py-2 rounded-md border">
                <optgroup label="Forex">{FOREX_ASSETS.map(a => <option key={a} value={a}>{a}</option>)}</optgroup>
                <optgroup label="Commodities">{COMMODITIES.map(a => <option key={a} value={a}>{a}</option>)}</optgroup>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white">{initialData ? 'Save Changes' : 'Create Entry'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
