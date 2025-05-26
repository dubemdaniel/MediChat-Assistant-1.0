// src/ai/flows/analyze-symptoms.ts
'use server';

/**
 * @fileOverview Analyzes user-provided symptoms and suggests possible medical conditions.
 *
 * - analyzeSymptoms - The main function to analyze symptoms and suggest conditions.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The output type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  symptoms: z.string().describe('The symptoms described by the user in natural language.'),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  possibleConditions: z
    .array(z.string())
    .describe('A list of possible medical conditions based on the symptoms.'),
  confidenceLevels: z
    .array(z.number())
    .describe('A corresponding list of confidence levels (0-1) for each condition.'),
  reasoning: z.string().describe('The AI reasoning for suggesting these conditions.'),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(input: AnalyzeSymptomsInput): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const analyzeSymptomsPrompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are a medical expert system that analyzes symptoms provided by the user and suggests possible medical conditions.

Analyze the following symptoms and provide a list of possible medical conditions, along with your reasoning.
Symptoms: {{{symptoms}}}

Format your output as a JSON object with 'possibleConditions', 'confidenceLevels', and 'reasoning' fields.
Confidence levels should be between 0 and 1.
`,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await analyzeSymptomsPrompt(input);
    return output!;
  }
);
