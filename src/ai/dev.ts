import { config } from 'dotenv';
config();

import '@/ai/flows/grade-student-answer.ts';
import '@/ai/flows/respond-to-student-grievance.ts';
import '@/ai/flows/summarize-student-performance.ts';
import '@/ai/flows/provide-feedback-on-answer.ts';