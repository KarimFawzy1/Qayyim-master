"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, FileWarning } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getStudentResults } from "@/services/studentResultService";
import { StudentResultsResponse } from "@/types/student-results";

export default function StudentDashboard() {
    const [data, setData] = useState<StudentResultsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const results = await getStudentResults();
                console.log(results);
                setData(results);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <PageHeader
                    title="Student Dashboard"
                    description="Welcome! Here's an overview of your progress."
                />
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <PageHeader
                    title="Student Dashboard"
                    description="Welcome! Here's an overview of your progress."
                />
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-destructive">Error loading results: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <PageHeader
                    title="Student Dashboard"
                    description="Welcome! Here's an overview of your progress."
                />
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">No data available</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <PageHeader
                title="Student Dashboard"
                description="Welcome! Here's an overview of your progress."
            >
                <Button variant="outline" asChild>
                    <Link href="/student/results">
                        <FileText className="mr-2 h-4 w-4" />
                        View All Results
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/student/grievance">
                        <FileWarning className="mr-2 h-4 w-4" />
                        Submit Grievance
                    </Link>
                </Button>
            </PageHeader>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.statistics.totalExamsTaken}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.statistics.averageScore}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.statistics.pendingGrading}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Score Trend</CardTitle>
                        <CardDescription>Your performance over recent assessments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.scoreData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.scoreData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                            }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="marks" stroke="hsl(var(--primary))" name="Marks" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px]">
                                <p className="text-muted-foreground">No score data available yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Recently Graded</CardTitle>
                        <CardDescription>Your latest graded assignments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.recentlyGraded.length > 0 ? (
                            data.recentlyGraded.map((submission) => (
                                <div key={submission.id} className="flex items-center justify-between rounded-md border p-4">
                                    <div>
                                        <p className="font-medium">{submission.examTitle}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Score: {submission.marks ?? 'N/A'} • {submission.gradedAt ? new Date(submission.gradedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <Button asChild size="sm">
                                        <Link href={`/student/results/${submission.examId}`}>View Details</Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <p className="text-muted-foreground">No graded assignments yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}