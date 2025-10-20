"use client"
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
import { MOCK_EXAMS } from "@/lib/mock-data";

const scoreData = [
    { name: 'Quiz 1', score: 85 },
    { name: 'Midterm', score: 78 },
    { name: 'Quiz 2', score: 92 },
    { name: 'Final', score: 88 },
];

export default function StudentDashboard() {
  const recentExams = MOCK_EXAMS.slice(0, 2);

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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Average Score Trend</CardTitle>
                <CardDescription>Your performance over the last few assessments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreData}>
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
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" name="Score (%)" />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recently Graded</CardTitle>
                <CardDescription>Your latest graded assignments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentExams.map(exam => (
                    <div key={exam.id} className="flex items-center justify-between rounded-md border p-4">
                        <div>
                            <p className="font-medium">{exam.title}</p>
                            <p className="text-sm text-muted-foreground">{exam.course}</p>
                        </div>
                        <Button asChild size="sm">
                            <Link href={`/student/results/${exam.id}`}>View Details</Link>
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
