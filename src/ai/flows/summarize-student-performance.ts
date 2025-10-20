'use server';

/**
 * @fileOverview Summarizes student performance on a specific exam.
 *
 * - summarizeStudentPerformance - A function that summarizes student performance.
 * - SummarizeStudentPerformanceInput - The input type for the summarizeStudentPerformance function.
 * - SummarizeStudentPerformanceOutput - The return type for the summarizeStudentPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStudentPerformanceInputSchema = z.object({
  examTitle: z.string().describe('The title of the exam.'),
  courseTopic: z.string().describe('The course or topic of the exam.'),
  studentAnswers: z.array(z.object({
    studentName: z.string().describe('The name of the student.'),
    studentId: z.string().describe('The ID of the student.'),
    answerSheet: z.string().describe('The student\u2019s answers as a single string.'),
    score: z.number().describe('The student score'),
    feedbackSummary: z.string().describe('The summary feedback for the student'),
  })).describe('The student answers, names, ids, and scores for the exam.'),
  modelAnswer: z.string().describe('The model answer for the exam.'),
  rubric: z.string().describe('The grading rubric.'),
});
export type SummarizeStudentPerformanceInput = z.infer<typeof SummarizeStudentPerformanceInputSchema>;

const SummarizeStudentPerformanceOutputSchema = z.object({
  summary: z.string().describe('A summary of student performance on the exam.'),
});
export type SummarizeStudentPerformanceOutput = z.infer<typeof SummarizeStudentPerformanceOutputSchema>;

export async function summarizeStudentPerformance(input: SummarizeStudentPerformanceInput): Promise<SummarizeStudentPerformanceOutput> {
  return summarizeStudentPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeStudentPerformancePrompt',
  input: {schema: SummarizeStudentPerformanceInputSchema},
  output: {schema: SummarizeStudentPerformanceOutputSchema},
  prompt: `You are an expert teacher summarizing student performance on a specific exam.

  Based on the following information, provide a summary of student performance on the exam, including areas of strength and weakness.

  Exam Title: {{{examTitle}}}
  Course/Topic: {{{courseTopic}}}

  Student Answers:
  {{#each studentAnswers}}
  Student Name: {{{studentName}}}
  Student ID: {{{studentId}}}
  Answer Sheet: {{{answerSheet}}}
  Score: {{{score}}}
  Feedback Summary: {{{feedbackSummary}}}
  {{/each}}

  Model Answer: {{{modelAnswer}}}
  Rubric: {{{rubric}}}
  `,
});

const summarizeStudentPerformanceFlow = ai.defineFlow(
  {
    name: 'summarizeStudentPerformanceFlow',
    inputSchema: SummarizeStudentPerformanceInputSchema,
    outputSchema: SummarizeStudentPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
