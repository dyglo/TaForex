import { create } from 'zustand';

export type AIStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AIFeedbackState {
  status: AIStatus;
  summary: string | null;
  error: string | null;
  fetchAISummary: (trades: any[], journalEntries: any[], prompt: string) => Promise<void>;
}

export const useAIFeedbackStore = create<AIFeedbackState>((set) => ({
  status: 'idle',
  summary: null,
  error: null,
  fetchAISummary: async (trades, journalEntries, prompt) => {
    set({ status: 'loading', error: null });
    try {
      const { summary } = await (await import('../api/ai')).fetchAISummary({ trades, journalEntries, prompt });
      set({ summary, status: 'success', error: null });
    } catch (err: any) {
      set({ error: err.message || 'AI request failed', status: 'error' });
    }
  },
}));
