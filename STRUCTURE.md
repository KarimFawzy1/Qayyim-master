# 📁 Project Structure - Qayyim

> **Clean, organized, and production-ready structure**

---

## 🌳 Complete Directory Tree

```
Qayyim-master/
│
├── 📄 Root Files (14 files)
│   ├── .env.local                 # Environment variables (create this)
│   ├── .gitignore                 # Git ignore rules
│   ├── apphosting.yaml            # Hosting configuration
│   ├── components.json            # Shadcn/ui config
│   ├── next.config.ts             # Next.js configuration
│   ├── package.json               # Dependencies
│   ├── package-lock.json          # Locked dependencies
│   ├── postcss.config.mjs         # PostCSS config
│   ├── tailwind.config.ts         # Tailwind config
│   ├── tsconfig.json              # TypeScript config
│   ├── README.md                  # 👈 START HERE - Main documentation
│   ├── CLEANUP_SUMMARY.md         # Recent cleanup details
│   ├── PROJECT_STATUS.md          # Current project status
│   └── STRUCTURE.md               # This file
│
├── 📁 docs/ (Documentation Hub)
│   ├── 📁 backend-setup/          # All backend documentation (14 files)
│   │   ├── README.md              # Documentation index
│   │   ├── START_HERE.md          # 🚀 Setup guide
│   │   ├── API_ENDPOINTS.md       # Complete API reference
│   │   ├── API_DOCUMENTATION.md   # Detailed API docs
│   │   ├── API_ARCHITECTURE.md    # System architecture
│   │   ├── BACKEND_README.md      # Backend overview
│   │   ├── BACKEND_SETUP.md       # Backend config details
│   │   ├── CHANGES_SUMMARY.md     # Change log
│   │   ├── FRONTEND_INTEGRATION.md # Integration guide
│   │   ├── IMPLEMENTATION_SUMMARY.md # Implementation details
│   │   ├── QUICK_REFERENCE.md     # Quick commands
│   │   ├── QUICKSTART.md          # Quick start guide
│   │   ├── SETUP_CHECKLIST.md     # Setup checklist
│   │   └── SETUP_COMPLETED.md     # Post-setup guide
│   └── blueprint.md               # Original project blueprint
│
├── 📁 prisma/ (Database)
│   └── schema.prisma              # Database schema (MySQL + Prisma)
│
├── 📁 src/ (Source Code)
│   │
│   ├── 📁 app/ (Next.js App Router)
│   │   │
│   │   ├── 📁 api/v1/ (Backend API - 17 endpoints)
│   │   │   │
│   │   │   ├── 📁 auth/ (Authentication - 4 endpoints)
│   │   │   │   ├── register/route.ts       # POST - User registration
│   │   │   │   ├── login/route.ts          # POST - User login
│   │   │   │   ├── forgot-password/route.ts # POST - Password reset
│   │   │   │   └── me/route.ts             # GET - Current user
│   │   │   │
│   │   │   ├── 📁 teacher/ (Teacher endpoints - 7 endpoints)
│   │   │   │   ├── dashboard/route.ts      # GET - Teacher dashboard
│   │   │   │   ├── exams/
│   │   │   │   │   ├── route.ts            # GET, POST - List/Create exams
│   │   │   │   │   └── [examId]/
│   │   │   │   │       ├── route.ts        # GET, PUT, DELETE - Exam CRUD
│   │   │   │   │       └── results/
│   │   │   │   │           ├── route.ts    # GET - View submissions
│   │   │   │   │           └── download/route.ts # GET - Export CSV
│   │   │   │   └── grade/
│   │   │   │       └── [submissionId]/route.ts # POST - Grade submission
│   │   │   │
│   │   │   └── 📁 student/ (Student endpoints - 6 endpoints)
│   │   │       ├── dashboard/route.ts      # GET - Student dashboard
│   │   │       ├── exams/
│   │   │       │   ├── route.ts            # GET - List exams
│   │   │       │   ├── [examId]/route.ts   # GET - Exam details
│   │   │       │   └── recently_graded/route.ts # GET - Recent grades
│   │   │       ├── submissions/route.ts    # POST - Submit answer
│   │   │       └── results/
│   │   │           ├── route.ts            # GET - All results
│   │   │           └── [examId]/route.ts   # GET - Specific result
│   │   │
│   │   ├── 📁 (auth-pages)/ (Public pages)
│   │   │   ├── login/page.tsx              # Login page
│   │   │   ├── register/page.tsx           # Registration page
│   │   │   └── forgot-password/page.tsx    # Password reset page
│   │   │
│   │   ├── 📁 teacher/ (Teacher UI)
│   │   │   ├── layout.tsx                  # Teacher layout
│   │   │   ├── dashboard/page.tsx          # Dashboard
│   │   │   ├── exams/
│   │   │   │   ├── page.tsx                # Exams list
│   │   │   │   ├── create/page.tsx         # Create exam
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx            # Exam details
│   │   │   │       ├── edit/page.tsx       # Edit exam
│   │   │   │       └── review/
│   │   │   │           └── [studentId]/page.tsx # Review submission
│   │   │   ├── profile/page.tsx            # Teacher profile
│   │   │   └── upload/page.tsx             # File upload
│   │   │
│   │   ├── 📁 student/ (Student UI)
│   │   │   ├── layout.tsx                  # Student layout
│   │   │   ├── dashboard/page.tsx          # Dashboard
│   │   │   ├── profile/page.tsx            # Student profile
│   │   │   └── results/
│   │   │       ├── page.tsx                # Results list
│   │   │       └── [id]/page.tsx           # Result details
│   │   │
│   │   ├── page.tsx                        # Home page
│   │   ├── layout.tsx                      # Root layout
│   │   ├── globals.css                     # Global styles
│   │   └── favicon.ico                     # Favicon
│   │
│   ├── 📁 components/ (React Components)
│   │   ├── 📁 ui/ (Shadcn/ui - 35 components)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── tooltip.tsx
│   │   ├── app-layout.tsx              # App layout wrapper
│   │   ├── file-upload.tsx             # File upload component
│   │   ├── logo.tsx                    # Logo component
│   │   └── page-header.tsx             # Page header component
│   │
│   ├── 📁 hooks/ (Custom React Hooks)
│   │   ├── use-mobile.tsx              # Mobile detection hook
│   │   └── use-toast.ts                # Toast notifications hook
│   │
│   ├── 📁 lib/ (Core Utilities - 10 files)
│   │   ├── api-response.ts             # ⚙️ API response helpers
│   │   ├── auth.ts                     # 🔐 JWT utilities
│   │   ├── csv-export.ts               # 📊 CSV generation
│   │   ├── email.ts                    # 📧 Email service (Resend)
│   │   ├── middleware.ts               # 🛡️ Auth middleware
│   │   ├── prisma.ts                   # 💾 Database client
│   │   ├── s3.ts                       # 📦 AWS S3 file storage
│   │   ├── validations.ts              # ✅ Zod validation schemas
│   │   ├── utils.ts                    # 🛠️ General utilities
│   │   └── mock-data.ts                # 🎭 Mock data (for testing)
│   │
│   └── 📁 ai/ (AI Integration - Future)
│       ├── dev.ts                      # AI development config
│       ├── genkit.ts                   # Genkit configuration
│       └── flows/
│           ├── grade-student-answer.ts
│           ├── provide-feedback-on-answer.ts
│           └── summarize-student-performance.ts
│
└── 📁 node_modules/ (Dependencies - Auto-generated)
```

---

## 📊 File Count Summary

| Category               | Count          | Location             |
| ---------------------- | -------------- | -------------------- |
| **Documentation**      | 15 files       | `docs/`              |
| **Root Config**        | 10 files       | Root                 |
| **Backend API Routes** | 17 endpoints   | `src/app/api/v1/`    |
| **Frontend Pages**     | 15+ pages      | `src/app/`           |
| **UI Components**      | 35+ components | `src/components/ui/` |
| **Custom Components**  | 4 files        | `src/components/`    |
| **Utilities**          | 10 files       | `src/lib/`           |
| **React Hooks**        | 2 files        | `src/hooks/`         |
| **AI Flows**           | 4 files        | `src/ai/`            |
| **Database Schema**    | 1 file         | `prisma/`            |

**Total Source Files**: ~100+ files (excluding node_modules)

---

## 🎯 Key Directories Explained

### 📁 `docs/backend-setup/`

All backend documentation in one place. Start with `README.md` or `START_HERE.md`.

### 📁 `src/app/api/v1/`

Backend API endpoints following RESTful conventions:

- **Authentication**: JWT-based auth system
- **Teacher**: Exam management and grading
- **Student**: Exam taking and results viewing

### 📁 `src/lib/`

Core backend utilities:

- **api-response.ts**: Standardized API responses
- **auth.ts**: JWT token management
- **middleware.ts**: Auth and role checking
- **validations.ts**: Zod input validation schemas
- **prisma.ts**: Database client singleton
- **email.ts**: Resend email service
- **s3.ts**: AWS S3 file operations
- **csv-export.ts**: CSV file generation

### 📁 `src/components/`

React components:

- **ui/**: Shadcn/ui component library (35 components)
- **Custom**: App-specific components (layout, logo, etc.)

### 📁 `src/app/teacher/` & `src/app/student/`

Frontend pages for teacher and student interfaces.

---

## 🗂️ Clean Structure Benefits

### ✅ Before Cleanup

```
Root/
├── 14 scattered doc files ❌
├── Empty grievance folders ❌
├── Outdated README ❌
└── Hard to navigate ❌
```

### ✅ After Cleanup

```
Root/
├── Clean root with 3 key docs ✅
├── docs/backend-setup/ (all docs) ✅
├── Well-organized src/ ✅
└── Easy navigation ✅
```

---

## 📖 Quick Navigation Guide

| I want to...             | Go to...                                     |
| ------------------------ | -------------------------------------------- |
| **Get started**          | `README.md`                                  |
| **Setup backend**        | `docs/backend-setup/START_HERE.md`           |
| **View API docs**        | `docs/backend-setup/API_ENDPOINTS.md`        |
| **Integrate frontend**   | `docs/backend-setup/FRONTEND_INTEGRATION.md` |
| **Check project status** | `PROJECT_STATUS.md`                          |
| **View structure**       | `STRUCTURE.md` (this file)                   |
| **See cleanup details**  | `CLEANUP_SUMMARY.md`                         |
| **Edit database schema** | `prisma/schema.prisma`                       |
| **Add API endpoint**     | `src/app/api/v1/`                            |
| **Modify UI**            | `src/components/` or `src/app/`              |
| **Update utilities**     | `src/lib/`                                   |

---

## 🔄 Development Workflow

```
1. Start Here
   └─> README.md (overview)

2. Setup
   └─> docs/backend-setup/START_HERE.md (setup guide)

3. Develop
   ├─> src/app/api/ (add API endpoints)
   ├─> src/app/ (add pages)
   ├─> src/components/ (add components)
   └─> src/lib/ (add utilities)

4. Test
   └─> docs/backend-setup/API_ENDPOINTS.md (test APIs)

5. Deploy
   └─> Follow deployment checklist
```

---

## 🎨 Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐│
│  │ Teacher  │  │ Student  │  │   Auth    ││
│  │  Pages   │  │  Pages   │  │  Pages    ││
│  └──────────┘  └──────────┘  └───────────┘│
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Components (Shadcn/ui)            │   │
│  └─────────────────────────────────────┘   │
└─────────────┬───────────────────────────────┘
              │
┌─────────────▼───────────────────────────────┐
│         Backend API (Next.js)               │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Auth     │  │   Business Logic    │  │
│  │ Middleware  │  │   (Utilities)       │  │
│  └─────────────┘  └─────────────────────┘  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   JWT    │  │   Zod    │  │  Email   │ │
│  │  bcrypt  │  │Validation│  │ (Resend) │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└─────────────┬───────────────────────────────┘
              │
┌─────────────▼───────────────────────────────┐
│         Data Layer (Prisma ORM)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   User   │  │   Exam   │  │Submission│  │
│  │  Model   │  │  Model   │  │  Model   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────┬───────────────────────────────┘
              │
┌─────────────▼───────────────────────────────┐
│           MySQL Database                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│        External Services                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  AWS S3  │  │  Resend  │  │  Flask   │  │
│  │(Storage) │  │ (Email)  │  │ (AI/OCR) │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

---

## ✨ What Makes This Clean?

1. **📚 All docs in one place**: `docs/backend-setup/`
2. **🗂️ Clear separation**: Frontend, backend, utils, components
3. **🎯 Logical grouping**: Related files together
4. **📝 Comprehensive docs**: Everything documented
5. **🧹 No clutter**: Removed empty folders and unused files
6. **🔍 Easy to find**: Clear naming and structure

---

**🎉 Ready to develop! Happy coding!**
