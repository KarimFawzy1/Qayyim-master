import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { createExamSchema } from '@/lib/validations';
import { successResponse, handleApiError } from '@/lib/api-response';
import { uploadModelAnswer } from '@/lib/s3';

// GET - List all exams for the instructor (formerly teacher)
export async function GET(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    
    const instructor = await prisma.instructor.findUnique({
    where: { userId: authUser.userId }  // Find instructor by User ID
    });
  
     if (!instructor) {
      throw new Error('Instructor profile not found');
    }
    
    const exams = await prisma.exam.findMany({
      // ⚠️ FIX: Changed teacherId to instructorId to match schema
      where: { instructorId: instructor.id }, 
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
    
    return successResponse(exams, 'Exams retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Create a new exam with S3 upload
export async function POST(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    
    // Parse FormData
    const formData = await request.formData();
    const modelAnswerFile = formData.get('modelAnswerFile') as File | null;

    const instructor = await prisma.instructor.findUnique({
    where: { userId: authUser.userId }  // Find instructor by User ID
    });
  
     if (!instructor) {
      throw new Error('Instructor profile not found');
    }
    
    // Extract only the fields that exist in your form
    const body = {
      title: formData.get('title') as string,
      description: formData.get('courseTopic') as string, 
      type: formData.get('examType') as string,
      deadline: formData.get('deadline') as string | null,
      rubric: formData.get('rubricText') as string | null,
    };
    
    // Validate - adjust your createExamSchema to match these fields only
    const validatedData = createExamSchema.parse(body);
    
    // Create exam (only with fields from form)
    const exam = await prisma.exam.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
        rubric: validatedData.rubric,
        instructorId: instructor.id, 
      },
    });
    
    // Upload to S3 if file exists
    if (modelAnswerFile) {
      if (modelAnswerFile.type !== 'application/pdf') {
        // Rollback: Delete the exam record if file is not a PDF
        await prisma.exam.delete({ where: { id: exam.id } });
        throw new Error('Model answer must be a PDF file');
      }
      
      const bytes = await modelAnswerFile.arrayBuffer();
      const s3Url = await uploadModelAnswer(exam.id, Buffer.from(bytes));
      
      await prisma.exam.update({
        where: { id: exam.id },
        data: { modelAnswerFile: s3Url },
      });
    }
    
    return successResponse(exam, 'Exam created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}