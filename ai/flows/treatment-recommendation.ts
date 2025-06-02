'use server';

/**
 * @fileOverview Provides treatment recommendations and prescriptions based on diagnosed conditions.
 *
 * - generateTreatmentPlan - Main function to generate comprehensive treatment recommendations
 * - TreatmentPlanInput - Input type for treatment plan generation
 * - TreatmentPlanOutput - Output type containing treatment recommendations
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TreatmentPlanInputSchema = z.object({
  condition: z.string().describe('The diagnosed medical condition'),
  symptoms: z.string().describe('The original symptoms described by the user'),
  severity: z.enum(['mild', 'moderate', 'severe']).describe('Severity level of the condition'),
  patientAge: z.number().optional().describe('Patient age (if provided)'),
  patientAllergies: z.array(z.string()).optional().describe('Known allergies (if any)'),
  currentMedications: z.array(z.string()).optional().describe('Current medications (if any)'),
});
export type TreatmentPlanInput = z.infer<typeof TreatmentPlanInputSchema>;

const TreatmentPlanOutputSchema = z.object({
  immediateActions: z.array(z.string()).describe('Immediate steps the patient should take'),
  medications: z.array(z.object({
    name: z.string().describe('Medication name'),
    dosage: z.string().describe('Recommended dosage'),
    frequency: z.string().describe('How often to take'),
    duration: z.string().describe('How long to take the medication'),
    instructions: z.string().describe('Special instructions for taking the medication'),
    otc: z.boolean().describe('Whether this is over-the-counter or prescription')
  })).describe('Recommended medications'),
  lifestyle: z.array(z.string()).describe('Lifestyle recommendations and home remedies'),
  dietaryAdvice: z.array(z.string()).describe('Dietary recommendations'),
  followUp: z.object({
    timeframe: z.string().describe('When to follow up'),
    conditions: z.array(z.string()).describe('Conditions that warrant immediate medical attention'),
  }).describe('Follow-up recommendations'),
  preventiveMeasures: z.array(z.string()).describe('How to prevent recurrence'),
  warnings: z.array(z.string()).describe('Important warnings and contraindications'),
  reasoning: z.string().describe('Medical reasoning for the treatment plan'),
});
export type TreatmentPlanOutput = z.infer<typeof TreatmentPlanOutputSchema>;

export async function generateTreatmentPlan(input: TreatmentPlanInput): Promise<TreatmentPlanOutput> {
  return treatmentPlanFlow(input);
}

const treatmentPlanPrompt = ai.definePrompt({
  name: 'treatmentPlanPrompt',
  input: {schema: TreatmentPlanInputSchema},
  output: {schema: TreatmentPlanOutputSchema},
  prompt: `You are an experienced medical doctor providing comprehensive treatment recommendations. 

Based on the following information, provide a detailed treatment plan:
- Condition: {{{condition}}}
- Original Symptoms: {{{symptoms}}}
- Severity: {{{severity}}}
{{#if patientAge}}
- Patient Age: {{{patientAge}}}
{{/if}}
{{#if patientAllergies}}
- Known Allergies: {{{patientAllergies}}}
{{/if}}
{{#if currentMedications}}
- Current Medications: {{{currentMedications}}}
{{/if}}

IMPORTANT GUIDELINES:
1. Always recommend consulting a healthcare professional for prescription medications
2. Clearly distinguish between OTC and prescription medications
3. Provide specific dosages and frequencies where appropriate
4. Include important safety warnings and contraindications
5. Consider patient age and allergies in recommendations
6. Provide clear follow-up instructions
7. Include both immediate and long-term management strategies
8. Emphasize when emergency medical care is needed

Format your response with comprehensive treatment recommendations including medications, lifestyle changes, dietary advice, and follow-up care.`,
});

const treatmentPlanFlow = ai.defineFlow(
  {
    name: 'treatmentPlanFlow',
    inputSchema: TreatmentPlanInputSchema,
    outputSchema: TreatmentPlanOutputSchema,
  },
  async input => {
    const {output} = await treatmentPlanPrompt(input);
    return output!;
  }
);