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

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/v1/teacher/exams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setExams(data.data || []);
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
      // Handle backend validation errors
      if (data.data?.errors && Array.isArray(data.data.errors)) {
        const errorMessages = data.data.errors.map((e: any) => `${e.filename}: ${e.error}`).join('\n');
        throw new Error(`Upload errors:\n${errorMessages}`);
      }
      throw new Error(data.error || data.message || "Upload failed");
    }
    
    // Get exam title for success message
    const selectedExam = exams.find(exam => exam.id === selectedExamId);
    const examTitle = selectedExam?.title || "the exam";
    const uploadedCount = data.data?.uploaded || 0;
    const failedCount = data.data?.failed || 0;

    // Show success toast (even if some files failed)
    if (uploadedCount > 0) {
      if (failedCount > 0) {
        // Partial success
        toast({
          title: "Partial Upload Success",
          description: `Successfully uploaded ${uploadedCount} student ${uploadedCount === 1 ? 'submission' : 'submissions'} for ${examTitle}. ${failedCount} file${failedCount === 1 ? '' : 's'} failed.`,
        });
      } else {
        // Full success
        toast({
          title: "Upload Successful!",
          description: `Successfully uploaded ${uploadedCount} student ${uploadedCount === 1 ? 'submission' : 'submissions'} for ${examTitle}.`,
        });
      }
    } else {
      // All files failed
      if (data.data?.errors && Array.isArray(data.data.errors)) {
        const errorMessages = data.data.errors.map((e: any) => `${e.filename}: ${e.error}`).join('\n');
        throw new Error(`All files failed to upload:\n${errorMessages}`);
      }
      throw new Error("All files failed to upload");
    }

    // Redirect after a short delay so user can see the success message
         window.location.href = "/teacher/exams";
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
        {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

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
