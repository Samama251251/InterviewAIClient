import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockInterviews } from '@/data/mockData';

const CandidatesPage: React.FC = () => {
  // Get all unique candidates from all interviews
  const allInterviews = Object.values(mockInterviews).flat();
  const uniqueCandidates = Array.from(
    new Map(
      allInterviews.map(interview => [
        interview.candidateEmail,
        {
          name: interview.candidateName,
          email: interview.candidateEmail,
          interviews: allInterviews.filter(i => i.candidateEmail === interview.candidateEmail),
        }
      ])
    ).values()
  );

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Candidates</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all candidates across your job postings.
        </p>
      </div>

      <Card className="shadow-md border-border">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-xl text-foreground">All Candidates</CardTitle>
          <CardDescription className="text-muted-foreground">
            A list of all candidates who have applied to your job postings.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Total Interviews</TableHead>
                <TableHead className="font-medium">Completed</TableHead>
                <TableHead className="font-medium">Pending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueCandidates.map((candidate) => (
                <TableRow 
                  key={candidate.email} 
                  className="transition-colors hover:bg-primary/5"
                >
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell className="text-center">{candidate.interviews.length}</TableCell>
                  <TableCell className="text-center">
                    {candidate.interviews.filter(i => i.status === 'completed').length}
                  </TableCell>
                  <TableCell className="text-center">
                    {candidate.interviews.filter(i => i.status === 'pending').length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidatesPage;
