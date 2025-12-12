"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, AlertTriangle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getSubmissionDetail } from "@/services/studentResultService";
import { SubmissionDetail } from "@/types/student-results";

export default function DetailedFeedbackPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<SubmissionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSubmissionDetail() {
            try {
                setLoading(true);
                setError(null);
                const result = await getSubmissionDetail(params.id);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchSubmissionDetail();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <PageHeader title="Loading..." />
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center h-64">
                            <p className="text-muted-foreground">Loading submission details...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <PageHeader title="Error" />
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-destructive">Error: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <PageHeader title="Result not found" />
            </div>
        );
    }

    const { submission, exam } = data;

    // Parse originalAnswers if it's a JSON structure
    const answers = Array.isArray(submission.originalAnswers)
        ? submission.originalAnswers
        : typeof submission.originalAnswers === 'object'
            ? Object.values(submission.originalAnswers)
            : [];

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <PageHeader
                title={`Feedback: ${exam.title}`}
                description={
                    submission.marks !== null
                        ? `Your score is ${submission.marks}${exam.totalMarks ? `/${exam.totalMarks}` : ''}. Review the detailed feedback below.`
                        : 'Your submission is pending grading.'
                }
            >
                <Button asChild>
                    <Link href="/student/grievance">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Have a concern?
                    </Link>
                </Button>
            </PageHeader>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Exam Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-semibold">Title: </span>
                            <span className="text-muted-foreground">{exam.title}</span>
                        </div>
                        {exam.description && (
                            <div>
                                <span className="font-semibold">Description: </span>
                                <span className="text-muted-foreground">{exam.description}</span>
                            </div>
                        )}
                        <div>
                            <span className="font-semibold">Type: </span>
                            <span className="text-muted-foreground">{exam.type.replace('_', ' ')}</span>
                        </div>
                        {exam.duration && (
                            <div>
                                <span className="font-semibold">Duration: </span>
                                <span className="text-muted-foreground">{exam.duration} minutes</span>
                            </div>
                        )}
                        {exam.totalMarks && (
                            <div>
                                <span className="font-semibold">Total Marks: </span>
                                <span className="text-muted-foreground">{exam.totalMarks}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Submission Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-semibold">Status: </span>
                            <span className="text-muted-foreground">{submission.status}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Score: </span>
                            <span className="text-muted-foreground">
                {submission.marks !== null ? submission.marks : 'Pending'}
              </span>
                        </div>
                        <div>
                            <span className="font-semibold">Submitted: </span>
                            <span className="text-muted-foreground">
                {new Date(submission.submittedAt).toLocaleString()}
              </span>
                        </div>
                        {submission.gradedAt && (
                            <div>
                                <span className="font-semibold">Graded: </span>
                                <span className="text-muted-foreground">
                  {new Date(submission.gradedAt).toLocaleString()}
                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {submission.feedback && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Overall Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                            <h4 className="flex items-center font-semibold text-yellow-800 dark:text-yellow-300">
                                <AlertTriangle className="mr-2 h-4 w-4"/>
                                Instructor Feedback
                            </h4>
                            <p className="mt-2 text-yellow-700 dark:text-yellow-400 whitespace-pre-wrap">
                                {submission.feedback}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {answers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Answers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {answers.map((item: any, index: number) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex w-full items-center justify-between pr-4">
                                            <div className="flex items-center gap-2">
                                                <span>Question {index + 1}</span>
                                            </div>
                                            {item.points !== undefined && (
                                                <span className="font-bold">{item.points} points</span>
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-2">
                                        <div>
                                            <h4 className="font-semibold">Your Answer:</h4>
                                            <p className="text-muted-foreground whitespace-pre-wrap">
                                                {item.answer || 'No answer provided'}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            {exam.modelAnswer && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Model Answer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{exam.modelAnswer}</p>
                    </CardContent>
                </Card>
            )}

            {exam.rubric && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Grading Rubric</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{exam.rubric}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}