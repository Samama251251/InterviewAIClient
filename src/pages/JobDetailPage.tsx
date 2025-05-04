import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, CheckCircle, FileText, Star, AlertCircle, Plus, UserPlus, X, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Job } from '@/types/job';
import { Interview, InterviewRound, CreateInterviewInput } from '@/types/interview';
import { useJobs } from '@/hooks/useJobs';
import { useInterviews } from '@/hooks/useInterviews';
import { format, parseISO, addDays } from 'date-fns';
import { useForm } from 'react-hook-form';
import api from '@/services/api';
import { useToast } from '@/hooks/useToast';

// User response type for GET /users/email/:email endpoint
interface UserResponse {
  status: string;
  data: {
    _id: string;
    name: string;
    email: string;
  };
}

const JobDetailPage: React.FC = () => {
  const { jobId = '' } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('pending');
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const toast = useToast();
  
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
  const { getInterviews, createInterview } = useInterviews();
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
  
  // Check if still loading any data
  const isLoading = isJobLoading || isInterviewsLoading;
  const error = jobError || interviewsError;
  
  // Form setup for adding a new candidate
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm<{
    name: string;
    email: string;
    date: string;
    time: string;
  }>();

  // Function to get user by email
  const getUserByEmail = async (email: string) => {
    try {
      const response = await api.get<UserResponse>(`/users/email/${email}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('User not found. Please ensure the email is registered.');
      }
      throw new Error('Failed to fetch user information.');
    }
  };

  const handleAddCandidate = async (data: { name: string; email: string; date: string; time: string }) => {
    try {
      // First, get the user by email
      let userId;
      try {
        const user = await getUserByEmail(data.email);
        userId = user._id;
      } catch (error: any) {
        setError('email', { 
          type: 'manual', 
          message: error.message || 'Failed to find user with this email' 
        });
        return;
      }
      
      // Create interview with the found user ID
      const interviewData: CreateInterviewInput = {
        job_id: jobId,
        user_id: userId,
        date: data.date,
        time: data.time
      };
      
      await createInterview.mutateAsync(interviewData);
      setIsAddCandidateModalOpen(false);
      reset();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error creating interview';
      toast.error(errorMessage);
      console.error('Error creating interview:', error);
    }
  };
  
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

  const getStatusBadgeClass = (relationship?: string) => {
    if (!relationship) return 'badge-ghost';
    
    switch (relationship) {
      case 'owner':
        return 'badge-success';
      case 'employee':
        return 'badge-info';
      case 'applicant':
        return 'badge-warning';
      default:
        return 'badge-ghost';
    }
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      const date = parseISO(`${dateString}T${timeString}`);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (e) {
      return `${dateString} ${timeString}`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
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
              <th>Scheduled For</th>
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
                  <td>{formatDateTime(interview.date, interview.time)}</td>
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
                    <button className="btn btn-xs btn-primary">View</button>
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
          onClick={() => navigate('/employee/jobs')} 
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>
        
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.name}</h1>
            <div className="flex items-center mt-2">
              <span className={`badge ${getStatusBadgeClass(job.relationship)} mr-2`}>
                {job.relationship || 'Viewer'}
              </span>
              <span className="text-base-content/70 text-sm">
                Deadline: {formatDate(job.deadline)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
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
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Framework</p>
                  <p className="text-sm text-base-content/70">{job.framework}</p>
                </div>
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

      {/* Job Metrics Card */}
      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
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

      {/* Add Candidate Modal */}
      <dialog className={`modal ${isAddCandidateModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Add New Candidate</h3>
            <button 
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => setIsAddCandidateModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleAddCandidate)}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Candidate Name</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter candidate name"
                {...register('name', { required: "Candidate name is required" })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name.message}</span>
                </label>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email Address</span>
                <span className="label-text-alt">Must be a registered user</span>
              </label>
              <input
                type="email"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter email address"
                {...register('email', { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Interview Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
                  defaultValue={format(addDays(new Date(), 3), 'yyyy-MM-dd')}
                  {...register('date', { required: "Interview date is required" })}
                />
                {errors.date && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.date.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Interview Time</span>
                </label>
                <input
                  type="time"
                  className={`input input-bordered w-full ${errors.time ? 'input-error' : ''}`}
                  defaultValue="10:00"
                  {...register('time', { required: "Interview time is required" })}
                />
                {errors.time && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.time.message}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="modal-action mt-6">
              <button 
                type="button" 
                className="btn" 
                onClick={() => setIsAddCandidateModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Scheduling...
                  </>
                ) : (
                  <>Schedule Interview</>
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsAddCandidateModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default JobDetailPage;