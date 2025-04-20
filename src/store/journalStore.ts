import { create } from 'zustand';

export type JournalEntry = {
  id: string;
  date: string;
  text: string;
  mood: string;
  tags: string[];
  image?: string; // base64 or URL
  relatedTradeId?: string;
};

type JournalState = {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
};

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  updateEntry: (entry) => set((state) => ({
    entries: state.entries.map(e => e.id === entry.id ? entry : e)
  })),
  deleteEntry: (id) => set((state) => ({
    entries: state.entries.filter(e => e.id !== id)
  })),
}));
