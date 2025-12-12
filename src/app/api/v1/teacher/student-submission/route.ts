export const runtime = "nodejs";

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { successResponse, handleApiError } from '@/lib/api-response';
import { uploadStudentAnswer } from '@/lib/s3';
import { FILE_UPLOAD, MESSAGES } from '@/lib/constants';

/**
 * Extracts the user ID from the filename.
 * Files should be named as: {user_id}.pdf (e.g., cmhfemzzt00057kicoeo82gdz.pdf)
 * This is the User.id (not Student.id) since we search by userId in the Student table.
 */
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
        // Validate file type
        if (file.type !== FILE_UPLOAD.ALLOWED_TYPES.PDF) {
          errors.push({ filename: file.name, error: MESSAGES.UPLOAD.INVALID_TYPE });
          continue;
        }
        
        // Validate file size
        if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
          const sizeMB = (file.size / 1024 / 1024).toFixed(2);
          errors.push({ 
            filename: file.name, 
            error: `${MESSAGES.UPLOAD.FILE_TOO_LARGE} (File size: ${sizeMB}MB)` 
          });
          continue;
        }

        const studentUserId = autoExtract
          ? extractStudentUserId(file.name)
          : file.name.replace(/\.pdf$/i, '');

        if (!studentUserId) {
          errors.push({ filename: file.name, error: MESSAGES.STUDENT.ID_EXTRACT_FAILED });
          continue;
        }

        const student = await prisma.student.findFirst({
          where: { userId: studentUserId },
        });

        if (!student) {
          errors.push({ filename: file.name, error: `${MESSAGES.STUDENT.NOT_FOUND}: ${studentUserId}` });
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