import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_JOBS } from './mockData';
import { Job } from '../../types';

// Types
interface ChartData {
  name: string;
  applicants: number;
  pending: number;
  completed: number;
}

const Overview: React.FC = () => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      setJobsData(MOCK_JOBS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Derived stats
  const activeJobs = jobsData?.filter(job => job.status === 'active').length || 0;
  const totalApplicants = jobsData?.reduce((sum, job) => sum + job.applicants_count, 0) || 0;
  const pendingInterviews = jobsData?.reduce((sum, job) => sum + job.pending_count, 0) || 0;
  const completedInterviews = jobsData?.reduce((sum, job) => sum + job.completed_count, 0) || 0;

  // Chart data for top 3 jobs
  const chartData: ChartData[] = jobsData 
    ? jobsData
      .filter(job => job.status === 'active')
      .slice(0, 3)
      .map(job => ({
        name: job.title,
        applicants: job.applicants_count,
        pending: job.pending_count,
        completed: job.completed_count
      }))
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to your InterviewAI recruiter dashboard.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Active Jobs</h2>
            <span className="text-blue-500">
              <i className="fas fa-file-alt"></i>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">{activeJobs}</p>
          <p className="mt-2 text-sm text-gray-500">Currently accepting applications</p>
        </div>

        {/* Total Applicants */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Total Applicants</h2>
            <span className="text-green-500">
              <i className="fas fa-users"></i>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">{totalApplicants}</p>
          <p className="mt-2 text-sm text-gray-500">Across all job postings</p>
        </div>

        {/* Pending Interviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Pending Interviews</h2>
            <span className="text-yellow-500">
              <i className="fas fa-clock"></i>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">{pendingInterviews}</p>
          <p className="mt-2 text-sm text-gray-500">Scheduled and waiting</p>
        </div>

        {/* Completed Interviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Completed Interviews</h2>
            <span className="text-purple-500">
              <i className="fas fa-check-circle"></i>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">{completedInterviews}</p>
          <p className="mt-2 text-sm text-gray-500">Interviews with results</p>
        </div>
      </div>

      {/* Charts and Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Job Applications Overview Chart */}
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <h2 className="text-lg font-semibold text-gray-700">Job Applications Overview</h2>
          <p className="text-sm text-gray-500">Applicants and interview status for your active jobs</p>
          
          <div className="mt-6 h-64">
            {/* Chart would go here - using a placeholder for now */}
            <div className="h-full flex items-center justify-center">
              <div className="space-y-8 w-full">
                {chartData.map((job, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">{job.name}</span>
                    </div>
                    <div className="flex space-x-1 h-8">
                      <div 
                        className="bg-green-500 h-full rounded-l" 
                        style={{ width: `${(job.applicants / (job.applicants + 4)) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-blue-400 h-full" 
                        style={{ width: `${(job.pending / (job.applicants + 4)) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-purple-400 h-full rounded-r" 
                        style={{ width: `${(job.completed / (job.applicants + 4)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex text-xs">
                      <span className="text-green-500 font-medium">Applicants: {job.applicants}</span>
                      <span className="mx-4 text-blue-400 font-medium">Pending: {job.pending}</span>
                      <span className="text-purple-400 font-medium">Completed: {job.completed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Recent Jobs</h2>
          <p className="text-sm text-gray-500">Your most recently posted jobs</p>
          
          {isLoading ? (
            <div className="mt-6 flex justify-center">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {jobsData?.slice(0, 3).map((job) => (
                <div key={job.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium text-gray-800">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.applicants_count} applicants</p>
                  <Link 
                    to={`/dashboard/jobs/${job.id}`} 
                    className="mt-2 inline-block text-sm text-green-500 hover:text-green-600"
                  >
                    View
                  </Link>
                </div>
              ))}
              
              <Link 
                to="/dashboard/jobs" 
                className="mt-4 inline-block text-sm font-medium text-green-500 hover:text-green-600"
              >
                View All Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;