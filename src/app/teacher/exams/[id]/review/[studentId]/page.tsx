import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { MOCK_SUBMISSIONS, MOCK_EXAMS } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { Save, MessageSquareWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function StudentAnswerReviewPage({ params }: { params: { id: string; studentId: string } }) {
  const submission = MOCK_SUBMISSIONS.find(s => s.id === params.studentId);
  const exam = MOCK_EXAMS.find(e => e.id === params.id);

  if (!submission || !exam) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <PageHeader title="Submission not found" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title={`Review: ${submission.studentName}`}
        description={`Viewing submission for ${exam.title}.`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Student's Answer</CardTitle>
            <CardDescription>Question 1: What is a Binary Search Tree?</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none rounded-md border p-4"
              dangerouslySetInnerHTML={{ __html: submission.feedback.highlightedAnswer }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Model Answer & Rubric</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Model Answer</h3>
              <p className="text-sm text-muted-foreground">{submission.modelAnswer}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold">Rubric</h3>
              <p className="text-sm text-muted-foreground">{submission.rubric}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI-Generated Feedback</CardTitle>
          <div className="flex items-center gap-4 pt-2">
            <Badge>Score: {submission.score}%</Badge>
            <p className="flex items-center text-sm text-amber-600">
              <MessageSquareWarning className="mr-2 h-4 w-4" />
              This feedback is AI-generated. Review and edit if necessary.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="feedback">Edit Feedback</Label>
              <Textarea id="feedback" defaultValue={submission.feedback.detailedFeedback} className="min-h-[120px]" />
            </div>
            <div>
              <Label htmlFor="score">Override Score</Label>
              <Input id="score" type="number" defaultValue={submission.score} className="w-32" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
