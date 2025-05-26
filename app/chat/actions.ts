'use server';

import { analyzeSymptoms, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { suggestNextQuestions, type SuggestNextQuestionsOutput } from '@/ai/flows/suggest-next-questions';
// summarizeConditionInfo might be used later if detailed info is sourced elsewhere
// import { summarizeConditionInfo, type SummarizeConditionInfoOutput } from '@/ai/flows/summarize-condition-info';
import type { MessageContent } from '@/lib/types';

export async function getBotResponses(symptoms: string): Promise<MessageContent[]> {
  const botResponses: MessageContent[] = [];

  try {
    // 1. Analyze symptoms
    const analysisResult: AnalyzeSymptomsOutput = await analyzeSymptoms({ symptoms });
    botResponses.push({ type: 'analysis', analysis: analysisResult });

    // 2. Suggest next questions if conditions were found
    if (analysisResult.possibleConditions && analysisResult.possibleConditions.length > 0) {
      const topCondition = analysisResult.possibleConditions[0];
      const questionsResult: SuggestNextQuestionsOutput = await suggestNextQuestions({
        symptoms,
        suggestedCondition: topCondition,
      });
      if (questionsResult.questions && questionsResult.questions.length > 0) {
        botResponses.push({ type: 'suggested_questions', questions: questionsResult.questions });
      }
    } else {
       botResponses.push({ type: 'text', text: "I couldn't identify specific conditions based on the symptoms provided. Could you please provide more details or rephrase?" });
    }

  } catch (error) {
    console.error("Error in getBotResponses:", error);
    botResponses.push({ type: 'text', text: "I'm sorry, I encountered an error while processing your request. Please try again." });
  }

  return botResponses;
}
