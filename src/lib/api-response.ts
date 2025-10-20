export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export function successResponse<T>(data: T, message?: string, statusCode = 200): Response {
  return Response.json({
    success: true,
    data,
    message,
    statusCode,
  }, { status: statusCode });
}

export function errorResponse(error: string, statusCode = 400, details?: any): Response {
  return Response.json({
    success: false,
    error,
    statusCode,
    ...(details && { details }),
  }, { status: statusCode });
}

export function handleApiError(error: any): Response {
  console.error('API Error:', error);
  
  if (error.message === 'Authentication required') {
    return errorResponse('Authentication required', 401);
  }
  
  if (error.message && error.message.includes('Access denied')) {
    return errorResponse(error.message, 403);
  }
  
  if (error.code === 'P2002') {
    return errorResponse('A record with this information already exists', 409);
  }
  
  if (error.code === 'P2025') {
    return errorResponse('Record not found', 404);
  }
  
  if (error.name === 'ZodError') {
    return errorResponse('Validation error', 400, error.errors);
  }
  
  return errorResponse('Internal server error', 500);
}

