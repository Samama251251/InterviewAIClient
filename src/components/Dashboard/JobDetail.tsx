import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_JOBS, MOCK_CANDIDATES } from './mockData';
import { Job, Candidate } from '../../types';

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Find the job
      const foundJob = MOCK_JOBS.find(j => j.id === jobId) || null;
      setJob(foundJob);
      
      // Find candidates for this job
      const jobCandidates = MOCK_CANDIDATES.filter(c => c.job_id === jobId);
      setCandidates(jobCandidates);
      
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [jobId]);

  // Handle job status change
  const handleStatusChange = (newStatus: 'active' | 'closed' | 'draft') => {
    if (job) {
      // Update job status
      setJob({
        ...job,
        status: newStatus
      });

      // In a real app, you would make an API call here
    }
  };

  // Filter candidates based on active tab
  const filteredCandidates = candidates.filter(
    candidate => candidate.status === activeTab
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Job not found</h2>
        <p className="mt-2 text-gray-600">The job posting you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/jobs')}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Back to Job Postings
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Link 
        to="/dashboard/jobs" 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Job Postings
      </Link>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-2 text-gray-600">{job.field}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none">
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)} <i className="fas fa-chevron-down ml-1"></i>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
                <div className="py-1">
                  <button 
                    onClick={() => handleStatusChange('active')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Active
                  </button>
                  <button 
                    onClick={() => handleStatusChange('closed')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Closed
                  </button>
                  <button 
                    onClick={() => handleStatusChange('draft')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Draft
                  </button>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Edit Job
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-3">Job Description</h2>
            <p className="text-gray-600">{job.description}</p>
            
            <h2 className="text-lg font-medium text-gray-800 mt-6 mb-3">Interview Rounds</h2>
            <div className="flex flex-wrap gap-2">
              {job.interview_rounds.map((round, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {round === 'dsa' && 'DSA Coding Round'}
                  {round === 'techStack' && 'Tech Stack Round'}
                  {round === 'systemDesign' && 'System Design Round'}
                  {round === 'behavioral' && 'Behavioral Round'}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Job Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-36 text-sm text-gray-500">Deadline:</span>
                  <span className="text-sm font-medium">
                    {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-sm text-gray-500">Posted on:</span>
                  <span className="text-sm font-medium">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-sm text-gray-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-sm text-gray-500">Candidates:</span>
                  <span className="text-sm font-medium">{candidates.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Interviews
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed Interviews
            </button>
          </nav>
        </div>

        <div className="p-6">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No {activeTab} interviews found for this job posting.</p>
              {activeTab === 'pending' && (
                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Candidates
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    {activeTab === 'pending' ? (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interview Date
                      </th>
                    ) : (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Score
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{candidate.email}</div>
                      </td>
                      {activeTab === 'pending' ? (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {candidate.interview_date 
                              ? new Date(candidate.interview_date).toLocaleDateString() 
                              : 'Not scheduled'}
                          </div>
                        </td>
                      ) : (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.interview_score ? `${candidate.interview_score}/10` : 'N/A'}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/dashboard/candidates/${candidate.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          {activeTab === 'pending' ? 'Schedule' : 'View Results'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;