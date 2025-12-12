import { cookies } from 'next/headers';
import { verifyToken, JWTPayload } from './auth';

/**
 * Get current user from JWT token in cookies
 * Returns null if no token or invalid token
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Get current instructor user ID
 * Throws error if not authenticated or not a teacher
 */
export async function requireInstructor(): Promise<string> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  if (user.role !== 'TEACHER') {
    throw new Error('Not authorized: Teacher access required');
  }
  
  return user.userId;
}