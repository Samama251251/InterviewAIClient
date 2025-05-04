import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, UserPlus, Filter, Upload } from 'lucide-react';
import { Interview, InterviewRound } from '@/types/interview';
import { useJobs } from '@/hooks/useJobs';
import { useInterviews } from '@/hooks/useInterviews';
import { format, parseISO } from 'date-fns';
import AddCandidateModal from '@/components/Candidate/AddCandidateModal';
import BulkUploadModal from '@/components/Candidate/BulkUploadModal';
import ScreenCandidatesModal from '@/components/Candidate/ScreenCandidatesModal';
import { screenCandidates } from '@/services/screenCandidates';

const JobCandidatesPage: React.FC = () => {
  const { jobId = '' } = useParams<{ jobId: string }>();
  const navigate = useNavigate();  
  // Tab and modal states
  const [activeTab, setActiveTab] = useState('pending');
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  
  // Use useJobs hook to fetch job details
  const { getJobById } = useJobs();
  const { data: job, isLoading: isJobLoading, error: jobError } = getJobById(jobId);
  
  // Use useInterviews hook to fetch interviews
  const { getInterviews } = useInterviews();
  const { data: allInterviews = [], isLoading: isInterviewsLoading, error: interviewsError } = getInterviews;
  
  // Filter interviews for this job and where the user is an interviewer
  const jobInterviews = useMemo(() => {
    return allInterviews.filter(interview => {
      // Get the job ID regardless of whether job_id is a string or object
      const interviewJobId = typeof interview.job_id === 'string' 
        ? interview.job_id 
        : interview.job_id._id;
      
      // Only include interviews for this job where the user is an interviewer
      return interviewJobId === jobId && interview.role === 'interviewer';
    });
  }, [allInterviews, jobId]);
  
  // Separate interviews into pending and completed
  const pendingInterviews = useMemo(() => {
    return jobInterviews.filter(interview => 
      interview.status === 'pending' || !interview.status
    );
  }, [jobInterviews]);
  
  const completedInterviews = useMemo(() => {
    return jobInterviews.filter(interview => 
      interview.status === 'completed'
    );
  }, [jobInterviews]);
  
  // Handle successful bulk upload
  const handleBulkUploadSuccess = (result: { successful: number; failed: number; total: number }) => {
    // Refresh the interviews list
    getInterviews.refetch();
  };
  
  // Handle candidate screening
  const handleScreenCandidates = async (criteria: string) => {
    try {
      // Use the screenCandidates service
      const result = await screenCandidates(jobId, criteria);
      
      // Refresh the interviews list after screening
      getInterviews.refetch();
      
      // Return a success message
      return Promise.resolve(`Successfully screened candidates: ${result.screened} removed, ${result.remaining} remaining.`);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  // Check if still loading any data
  const isLoading = isJobLoading || isInterviewsLoading;
  const error = jobError || interviewsError;
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4">Loading candidates...</p>
      </div>
    );
  }

  // If error fetching job, show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error loading candidates</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/employee/jobs/${jobId}`)}
        >
          Return to Job Details
        </button>
      </div>
    );
  }

  // If job not found, show not found state
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/employee/jobs')}
        >
          Return to Jobs List
        </button>
      </div>
    );
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      const date = parseISO(`${dateString}T${timeString}`);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (e) {
      return `${dateString} ${timeString}`;
    }
  };

  const getScoreBadgeClass = (score?: number) => {
    if (!score) return 'badge-ghost';
    if (score >= 80) return 'badge-success';
    if (score >= 60) return 'badge-warning';
    return 'badge-error';
  };

  const calculateAverageScore = (rounds: InterviewRound[]) => {
    // Filter out rounds without scores
    const roundsWithScores = rounds.filter(round => round.score !== undefined);
    
    if (roundsWithScores.length === 0) return undefined;
    
    // Calculate the average of rounds that have scores
    const sum = roundsWithScores.reduce((acc, round) => 
      acc + (round.score || 0), 0);
    
    return Math.round(sum / roundsWithScores.length);
  };

  const renderInterviewTable = (interviews: Interview[]) => {
    if (interviews.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-base-content/70">No interviews in this category yet.</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Email</th>
              {activeTab === 'completed' && (
                <>
                  <th>Score</th>
                  <th>Rounds</th>
                </>
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => {
              // Extract user data from the interview
              const user = typeof interview.user_id === 'object' 
                ? interview.user_id 
                : { name: 'N/A', email: 'N/A' };

              // Calculate average score using the improved function
              const rounds = interview.rounds || [];
              const totalScore = calculateAverageScore(rounds);
              
              return (
                <tr key={interview._id}>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  {activeTab === 'completed' && (
                    <>
                      <td>
                        {totalScore !== undefined ? (
                          <span className={`badge ${getScoreBadgeClass(totalScore)}`}>
                            {totalScore}%
                          </span>
                        ) : '-'}
                      </td>
                      <td>{rounds.length}</td>
                    </>
                  )}
                  <td>
                    <button 
                      className="btn btn-xs btn-primary"
                      onClick={() => navigate(`/employee/interviews/${interview._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <button 
          className="btn btn-ghost mb-4 flex items-center gap-2"
          onClick={() => navigate(`/employee/jobs/${jobId}`)} 
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Details
        </button>
        
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 1, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.name} - Candidates</h1>
            <p className="text-base-content/70 mt-1">
              Manage candidates and interviews for this job posting
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddCandidateModalOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Candidate
            </button>
            
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => setIsBulkUploadModalOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </button>
            
            <button 
              className="btn btn-error btn-sm"
              onClick={() => setIsScreenModalOpen(true)}
              disabled={jobInterviews.length === 0}
            >
              <Filter className="h-4 w-4 mr-2" />
              Screen Candidates
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-body">
          <div className="tabs tabs-boxed mb-6 bg-base-200 inline-flex">
            <a 
              className={`tab gap-2 ${activeTab === 'pending' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <Clock className="h-4 w-4" />
              <span>Pending ({pendingInterviews.length})</span>
            </a>
            <a 
              className={`tab gap-2 ${activeTab === 'completed' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Completed ({completedInterviews.length})</span>
            </a>
          </div>
          
          {activeTab === 'pending' && renderInterviewTable(pendingInterviews)}
          {activeTab === 'completed' && renderInterviewTable(completedInterviews)}
        </div>
      </motion.div>

      {/* Modals */}
      <AddCandidateModal
        isOpen={isAddCandidateModalOpen}
        onClose={() => setIsAddCandidateModalOpen(false)}
        jobId={jobId}
      />
      
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        jobId={jobId}
        onSuccess={handleBulkUploadSuccess}
      />
      
      <ScreenCandidatesModal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        onConfirm={handleScreenCandidates}
      />
    </div>
  );
};

export default JobCandidatesPage; 