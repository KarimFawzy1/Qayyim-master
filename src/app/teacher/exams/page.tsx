import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Download, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { MOCK_EXAMS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function ExamManagementPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title="Exam Management"
        description="View, edit, and manage all your created exams."
      >
        <Button asChild>
          <Link href="/teacher/exams/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Exam
          </Link>
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download All Grades
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EXAMS.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.course}</TableCell>
                  <TableCell>{exam.gradedSubmissions} / {exam.totalSubmissions}</TableCell>
                  <TableCell>
                    {exam.gradedSubmissions < exam.totalSubmissions ? (
                       <Badge variant="secondary">Grading in Progress</Badge>
                    ) : (
                       <Badge>Completed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/teacher/exams/${exam.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Results
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/teacher/exams/${exam.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Exam
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Exam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
