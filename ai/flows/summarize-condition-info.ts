// SummarizeConditionInfo flow
'use server';
/**
 * @fileOverview Summarizes medical condition information using generative AI.
 *
 * - summarizeConditionInfo - A function that summarizes condition information.
 * - SummarizeConditionInfoInput - The input type for the summarizeConditionInfo function.
 * - SummarizeConditionInfoOutput - The return type for the summarizeConditionInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConditionInfoInputSchema = z.object({
  conditionName: z.string().describe('The name of the medical condition.'),
  conditionInfo: z.string().describe('Detailed information about the medical condition.'),
});
export type SummarizeConditionInfoInput = z.infer<typeof SummarizeConditionInfoInputSchema>;

const SummarizeConditionInfoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the medical condition information.'),
});
export type SummarizeConditionInfoOutput = z.infer<typeof SummarizeConditionInfoOutputSchema>;

export async function summarizeConditionInfo(input: SummarizeConditionInfoInput): Promise<SummarizeConditionInfoOutput> {
  return summarizeConditionInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConditionInfoPrompt',
  input: {schema: SummarizeConditionInfoInputSchema},
  output: {schema: SummarizeConditionInfoOutputSchema},
  prompt: `You are a medical expert summarizing information for patients.

  Summarize the following information about {{conditionName}} in a way that is easy to understand.

  Condition Information: {{{conditionInfo}}}`,
});

const summarizeConditionInfoFlow = ai.defineFlow(
  {
    name: 'summarizeConditionInfoFlow',
    inputSchema: SummarizeConditionInfoInputSchema,
    outputSchema: SummarizeConditionInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
