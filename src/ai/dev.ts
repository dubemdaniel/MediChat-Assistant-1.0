import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/suggest-next-questions.ts';
import '@/ai/flows/summarize-condition-info.ts';