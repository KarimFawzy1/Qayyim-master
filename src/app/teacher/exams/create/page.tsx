"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { FileUpload } from "@/components/file-upload";

export default function CreateExamPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title="Create New Exam"
        description="Fill out the details below to create a new exam."
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="exam-title">Exam Title</Label>
              <Input id="exam-title" placeholder="e.g., Data Structures Midterm" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Course/Topic</Label>
              <Input id="course" placeholder="e.g., Algorithms, CS101" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-type">Exam Type</Label>
              <Select>
                <SelectTrigger id="exam-type">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input id="deadline" type="date" />
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
              <Label>Upload Model Answers</Label>
              <FileUpload />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rubric">Or, enter rubric manually</Label>
              <Textarea id="rubric" placeholder="Describe the grading rubric..." className="min-h-[150px]" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/teacher/exams">Cancel</Link>
            </Button>
            <Button>Create Exam</Button>
        </div>
      </div>
    </div>
  );
}
