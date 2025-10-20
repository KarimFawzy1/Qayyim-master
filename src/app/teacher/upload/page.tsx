import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { MOCK_EXAMS } from "@/lib/mock-data";
import { FileCheck2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/file-upload";

export default function UploadSubmissionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title="Upload Student Submissions"
        description="Select an exam and upload student answer sheets for grading."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Submission Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid max-w-md gap-2">
            <Label htmlFor="exam-selection">Select Exam</Label>
            <Select>
              <SelectTrigger id="exam-selection">
                <SelectValue placeholder="Choose an exam..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_EXAMS.map(exam => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Upload Student Answer Sheets</Label>
            <FileUpload maxFiles={50} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="auto-extract" />
            <Label htmlFor="auto-extract">Auto-extract names or IDs from file names</Label>
          </div>

        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button size="lg">
            <FileCheck2 className="mr-2 h-4 w-4" />
            Submit for Grading
        </Button>
      </div>
    </div>
  );
}
