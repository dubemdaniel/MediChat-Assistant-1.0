'use server';

/**
 * @fileOverview Simulates a doctor consultation with follow-up questions and comprehensive assessment.
 *
 * - conductDoctorConsultation - Main function to simulate doctor-patient interaction
 * - DoctorConsultationInput - Input for doctor consultation
 * - DoctorConsultationOutput - Output containing doctor's response and questions
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DoctorConsultationInputSchema = z.object({
  patientMessage: z.string().describe('The patient\'s message or response'),
  conversationHistory: z.array(z.object({
    sender: z.enum(['patient', 'doctor']),
    message: z.string(),
    timestamp: z.string(),
  })).describe('Previous conversation history'),
  currentDiagnosis: z.string().optional().describe('Current working diagnosis if any'),
  gatheringInfo: z.boolean().default(true).describe('Whether still gathering patient information'),
});
export type DoctorConsultationInput = z.infer<typeof DoctorConsultationInputSchema>;

const DoctorConsultationOutputSchema = z.object({
  doctorResponse: z.string().describe('The doctor\'s response to the patient'),
  followUpQuestions: z.array(z.string()).describe('Follow-up questions to ask the patient'),
  assessmentComplete: z.boolean().describe('Whether enough information has been gathered for diagnosis'),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'emergency']).describe('Urgency level based on symptoms'),
  nextSteps: z.array(z.string()).describe('Recommended next steps'),
  empathy: z.string().describe('Empathetic acknowledgment of patient concerns'),
});
export type DoctorConsultationOutput = z.infer<typeof DoctorConsultationOutputSchema>;

export async function conductDoctorConsultation(input: DoctorConsultationInput): Promise<DoctorConsultationOutput> {
  return doctorConsultationFlow(input);
}

const doctorConsultationPrompt = ai.definePrompt({
  name: 'doctorConsultationPrompt',
  input: {schema: DoctorConsultationInputSchema},
  output: {schema: DoctorConsultationOutputSchema},
  prompt: `You are a compassionate and experienced medical doctor conducting a virtual consultation. 

Current patient message: {{{patientMessage}}}

{{#if conversationHistory}}
Previous conversation:
{{#each conversationHistory}}
{{sender}}: {{message}}
{{/each}}
{{/if}}

{{#if currentDiagnosis}}
Current working diagnosis: {{{currentDiagnosis}}}
{{/if}}

DOCTOR PERSONA:
- Professional yet warm and approachable
- Ask relevant follow-up questions to gather complete medical history
- Show empathy and understanding for patient concerns
- Provide clear, understandable explanations
- Be thorough but not overwhelming
- Always prioritize patient safety

CONSULTATION APPROACH:
1. Acknowledge the patient's concerns with empathy
2. Ask relevant follow-up questions about:
   - Symptom duration, severity, and progression
   - Associated symptoms
   - Medical history and current medications
   - Lifestyle factors that might be relevant
   - Pain scales (1-10) when applicable
3. Assess urgency level based on symptoms
4. Determine if enough information has been gathered for assessment
5. Provide next steps and recommendations

Remember to be thorough in gathering information before making any diagnostic suggestions.`,
});

const doctorConsultationFlow = ai.defineFlow(
  {
    name: 'doctorConsultationFlow',
    inputSchema: DoctorConsultationInputSchema,
    outputSchema: DoctorConsultationOutputSchema,
  },
  async input => {
    const {output} = await doctorConsultationPrompt(input);
    return output!;
  }
);