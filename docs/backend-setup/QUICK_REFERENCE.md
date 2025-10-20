# Quick Reference - Qayyim API

## 🚀 Quick Start

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 3. Initialize database
npx prisma generate
npx prisma db push

# 4. Start server
npm run dev
```

## 📡 API Endpoints Quick Reference

### Authentication

```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login
POST   /api/v1/auth/forgot-password   - Request password reset
GET    /api/v1/auth/me                - Get current user
```

### Teacher

```
GET    /api/v1/teacher/dashboard                        - Dashboard stats
GET    /api/v1/teacher/exams                            - List all exams
POST   /api/v1/teacher/exams                            - Create exam
GET    /api/v1/teacher/exams/:examId                    - Get exam details
PUT    /api/v1/teacher/exams/:examId                    - Update exam
DELETE /api/v1/teacher/exams/:examId                    - Delete exam
GET    /api/v1/teacher/exams/:examId/results            - View submissions
GET    /api/v1/teacher/exams/:examId/results/download   - Download CSV
POST   /api/v1/teacher/grade/:submissionId              - Grade submission
```

### Student

```
GET    /api/v1/student/dashboard                - Dashboard data
GET    /api/v1/student/exams                    - Browse exams
GET    /api/v1/student/exams/:examId            - Exam details
GET    /api/v1/student/exams/recently_graded    - Recently graded exams
POST   /api/v1/student/submissions              - Submit answer
GET    /api/v1/student/results                  - All results
GET    /api/v1/student/results/:examId          - Detailed result
```

## 🗄️ Database Schema

### Users

```
id, email, password, name, role, createdAt, updatedAt
```

### Exams

```
id, title, description, duration, totalMarks, questions, type,
deadline, modelAnswer, rubric, teacherId, totalSubmissions,
gradedSubmissions, isActive, createdAt, updatedAt
```

### Submissions

```
id, originalAnswer, marks, feedback, matchPercentage, status,
gradedAt, studentId, examId, createdAt, updatedAt
```

## 🔑 Key Changes from Original

### ❌ Removed

- Grievances (complete feature)
- `course` field from Exam
- Complex feedback object
- `score` field (replaced with `marks`)
- `feedbackSummary` (replaced with `feedback`)

### ✅ Added

- `description` to Exam
- `duration` to Exam (minutes)
- `totalMarks` to Exam
- `questions` to Exam (JSON)
- `/student/exams/recently_graded` endpoint

### 🔄 Changed

- `score` → `marks` (actual marks scored)
- `feedbackSummary` → `feedback` (simplified)
- Grading now uses marks instead of percentage

## 📝 Request Examples

### Create Exam

```json
POST /api/v1/teacher/exams
{
  "title": "Data Structures Midterm",
  "description": "Covers arrays, linked lists, trees",
  "duration": 120,
  "totalMarks": 100,
  "questions": { /* question structure */ },
  "type": "MIXED"
}
```

### Grade Submission

```json
POST /api/v1/teacher/grade/:submissionId
{
  "marks": 85,
  "feedback": "Good work overall. Minor improvements needed in...",
  "matchPercentage": 90
}
```

### Submit Answer

```json
POST /api/v1/student/submissions
{
  "examId": "exam-1",
  "originalAnswer": "A binary search tree is..."
}
```

## 🔐 Authentication

Include JWT token in all protected requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 📊 Response Format

### Success

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "statusCode": 200
}
```

### Error

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": { ... }
}
```

## 🛠️ Common Tasks

### Create a Test User

```bash
curl -X POST http://localhost:9002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Teacher",
    "email": "teacher@test.com",
    "password": "Test123!",
    "role": "TEACHER"
  }'
```

### View Database

```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Reset Database

```bash
npx prisma db push --force-reset
```

### Check for Errors

```bash
npm run typecheck
```

## 🐛 Troubleshooting

| Issue               | Solution                         |
| ------------------- | -------------------------------- |
| Can't connect to DB | Check DATABASE_URL in .env.local |
| Prisma errors       | Run `npx prisma generate`        |
| Port in use         | Change port in package.json      |
| JWT errors          | Check JWT_SECRET in .env.local   |
| Email not sending   | Verify RESEND_API_KEY            |

## 📚 Documentation Files

- `START_HERE.md` - Start here for setup
- `QUICKSTART.md` - 5-minute setup guide
- `API_ENDPOINTS.md` - Complete API reference
- `BACKEND_SETUP.md` - Detailed setup instructions
- `CHANGES_SUMMARY.md` - Recent changes
- `SETUP_CHECKLIST.md` - Step-by-step checklist

## 🎯 Testing URLs

```
Health: http://localhost:9002/api/v1/auth/me
Swagger: (To be implemented)
Prisma Studio: http://localhost:5555 (npx prisma studio)
```

## 💡 Tips

- Use Prisma Studio to view/edit data during development
- Test with Postman/Thunder Client before frontend integration
- Check `CHANGES_SUMMARY.md` for migration notes
- JWT tokens expire after 7 days (configurable)
- CSV exports save to `tmp/` directory

---

**Need help?** Check the detailed documentation files or API_ENDPOINTS.md for examples.
