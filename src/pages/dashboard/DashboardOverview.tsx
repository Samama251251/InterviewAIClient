import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockJobs, mockInterviews } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, CheckCheck, Clock, Users, Server, Lock, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getIntervieweeJobs } from '@/services/api/interviewee';
import { motion } from 'framer-motion';

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
  });

  console.log("this is the data from the getJobs api", data);
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-base-content/70 mt-2">
          Welcome to your InterviewAI recruiter dashboard.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm">Active Jobs</h3>
              <FileText className="h-4 w-4 text-primary opacity-70" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs opacity-70 mt-1">
                {activeJobs > 0 ? 'Currently accepting applications' : 'No active jobs'}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm">Total Applicants</h3>
              <Users className="h-4 w-4 text-primary opacity-70" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{totalApplicants}</div>
              <p className="text-xs opacity-70 mt-1">
                {totalApplicants > 0 ? 'Across all job postings' : 'No applicants yet'}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm">Pending Interviews</h3>
              <Clock className="h-4 w-4 text-primary opacity-70" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{pendingInterviews}</div>
              <p className="text-xs opacity-70 mt-1">
                {pendingInterviews > 0 ? 'Scheduled and waiting' : 'No pending interviews'}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm">Completed Interviews</h3>
              <CheckCheck className="h-4 w-4 text-primary opacity-70" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{completedInterviews}</div>
              <p className="text-xs opacity-70 mt-1">
                {completedInterviews > 0 ? 'Interviews with results' : 'No completed interviews'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="card-title">Server Status</h3>
                <p className="text-sm opacity-70">Check the server connection</p>
              </div>
              <Server className="h-5 w-5 text-primary opacity-70" />
            </div>
            <div className="space-y-4 mt-4">
              <button 
                onClick={checkServerStatus} 
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 
                  <span className="loading loading-spinner loading-sm"></span> : 
                  'Check Server Status'
                }
              </button>
              {serverMessage && (
                <div className="p-4 bg-base-200 rounded-md border border-base-300">
                  <p className="text-sm break-words">{serverMessage}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="card-title">Authentication Status</h3>
                <p className="text-sm opacity-70">Check if you're authenticated</p>
              </div>
              <Lock className="h-5 w-5 text-primary opacity-70" />
            </div>
            <div className="space-y-4 mt-4">
              <button 
                onClick={checkAuthStatus} 
                disabled={authLoading}
                className="btn btn-outline"
              >
                {authLoading ? 
                  <span className="loading loading-spinner loading-sm"></span> : 
                  'Check Authentication'
                }
              </button>
              {authStatus && (
                <div className={`p-4 rounded-md border ${authStatus.error ? 'bg-error/10 border-error text-error' : 'bg-primary/10 border-primary text-primary'}`}>
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
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="card-body">
          <h3 className="card-title">Job Applications Overview</h3>
          <p className="text-sm opacity-70">
            Applicants and interview status for your active jobs
          </p>
          <div className="mt-4 pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="hsl(var(--p) / 0.8)" name="Applicants" />
                  <Bar dataKey="pending" fill="hsl(var(--s) / 0.8)" name="Pending" />
                  <Bar dataKey="completed" fill="hsl(var(--a) / 0.8)" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid gap-4 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="card-body">
            <h3 className="card-title">Recent Job Postings</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mockJobs.slice(0, 3).map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.applicantCount}</td>
                      <td>
                        <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-ghost btn-xs"
                          onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                        >
                          View
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/dashboard/jobs')}
              >
                View All Jobs
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="card-body">
            <h3 className="card-title">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/dashboard/jobs/new')}
              >
                Post New Job
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/dashboard/candidates')}
              >
                View Candidates
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/dashboard/settings')}
              >
                Account Settings
              </button>
              <button className="btn btn-outline">
                Generate Reports
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
