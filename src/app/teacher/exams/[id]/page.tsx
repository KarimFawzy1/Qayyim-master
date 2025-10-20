import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, SlidersHorizontal, Eye } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { MOCK_EXAMS, MOCK_SUBMISSIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function GradingResultsPage({ params }: { params: { id: string } }) {
  const exam = MOCK_EXAMS.find(e => e.id === params.id);
  const submissions = MOCK_SUBMISSIONS.filter(s => s.examId === params.id);

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
        title={`Results: ${exam.title}`}
        description={`Showing ${submissions.length} of ${exam.totalSubmissions} submissions.`}
      >
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Passed</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Failed</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Grades
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>% Match</TableHead>
                <TableHead>Feedback Summary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.studentName} ({sub.studentId})</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{sub.score}%</span>
                      <Progress value={sub.score} className="h-2 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>{sub.matchPercentage}%</TableCell>
                  <TableCell className="max-w-xs truncate">{sub.feedbackSummary}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/teacher/exams/${exam.id}/review/${sub.id}`}>
                            <Eye className="h-4 w-4"/>
                            <span className="sr-only">Detailed View</span>
                        </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
