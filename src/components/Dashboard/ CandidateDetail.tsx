import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_CANDIDATES, MOCK_JOBS, MOCK_INTERVIEWS } from './mockData';
import { Candidate, Job, Interview } from '../../types';

const CandidateDetail: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Find candidate
      const foundCandidate = MOCK_CANDIDATES.find(c => c.id === candidateId) || null;
      setCandidate(foundCandidate);
      
      if (foundCandidate) {
        // Find job for this candidate
        const foundJob = MOCK_JOBS.find(j => j.id === foundCandidate.job_id) || null;
        setJob(foundJob);
        
        // Find interviews for this candidate
        const candidateInterviews = MOCK_INTERVIEWS.filter(i => i.candidate_id === candidateId);
        setInterviews(candidateInterviews);
      }
      
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [candidateId]);

  // Schedule new interview
  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewDate || !interviewType) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create a new interview
      const newInterview: Interview = {
        id: `interview-${interviews.length + 1}`,
        candidate_id: candidateId || '',
        interview_date: interviewDate,
        status: 'scheduled',
        interview_type: interviewType,
        created_at: new Date().toISOString()
      };
      
      // Update interviews state
      setInterviews(prev => [...prev, newInterview]);
      
      // Reset form
      setInterviewDate('');
      setInterviewType('');
      setIsSubmitting(false);
    }, 800);
  };

  // Add feedback for an interview
  const handleAddFeedback = (interviewId: string) => {
    if (!feedback || score === '') return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update interview with feedback
      const updatedInterviews = interviews.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            feedback,
            score: Number(score),
            status: 'completed' as 'completed' | 'scheduled' | 'canceled'
          };
        }
        return interview;
      });
      
      setInterviews(updatedInterviews);
      
      // Reset feedback form
      setFeedback('');
      setScore('');
      setIsSubmitting(false);
    }, 800);
  };

  // Update candidate status
  const updateCandidateStatus = (status: 'pending' | 'completed') => {
    if (!candidate) return;
    
    // Update candidate status
    setCandidate({
      ...candidate,
      status
    });
    
    // In a real app, you would make an API call here
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading candidate details...</div>;
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Candidate not found</h2>
        <p className="mt-2 text-gray-600">The candidate you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/candidates')}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Link 
        to="/dashboard/candidates" 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Candidates
      </Link>

      {/* Candidate Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="mt-1 text-gray-600">{candidate.email}</p>
            {candidate.phone && (
              <p className="mt-1 text-gray-600">{candidate.phone}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                candidate.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {candidate.status === 'pending' ? 'Pending' : 'Completed'}
            </span>
            {job && (
              <Link 
                to={`/dashboard/jobs/${job.id}`}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
              >
                View Job: {job.title}
              </Link>
            )}
          </div>
        </div>

        {/* Resume Link - would be implemented if there was an actual resume */}
        {candidate.resume_url && (
          <div className="mt-6">
            <a 
              href={candidate.resume_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-600 hover:text-green-800"
            >
              <i className="fas fa-file-pdf mr-2"></i> View Resume
            </a>
          </div>
        )}
      </div>

      {/* Interview Schedules */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Interview Schedule</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and schedule interviews for this candidate.</p>
        </div>

        {interviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(interview.interview_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(interview.interview_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.interview_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          interview.status === 'scheduled' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : interview.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {interview.score ? `${interview.score}/10` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {interview.status === 'scheduled' ? (
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => {
                            setFeedback('');
                            setScore('');
                            // Open feedback modal or expand for feedback
                          }}
                        >
                          Add Feedback
                        </button>
                      ) : (
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            // View feedback details
                          }}
                        >
                          View Feedback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No interviews scheduled yet.</p>
          </div>
        )}

        {/* Schedule New Interview */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Schedule New Interview</h3>
          
          <form onSubmit={handleScheduleInterview} className="mt-4 space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
            <div className="flex-1">
              <label htmlFor="interviewDate" className="block text-sm font-medium text-gray-700">
                Interview Date
              </label>
              <input
                type="datetime-local"
                id="interviewDate"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div className="flex-1">
              <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700">
                Interview Type
              </label>
              <select
                id="interviewType"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Type</option>
                {job?.interview_rounds.map((round) => (
                  <option key={round} value={round}>
                    {round === 'dsa' && 'DSA Coding Round'}
                    {round === 'techStack' && 'Tech Stack Round'}
                    {round === 'systemDesign' && 'System Design Round'}
                    {round === 'behavioral' && 'Behavioral Round'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interview Feedback & Results */}
      {interviews.some(interview => interview.status === 'completed') && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Interview Results</h2>
            <p className="mt-1 text-sm text-gray-500">Summary of completed interviews and feedback.</p>
          </div>
          
          <div className="p-6">
            {interviews
              .filter(interview => interview.status === 'completed')
              .map((interview) => (
                <div key={interview.id} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{interview.interview_type}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(interview.interview_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        Score: {interview.score ? `${interview.score}/10` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {interview.feedback && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
                      <p className="mt-1 text-gray-600">{interview.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            
            {candidate.status === 'pending' && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => updateCandidateStatus('completed')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Mark All Interviews as Completed
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;