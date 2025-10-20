// Implemented the gradeStudentAnswer flow to automatically grade student answers based on a model answer and rubric.

'use server';

/**
 * @fileOverview This file defines the gradeStudentAnswer flow, which grades a student's answer
 * against a model answer and rubric using an LLM.
 *
 * @exports {
 *   gradeStudentAnswer,
 *   GradeStudentAnswerInput,
 *   GradeStudentAnswerOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const GradeStudentAnswerInputSchema = z.object({
  studentAnswer: z.string().describe('The text of the student\u2019s answer.'),
  modelAnswer: z.string().describe('The text of the model answer.'),
  rubric: z.string().describe('The grading rubric.'),
  examType: z.enum(['MCQ', 'True/False', 'Short Answer', 'Mixed']).describe('The type of exam question.'),
  questionNumber: z.number().optional().describe('The question number being graded.')
});

export type GradeStudentAnswerInput = z.infer<typeof GradeStudentAnswerInputSchema>;

const GradeStudentAnswerOutputSchema = z.object({
  score: z.number().describe('The score the student received on the answer.'),
  feedback: z.string().describe('Feedback for the student on their answer.'),
  isCorrect: z.boolean().describe('Whether the student got the answer correct.'),
  detailedFeedback: z.string().optional().describe('Detailed feedback with highlighted sections indicating which parts of the answer are correct/incorrect')
});

export type GradeStudentAnswerOutput = z.infer<typeof GradeStudentAnswerOutputSchema>;

export async function gradeStudentAnswer(input: GradeStudentAnswerInput): Promise<GradeStudentAnswerOutput> {
  return gradeStudentAnswerFlow(input);
}

const gradeStudentAnswerPrompt = ai.definePrompt({
  name: 'gradeStudentAnswerPrompt',
  input: {
    schema: GradeStudentAnswerInputSchema,
  },
  output: {
    schema: GradeStudentAnswerOutputSchema,
  },
  prompt: `You are an AI-powered grading assistant. Your task is to grade a student's answer based on a model answer and a rubric.

Here is the student's answer:
{{studentAnswer}}

Here is the model answer:
{{modelAnswer}}

Here is the grading rubric:
{{rubric}}

Exam Type: {{examType}}

Based on the above information, provide a score, feedback, and whether the student's answer is correct or not. The output should conform to the JSON schema. Give detailed feedback to the student, and highlight portions of the student answer to explain why the score was assigned. The response should conform to the schema:

${JSON.stringify(GradeStudentAnswerOutputSchema.describe('JSON schema for GradeStudentAnswerOutput'))}`,
});

const gradeStudentAnswerFlow = ai.defineFlow(
  {
    name: 'gradeStudentAnswerFlow',
    inputSchema: GradeStudentAnswerInputSchema,
    outputSchema: GradeStudentAnswerOutputSchema,
  },
  async input => {
    const {output} = await gradeStudentAnswerPrompt(input);
    return output!;
  }
);
