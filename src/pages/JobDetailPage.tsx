import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, FileText, Star, AlertCircle, UserPlus, Users } from 'lucide-react';
import { InterviewRound } from '@/types/interview';
import { useJobs } from '@/hooks/useJobs';
import { useInterviews } from '@/hooks/useInterviews';
import { format, parseISO } from 'date-fns';
import AddCandidateModal from '@/components/Candidate/AddCandidateModal';

const JobDetailPage: React.FC = () => {
  const { jobId = '' } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  
  // Check location state for openAddCandidate flag
  useEffect(() => {
    if (location.state?.openAddCandidate) {
      setIsAddCandidateModalOpen(true);
      // Clear the state to prevent reopening on page refresh
      navigate(`/employee/jobs/${jobId}`, { replace: true });
    }
  }, [location.state, jobId, navigate]);
  
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
  
  // Calculate metrics
  const metrics = useMemo(() => {
    const pending = jobInterviews.filter(interview => 
      interview.status === 'pending' || !interview.status
    ).length;
    
    const completed = jobInterviews.filter(interview => 
      interview.status === 'completed'
    ).length;
    
    // Calculate average score across all completed interviews
    const completedInterviews = jobInterviews.filter(interview => 
      interview.status === 'completed'
    );
    
    let avgScore: number | null = null;
    if (completedInterviews.length > 0) {
      let totalScore = 0;
      let interviewsWithScores = 0;
      
      completedInterviews.forEach(interview => {
        const interviewScore = calculateAverageScore(interview.rounds || []);
        if (interviewScore !== undefined) {
          totalScore += interviewScore;
          interviewsWithScores++;
        }
      });
      
      if (interviewsWithScores > 0) {
        avgScore = Math.round(totalScore / interviewsWithScores);
      }
    }
    
    return {
      total: jobInterviews.length,
      pending,
      completed,
      avgScore
    };
  }, [jobInterviews]);
  
  // Check if still loading any data
  const isLoading = isJobLoading || isInterviewsLoading;
  const error = jobError || interviewsError;
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4">Loading job details...</p>
      </div>
    );
  }

  // If error fetching job, show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error loading job details</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/employee/jobs')}
        >
          Return to Jobs List
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

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
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

  return (
    <div className="space-y-0 p-0">
      <div>
        <button 
          className="btn btn-ghost mb-4 flex items-center gap-2"
          onClick={() => navigate('/employee/jobs')} 
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>
        
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 1, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-base-content/70 text-sm">
                Deadline: {formatDate(job.deadline)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Job Metrics Card - Moved to the top */}
      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-body">
          <div className="border-b border-base-300 pb-4 mb-4">
            <h2 className="card-title flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Job Metrics
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Total Candidates</div>
              <div className="stat-value text-primary">{metrics.total}</div>
            </div>
            
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">{metrics.pending}</div>
            </div>
            
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Completed</div>
              <div className="stat-value text-success">{metrics.completed}</div>
            </div>
            
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Average Score</div>
              <div className="stat-value text-accent">
                {metrics.avgScore !== null ? `${metrics.avgScore}%` : '-'}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/employee/jobs/${jobId}/candidates`)}
            >
              <Users className="h-4 w-4 mr-2" />
              View Candidates
            </button>
            
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddCandidateModalOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Candidate
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <div className="card-body">
          <div className="border-b border-base-300 pb-4 mb-4">
            <h2 className="card-title flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Job Details
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-1 text-base-content/70">{job.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-base-content/70">{formatDate(job.deadline)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-base-content/70">{job.role}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(job.framework) ? (
                  job.framework.map((framework) => (
                    <span key={framework} className="badge badge-outline badge-secondary">
                      {framework}
                    </span>
                  ))
                ) : (
                  <span className="badge badge-outline badge-secondary">
                    {job.framework}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Round Types</h3>
              <div className="flex flex-wrap gap-2">
                {job.roundTypes.map((type) => (
                  <span key={type} className="badge badge-outline badge-primary">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddCandidateModalOpen}
        onClose={() => setIsAddCandidateModalOpen(false)}
        jobId={jobId}
      />
    </div>
  );
};

export default JobDetailPage;