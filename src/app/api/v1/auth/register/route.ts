import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, validatePassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Validate password strength
    const passwordValidation = validatePassword(validatedData.password);
    if (!passwordValidation.isValid) {
      return errorResponse('Password validation failed', 400, passwordValidation.errors);
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return errorResponse('User with this email already exists', 409);
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    // Send welcome email (don't await to not block response)
    sendWelcomeEmail(user.email, user.name, user.role).catch(err => 
      console.error('Failed to send welcome email:', err)
    );
    
    return successResponse(
      { user, token },
      'User registered successfully',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

