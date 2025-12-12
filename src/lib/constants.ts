/**
 * Application-wide constants
 */

// File upload limits
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  MAX_STUDENT_SUBMISSIONS: 50,
  ALLOWED_TYPES: {
    PDF: 'application/pdf',
  },
} as const;

// File naming patterns
export const FILE_NAMING = {
  STUDENT_SUBMISSION_PATTERN: /^[a-z0-9]{25,30}\.pdf$/i, // CUID format: 25-30 alphanumeric chars
  STUDENT_ID_EXTRACT_REGEX: /^(.+?)(?:\.pdf)?$/i,
} as const;

// API response messages
export const MESSAGES = {
  UPLOAD: {
    SUCCESS: 'Files uploaded successfully',
    PARTIAL_SUCCESS: 'Some files uploaded successfully',
    FAILED: 'Upload failed',
    FILE_TOO_LARGE: 'File size exceeds maximum allowed size (10MB)',
    INVALID_TYPE: 'Only PDF files are allowed',
    INVALID_FILENAME: 'Filename must be in format: {user_id}.pdf',
  },
  EXAM: {
    CREATED: 'Exam created successfully',
    NOT_FOUND: 'Exam not found',
    ACCESS_DENIED: 'You do not have access to this exam',
  },
  STUDENT: {
    NOT_FOUND: 'Student not found',
    ID_EXTRACT_FAILED: 'Could not extract student ID from filename',
  },
} as const;

// Validation limits
export const VALIDATION = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
  RUBRIC_MAX_LENGTH: 5000,
} as const;

