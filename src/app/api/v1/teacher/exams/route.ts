import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { createExamSchema } from '@/lib/validations';
import { successResponse, handleApiError } from '@/lib/api-response';

// GET - List all exams for the teacher
export async function GET(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    
    const exams = await prisma.exam.findMany({
      where: { teacherId: authUser.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
    
    // Transform to match frontend expectations
    const transformedExams = exams.map(exam => ({
      ...exam,
      totalSubmissions: exam._count.submissions,
      gradedSubmissions: exam.gradedSubmissions,
    }));
    
    return successResponse(transformedExams);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Create a new exam
export async function POST(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    const body = await request.json();
    
    // Validate input
    const validatedData = createExamSchema.parse(body);
    
    // Create exam
    const exam = await prisma.exam.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        totalMarks: validatedData.totalMarks,
        questions: validatedData.questions,
        type: validatedData.type,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
        modelAnswer: validatedData.modelAnswer,
        rubric: validatedData.rubric,
        teacherId: authUser.userId,
      },
    });
    
    return successResponse(exam, 'Exam created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

