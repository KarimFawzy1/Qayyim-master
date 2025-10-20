# Qayyim API Documentation

## Base URL

```
http://localhost:9002/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "statusCode": 200
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": { ... }  // Optional
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

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
      "role": "TEACHER",
      "createdAt": "2024-..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully",
  "statusCode": 201
}
```

### Login

**POST** `/auth/login`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Forgot Password

**POST** `/auth/forgot-password`

**Body:**

```json
{
  "email": "john@example.com"
}
```

### Get Current User

**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

---

## Teacher Endpoints

### Get Dashboard Statistics

**GET** `/teacher/dashboard`

**Auth:** Required (TEACHER)

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

### List All Exams

**GET** `/teacher/exams`

**Auth:** Required (TEACHER)

### Create Exam

**POST** `/teacher/exams`

**Auth:** Required (TEACHER)

**Body:**

```json
{
  "title": "Data Structures Midterm",
  "course": "CS101",
  "type": "MIXED", // MCQ, TRUE_FALSE, SHORT_ANSWER, MIXED
  "deadline": "2024-12-31T23:59:59Z", // Optional
  "modelAnswer": "Answer key text...",
  "rubric": "Grading criteria..."
}
```

### Get Exam Details

**GET** `/teacher/exams/[examId]`

**Auth:** Required (TEACHER)

### Update Exam

**PUT** `/teacher/exams/[examId]`

**Auth:** Required (TEACHER)

**Body:** (All fields optional)

```json
{
  "title": "Updated Title",
  "course": "CS102",
  "type": "SHORT_ANSWER",
  "deadline": "2024-12-31T23:59:59Z",
  "modelAnswer": "Updated answer...",
  "rubric": "Updated rubric..."
}
```

### Delete Exam

**DELETE** `/teacher/exams/[examId]`

**Auth:** Required (TEACHER)

### Get Exam Results

**GET** `/teacher/exams/[examId]/results`

**Auth:** Required (TEACHER)

**Response:**

```json
{
  "success": true,
  "data": {
    "exam": { ... },
    "submissions": [
      {
        "id": "clx...",
        "studentName": "Alice Johnson",
        "studentId": "clx...",
        "score": 88,
        "matchPercentage": 92,
        "feedbackSummary": "Good understanding...",
        "status": "GRADED",
        "gradedAt": "2024-..."
      }
    ]
  }
}
```

### Download Results as CSV

**GET** `/teacher/exams/[examId]/results/download`

**Auth:** Required (TEACHER)

**Response:** CSV file download

### Grade Submission

**POST** `/teacher/grade/[submissionId]`

**Auth:** Required (TEACHER)

**Body:**

```json
{
  "score": 85,
  "matchPercentage": 90, // Optional
  "feedbackSummary": "Good work overall...",
  "feedback": {
    "highlightedAnswer": "HTML with highlights...",
    "detailedFeedback": "Detailed explanation..."
  }
}
```

### List Grievances

**GET** `/teacher/grievances`

**Auth:** Required (TEACHER)

### Get Grievance Details

**GET** `/teacher/grievances/[grievanceId]`

**Auth:** Required (TEACHER)

### Respond to Grievance

**PUT** `/teacher/grievances/[grievanceId]`

**Auth:** Required (TEACHER)

**Body:**

```json
{
  "status": "RESOLVED", // PENDING, REVIEWED, RESOLVED
  "teacherResponse": "Response text..."
}
```

---

## Student Endpoints

### Get Dashboard

**GET** `/student/dashboard`

**Auth:** Required (STUDENT)

**Response:**

```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalExamsTaken": 5,
      "averageScore": 85,
      "pendingGrading": 1
    },
    "recentlyGraded": [...],
    "scoreData": [
      { "name": "Quiz 1", "score": 85 },
      { "name": "Midterm", "score": 78 }
    ]
  }
}
```

### List Available Exams

**GET** `/student/exams`

**Auth:** Required (STUDENT)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "Data Structures Midterm",
      "course": "CS101",
      "type": "MIXED",
      "deadline": "2024-12-31T23:59:59Z",
      "teacherName": "Prof. Smith",
      "hasSubmitted": false,
      "submissionStatus": null
    }
  ]
}
```

### Get Exam Details

**GET** `/student/exams/[examId]`

**Auth:** Required (STUDENT)

### Submit Answer

**POST** `/student/submissions`

**Auth:** Required (STUDENT)

**Body:**

```json
{
  "examId": "clx...",
  "originalAnswer": "Student's answer text..."
}
```

### Get All Results

**GET** `/student/results`

**Auth:** Required (STUDENT)

### Get Detailed Result

**GET** `/student/results/[examId]`

**Auth:** Required (STUDENT)

**Response:**

```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "clx...",
      "originalAnswer": "...",
      "score": 88,
      "matchPercentage": 92,
      "feedbackSummary": "...",
      "feedback": {
        "highlightedAnswer": "...",
        "detailedFeedback": "..."
      },
      "status": "GRADED",
      "gradedAt": "..."
    },
    "exam": {
      "id": "clx...",
      "title": "...",
      "modelAnswer": "...",
      "rubric": "..."
    }
  }
}
```

### List Grievances

**GET** `/student/grievances`

**Auth:** Required (STUDENT)

### Submit Grievance

**POST** `/student/grievances`

**Auth:** Required (STUDENT)

**Body:**

```json
{
  "examId": "clx...",
  "questionNumber": 3, // Optional
  "grievanceType": "SCORE_DISAGREEMENT", // SCORE_DISAGREEMENT, INCORRECT_FEEDBACK, MISSING_ANSWER, OTHER
  "details": "I believe my answer was correct because..."
}
```

---

## Error Codes

| Status Code | Description                            |
| ----------- | -------------------------------------- |
| 200         | Success                                |
| 201         | Created                                |
| 400         | Bad Request / Validation Error         |
| 401         | Unauthorized / Authentication Required |
| 403         | Forbidden / Access Denied              |
| 404         | Not Found                              |
| 409         | Conflict (e.g., duplicate entry)       |
| 500         | Internal Server Error                  |

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Cannot be a common password

## Rate Limiting

(To be implemented)

- 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes

## WebSocket Support

(Future feature for real-time updates)
