import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { gradeSubmissionSchema } from '@/lib/validations';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    const body = await request.json();
    
    // Validate input
    const validatedData = gradeSubmissionSchema.parse(body);
    
    // Get submission with exam details
    const submission = await prisma.submission.findUnique({
      where: { id: params.submissionId },
      include: {
        exam: true,
      },
    });
    
    if (!submission) {
      return errorResponse('Submission not found', 404);
    }
    
    // Verify that the exam belongs to the teacher
    if (submission.exam.teacherId !== authUser.userId) {
      return errorResponse('Access denied. You do not own this exam.', 403);
    }
    
    // Update submission with grading data
    const updatedSubmission = await prisma.submission.update({
      where: { id: params.submissionId },
      data: {
        marks: validatedData.marks,
        matchPercentage: validatedData.matchPercentage,
        feedback: validatedData.feedback,
        status: 'GRADED',
        gradedAt: new Date(),
      },
    });
    
    // Update exam's graded submissions count
    const gradedCount = await prisma.submission.count({
      where: {
        examId: submission.examId,
        status: 'GRADED',
      },
    });
    
    await prisma.exam.update({
      where: { id: submission.examId },
      data: {
        gradedSubmissions: gradedCount,
      },
    });
    
    return successResponse(updatedSubmission, 'Submission graded successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

