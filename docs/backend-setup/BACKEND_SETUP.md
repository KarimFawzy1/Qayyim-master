# Qayyim Backend API Setup Guide

This guide will help you set up the complete backend API for the Qayyim exam management system.

## Prerequisites

- Node.js 18+ installed
- MySQL database (local or cloud)
- AWS S3 account (for file storage)
- Resend account (for emails)

## Step 1: Install Dependencies

Run the following command to install all required backend dependencies:

```bash
npm install prisma @prisma/client bcrypt jsonwebtoken resend @aws-sdk/client-s3 @aws-sdk/s3-request-presigner csv-writer
npm install -D @types/bcrypt @types/jsonwebtoken
```

## Step 2: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/qayyim_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="qayyim-file-storage"

# App
NEXT_PUBLIC_APP_URL="http://localhost:9002"
```

### Setting Up Services

#### MySQL Database

**Option 1: Local MySQL**

1. Install MySQL on your machine
2. Create a database: `CREATE DATABASE qayyim_db;`
3. Update DATABASE_URL in `.env`

**Option 2: Cloud MySQL (Recommended for Production)**

- PlanetScale (Free tier available)
- AWS RDS
- Google Cloud SQL
- Azure Database for MySQL

#### Resend Email Service

1. Sign up at https://resend.com
2. Verify your domain or use the test domain
3. Get your API key from the dashboard
4. Add to `.env` as `RESEND_API_KEY`

#### AWS S3 Setup

1. Create an AWS account
2. Create an S3 bucket named `qayyim-file-storage` (or your preferred name)
3. Create an IAM user with S3 permissions
4. Generate access keys
5. Add credentials to `.env`

## Step 3: Initialize Prisma

Run the following commands to set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

## Step 4: Verify Setup

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:9002/api/v1`

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/forgot-password` - Request password reset
- `GET /api/v1/auth/me` - Get current user

### Teacher Endpoints

- `GET /api/v1/teacher/dashboard` - Get dashboard statistics
- `GET /api/v1/teacher/exams` - List all exams
- `POST /api/v1/teacher/exams` - Create new exam
- `GET /api/v1/teacher/exams/[examId]` - Get exam details
- `PUT /api/v1/teacher/exams/[examId]` - Update exam
- `DELETE /api/v1/teacher/exams/[examId]` - Delete exam
- `GET /api/v1/teacher/exams/[examId]/results` - Get exam results
- `GET /api/v1/teacher/exams/[examId]/results/download` - Download results as CSV
- `POST /api/v1/teacher/grade/[submissionId]` - Grade a submission
- `GET /api/v1/teacher/grievances` - List grievances
- `GET /api/v1/teacher/grievances/[grievanceId]` - Get grievance details
- `PUT /api/v1/teacher/grievances/[grievanceId]` - Respond to grievance

### Student Endpoints

- `GET /api/v1/student/dashboard` - Get dashboard data
- `GET /api/v1/student/exams` - List available exams
- `GET /api/v1/student/exams/[examId]` - Get exam details
- `POST /api/v1/student/submissions` - Submit exam answer
- `GET /api/v1/student/results` - Get all results
- `GET /api/v1/student/results/[examId]` - Get detailed result
- `GET /api/v1/student/grievances` - List grievances
- `POST /api/v1/student/grievances` - Submit grievance

## Testing the API

You can test the API using tools like:

- Postman
- Insomnia
- Thunder Client (VS Code extension)
- cURL

### Example: Register a User

```bash
curl -X POST http://localhost:9002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "TEACHER"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:9002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

The response will include a JWT token. Use this token in the Authorization header for authenticated requests:

```bash
curl -X GET http://localhost:9002/api/v1/teacher/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Management

### View Database in Browser

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to view and edit data.

### Reset Database

```bash
npx prisma db push --force-reset
```

### Create Migration (for production)

```bash
npx prisma migrate dev --name init
```

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check DATABASE_URL format
- Ensure database exists

### Prisma Client Errors

```bash
npx prisma generate
```

### Email Not Sending

- Verify RESEND_API_KEY is correct
- Check domain verification
- Review Resend dashboard for errors

### S3 Upload Errors

- Verify AWS credentials
- Check bucket name and region
- Ensure IAM permissions are correct

## Production Deployment

### Environment Variables

- Use strong, random JWT_SECRET
- Use production database URL
- Configure CORS if frontend is on different domain

### Security Checklist

- ✅ Environment variables secured
- ✅ Database backups configured
- ✅ Rate limiting enabled (TODO: implement)
- ✅ HTTPS enabled
- ✅ Input validation with Zod
- ✅ Password hashing with bcrypt
- ✅ JWT expiration configured

## Next Steps

1. Install dependencies
2. Configure environment variables
3. Set up database
4. Run Prisma migrations
5. Test API endpoints
6. Integrate with frontend
7. Set up Python Flask for AI grading (future)

## Support

For issues or questions, refer to:

- Prisma docs: https://www.prisma.io/docs
- Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Resend docs: https://resend.com/docs
