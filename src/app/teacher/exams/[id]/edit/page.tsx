import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { UploadCloud } from "lucide-react";
import Link from "next/link";
import { MOCK_EXAMS } from "@/lib/mock-data";

export default function EditExamPage({ params }: { params: { id: string } }) {
  const exam = MOCK_EXAMS.find(e => e.id === params.id);

  if (!exam) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <PageHeader title="Exam not found" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title={`Edit Exam: ${exam.title}`}
        description="Update the details below to modify the exam."
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="exam-title">Exam Title</Label>
              <Input id="exam-title" defaultValue={exam.title} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Course/Topic</Label>
              <Input id="course" defaultValue={exam.course} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-type">Exam Type</Label>
              <Select defaultValue={exam.type}>
                <SelectTrigger id="exam-type">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                  <SelectItem value="True/False">True/False</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input id="deadline" type="date" defaultValue={exam.deadline} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Model Answers & Rubric</CardTitle>
            <CardDescription>Update the correct answers and grading criteria.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label>Upload Model Answers</Label>
              <div className="flex h-32 w-full items-center justify-center rounded-md border-2 border-dashed">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop files here, or click to browse.
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT</p>
                  <Input type="file" className="sr-only" />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rubric">Or, update rubric manually</Label>
              <Textarea id="rubric" placeholder="Describe the grading rubric..." className="min-h-[150px]" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/teacher/exams">Cancel</Link>
            </Button>
            <Button>Update Exam</Button>
        </div>
      </div>
    </div>
  );
}
