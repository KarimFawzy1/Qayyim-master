import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { MOCK_EXAMS, MOCK_SUBMISSIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function StudentResultsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title="My Results"
        description="Here are your grades for all completed exams."
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Feedback Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EXAMS.map((exam) => {
                const submission = MOCK_SUBMISSIONS.find(s => s.examId === exam.id);
                const grade = submission ? `${submission.score}%` : 'N/A';
                const feedbackStatus = submission ? 'Reviewed' : 'Pending';

                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{exam.course}</TableCell>
                    <TableCell>
                      <Badge variant={submission && submission.score > 80 ? "default" : "secondary"}>{grade}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{feedbackStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" asChild>
                         <Link href={`/student/results/${exam.id}`}>
                           <Eye className="mr-2 h-4 w-4" />
                           View Details
                         </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
