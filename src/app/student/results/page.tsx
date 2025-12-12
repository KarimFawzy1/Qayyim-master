"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getAllSubmissions } from "@/services/studentResultService";
import { SubmissionResult } from "@/types/student-results";

export default function StudentResultsPage() {
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllSubmissions();
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <PageHeader
              title="My Results"
              description="Here are your grades for all completed exams."
          />
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading your results...</p>
              </div>
            </CardContent>
          </Card>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <PageHeader
              title="My Results"
              description="Here are your grades for all completed exams."
          />
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">Error loading results: {error}</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <PageHeader
            title="My Results"
            description="Here are your grades for all completed exams."
        />
        <Card>
          <CardContent className="pt-6">
            {submissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.examTitle}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{submission.examType.replace('_', ' ')}</Badge>
                          </TableCell>
                          <TableCell>
                            {submission.marks !== null ? (
                                <Badge variant={submission.marks > 80 ? "default" : "secondary"}>
                                  {submission.marks}
                                </Badge>
                            ) : (
                                <Badge variant="secondary">N/A</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={submission.status === 'GRADED' ? 'default' : 'outline'}>
                              {submission.status === 'GRADED' ? 'Graded' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/student/results/${submission.examId}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">No submissions found</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}