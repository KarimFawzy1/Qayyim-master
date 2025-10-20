'use server';

/**
 * @fileOverview An AI agent that provides feedback on student answers based on a model answer and rubric.
 *
 * - provideFeedbackOnAnswer - A function that handles the feedback generation process.
 * - ProvideFeedbackOnAnswerInput - The input type for the provideFeedbackOnAnswer function.
 * - ProvideFeedbackOnAnswerOutput - The return type for the provideFeedbackOnAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideFeedbackOnAnswerInputSchema = z.object({
  studentAnswer: z
    .string()
    .describe('The answer provided by the student.'),
  modelAnswer: z.string().describe('The model answer to compare against.'),
  rubric: z.string().describe('The rubric to use for grading and feedback.'),
});
export type ProvideFeedbackOnAnswerInput = z.infer<
  typeof ProvideFeedbackOnAnswerInputSchema
>;

const ProvideFeedbackOnAnswerOutputSchema = z.object({
  feedback: z.string().describe('The feedback generated for the student answer.'),
  highlightedAnswer: z
    .string()
    .describe(
      'The student answer with correct and incorrect parts highlighted (color-coded).'
    ),
  score: z.number().describe('The score assigned to the student answer.'),
});
export type ProvideFeedbackOnAnswerOutput = z.infer<
  typeof ProvideFeedbackOnAnswerOutputSchema
>;

export async function provideFeedbackOnAnswer(
  input: ProvideFeedbackOnAnswerInput
): Promise<ProvideFeedbackOnAnswerOutput> {
  return provideFeedbackOnAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideFeedbackOnAnswerPrompt',
  input: {schema: ProvideFeedbackOnAnswerInputSchema},
  output: {schema: ProvideFeedbackOnAnswerOutputSchema},
  prompt: `You are an AI-powered grading assistant. Your task is to provide feedback on a student's answer based on a model answer and a rubric.

Student's Answer: {{{studentAnswer}}}

Model Answer: {{{modelAnswer}}}

Rubric: {{{rubric}}}

Generate feedback that is detailed and actionable, highlighting the correct and incorrect parts of the student's answer. Also, assign a score to the student's answer based on the rubric.

Output the feedback, highlighted answer (color-coded), and the score in the format specified in the output schema.`,
});

const provideFeedbackOnAnswerFlow = ai.defineFlow(
  {
    name: 'provideFeedbackOnAnswerFlow',
    inputSchema: ProvideFeedbackOnAnswerInputSchema,
    outputSchema: ProvideFeedbackOnAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
