import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'TEACHER');
    
    // Get statistics
    const [totalExams, totalSubmissions, pendingSubmissions] = await Promise.all([
      prisma.exam.count({
        where: { teacherId: authUser.userId },
      }),
      prisma.submission.count({
        where: {
          exam: { teacherId: authUser.userId },
        },
      }),
      prisma.submission.count({
        where: {
          exam: { teacherId: authUser.userId },
          status: 'PENDING',
        },
      }),
    ]);
    
    // Get recent exams
    const recentExams = await prisma.exam.findMany({
      where: { teacherId: authUser.userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
    
    // Get grade distribution
    const allSubmissions = await prisma.submission.findMany({
      where: {
        exam: { teacherId: authUser.userId },
        status: 'GRADED',
        score: { not: null },
      },
      select: {
        score: true,
      },
    });
    
    const gradeDistribution = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };
    
    allSubmissions.forEach(sub => {
      if (sub.score === null) return;
      if (sub.score >= 90) gradeDistribution.A++;
      else if (sub.score >= 80) gradeDistribution.B++;
      else if (sub.score >= 70) gradeDistribution.C++;
      else if (sub.score >= 60) gradeDistribution.D++;
      else gradeDistribution.F++;
    });
    
    return successResponse({
      statistics: {
        totalExams,
        totalSubmissions,
        pendingSubmissions,
        studentsGraded: totalSubmissions - pendingSubmissions,
      },
      recentExams,
      gradeDistribution,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

