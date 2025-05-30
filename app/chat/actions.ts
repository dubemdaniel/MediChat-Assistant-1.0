'use server';

import { analyzeSymptoms, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';

import type { MessageContent } from '@/lib/types';

export async function getBotResponses(symptoms: string): Promise<MessageContent[]> {
  const botResponses: MessageContent[] = [];

  try {
    // 1. Analyze symptoms
    const analysisResult: AnalyzeSymptomsOutput = await analyzeSymptoms({ symptoms });
    botResponses.push({ type: 'analysis', analysis: analysisResult });

    if (!analysisResult.possibleConditions || analysisResult.possibleConditions.length === 0) {
       botResponses.push({ type: 'text', text: "I couldn't identify specific conditions based on the symptoms provided. Could you please provide more details or rephrase?" });
    }

  } catch (error) {
    console.error("Error in getBotResponses:", error);
    botResponses.push({ type: 'text', text: "I'm sorry, I encountered an error while processing your request. Please try again." });
  }

  return botResponses;
}
