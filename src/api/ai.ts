// xAI Grok-2-1212 API utility
import axios from 'axios';

const XAI_API_URL = process.env.NEXT_PUBLIC_XAI_API_URL || 'https://api.x.ai/v1/chat/completions';
const XAI_API_KEY = process.env.NEXT_PUBLIC_XAI_API_KEY;

export interface AISummarizePayload {
  trades: any[];
  journalEntries: any[];
  prompt: string;
}

export async function fetchAISummary(payload: AISummarizePayload) {
  if (!XAI_API_KEY) throw new Error('Missing xAI API key');

  // --- Token limit enforcement ---
  const MAX_TOKENS = 131072;
  // Rough estimate: 1 word ≈ 1.3 tokens
  function estimateTokens(text: string) {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }
  // Truncate trades and journals to fit within the token limit
  let trades = payload.trades.slice();
  let journalEntries = payload.journalEntries.slice();
  let prompt = payload.prompt;
  // Try most recent first
  trades = trades.slice(-1000); // hard cap for performance
  journalEntries = journalEntries.slice(-1000);
  let userContent = '';
  let tradeCount = trades.length;
  let journalCount = journalEntries.length;
  // Iteratively reduce until under limit
  while (tradeCount >= 0) {
    while (journalCount >= 0) {
      userContent = [
        prompt,
        '',
        'Trades:',
        JSON.stringify(trades.slice(trades.length - tradeCount), null, 2),
        '',
        'Journal Entries:',
        JSON.stringify(journalEntries.slice(journalEntries.length - journalCount), null, 2)
      ].join('\n');
      if (estimateTokens(userContent) < MAX_TOKENS) break;
      journalCount -= 10;
    }
    if (estimateTokens(userContent) < MAX_TOKENS) break;
    tradeCount -= 10;
    journalCount = journalEntries.length;
  }
  // If still over, fallback to just prompt
  if (estimateTokens(userContent) >= MAX_TOKENS) {
    userContent = prompt;
  }

  try {
    const res = await axios.post(
      XAI_API_URL,
      {
        model: 'grok-2-1212',
        messages: [
          { role: 'system', content: 'You are an expert trading coach and analyst.' },
          { role: 'user', content: userContent }
        ],
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // OpenAI-compatible response structure
    return { summary: res.data.choices?.[0]?.message?.content || '' };
  } catch (err: any) {
    // Add detailed error logging for debugging
    if (err.response) {
      throw new Error(
        `xAI API error: ${err.response.status} ${err.response.statusText} - ${JSON.stringify(err.response.data)}`
      );
    }
    throw new Error('Failed to connect to xAI API: ' + err.message);
  }
}
