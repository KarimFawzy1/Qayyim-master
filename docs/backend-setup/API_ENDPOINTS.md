# Qayyim API Endpoints - Updated Structure

## Base URL

```
http://localhost:9002/api/v1
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

**Requires DB:** Yes (Users table)

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "TEACHER" // or "STUDENT"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "TEACHER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "statusCode": 201
}
```

### 2. Login

**POST** `/auth/login`

**Requires DB:** Yes (Users table)

**Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Returns user object and JWT token

### 3. Forgot Password

**POST** `/auth/forgot-password`

**Requires DB:** No (server function - sends email)

**Body:**

```json
{
  "email": "john@example.com"
}
```

---

## Teacher Endpoints

### 0. Dashboard Overview

**GET** `/teacher/dashboard`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Exams, Submissions, Users tables)

**Response:**

```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalExams": 12,
      "totalSubmissions": 452,
      "pendingSubmissions": 32,
      "studentsGraded": 420
    },
    "recentExams": [...],
    "gradeDistribution": {
      "A": 15,
      "B": 25,
      "C": 18,
      "D": 5,
      "F": 2
    }
  }
}
```

### 1. Create Exam

**POST** `/teacher/exams/create`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Exams table)

**Body:**

```json
{
  "title": "Data Structures Midterm",
  "description": "Midterm exam covering arrays, linked lists, and trees",
  "duration": 120, // minutes
  "totalMarks": 100,
  "questions": {
    // JSON object for questions structure
  },
  "type": "MIXED", // MCQ, TRUE_FALSE, SHORT_ANSWER, MIXED
  "deadline": "2024-12-31T23:59:59Z", // optional
  "modelAnswer": "Model answer text...", // optional
  "rubric": "Grading criteria..." // optional
}
```

**Response:** Created exam object

### 2. Get Teacher's Exams

**GET** `/teacher/exams`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Exams, Users tables)

**Returns:** List of exams filtered by teacherId

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "exam-1",
      "title": "Data Structures Midterm",
      "description": "...",
      "duration": 120,
      "totalMarks": 100,
      "type": "MIXED",
      "totalSubmissions": 50,
      "gradedSubmissions": 45
    }
  ]
}
```

### 3. Get Exam Results

**GET** `/teacher/exams/:examId/results`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Submissions, Users, Exams tables)

**Returns:** All student submissions for specific exam

**Response:**

```json
{
  "success": true,
  "data": {
    "exam": { ... },
    "submissions": [
      {
        "id": "sub-1",
        "studentName": "Alice Johnson",
        "studentId": "clx...",
        "studentEmail": "alice@example.com",
        "marks": 85,
        "matchPercentage": 92,
        "feedback": "Good understanding...",
        "status": "GRADED",
        "gradedAt": "2024-..."
      }
    ]
  }
}
```

### 4. Download Exam Results CSV

**GET** `/teacher/exams/:examId/results/download`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Submissions, Users, Exams tables)

**Server Function:** Generates and returns CSV file

**Response:** CSV file download with columns:

- Student Name
- Student ID
- Email
- Marks
- Match Percentage (%)
- Feedback
- Status
- Submitted At
- Graded At

### 5. Update Student Score

**PUT** `/teacher/exams/:examId/results/:studentId`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Submissions table)

**Body:**

```json
{
  "marks": 90,
  "feedback": "Excellent work on this exam"
}
```

**Note:** This endpoint updates a specific student's submission record

### 6. Update Exam Details

**PUT** `/teacher/exams/:examId`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Exams table)

**Body:** (All fields optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "duration": 90,
  "totalMarks": 120,
  "questions": { ... },
  "type": "SHORT_ANSWER",
  "deadline": "2024-12-31T23:59:59Z"
}
```

### 7. Grade Exam Submission

**POST** `/teacher/grade/:submissionId`

**Auth:** Required (TEACHER role)

**Requires DB:** Yes (Submissions table)

**Body:**

```json
{
  "marks": 85,
  "feedback": "Good work overall. Minor improvements needed in...",
  "matchPercentage": 90 // optional
}
```

**Response:** Updated submission with grades and feedback

---

## Student Endpoints

### 1. Get Recently Graded Exams

**GET** `/student/exams/recently_graded`

**Auth:** Required (STUDENT role)

**Requires DB:** Yes

**Returns:** List of recently graded exams for the student (last 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "sub-1",
      "examId": "exam-1",
      "examTitle": "Data Structures Midterm",
      "examDescription": "...",
      "examType": "MIXED",
      "totalMarks": 100,
      "marks": 85,
      "feedback": "Good work...",
      "gradedAt": "2024-..."
    }
  ]
}
```

### 2. Get Available Exams

**GET** `/student/exams`

**Auth:** Required (STUDENT role)

**Requires DB:** Yes

**Returns:** List of available exams for student

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "exam-1",
      "title": "Data Structures Midterm",
      "description": "...",
      "type": "MIXED",
      "duration": 120,
      "totalMarks": 100,
      "deadline": "2024-12-31T23:59:59Z",
      "teacherName": "Dr. Smith",
      "hasSubmitted": false,
      "submissionStatus": null
    }
  ]
}
```

### 3. Get Exam Results (One Exam)

**GET** `/student/results/:examId`

**Auth:** Required (STUDENT role)

**Requires DB:** Yes

**Returns:** Student's exam result and feedback for specific exam

**Response:**

```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "sub-1",
      "originalAnswer": "Student's answer...",
      "marks": 85,
      "matchPercentage": 90,
      "feedback": "Good work...",
      "status": "GRADED",
      "gradedAt": "2024-..."
    },
    "exam": {
      "id": "exam-1",
      "title": "Data Structures Midterm",
      "description": "...",
      "duration": 120,
      "totalMarks": 100,
      "type": "MIXED",
      "modelAnswer": "...",
      "rubric": "..."
    }
  }
}
```

### Additional Student Endpoints

### Submit Answer

**POST** `/student/submissions`

**Auth:** Required (STUDENT role)

**Body:**

```json
{
  "examId": "exam-1",
  "originalAnswer": "Student's answer text..."
}
```

### Get All Results

**GET** `/student/results`

**Auth:** Required (STUDENT role)

**Returns:** All exam results for the student

---

## Database Schema

### Users Table

- id (primary key)
- email (unique)
- password (hashed)
- name
- role (TEACHER | STUDENT)
- createdAt
- updatedAt

### Exams Table

- id (primary key)
- title
- description
- duration (minutes)
- totalMarks
- questions (JSON)
- type (MCQ | TRUE_FALSE | SHORT_ANSWER | MIXED)
- deadline
- modelAnswer
- rubric
- teacherId (foreign key → Users)
- totalSubmissions
- gradedSubmissions
- isActive
- createdAt
- updatedAt

### Submissions Table

- id (primary key)
- originalAnswer
- marks
- feedback
- matchPercentage
- status (PENDING | GRADED)
- gradedAt
- studentId (foreign key → Users)
- examId (foreign key → Exams)
- createdAt
- updatedAt
- **Unique constraint:** (studentId, examId)

---

## Error Codes

| Code | Description                            |
| ---- | -------------------------------------- |
| 200  | Success                                |
| 201  | Created                                |
| 400  | Bad Request / Validation Error         |
| 401  | Unauthorized / Authentication Required |
| 403  | Forbidden / Access Denied (wrong role) |
| 404  | Not Found                              |
| 409  | Conflict (e.g., duplicate submission)  |
| 500  | Internal Server Error                  |

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Cannot be a common password

## Notes

- All timestamps are in ISO 8601 format
- JWT tokens expire after 7 days (configurable)
- Grievances functionality has been removed
- File uploads use AWS S3 (for model answers, rubrics)
- Email service uses Resend (for password reset)
