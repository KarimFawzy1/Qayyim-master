import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const authUser = requireRole(request, 'STUDENT');

    const student = await prisma.student.findUnique({
      where:{
        userId: authUser.userId
      },
    });

    if (!student) {
      throw new Error(`No student user with id ${authUser.userId}`);
    }
    
    // Get submission for this exam
    const submission = await prisma.submission.findUnique({
      where: {
        studentId_examId: {
          studentId: student.id,
          examId: params.examId,
        },
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            course: true,
            description: true,
            duration: true,
            totalMarks: true,
            type: true,
            modelAnswer: true,
            rubric: true,
          },
        },
      },
    });
    
    if (!submission) {
      return errorResponse('Submission not found', 404);
    }
    
    return successResponse({
      submission: {
        id: submission.id,
        originalAnswers: submission.originalAnswers,
        marks: submission.marks,
        feedback: submission.feedback,
        status: submission.status,
        submittedAt: submission.createdAt,
        gradedAt: submission.gradedAt,
      },
      exam: {
        id: submission.exam.id,
        title: submission.exam.title,
        description: submission.exam.description,
        duration: submission.exam.duration,
        totalMarks: submission.exam.totalMarks,
        type: submission.exam.type,
        modelAnswer: submission.exam.modelAnswer,
        rubric: submission.exam.rubric,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

