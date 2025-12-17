"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { FileCheck2, Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import { FILE_UPLOAD, MESSAGES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { FileRejection } from "react-dropzone";


interface Exam {
  id: string;
  title: string;
  description: string | null;
  type: string;
  createdAt: string;
}

export default function UploadSubmissionsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/v1/teacher/exams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Handle new response structure: { exams: [...], availableCourses: [...] }
          const examsData = data.data?.exams || data.data || [];
          setExams(Array.isArray(examsData) ? examsData : []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
  }, []);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);
  try {
    if (!selectedExamId) throw new Error("Please select an exam");
    if (!files.length) throw new Error("Please upload at least one PDF");
    
    // Validate all files are PDFs
    const nonPdfFiles = files.filter(file => file.type !== FILE_UPLOAD.ALLOWED_TYPES.PDF);
    if (nonPdfFiles.length > 0) {
      const fileNames = nonPdfFiles.map(f => f.name).join(', ');
      throw new Error(`${MESSAGES.UPLOAD.INVALID_TYPE}. Please remove: ${fileNames}`);
    }
    
    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > FILE_UPLOAD.MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join(', ');
      throw new Error(`${MESSAGES.UPLOAD.FILE_TOO_LARGE}. Please remove: ${fileNames}`);
    }

    const formData = new FormData();
    formData.append("examId", selectedExamId);
    formData.append("autoExtract", "true"); // Always auto-extract from filename
    files.forEach((f) => formData.append("files", f));

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    const res = await fetch("/api/v1/teacher/student-submission", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      // Handle backend validation/upload errors
      throw new Error(data.error || data.message || "Upload failed");
    }
    
    // Handle backend validation errors
    const backendErrors = data.data?.errors || [];
    if (backendErrors.length > 0) {
      // Create FileRejection objects from backend errors
      const newRejectedFiles: FileRejection[] = [];
      const validFiles: File[] = [];
      const erroredFileNames = new Set(backendErrors.map((e: any) => e.filename));
      
      // Separate valid and invalid files
      files.forEach(file => {
        if (erroredFileNames.has(file.name)) {
          const error = backendErrors.find((e: any) => e.filename === file.name);
          newRejectedFiles.push({
            file,
            errors: [{ 
              code: 'backend-validation', 
              message: error?.error || 'Validation failed' 
            }]
          });
        } else {
          validFiles.push(file);
        }
      });
      
      // Update files and rejected files
      setFiles(validFiles);
      setRejectedFiles(prev => [...prev, ...newRejectedFiles]);
      
      // Show error message
      const errorMessages = backendErrors.map((e: any) => {
        // Extract student ID from error message or filename
        const errorMsg = e.error || '';
        const studentId = errorMsg.includes(':') 
          ? errorMsg.split(':')[1].trim() 
          : e.filename.replace(/\.pdf$/i, '');
        return `Student ID not found: ${studentId} (${e.filename})`;
      }).join('\n');
      
      setError(`Validation failed. Please fix all errors before uploading:\n${errorMessages}`);
      return;
    }
    
    // Get exam title for success message
    const selectedExam = exams.find(exam => exam.id === selectedExamId);
    const examTitle = selectedExam?.title || "the exam";
    const uploadedCount = data.data?.uploaded || 0;

    // Show success toast
    toast({
      title: "Upload Successful!",
      description: `Successfully uploaded ${uploadedCount} student ${uploadedCount === 1 ? 'submission' : 'submissions'} for ${examTitle}.`,
    });

    // Redirect after a short delay so user can see the success message
    setTimeout(() => {  window.location.href = "/teacher/exams";
    }, 2000);
 
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error occurred");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Upload Student Submissions" description="Select an exam and upload student answer sheets for grading." />

      <form onSubmit={handleSubmit} className="grid gap-6">
        {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive whitespace-pre-wrap">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid max-w-md gap-2">
              <Label htmlFor="exam-selection">Select Exam</Label>
              <Select value={selectedExamId} onValueChange={setSelectedExamId} required>
                <SelectTrigger id="exam-selection">
                  <SelectValue placeholder="Choose an exam..." />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Upload Student Answer Sheets</Label>
              <FileUpload 
                maxFiles={FILE_UPLOAD.MAX_STUDENT_SUBMISSIONS} 
                maxSize={FILE_UPLOAD.MAX_FILE_SIZE}
                value={files} 
                onFilesChange={setFiles}
                rejectedFiles={rejectedFiles}
                onRejectedFilesChange={setRejectedFiles}
              />
              <p className="text-xs text-muted-foreground">
                Name files as: <code className="rounded bg-muted px-1 py-0.5">{"{"}student_user_id{"}"}.pdf</code>
              </p>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" type="submit" disabled={isSubmitting || !selectedExamId || !files.length}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <FileCheck2 className="mr-2 h-4 w-4" /> Submit for Grading
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
