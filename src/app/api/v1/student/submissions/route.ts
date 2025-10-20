import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { createSubmissionSchema } from '@/lib/validations';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'STUDENT');
    const body = await request.json();
    
    // Validate input
    const validatedData = createSubmissionSchema.parse(body);
    
    // Check if exam exists and is active
    const exam = await prisma.exam.findUnique({
      where: { id: validatedData.examId },
    });
    
    if (!exam || !exam.isActive) {
      return errorResponse('Exam not found or not available for submission', 404);
    }
    
    // Check if student has already submitted
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        studentId_examId: {
          studentId: authUser.userId,
          examId: validatedData.examId,
        },
      },
    });
    
    if (existingSubmission) {
      return errorResponse('You have already submitted this exam', 409);
    }
    
    // Create submission
    const submission = await prisma.submission.create({
      data: {
        studentId: authUser.userId,
        examId: validatedData.examId,
        originalAnswer: validatedData.originalAnswer,
        status: 'PENDING',
      },
    });
    
    // Update exam's total submissions count
    await prisma.exam.update({
      where: { id: validatedData.examId },
      data: {
        totalSubmissions: {
          increment: 1,
        },
      },
    });
    
    return successResponse(submission, 'Submission created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

