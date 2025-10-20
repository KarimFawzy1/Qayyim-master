# 🚀 Quick Start Guide

Get the Qayyim backend up and running in 5 minutes!

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ MySQL database running (local or cloud)

## 5-Minute Setup

### 1️⃣ Install Dependencies (1 minute)

**Windows:**
```cmd
INSTALL.bat
```

**Mac/Linux:**
```bash
npm install prisma @prisma/client bcrypt jsonwebtoken resend @aws-sdk/client-s3 @aws-sdk/s3-request-presigner csv-writer
npm install -D @types/bcrypt @types/jsonwebtoken
```

### 2️⃣ Configure Environment (2 minutes)

1. Copy `.env.local.example` to `.env.local`
2. Update these **critical** values:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/qayyim_db"
JWT_SECRET="run: node -e 'console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))'"
RESEND_API_KEY="get from https://resend.com"
```

**Quick MySQL Database Setup:**
```sql
CREATE DATABASE qayyim_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3️⃣ Initialize Database (1 minute)

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push
```

### 4️⃣ Start the Server (1 minute)

```bash
npm run dev
```

Server runs at: `http://localhost:9002`

### 5️⃣ Test the API

**Open a new terminal and run:**

```bash
# Test registration
curl -X POST http://localhost:9002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Teacher\",\"email\":\"teacher@test.com\",\"password\":\"Test123!\",\"role\":\"TEACHER\"}"
```

✅ **Success!** You should see a response with a user object and JWT token.

## Next Steps

1. 📖 Read [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed configuration
2. 📚 Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for all endpoints
3. 🔧 Configure AWS S3 and Resend for production features
4. 🎨 Connect your frontend to the API

## Common Issues

### "Cannot connect to MySQL"
- ✅ Check MySQL is running: `mysql --version`
- ✅ Verify DATABASE_URL credentials
- ✅ Ensure database exists: `CREATE DATABASE qayyim_db;`

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Port 9002 already in use"
- Change port in `package.json`: `"dev": "next dev --turbopack -p 3000"`

## Optional: Seed Sample Data

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Create teacher
  const teacher = await prisma.user.create({
    data: {
      name: 'Dr. Smith',
      email: 'teacher@qayyim.com',
      password: await hashPassword('Teacher123!'),
      role: 'TEACHER',
    },
  });

  // Create sample exam
  await prisma.exam.create({
    data: {
      title: 'Introduction to Computer Science',
      course: 'CS101',
      type: 'MIXED',
      modelAnswer: 'Sample model answer',
      rubric: 'Sample rubric',
      teacherId: teacher.id,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
npx tsx prisma/seed.ts
```

## View Database

```bash
npx prisma studio
```

Opens at `http://localhost:5555` - Browse and edit data visually!

## Production Checklist

Before deploying:
- [ ] Change JWT_SECRET to a strong random string
- [ ] Use production DATABASE_URL
- [ ] Configure CORS for your frontend domain
- [ ] Set up AWS S3 bucket
- [ ] Verify Resend domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging

---

Need help? Check the detailed guides:
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Complete setup guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

