"use client";
import React, { useEffect } from "react";
import { useAIFeedbackStore } from "../../store/aiFeedbackStore";

interface TradeAIFeedbackPanelProps {
  tradeDraft: any;
}

const TRADE_FEEDBACK_PROMPT = `You are an expert trading coach. Analyze the following trade setup and provide:
- Constructive feedback
- Risk management tips
- Suggestions to improve the trade or journaling
Be concise, practical, and supportive.`;

export default function TradeAIFeedbackPanel({ tradeDraft }: TradeAIFeedbackPanelProps) {
  const { status, summary, error, fetchAISummary } = useAIFeedbackStore();

  useEffect(() => {
    // Only fetch if the draft has enough data
    if (!tradeDraft.pair || !tradeDraft.entryPrice || !tradeDraft.exitPrice || !tradeDraft.size) return;
    fetchAISummary([tradeDraft], [], TRADE_FEEDBACK_PROMPT);
    // eslint-disable-next-line
  }, [tradeDraft.pair, tradeDraft.entryPrice, tradeDraft.exitPrice, tradeDraft.size]);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-gray-900 rounded-xl p-4 shadow text-white mb-6">
      <div className="text-base font-semibold mb-2 flex items-center gap-2">
        <span role="img" aria-label="AI">🤖</span>AI Trade Feedback
        <button
          className="ml-auto bg-blue-700 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded focus:outline-none"
          onClick={() => fetchAISummary([tradeDraft], [], TRADE_FEEDBACK_PROMPT)}
          disabled={status === 'loading'}
        >
          Refresh
        </button>
      </div>
      {status === 'loading' && (
        <div className="text-blue-300 text-sm flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-300" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
          Generating feedback...
        </div>
      )}
      {status === 'error' && (
        <div className="text-red-400 text-sm">{error || 'Failed to fetch AI feedback.'}</div>
      )}
      {status === 'success' && summary && (
        <div className="text-gray-200 text-base whitespace-pre-line mt-2">{summary}</div>
      )}
      {status === 'idle' && (
        <div className="text-gray-300 text-sm">Fill in trade details to get AI feedback.</div>
      )}
    </div>
  );
}
