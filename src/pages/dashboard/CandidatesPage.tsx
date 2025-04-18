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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all candidates across your job postings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>
            A list of all candidates who have applied to your job postings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Interviews</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Pending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueCandidates.map((candidate) => (
                <TableRow key={candidate.email}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.interviews.length}</TableCell>
                  <TableCell>
                    {candidate.interviews.filter(i => i.status === 'completed').length}
                  </TableCell>
                  <TableCell>
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
