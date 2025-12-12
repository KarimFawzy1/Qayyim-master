"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateExamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [courseTopic, setCourseTopic] = useState("");
  const [examType, setExamType] = useState<string>("");
  const [deadline, setDeadline] = useState("");
  const [rubricText, setRubricText] = useState("");
  const [modelAnswerFiles, setModelAnswerFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!title.trim()) {
        throw new Error("Exam title is required");
      }
      if (!courseTopic.trim()) {
        throw new Error("Course/Topic is required");
      }
      if (!examType) {
        throw new Error("Exam type is required");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseTopic", courseTopic);
      formData.append("examType", examType);
      
      if (deadline) {
        formData.append("deadline", deadline);
      }
      
      if (rubricText.trim()) {
        formData.append("rubricText", rubricText);
      }
      
      // Add model answer file (only first file if multiple)
      if (modelAnswerFiles.length > 0) {
        formData.append("modelAnswerFile", modelAnswerFiles[0]);
      }

      // Get token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not logged in');
    }

    // Submit to API with Authorization header
    const response = await fetch("/api/v1/teacher/exams", { 
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include',
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create exam");
      }

      // Show success toast
      toast({
        title: "Exam Created Successfully!",
        description: `Exam "${title}" has been created successfully.`,
      });

      // Redirect after a short delay so user can see the success message
      setTimeout(() => {
        router.push("/teacher/exams");
        router.refresh();
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title="Create New Exam"
        description="Fill out the details below to create a new exam."
      />
      
      <form onSubmit={handleSubmit} className="grid gap-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="exam-title">Exam Title</Label>
              <Input 
                id="exam-title" 
                placeholder="e.g., Data Structures Midterm" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Course/Topic</Label>
              <Input 
                id="course" 
                placeholder="e.g., Algorithms, CS101" 
                value={courseTopic}
                onChange={(e) => setCourseTopic(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-type">Exam Type</Label>
              <Select value={examType} onValueChange={setExamType} required>
                <SelectTrigger id="exam-type">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                  <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                  <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                  <SelectItem value="MIXED">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Model Answers & Rubric</CardTitle>
            <CardDescription>Provide the correct answers and grading criteria.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label>Upload Model Answers (PDF)</Label>
              <FileUpload 
                maxFiles={1}
                onFilesChange={setModelAnswerFiles}
                value={modelAnswerFiles}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rubric">Or, enter rubric manually</Label>
              <Textarea 
                id="rubric" 
                placeholder="Describe the grading rubric..." 
                className="min-h-[150px]" 
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild type="button">
            <Link href="/teacher/exams">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Exam"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}