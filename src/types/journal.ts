export interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: "Confident" | "Neutral" | "Anxious" | "Frustrated" | "Excited";
  tags: string[];
  relatedTrades: string[];
}
