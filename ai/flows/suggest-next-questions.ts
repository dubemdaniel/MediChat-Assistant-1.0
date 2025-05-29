// 'use server';

// /**
//  * @fileOverview This file defines a Genkit flow that suggests follow-up questions
//  * based on a user's symptoms and potential medical conditions.
//  *
//  * - suggestNextQuestions - A function that takes user input and suggests follow-up questions.
//  * - SuggestNextQuestionsInput - The input type for the suggestNextQuestions function.
//  * - SuggestNextQuestionsOutput - The return type for the suggestNextQuestions function.
//  */

// import {ai} from '@/ai/genkit';
// import {z} from 'genkit';

// const SuggestNextQuestionsInputSchema = z.object({
//   symptoms: z.string().describe('The symptoms described by the user.'),
//   suggestedCondition: z.string().describe('The medical condition suggested by the chatbot.'),
// });

// export type SuggestNextQuestionsInput = z.infer<typeof SuggestNextQuestionsInputSchema>;

// const SuggestNextQuestionsOutputSchema = z.object({
//   questions: z.array(z.string()).describe('An array of follow-up questions related to the symptoms and suggested condition.'),
// });

// export type SuggestNextQuestionsOutput = z.infer<typeof SuggestNextQuestionsOutputSchema>;

// export async function suggestNextQuestions(input: SuggestNextQuestionsInput): Promise<SuggestNextQuestionsOutput> {
//   return suggestNextQuestionsFlow(input);
// }

// const prompt = ai.definePrompt({
//   name: 'suggestNextQuestionsPrompt',
//   input: {schema: SuggestNextQuestionsInputSchema},
//   output: {schema: SuggestNextQuestionsOutputSchema},
//   prompt: `You are a medical expert system. Based on the user's described symptoms:
//   {{symptoms}}
//   and the suggested condition:
//   {{suggestedCondition}},
//   suggest a list of follow-up questions that would help refine the diagnosis. The questions should be specific and aimed at gathering more detailed information about the user's condition. Return the questions as a JSON array of strings.
//   `,
// });

// const suggestNextQuestionsFlow = ai.defineFlow(
//   {
//     name: 'suggestNextQuestionsFlow',
//     inputSchema: SuggestNextQuestionsInputSchema,
//     outputSchema: SuggestNextQuestionsOutputSchema,
//   },
//   async input => {
//     const {output} = await prompt(input);
//     return output!;
//   }
// );
