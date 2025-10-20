# قَيِّمْ (Qayyim) - Exam Management System

> A modern, AI-powered exam management system leveraging open-source Large Language Models (LLMs) to automate grading for computer science subjects.

## 📖 Overview

Qayyim is a web-based system that automates grading for multiple-choice, true/false, and short-answer questions in computer science subjects, including algorithms, data structures, and programming fundamentals.

## ✨ Features

### 👨‍🏫 For Teachers

- **Exam Management**: Create, edit, and manage exams
- **Model Answers**: Upload model answers and grading rubrics
- **Automated Grading**: Submit student answers for AI-powered grading
- **Results Dashboard**: View detailed grading reports and analytics
- **Manual Override**: Review and adjust grades as needed
- **CSV Export**: Download exam results for record-keeping

### 👨‍🎓 For Students

- **View Exams**: Browse available exams and deadlines
- **Submit Answers**: Submit exam answers through the platform
- **Grade Tracking**: View grades and detailed feedback
- **Performance Analytics**: Track progress over time
- **Results History**: Access all past exam results

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.3** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Shadcn/ui** - Beautiful UI components

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MySQL** - Relational database
- **Prisma ORM** - Type-safe database access
- **Zod 3.24.2** - Schema validation
- **JWT + bcrypt** - Authentication & authorization

### Services

- **Resend** - Transactional emails
- **AWS S3** - File storage
- **Python Flask** (planned) - LLM and OCR integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Qayyim-master
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/qayyim_db"
   JWT_SECRET="your-secure-jwt-secret"
   JWT_EXPIRES_IN="7d"
   RESEND_API_KEY="your-resend-api-key"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="qayyim-file-storage"
   NEXT_PUBLIC_APP_URL="http://localhost:9002"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:9002`

### 📚 Full Documentation

For complete setup instructions and API documentation, see:

- **[Backend Setup Guide](./docs/backend-setup/START_HERE.md)** - Complete backend setup from scratch
- **[API Documentation](./docs/backend-setup/API_ENDPOINTS.md)** - All API endpoints with examples
- **[Frontend Integration](./docs/backend-setup/FRONTEND_INTEGRATION.md)** - How to connect the frontend
- **[All Backend Docs](./docs/backend-setup/README.md)** - Complete backend documentation index

## 📁 Project Structure

```
Qayyim-master/
├── docs/                      # Documentation
│   ├── backend-setup/         # Backend setup & API docs
│   └── blueprint.md           # Project blueprint
├── prisma/                    # Database schema
│   └── schema.prisma
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/v1/           # API endpoints
│   │   ├── student/          # Student pages
│   │   └── teacher/          # Teacher pages
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utilities & helpers
│       ├── api-response.ts   # API response helpers
│       ├── auth.ts           # JWT utilities
│       ├── csv-export.ts     # CSV generation
│       ├── email.ts          # Email service
│       ├── middleware.ts     # Auth middleware
│       ├── prisma.ts         # Database client
│       ├── s3.ts             # File storage
│       └── validations.ts    # Zod schemas
└── package.json
```

## 🔐 Security Features

- **Password Requirements**:
  - Minimum 8 characters
  - 1 uppercase letter
  - 1 lowercase letter
  - 1 number
  - 1 special character
- **JWT Authentication**: Secure token-based auth
- **bcrypt Hashing**: Industry-standard password hashing
- **Role-Based Access**: Separate permissions for teachers and students
- **Input Validation**: Zod schema validation on all inputs

## 🌟 Benefits

- ⚡ **Fast**: Automated grading saves hours of manual work
- 🎯 **Consistent**: Standardized evaluation criteria
- 📈 **Scalable**: Handle hundreds of submissions effortlessly
- 🔍 **Transparent**: Detailed feedback for every answer
- 🤝 **Fair**: AI-assisted grading with manual override options
- 📊 **Analytics**: Track student performance over time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for educators and students**
