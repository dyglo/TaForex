import React from 'react';

const moods = [
  { label: '😊', value: 'happy' },
  { label: '😐', value: 'neutral' },
  { label: '😔', value: 'sad' },
  { label: '😤', value: 'angry' },
  { label: '🤩', value: 'excited' },
];

interface JournalFiltersProps {
  mood: string;
  setMood: (mood: string) => void;
  tag: string;
  setTag: (tag: string) => void;
  date: string;
  setDate: (date: string) => void;
  linked: string;
  setLinked: (linked: string) => void;
  search: string;
  setSearch: (search: string) => void;
  tagsList: string[];
}

export default function JournalFilters({ mood, setMood, tag, setTag, date, setDate, linked, setLinked, search, setSearch, tagsList }: JournalFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <select
        className="border rounded px-2 py-1 text-sm"
        aria-label="Filter by mood"
        value={mood}
        onChange={e => setMood(e.target.value)}
      >
        <option value="">All Moods</option>
        {moods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <select
        className="border rounded px-2 py-1 text-sm"
        aria-label="Filter by tag"
        value={tag}
        onChange={e => setTag(e.target.value)}
      >
        <option value="">All Tags</option>
        {tagsList.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input
        type="date"
        className="border rounded px-2 py-1 text-sm"
        aria-label="Filter by date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <select
        className="border rounded px-2 py-1 text-sm"
        aria-label="Filter by linked trade"
        value={linked}
        onChange={e => setLinked(e.target.value)}
      >
        <option value="">All Entries</option>
        <option value="linked">Linked to Trade</option>
        <option value="unlinked">Not Linked</option>
      </select>
      <input
        type="text"
        className="border rounded px-2 py-1 text-sm"
        placeholder="Search..."
        aria-label="Search entries"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
  );
}
