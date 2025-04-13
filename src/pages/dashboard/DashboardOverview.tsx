import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockJobs, mockInterviews } from '@/data/mockData';
import { FileText, CheckCheck, Clock, Users } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();

  // Calculate statistics
  const activeJobs = mockJobs.filter(job => job.status === 'active').length;
  const totalApplicants = mockJobs.reduce((total, job) => total + job.applicantCount, 0);
  
  // Get all interviews from mock data
  const allInterviews = Object.values(mockInterviews).flat();
  const pendingInterviews = allInterviews.filter(interview => interview.status === 'pending').length;
  const completedInterviews = allInterviews.filter(interview => interview.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your InterviewAI recruiter dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Jobs
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeJobs > 0 ? 'Currently accepting applications' : 'No active jobs'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalApplicants > 0 ? 'Across all job postings' : 'No applicants yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Interviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingInterviews > 0 ? 'Scheduled and waiting' : 'No pending interviews'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Interviews
            </CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedInterviews > 0 ? 'Interviews with results' : 'No completed interviews'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Your most recently posted jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {mockJobs.slice(0, 6).map((job) => (
              <div key={job.id} className="flex flex-col justify-between border rounded-lg p-4 h-full">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {job.applicantCount} applicants
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {job.status === 'active' ? 'Active' : 'Closed'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-6"
            onClick={() => navigate('/dashboard/jobs')}
          >
            View All Jobs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
