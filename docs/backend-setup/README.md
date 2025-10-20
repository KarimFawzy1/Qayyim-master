# Backend Documentation

This folder contains all the backend setup and API documentation for the Qayyim Exam Management System.

## 📚 Documentation Files

### Getting Started
- **[START_HERE.md](./START_HERE.md)** - 👈 **Start here!** Complete setup guide from scratch
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick commands for experienced developers
- **[SETUP_COMPLETED.md](./SETUP_COMPLETED.md)** - Final setup steps after installation

### API Reference
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Complete list of all API endpoints with request/response examples
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Detailed API documentation
- **[API_ARCHITECTURE.md](./API_ARCHITECTURE.md)** - System architecture and design patterns

### Integration Guides
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - How to integrate the backend with your frontend
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend configuration details
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference for common tasks

### Technical Details
- **[BACKEND_README.md](./BACKEND_README.md)** - Backend system overview
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Summary of implementation details
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - Log of all changes made
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Complete setup checklist

## 🚀 Quick Start

If you're new to this project:

1. Start with **[START_HERE.md](./START_HERE.md)** for the complete setup guide
2. Review **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** to understand available endpoints
3. Check **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** to integrate with your frontend

## 🔑 Key Features

- **Authentication**: JWT-based with bcrypt password hashing
- **Database**: MySQL with Prisma ORM
- **Validation**: Zod schema validation
- **Email**: Resend for transactional emails
- **File Storage**: AWS S3 integration
- **CSV Export**: Exam results export functionality

## 📋 API Overview

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Password reset
- `GET /api/v1/auth/me` - Get current user

### Teacher Endpoints
- Exam management (create, read, update, delete)
- View exam results and submissions
- Grade student submissions
- Download results as CSV

### Student Endpoints
- View available exams
- Submit exam answers
- View grades and feedback
- Dashboard with statistics

For detailed endpoint documentation, see **[API_ENDPOINTS.md](./API_ENDPOINTS.md)**.

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Database**: MySQL with Prisma ORM
- **Validation**: Zod 3.24.2
- **Authentication**: JWT + bcrypt
- **Email**: Resend
- **File Storage**: AWS S3
- **CSV Export**: csv-writer
- **TypeScript**: Version 5

## 📝 Environment Variables

Required environment variables (see START_HERE.md for details):

```env
DATABASE_URL="mysql://..."
JWT_SECRET="..."
JWT_EXPIRES_IN="7d"
RESEND_API_KEY="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
AWS_S3_BUCKET="..."
NEXT_PUBLIC_APP_URL="http://localhost:9002"
```

## 🤝 Support

If you encounter any issues:

1. Check the **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** to ensure all steps are completed
2. Review **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** for common commands
3. Consult **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** for recent changes

---

**Last Updated**: October 2025

