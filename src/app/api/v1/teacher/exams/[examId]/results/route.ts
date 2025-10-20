import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    
    // Verify exam ownership
    const exam = await prisma.exam.findUnique({
      where: { id: params.examId },
    });
    
    if (!exam) {
      return errorResponse('Exam not found', 404);
    }
    
    if (exam.teacherId !== authUser.userId) {
      return errorResponse('Access denied. You do not own this exam.', 403);
    }
    
    // Get all submissions for this exam
    const submissions = await prisma.submission.findMany({
      where: { examId: params.examId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Transform to match frontend expectations
    const transformedSubmissions = submissions.map(sub => ({
      id: sub.id,
      studentName: sub.student.name,
      studentId: sub.student.id,
      studentEmail: sub.student.email,
      examId: sub.examId,
      marks: sub.marks || 0,
      matchPercentage: sub.matchPercentage || 0,
      feedback: sub.feedback || '',
      status: sub.status,
      originalAnswer: sub.originalAnswer,
      gradedAt: sub.gradedAt,
      createdAt: sub.createdAt,
    }));
    
    return successResponse({
      exam,
      submissions: transformedSubmissions,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

