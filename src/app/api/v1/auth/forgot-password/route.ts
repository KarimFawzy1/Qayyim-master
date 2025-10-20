import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { forgotPasswordSchema } from '@/lib/validations';
import { successResponse, handleApiError } from '@/lib/api-response';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return successResponse(
        null,
        'If an account with that email exists, a password reset link has been sent'
      );
    }
    
    // Generate reset token (valid for 1 hour)
    const resetToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken);
    
    return successResponse(
      null,
      'If an account with that email exists, a password reset link has been sent'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

