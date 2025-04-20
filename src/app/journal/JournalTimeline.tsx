import React from 'react';
import { JournalEntry } from '../../store/journalStore';

interface JournalTimelineProps {
  entries: JournalEntry[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function JournalTimeline({ entries, selectedDate, onSelectDate }: JournalTimelineProps) {
  // Group entries by date
  const dateMap: Record<string, JournalEntry[]> = {};
  entries.forEach(e => {
    if (!dateMap[e.date]) dateMap[e.date] = [];
    dateMap[e.date].push(e);
  });
  const dates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-1 mb-4">
      <div className="font-semibold text-sm mb-1 text-gray-500 dark:text-gray-300">Timeline</div>
      <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
        {dates.map(date => (
          <button
            key={date}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg transition text-xs font-medium
              ${selectedDate === date ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}
              ${date === today ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => onSelectDate(date === selectedDate ? '' : date)}
          >
            <span className={`h-2 w-2 rounded-full ${dateMap[date].length > 0 ? 'bg-blue-400' : 'bg-gray-400'} ${date === today ? 'ring-2 ring-blue-600' : ''}`}></span>
            <span>{date}</span>
            <span className="ml-auto text-[10px] text-gray-400">{dateMap[date].length} entry{dateMap[date].length > 1 ? 'ies' : 'y'}</span>
            {date === today && <span className="ml-2 text-blue-600 dark:text-blue-300">Today</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
