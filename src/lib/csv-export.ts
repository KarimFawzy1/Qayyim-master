import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs/promises';

export interface ExamResult {
  studentName: string;
  studentId: string;
  studentEmail: string;
  marks: number;
  matchPercentage: number;
  feedback: string;
  status: string;
  submittedAt: string;
  gradedAt?: string;
}

export async function generateResultsCSV(examTitle: string, results: ExamResult[]): Promise<Buffer> {
  const fileName = `${examTitle.replace(/[^a-z0-9]/gi, '_')}_results_${Date.now()}.csv`;
  const filePath = path.join(process.cwd(), 'tmp', fileName);
  
  // Ensure tmp directory exists
  await fs.mkdir(path.join(process.cwd(), 'tmp'), { recursive: true });
  
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'studentName', title: 'Student Name' },
      { id: 'studentId', title: 'Student ID' },
      { id: 'studentEmail', title: 'Email' },
      { id: 'marks', title: 'Marks' },
      { id: 'matchPercentage', title: 'Match Percentage (%)' },
      { id: 'feedback', title: 'Feedback' },
      { id: 'status', title: 'Status' },
      { id: 'submittedAt', title: 'Submitted At' },
      { id: 'gradedAt', title: 'Graded At' },
    ]
  });
  
  await csvWriter.writeRecords(results);
  
  const buffer = await fs.readFile(filePath);
  
  // Clean up temp file
  await fs.unlink(filePath);
  
  return buffer;
}

