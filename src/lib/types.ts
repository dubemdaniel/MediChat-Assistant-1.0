import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';

// Define a more specific type for the content of a message
export type MessageContent =
  | { type: 'text'; text: string }
  | { type: 'analysis'; analysis: AnalyzeSymptomsOutput }
  | { type: 'suggested_questions'; questions: string[] }
  | { type: 'loading' };

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: MessageContent;
  timestamp: Date;
}
