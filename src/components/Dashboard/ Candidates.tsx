import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CANDIDATES, MOCK_JOBS, MOCK_INTERVIEWS } from './mockData';
import { Candidate, Job } from '../../types';

// Types for component
interface CandidateWithDetails extends Candidate {
  job_title?: string;
  total_interviews: number;
  completed_interviews: number;
  pending_interviews: number;
}

const Candidates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [candidates, setCandidates] = useState<CandidateWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Enhance candidates with job titles and interview counts
      const enhancedCandidates = MOCK_CANDIDATES.map(candidate => {
        const job = MOCK_JOBS.find(j => j.id === candidate.job_id);
        const candidateInterviews = MOCK_INTERVIEWS.filter(i => i.candidate_id === candidate.id);
        
        return {
          ...candidate,
          job_title: job?.title,
          total_interviews: candidateInterviews.length,
          completed_interviews: candidateInterviews.filter(i => i.status === 'completed').length,
          pending_interviews: candidateInterviews.filter(i => i.status === 'scheduled').length
        };
      });
      
      setCandidates(enhancedCandidates);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter candidates based on search term and status filter
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      searchTerm === '' ||
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'pending' && candidate.status === 'pending') ||
      (filterStatus === 'completed' && candidate.status === 'completed');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
      <p className="mt-2 text-gray-600">Manage and view all candidates across your job postings.</p>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'pending'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">All Candidates</h2>
          <p className="text-sm text-gray-500">A list of all candidates who have applied to your job postings.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading candidates...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No candidates found matching your filters.</p>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Interviews
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Completed
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pending
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/dashboard/candidates/${candidate.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-green-600"
                      >
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.job_title || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.total_interviews}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.completed_interviews}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.pending_interviews}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;