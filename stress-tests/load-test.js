// stress-tests/load_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://qayyim.tech';

// Restricted pool containing only your 4 verified CS101 midterms
const EXAM_POOL = [
  { id: 'cmqzfvhtj0001pa01da6hrgz3', title: 'Data Structures Midterm' },
  { id: 'cmqzfvkc20003pa01nfpu81aw', title: 'Data Structures Midterm' },
  { id: 'cmqzfvr4w0005pa01at2pbsg6', title: 'Data Structures Midterm' },
  { id: 'cmqzfvtfp0007pa01boqjr8bu', title: 'Data Structures Midterm' }
];

const STUDENT_USER_ID = 'cmkrkasko00067kmwvedwc0zq'; // Existential verification mapping

const TEST_USERS = [
  { email: 'mm@m.com', password: '@Chookies12', role: 'instructor' },
  { email: 'student12@m.com', password: '@Chookies12', role: 'student' },
];

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

function safeJsonParse(response) {
  try {
    return JSON.parse(response.body || '{}');
  } catch (error) {
    return {};
  }
}

function checkResponse(res, name, expectedStatus = [200]) {
  const result = check(res, {
    [name]: (r) => expectedStatus.includes(r.status),
    [`${name} fast`]: (r) => r.timings.duration < 3000,
  });

  if (!result) {
    console.error(`${name} failed: ${res.status} ${res.body}`);
  }

  return result;
}

export default function () {
  const user = TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];

  const loginRes = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({ email: user.email, password: user.password }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!checkResponse(loginRes, 'login status 200')) {
    sleep(1);
    return;
  }

  const loginBody = safeJsonParse(loginRes);
  const token = loginBody?.data?.token;

  if (!token) {
    console.error('login token missing', loginRes.body);
    sleep(1);
    return;
  }

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  sleep(1);

  checkResponse(http.get(`${BASE_URL}/api/v1/auth/me`, authHeaders), 'auth/me');

  if (user.role === 'instructor') {
    // Pick an exam systematically out of your 4-item array pool
    const currentExam = EXAM_POOL[__ITER % EXAM_POOL.length];

    const dummyPdf = http.file("this is mock pdf content for grading", "test-exam.pdf", "application/pdf");

    const formData = {
      title: currentExam.title,
      courseId: 'clcourse001',
      type: 'MCQ',
      date: new Date().toISOString(),
      file: dummyPdf,
    };

    const examHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    checkResponse(
      http.post(`${BASE_URL}/api/v1/teacher/exams`, formData, examHeaders),
      'teacher/create-exam',
      [200, 201]
    );

    checkResponse(http.get(`${BASE_URL}/api/v1/teacher/dashboard`, authHeaders), 'teacher/dashboard', [200, 403]);
    checkResponse(http.get(`${BASE_URL}/api/v1/teacher/exams`, authHeaders), 'teacher/exams', [200, 403]);
    checkResponse(http.get(`${BASE_URL}/api/v1/teacher/courses`, authHeaders), 'teacher/courses', [200, 403]);
    checkResponse(http.get(`${BASE_URL}/api/v1/grievances`, authHeaders), 'teacher/grievances', [200, 403]);

    // ── UPLOAD STUDENT SUBMISSION ─────────────────────────────
    if (Math.random() < 0.3) {
      const minimalPdf = http.file(
        '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\ntrailer<</Size 4/Root 1 0 R>>\n%%EOF',
        `${STUDENT_USER_ID}.pdf`,
        'application/pdf'
      );

      const uploadFormData = {
        examId: currentExam.id, // Pulled dynamically directly from array item references
        courseName: 'CS101',
        files: minimalPdf,
      };

      const uploadRes = http.post(
        `${BASE_URL}/api/v1/teacher/student-submission`, // Fixed endpoint string mapping
        uploadFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      checkResponse(uploadRes, 'teacher/student-submission', [200, 201]);

      if (uploadRes.status !== 200 && uploadRes.status !== 201) {
        console.error(`Upload failed: ${uploadRes.status} — ${uploadRes.body}`);
      }

      sleep(2);
    }
    // ─────────────────────────────────────────────────────────

  } else {
    checkResponse(http.get(`${BASE_URL}/api/v1/student/dashboard`, authHeaders), 'student/dashboard', [200, 403]);
    checkResponse(http.get(`${BASE_URL}/api/v1/student/courses`, authHeaders), 'student/courses', [200, 403]);
    checkResponse(http.get(`${BASE_URL}/api/v1/student/results`, authHeaders), 'student/results', [200, 403]);
    checkResponse(http.get(`${BASE_URL}/api/v1/student/submissions`, authHeaders), 'student/submissions', [200, 403]);
  }

  checkResponse(http.get(`${BASE_URL}/api/v1/health`), 'health check');
  sleep(1);
}