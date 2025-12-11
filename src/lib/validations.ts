import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['TEACHER', 'STUDENT'], {
    errorMap: () => ({ message: 'Role must be either TEACHER or STUDENT' })
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});


export const createExamSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'MIXED']),
  deadline: z.string().optional().nullable(), // REMOVE .datetime()
  modelAnswer: z.string().optional(),
  rubric: z.string().optional().nullable(), // ADD .nullable()
});

export const updateExamSchema = createExamSchema.partial();

export const createSubmissionSchema = z.object({
  examId: z.string().min(1, 'Exam ID is required'),
  originalAnswer: z.string().min(1, 'Answer is required'),
});

export const gradeSubmissionSchema = z.object({
  marks: z.number().min(0, 'Marks cannot be negative'),
  feedback: z.string().optional(),
  matchPercentage: z.number().min(0).max(100).optional(),
});

