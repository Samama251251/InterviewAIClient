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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  
  // Data for bar chart (jobs and applicant count)
  const chartData = mockJobs
    .filter(job => job.status === 'active')
    .slice(0, 4)
    .map(job => ({
      name: job.title.length > 15 ? `${job.title.substring(0, 15)}...` : job.title,
      applicants: job.applicantCount,
      pending: job.pendingInterviewsCount,
      completed: job.completedInterviewsCount,
    }));

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

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Job Applications Overview</CardTitle>
            <CardDescription>
              Applicants and interview status for your active jobs
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#10b981" name="Applicants" />
                  <Bar dataKey="pending" fill="#93c5fd" name="Pending Interviews" />
                  <Bar dataKey="completed" fill="#6366f1" name="Completed Interviews" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>
              Your most recently posted jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.applicantCount} applicants
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/dashboard/jobs')}
              >
                View All Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
