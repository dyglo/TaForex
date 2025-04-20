"use client";
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

interface EntryData {
  id: number;
  title: string;
  content: string;
  category: string;
  asset: string;
  date: string;
  image?: string;
}

interface EntryCardProps {
  entry: EntryData;
  isDarkMode: boolean;
  onEdit: (entry: EntryData) => void;
  onDelete: (id: number) => void;
}

export default function EntryCard({ entry, isDarkMode, onEdit, onDelete }: EntryCardProps) {
  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700/50' : 'bg-white border border-gray-200/80 shadow-sm hover:shadow-md'} transition-shadow duration-200`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{entry.title}</span>
            {entry.category && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-1">{entry.category}</span>}
          </div>
          <div className="flex gap-1">
            <button onClick={() => onEdit(entry)} aria-label="Edit entry" className="p-1 rounded-full">
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(entry.id)} aria-label="Delete entry" className="p-1 rounded-full">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {entry.asset && <div className="flex flex-wrap gap-2"><span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{entry.asset}</span></div>}
        {entry.image && <img src={entry.image} alt="Journal Entry" className="my-2 max-h-48 rounded border border-gray-200 dark:border-gray-600" />}
        <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{entry.content}</div>
        <div className="flex justify-end items-center mt-3">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{entry.date}</span>
        </div>
      </div>
    </div>
  );
}
