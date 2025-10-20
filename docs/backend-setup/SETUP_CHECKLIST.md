# ✅ Qayyim Backend Setup Checklist

Use this checklist to ensure you've completed all setup steps correctly.

## 📦 Phase 1: Installation (10 minutes)

### Dependencies Installation

- [ ] Node.js 18+ is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] Ran `INSTALL.bat` (Windows) or manual install
- [ ] All dependencies installed successfully
- [ ] No error messages in terminal

### Verify Installation

```bash
# Run this to verify
npm list prisma @prisma/client bcrypt jsonwebtoken resend
```

## 🔧 Phase 2: Environment Configuration (15 minutes)

### Environment File Setup

- [ ] Copied `.env.local.example` to `.env.local`
- [ ] File `.env.local` exists in project root
- [ ] File is NOT committed to git (in .gitignore)

### Database Configuration

- [ ] MySQL is installed and running
- [ ] Created database: `CREATE DATABASE qayyim_db;`
- [ ] Updated `DATABASE_URL` in `.env.local`
- [ ] Connection string format is correct
- [ ] Can connect to database

**Test connection:**

```bash
mysql -u your_username -p -e "SHOW DATABASES;"
```

### JWT Configuration

- [ ] Generated secure JWT_SECRET
- [ ] Updated `JWT_SECRET` in `.env.local`
- [ ] Secret is at least 32 characters
- [ ] Secret contains random characters

**Generate JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Email Service (Optional for Development)

- [ ] Created Resend account (https://resend.com)
- [ ] Got API key from Resend dashboard
- [ ] Updated `RESEND_API_KEY` in `.env.local`
- [ ] (Optional) Verified custom domain

**Or skip for now:**

- [ ] Commented out email-related code in forgot-password

### AWS S3 (Optional for Development)

- [ ] Created AWS account
- [ ] Created S3 bucket
- [ ] Created IAM user with S3 permissions
- [ ] Got access key ID and secret
- [ ] Updated AWS credentials in `.env.local`
- [ ] Set correct AWS_REGION

**Or skip for now:**

- [ ] Will set up later for file uploads

### Application URL

- [ ] Updated `NEXT_PUBLIC_APP_URL` if not using localhost:9002
- [ ] URL matches your development environment

## 🗄️ Phase 3: Database Setup (5 minutes)

### Prisma Setup

- [ ] Ran `npx prisma generate`
- [ ] No errors in Prisma generation
- [ ] Prisma Client created successfully

### Database Migration

- [ ] Ran `npx prisma db push`
- [ ] All tables created successfully
- [ ] No migration errors
- [ ] Database schema matches `prisma/schema.prisma`

### Verify Database

- [ ] Ran `npx prisma studio`
- [ ] Studio opens at http://localhost:5555
- [ ] Can see 4 tables: User, Exam, Submission, Grievance
- [ ] Tables are empty (no data yet)

**Tables should be:**

- users
- exams
- submissions
- grievances

## 🚀 Phase 4: Server Launch (2 minutes)

### Start Development Server

- [ ] Ran `npm run dev`
- [ ] Server starts without errors
- [ ] Server runs on port 9002 (or your configured port)
- [ ] No TypeScript errors
- [ ] No build errors

### Verify Server Running

- [ ] Can access http://localhost:9002
- [ ] Can access http://localhost:9002/api/v1/auth/me
- [ ] Getting proper response (401 unauthorized is correct)

## 🧪 Phase 5: API Testing (10 minutes)

### Test Registration

- [ ] Tested POST /api/v1/auth/register
- [ ] Registration works with valid data
- [ ] Returns user object and token
- [ ] Password validation works
- [ ] Email uniqueness is enforced

**Test with cURL:**

```bash
curl -X POST http://localhost:9002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Teacher","email":"teacher@test.com","password":"Test123!","role":"TEACHER"}'
```

### Test Login

- [ ] Tested POST /api/v1/auth/login
- [ ] Login works with registered user
- [ ] Returns user object and token
- [ ] Wrong password returns error
- [ ] Wrong email returns error

**Test with cURL:**

```bash
curl -X POST http://localhost:9002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"Test123!"}'
```

### Test Protected Endpoint

- [ ] Got JWT token from login/register
- [ ] Tested GET /api/v1/teacher/dashboard with token
- [ ] Request succeeds with valid token
- [ ] Request fails without token (401)
- [ ] Request fails with invalid token (401)

**Test with cURL:**

```bash
curl -X GET http://localhost:9002/api/v1/teacher/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Exam Creation

- [ ] Tested POST /api/v1/teacher/exams
- [ ] Can create exam as teacher
- [ ] Exam appears in database (check Prisma Studio)
- [ ] Validation works for required fields

### Test Student Endpoints

- [ ] Registered a student account
- [ ] Can access student dashboard
- [ ] Can view available exams
- [ ] Student cannot access teacher endpoints (403)

## 📚 Phase 6: Documentation Review (5 minutes)

### Read Documentation

- [ ] Read START_HERE.md
- [ ] Skimmed QUICKSTART.md
- [ ] Reviewed API_DOCUMENTATION.md structure
- [ ] Know where to find endpoint details

### Understand Structure

- [ ] Understand project file structure
- [ ] Know where API endpoints are located
- [ ] Know where utilities are located
- [ ] Understand database schema

## 🔌 Phase 7: Frontend Integration Prep (Optional)

### Install Frontend Dependencies

- [ ] Ran `npm install zustand` (if not already installed)
- [ ] Created `src/lib/api-client.ts`
- [ ] Created `src/hooks/use-auth.ts`
- [ ] Created `src/types/api.ts`

### Update Components

- [ ] Updated registration page
- [ ] Updated login page
- [ ] Updated at least one dashboard

## ✅ Final Verification

### Backend Health Check

- [ ] Server starts without errors
- [ ] Can register new users
- [ ] Can login successfully
- [ ] Can access protected endpoints with token
- [ ] Database persists data correctly
- [ ] All 4 tables exist in database

### Security Check

- [ ] Passwords are hashed (check database)
- [ ] JWT_SECRET is secure and not default
- [ ] .env.local is in .gitignore
- [ ] No sensitive data in code

### Development Ready

- [ ] Can create exams
- [ ] Can view exams
- [ ] Can submit answers (as student)
- [ ] Can grade submissions (as teacher)
- [ ] Can submit grievances

## 🎯 Success Criteria

You're ready to proceed if you can:

1. ✅ Start the server without errors
2. ✅ Register a teacher account
3. ✅ Login and receive JWT token
4. ✅ Create an exam as teacher
5. ✅ Register a student account
6. ✅ View exams as student

## 🚨 Troubleshooting Checklist

If something isn't working:

### Server Won't Start

- [ ] Checked for port conflicts
- [ ] Verified all dependencies are installed
- [ ] Checked for TypeScript errors
- [ ] Reviewed error messages in terminal

### Database Connection Failed

- [ ] MySQL is running
- [ ] DATABASE_URL is correct
- [ ] Database exists
- [ ] Credentials are correct
- [ ] Network/firewall allows connection

### API Requests Fail

- [ ] Server is running
- [ ] Using correct URL
- [ ] Headers are correct
- [ ] Body format is JSON
- [ ] Token is valid (if protected endpoint)

### Prisma Issues

- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] No syntax errors in schema.prisma
- [ ] Database connection works

## 📊 Completion Status

Count your checkmarks:

- ✅ **All checked (100%)** - Perfect! You're ready to go! 🎉
- ✅ **80-99% checked** - Almost there! Fix remaining items
- ✅ **60-79% checked** - Good progress, keep going
- ⚠️ **Below 60%** - Review documentation and try again

## 🎓 Next Steps After Completion

Once all items are checked:

1. ⏭️ Read [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
2. ⏭️ Start integrating with your existing frontend
3. ⏭️ Test complete workflows
4. ⏭️ Plan Python Flask AI integration
5. ⏭️ Prepare for production deployment

## 💾 Save Your Progress

Document your configuration:

- [ ] Saved database credentials securely
- [ ] Documented any custom configuration
- [ ] Backed up `.env.local` (securely!)
- [ ] Noted any issues encountered

## 🎉 Congratulations!

If you've checked all boxes, you now have a fully functional backend API!

**You're ready to:**

- Connect your frontend
- Start building features
- Test complete workflows
- Deploy to production

---

**Need Help?** Refer back to the documentation:

- Setup issues → [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- API questions → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Integration help → [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

**Pro Tip:** Keep this checklist handy for future setup on other machines or environments!
