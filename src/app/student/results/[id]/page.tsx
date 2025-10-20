import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { MOCK_SUBMISSIONS, MOCK_EXAMS } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, AlertTriangle, MessageCircle } from "lucide-react";
import Link from "next/link";


export default function DetailedFeedbackPage({ params }: { params: { id: string } }) {
  const submission = MOCK_SUBMISSIONS.find(s => s.examId === params.id);
  const exam = MOCK_EXAMS.find(e => e.id === params.id);

  if (!submission || !exam) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <PageHeader title="Result not found" />
      </div>
    );
  }

  const questions = [
    {
      id: 1,
      question: "What is a Binary Search Tree?",
      studentAnswer: submission.originalAnswer,
      modelAnswer: submission.modelAnswer,
      feedback: submission.feedback.detailedFeedback,
      score: 8,
      maxScore: 10,
      isCorrect: false,
    },
    {
      id: 2,
      question: "What is the time complexity of bubble sort?",
      studentAnswer: "O(n^2)",
      modelAnswer: "O(n^2) in the average and worst case.",
      feedback: "Correct. You've identified the time complexity accurately.",
      score: 10,
      maxScore: 10,
      isCorrect: true,
    }
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title={`Feedback: ${exam.title}`}
        description={`Your final score is ${submission.score}%. Review the detailed feedback below.`}
      >
        <Button asChild>
            <Link href="/student/grievance">
                <MessageCircle className="mr-2 h-4 w-4" />
                Have a concern?
            </Link>
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Question-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {questions.map((q, index) => (
                    <AccordionItem value={`item-${index}`} key={q.id}>
                        <AccordionTrigger>
                           <div className="flex w-full items-center justify-between pr-4">
                               <div className="flex items-center gap-2">
                                    {q.isCorrect ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                                    <span>Question {q.id}: {q.question}</span>
                               </div>
                               <span className="font-bold">{q.score}/{q.maxScore}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div>
                                <h4 className="font-semibold">Your Answer:</h4>
                                <p className="text-muted-foreground">{q.studentAnswer}</p>
                            </div>
                            <Separator />
                             <div>
                                <h4 className="font-semibold">Model Answer:</h4>
                                <p className="text-muted-foreground">{q.modelAnswer}</p>
                            </div>
                            <Separator />
                            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                                <h4 className="flex items-center font-semibold text-yellow-800 dark:text-yellow-300">
                                    <AlertTriangle className="mr-2 h-4 w-4"/>
                                    Feedback
                                </h4>
                                <p className="text-yellow-700 dark:text-yellow-400">{q.feedback}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
