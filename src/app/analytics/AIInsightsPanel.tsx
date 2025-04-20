"use client";
import React, { useEffect, useRef, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useAIFeedbackStore } from "../../store/aiFeedbackStore";

interface AIInsightsPanelProps {
  trades: any[];
  journalEntries: any[];
}

const DEFAULT_PROMPT = `Summarize the following trade data. Highlight key patterns, offer actionable insights, and provide recommendations to improve trading performance. Be concise and practical.`;

export default function AIInsightsPanel({ trades, journalEntries }: AIInsightsPanelProps) {
  const { status, summary, error, fetchAISummary } = useAIFeedbackStore();
  // For follow-up prompt
  const [followupPrompt, setFollowupPrompt] = useState("");
  const [followupStatus, setFollowupStatus] = useState<'idle'|'loading'|'success'|'error'>("idle");
  const [followupResult, setFollowupResult] = useState<string | null>(null);
  const [followupError, setFollowupError] = useState<string | null>(null);
  // Store last used data for follow-up
  const lastDataRef = useRef<{trades: any[], journalEntries: any[]} | null>(null);

  // Reset follow-up state on new data or refresh
  useEffect(() => {
    setFollowupPrompt("");
    setFollowupStatus("idle");
    setFollowupResult(null);
    setFollowupError(null);
    lastDataRef.current = { trades, journalEntries };
  }, [trades, journalEntries, status]);

  // Main summary fetch on mount/data change
  useEffect(() => {
    if (trades.length === 0) return;
    fetchAISummary(trades, [], DEFAULT_PROMPT);
    lastDataRef.current = { trades, journalEntries };
    // eslint-disable-next-line
  }, [trades, journalEntries]);

  // Handle follow-up submit
  const handleFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupPrompt.trim()) return;
    setFollowupStatus("loading");
    setFollowupResult(null);
    setFollowupError(null);
    try {
      // Use last data snapshot
      const data = lastDataRef.current || { trades, journalEntries };
      // Use the API directly for follow-up to avoid Zustand state collision
      const { summary: result } = await (await import("../../api/ai")).fetchAISummary({
        trades: data.trades,
        journalEntries: data.journalEntries,
        prompt: followupPrompt,
      });
      setFollowupStatus("success");
      setFollowupResult(result);
    } catch (err: any) {
      setFollowupStatus("error");
      setFollowupError(err?.message || "Failed to fetch follow-up insights.");
    }
  };

  const showSummary = status === "success" && (summary?.trim() || error);
  const showEmptyMsg = !showSummary && status === "success";

  // --- Utility: parse limited markdown for follow-up output ---
  function parseFollowupMarkdown(text: string): string {
    return text
      // Headings: # -> h3
      .replace(/^(#{1,6})\s*(.*)$/gm, (_, hashes, content) => {
        const level = Math.min(hashes.length, 3);
        return `<h${level} class=\"text-lg font-bold mt-2 text-white\">${content}</h${level}>`;
      })
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br/>');
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-gray-900 rounded-xl p-6 shadow text-white mb-8">
      <div className="text-lg font-semibold mb-2 flex items-center gap-2">
        <span role="img" aria-label="AI">🧠</span>Intelligent Insights (AI)
        <button
          className="ml-auto bg-blue-700 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded focus:outline-none"
          onClick={() => fetchAISummary(trades, [], DEFAULT_PROMPT)}
          disabled={status === 'loading'}
        >
          Refresh
        </button>
      </div>
      <SignedOut>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-4 my-8 text-center">
          Please <SignInButton mode="modal">sign in</SignInButton> to access AI Insights.
        </div>
      </SignedOut>
      <SignedIn>
        {status === 'loading' && (
          <div className="text-blue-300 text-sm flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-blue-300" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
            Generating insights...
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-400 text-sm">{error || 'Failed to fetch AI insights.'}</div>
        )}
        {showSummary && (
          <>
            <AISummaryDisplay summary={summary} />
            <div className="mt-6 border-t border-gray-700 pt-4">
              <form onSubmit={handleFollowup}>
                <textarea
                  className="w-full bg-gray-800 text-white p-3 rounded mb-2"
                  rows={3}
                  placeholder="Ask a follow-up question..."
                  value={followupPrompt}
                  onChange={(e) => setFollowupPrompt(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  disabled={followupStatus === 'loading'}
                >
                  {followupStatus === 'loading' ? 'Asking...' : 'Ask Follow-up'}
                </button>
              </form>
              {followupStatus === 'error' && (
                <div className="text-red-400 text-sm mt-2">{followupError}</div>
              )}
              {followupStatus === 'success' && followupResult && (
                <div className="bg-gray-800 rounded mt-4 p-4 text-white">
                  <div dangerouslySetInnerHTML={{ __html: parseFollowupMarkdown(followupResult) }} />
                </div>
              )}
            </div>
          </>
        )}
        {showEmptyMsg && (
          <div className="text-gray-400 text-base mt-2">No summary was generated. Try a different prompt or check your data.</div>
        )}
        {status === 'idle' && (
          <div className="text-gray-300 text-sm">Add some trades to see AI-powered insights.</div>
        )}
      </SignedIn>
    </div>
  );
}

// --- Utility: Parse AI summary and render as cards/sections ---
function AISummaryDisplay({ summary }: { summary: string }) {
  // Basic parser: split by sections, remove markdown, and render as cards
  // Sections: Overall, Outcomes, Recommendations
  // Fallback: render as plain text if parsing fails
  const parsed = parseAISummary(summary);
  if (!parsed) return <div className="bg-white text-gray-900 p-4 rounded shadow">{summary}</div>;
  return (
    <div className="flex flex-wrap gap-6 mt-2">
      <div className="flex-1 min-w-[260px] max-w-sm bg-white text-gray-900 rounded-xl shadow p-5">
        <h3 className="font-bold text-lg mb-2 border-b pb-1">Overall Performance</h3>
        <ul className="text-sm space-y-1">
          {parsed.overall.map((item, i) => <li key={i}><span className="font-semibold">{item.label}:</span> {item.value}</li>)}
        </ul>
      </div>
      <div className="flex-1 min-w-[260px] max-w-sm bg-white text-gray-900 rounded-xl shadow p-5">
        <h3 className="font-bold text-lg mb-2 border-b pb-1">Trade Outcomes</h3>
        <ul className="text-sm space-y-1">
          {parsed.outcomes.map((item, i) => <li key={i}><span className="font-semibold">{item.label}:</span> {item.value}</li>)}
        </ul>
      </div>
      <div className="flex-1 min-w-[260px] max-w-sm bg-white text-gray-900 rounded-xl shadow p-5">
        <h3 className="font-bold text-lg mb-2 border-b pb-1">Recommendations</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          {parsed.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
        </ul>
      </div>
    </div>
  );
}

// --- Utility: Parse AI summary into sections ---
function parseAISummary(summary: string): null | {
  overall: { label: string, value: string }[],
  outcomes: { label: string, value: string }[],
  recommendations: string[]
} {
  if (!summary) return null;
  // Remove markdown symbols
  const clean = summary.replace(/\*\*|\*|__/g, '').replace(/^#+ /gm, '').trim();
  // Heuristic: split into blocks
  // Find "Overall", "Outcome", "Recommendation" headers or similar
  let overallBlock = '', outcomesBlock = '', recBlock = '';
  const overallMatch = clean.match(/Overall Performance:?([\s\S]*?)(Trade Outcomes:|Trade Outcome:|Recommendations:|Recommendation:|$)/i);
  if (overallMatch) overallBlock = overallMatch[1].trim();
  const outcomesMatch = clean.match(/Trade Outcomes?:?([\s\S]*?)(Recommendations:|Recommendation:|$)/i);
  if (outcomesMatch) outcomesBlock = outcomesMatch[1].trim();
  const recMatch = clean.match(/Recommendations?:?([\s\S]*)$/i);
  if (recMatch) recBlock = recMatch[1].trim();
  // Fallback: if not found, try to split by lines
  // Parse key-value pairs for overall/outcomes
  function parseKeyValueBlock(block: string) {
    return block.split(/\n|\r/).map(line => {
      const m = line.match(/^([\w\s\/-]+):\s*(.+)$/);
      if (m) return { label: m[1].trim(), value: m[2].trim() };
      return null;
    }).filter(Boolean) as { label: string, value: string }[];
  }
  // Recommendations: bullet points or numbered
  function parseListBlock(block: string) {
    return block
      .split(/\n|\r/)
      .map(line => line.replace(/^[-\d.]+\s*/, '').trim())
      .filter(Boolean);
  }
  // If blocks are empty, fallback to first lines
  if (!overallBlock && clean) overallBlock = clean.split(/\n\n/)[0];
  if (!outcomesBlock && clean) outcomesBlock = clean.split(/\n\n/)[1] || '';
  if (!recBlock && clean) recBlock = clean.split(/\n\n/)[2] || '';
  return {
    overall: parseKeyValueBlock(overallBlock),
    outcomes: parseKeyValueBlock(outcomesBlock),
    recommendations: parseListBlock(recBlock)
  };
}
