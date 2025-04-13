
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User, Mail, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockJobs, getInterviewsByJobAndStatus } from '@/data/mockData';
import { Interview } from '@/types';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  
  // Find job details
  const job = mockJobs.find(j => j.id === jobId);
  
  // Get interviews based on active tab
  const pendingInterviews = getInterviewsByJobAndStatus(jobId || '', 'pending');
  const completedInterviews = getInterviewsByJobAndStatus(jobId || '', 'completed');

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Button onClick={() => navigate('/dashboard/jobs')}>Return to Jobs List</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  const renderInterviewTable = (interviews: Interview[]) => {
    if (interviews.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No interviews in this category yet.</p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Scheduled For</TableHead>
            {activeTab === 'completed' && (
              <>
                <TableHead>Score</TableHead>
                <TableHead>Completion Date</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id}>
              <TableCell className="font-medium">{interview.candidateName}</TableCell>
              <TableCell>{interview.candidateEmail}</TableCell>
              <TableCell>{interview.scheduledFor ? formatDateTime(interview.scheduledFor) : '-'}</TableCell>
              {activeTab === 'completed' && (
                <>
                  <TableCell>
                    <Badge className={
                      cn(
                        (interview.score && interview.score >= 80) ? 'bg-green-100 text-green-800' :
                        (interview.score && interview.score >= 60) ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )
                    }>
                      {interview.score}%
                    </Badge>
                  </TableCell>
                  <TableCell>{interview.completedAt ? formatDateTime(interview.completedAt) : '-'}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/jobs')} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <div className="flex items-center mt-2">
              <Badge className={cn("mr-2", getStatusColor(job.status))}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Posted on {format(new Date(job.createdAt), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="mt-1 text-muted-foreground">{job.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-interviewai-green" />
              <div>
                <p className="text-sm font-medium">Deadline</p>
                <p className="text-sm text-muted-foreground">{format(new Date(job.deadline), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-interviewai-green" />
              <div>
                <p className="text-sm font-medium">Total Applicants</p>
                <p className="text-sm text-muted-foreground">{job.applicantCount}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-interviewai-green" />
              <div>
                <p className="text-sm font-medium">Total Interviews</p>
                <p className="text-sm text-muted-foreground">{job.pendingInterviewsCount + job.completedInterviewsCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interviews</CardTitle>
          <CardDescription>
            View and manage interviews for this job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>Pending ({pendingInterviews.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4" />
                <span>Completed ({completedInterviews.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {renderInterviewTable(pendingInterviews)}
            </TabsContent>
            
            <TabsContent value="completed">
              {renderInterviewTable(completedInterviews)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailPage;