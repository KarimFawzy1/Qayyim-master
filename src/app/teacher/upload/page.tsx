"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { FileCheck2, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";

// Remove all these dynamic imports ↑

interface Exam {
  id: string;
  title: string;
  description: string | null;
  type: string;
  createdAt: string;
}

export default function UploadSubmissionsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [autoExtract, setAutoExtract] = useState(true);
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

    const formData = new FormData();
    formData.append("examId", selectedExamId);
    formData.append("autoExtract", autoExtract.toString());
    files.forEach((f) => formData.append("files", f));

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    const res = await fetch("/api/v1/teacher/student-submission", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    // Hard redirect - bypasses React reconciliation
    router.push("/teacher/exams");
    router.refresh();  } catch (err) {
    setError(err instanceof Error ? err.message : "Error occurred");
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
              <FileUpload maxFiles={50} value={files} onFilesChange={setFiles} />
              <p className="text-xs text-muted-foreground">
                Name files as: <code className="rounded bg-muted px-1 py-0.5">{"{"}student_user_id{"}"}.pdf</code>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="auto-extract" checked={autoExtract} onCheckedChange={(c) => setAutoExtract(c as boolean)} />
              <Label htmlFor="auto-extract">Auto-extract student IDs from file names</Label>
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
