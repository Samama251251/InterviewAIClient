import { use, useState } from 'react';
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
import { FileText, CheckCheck, Clock, Users, Server, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getIntervieweeJobs } from '@/services/api/interviewee';
interface AuthStatus {
  message?: string;
  error?: string;
  status?: number;
  user?: {
    id: string;
    email: string;
    name?: string;
    emailVerified?: boolean;
  };
}
const DashboardOverview = () => {
  const navigate = useNavigate();
  const {data, isError, isSuccess} = useQuery({
    queryKey: ["jobs"],
    queryFn: getIntervieweeJobs
  })
  console.log("this is the data from the getJobs api", data)
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

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

  const checkServerStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/', {
        credentials: 'include', // This sends cookies with session data
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setServerMessage(data.message);
    } catch (error) {
      setServerMessage('Error connecting to server');
      console.error('Error fetching server status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      setAuthLoading(true);
      const response = await fetch('http://localhost:5000/api/protected', {
        credentials: 'include', // This sends cookies with session data
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthStatus(data);
      } else {
        setAuthStatus({ error: 'Not authenticated', status: response.status });
      }
    } catch (error) {
      setAuthStatus({ error: 'Error checking authentication status' });
      console.error('Error checking auth status:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your InterviewAI recruiter dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Active Jobs
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeJobs > 0 ? 'Currently accepting applications' : 'No active jobs'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Applicants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalApplicants > 0 ? 'Across all job postings' : 'No applicants yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Pending Interviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingInterviews > 0 ? 'Scheduled and waiting' : 'No pending interviews'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Completed Interviews
            </CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedInterviews > 0 ? 'Interviews with results' : 'No completed interviews'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Server Status</CardTitle>
              <CardDescription className="text-muted-foreground">Check the server connection</CardDescription>
            </div>
            <Server className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={checkServerStatus} 
              disabled={isLoading}
              className="hover:bg-primary/90 transition-colors duration-300"
            >
              {isLoading ? 'Checking...' : 'Check Server Status'}
            </Button>
            {serverMessage && (
              <div className="p-4 bg-muted rounded-md border border-border">
                <p className="text-sm break-words text-foreground">{serverMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Authentication Status</CardTitle>
              <CardDescription className="text-muted-foreground">Check if you're authenticated</CardDescription>
            </div>
            <Lock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={checkAuthStatus} 
              disabled={authLoading}
              variant="outline"
              className="hover:bg-primary/5 transition-colors duration-300"
            >
              {authLoading ? 'Checking...' : 'Check Authentication'}
            </Button>
            {authStatus && (
              <div className={`p-4 rounded-md border ${authStatus.error ? 'bg-destructive/10 border-destructive/50 text-destructive-foreground' : 'bg-primary/10 border-primary/50 text-primary-foreground'}`}>
                {authStatus.error ? (
                  <p className="text-sm">{authStatus.error}</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{authStatus.message}</p>
                    {authStatus.user && (
                      <div className="text-xs space-y-1">
                        <p>User ID: {authStatus.user.id}</p>
                        <p>Email: {authStatus.user.email}</p>
                        {authStatus.user.name && <p>Name: {authStatus.user.name}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-foreground">Job Applications Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
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
                  <Bar dataKey="applicants" fill="hsl(var(--primary))" name="Applicants" />
                  <Bar dataKey="pending" fill="hsl(var(--secondary))" name="Pending Interviews" />
                  <Bar dataKey="completed" fill="hsl(var(--accent))" name="Completed Interviews" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Jobs</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your most recently posted jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="flex justify-between items-center p-2 rounded-md hover:bg-primary/5 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.applicantCount} applicants
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                    className="hover:bg-primary/5 transition-colors duration-300"
                  >
                    View
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4 hover:bg-primary/5 transition-colors duration-300"
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
