# Frontend Integration Guide

This guide shows you how to connect your existing Next.js frontend to the new backend API.

## 🔌 API Client Setup

### Create API Utility

Create `src/lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL + '/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error || 'An error occurred',
      data.statusCode || response.status,
      data.details
    );
  }
  
  return data.data;
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  put: <T>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
```

## 🔐 Authentication Hook

Create `src/hooks/use-auth.ts`:

```typescript
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'TEACHER' | 'STUDENT';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'TEACHER' | 'STUDENT';
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post<{ user: User; token: string }>(
          '/auth/login',
          { email, password }
        );
        
        localStorage.setItem('authToken', response.token);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      register: async (data: RegisterData) => {
        const response = await api.post<{ user: User; token: string }>(
          '/auth/register',
          data
        );
        
        localStorage.setItem('authToken', response.token);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('authToken');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setAuth: (user: User, token: string) => {
        localStorage.setItem('authToken', token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

## 📝 Update Existing Components

### 1. Registration Page

Update `src/app/register/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
// ... other imports

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as 'TEACHER' | 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      router.push(formData.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      {/* ... existing UI ... */}
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'TEACHER' | 'STUDENT') => 
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
```

### 2. Login Page

Update `src/app/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Redirect based on user role
      const role = user?.role || 'STUDENT';
      router.push(role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component with form handling
}
```

### 3. Teacher Dashboard

Update `src/app/teacher/dashboard/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

interface DashboardData {
  statistics: {
    totalExams: number;
    totalSubmissions: number;
    pendingSubmissions: number;
    studentsGraded: number;
  };
  recentExams: any[];
  gradeDistribution: Record<string, number>;
}

export default function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await api.get<DashboardData>('/teacher/dashboard');
        setData(result);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Error loading dashboard</div>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Dashboard" description="Welcome back, here's a summary of your activities.">
        <Button asChild>
          <Link href="/teacher/exams/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Exam
          </Link>
        </Button>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Exams Created" value={data.statistics.totalExams.toString()} />
        <StatCard title="Students Graded" value={data.statistics.studentsGraded.toString()} />
        <StatCard title="Pending Submissions" value={data.statistics.pendingSubmissions.toString()} />
      </div>

      {/* Grade distribution chart */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Use data.gradeDistribution for chart */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4. Create Exam

Update `src/app/teacher/exams/create/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function CreateExamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    type: 'MIXED' as 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'MIXED',
    deadline: '',
    modelAnswer: '',
    rubric: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/teacher/exams', formData);
      router.push('/teacher/exams');
    } catch (error) {
      console.error('Failed to create exam:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... form UI
}
```

## 🛡️ Protected Routes

Create `src/middleware.ts` for route protection:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Require auth for protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 📦 Required Dependencies

Install Zustand for state management:

```bash
npm install zustand
```

## 🎨 Type Definitions

Create `src/types/api.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'TEACHER' | 'STUDENT';
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  course: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'MIXED';
  deadline?: string;
  totalSubmissions: number;
  gradedSubmissions: number;
}

export interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  examId: string;
  score: number;
  matchPercentage: number;
  feedbackSummary: string;
  status: 'PENDING' | 'GRADED';
  originalAnswer: string;
  feedback?: {
    highlightedAnswer: string;
    detailedFeedback: string;
  };
}

export interface Grievance {
  id: string;
  studentName: string;
  examTitle: string;
  questionNumber?: number;
  grievanceType: 'SCORE_DISAGREEMENT' | 'INCORRECT_FEEDBACK' | 'MISSING_ANSWER' | 'OTHER';
  details: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  submittedAt: string;
  teacherResponse?: string;
}
```

## ✅ Integration Checklist

- [ ] Install Zustand: `npm install zustand`
- [ ] Create `src/lib/api-client.ts`
- [ ] Create `src/hooks/use-auth.ts`
- [ ] Create `src/types/api.ts`
- [ ] Update registration page
- [ ] Update login page
- [ ] Update teacher dashboard
- [ ] Update student dashboard
- [ ] Update exam creation
- [ ] Update exam list
- [ ] Update grading interface
- [ ] Update results display
- [ ] Update grievance forms
- [ ] Add route protection middleware
- [ ] Test all flows end-to-end

## 🧪 Testing Integration

1. **Test Registration**
   - Register a teacher account
   - Register a student account
   - Verify JWT token storage

2. **Test Teacher Flow**
   - Login as teacher
   - Create an exam
   - View exam list
   - Access dashboard

3. **Test Student Flow**
   - Login as student
   - Browse exams
   - Submit answer
   - View results

4. **Test Grievances**
   - Student submits grievance
   - Teacher views grievance
   - Teacher responds

## 🚨 Common Issues

### CORS Errors
If frontend and backend are on different ports, configure CORS in Next.js config.

### Token Not Persisting
Ensure `localStorage.setItem` is called after successful login.

### 401 Unauthorized
Check that token is being sent in Authorization header.

### Type Mismatches
Ensure enum values match exactly (e.g., 'TEACHER' not 'teacher').

---

Your frontend is now ready to communicate with the backend! 🎉

