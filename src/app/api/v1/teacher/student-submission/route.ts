export const runtime = "nodejs";

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { successResponse, handleApiError } from '@/lib/api-response';
import { uploadStudentAnswer } from '@/lib/s3';

function extractStudentUserId(filename: string): string | null {
  const nameWithoutExt = filename.replace(/\.pdf$/i, '');
  return nameWithoutExt || null;
}

export async function POST(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    const instructor = await prisma.instructor.findUnique({
      where: { userId: authUser.userId }
    });

    if (!instructor) {
      throw new Error('Instructor not found');
    }

    const formData = await request.formData();
    
    const examId = formData.get('examId') as string;
    const autoExtract = formData.get('autoExtract') === 'true';
    const files = formData.getAll('files') as File[];

    if (!examId || files.length === 0) {
      throw new Error('Exam ID and files are required');
    }

    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam || exam.instructorId !== instructor.id) {
      throw new Error('Exam not found or access denied');
    }

    const results: any[] = [];
    const errors: any[] = [];

    for (const file of files) {
      try {
        if (file.type !== 'application/pdf') {
          errors.push({ filename: file.name, error: 'Only PDF files allowed' });
          continue;
        }

        const studentUserId = autoExtract
          ? extractStudentUserId(file.name)
          : file.name.replace(/\.pdf$/i, '');

        if (!studentUserId) {
          errors.push({ filename: file.name, error: 'Could not extract student ID' });
          continue;
        }

        const student = await prisma.student.findFirst({
          where: { userId: studentUserId },
        });

        if (!student) {
          errors.push({ filename: file.name, error: `Student ${studentUserId} not found` });
          continue;
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const s3Url = await uploadStudentAnswer(examId, studentUserId, buffer);

        // FIXED: Use upsert to handle both create and update
        await prisma.submission.upsert({
          where: {
            studentId_examId: {
              studentId: student.id,
              examId: examId,
            },
          },
          update: {
            fileLink: s3Url,
            status: 'PENDING',
            marks: null,
            feedback: null,
            gradedAt: null,
            updatedAt: new Date(),
          },
          create: {
            studentId: student.id,
            examId,
            fileLink: s3Url,
            originalAnswers: {},
            status: 'PENDING',
          },
        });

        results.push({
          studentUserId,
          filename: file.name,
          s3Url,
        });

      } catch (err: any) {
        errors.push({ filename: file.name, error: err.message });
      }
    }

    return successResponse(
      { uploaded: results.length, failed: errors.length, results, errors },
      `Uploaded ${results.length} files to S3`
    );
  } catch (error) {
    return handleApiError(error);
  }
}