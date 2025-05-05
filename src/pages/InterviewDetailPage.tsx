import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, Award, User, AlertCircle, FileText, Star, ChevronRight } from 'lucide-react';
import { useInterviews } from '@/hooks/useInterviews';
import { RoundType } from '@/types/job';

const InterviewDetailPage: React.FC = () => {
  const { interviewId = '' } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  // Use useInterviews hook to fetch interview details
  const { getInterviewById } = useInterviews();
  const { data: interview, isLoading, error } = getInterviewById(interviewId);
  
  // Get job and candidate info from the interview
  const jobInfo = useMemo(() => {
    if (!interview) return null;
    
    // Handle both string IDs and populated job objects
    if (typeof interview.job_id === 'string') {
      return { name: 'Loading...', company: { name: 'Loading...' } };
    }
    
    return {
      name: interview.job_id.name,
      description: interview.job_id.description,
      company: {
        name: interview.job_id.company_id.name,
        id: interview.job_id.company_id._id
      }
    };
  }, [interview]);
  
  // Get candidate info
  const candidateInfo = useMemo(() => {
    if (!interview) return null;
    
    // Handle both string IDs and populated user objects
    if (typeof interview.user_id === 'string') {
      return { name: 'Loading...', email: 'Loading...' };
    }
    
    return {
      name: interview.user_id.name,
      email: interview.user_id.email,
      id: interview.user_id._id
    };
  }, [interview]);
  
  // Calculate overall score
  const overallScore = useMemo(() => {
    if (!interview?.rounds || interview.rounds.length === 0) return null;
    
    const roundsWithScores = interview.rounds.filter(round => 
      round.score !== undefined
    );
    
    if (roundsWithScores.length === 0) return null;
    
    const sum = roundsWithScores.reduce((acc, round) => 
      acc + (round.score || 0), 0);
    
    return Math.round(sum / roundsWithScores.length);
  }, [interview]);
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4">Loading interview details...</p>
      </div>
    );
  }

  // If error fetching interview, show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error loading interview details</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  // If interview not found, show not found state
  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h1 className="text-2xl font-bold mb-4">Interview not found</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const getStatusBadgeClass = (status?: string) => {
    if (!status) return 'badge-secondary';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'scheduled':
        return 'badge-info';
      case 'canceled':
        return 'badge-error';
      default:
        return 'badge-secondary';
    }
  };

  const getScoreBadgeClass = (score?: number) => {
    if (!score) return 'badge-ghost';
    if (score >= 80) return 'badge-success';
    if (score >= 60) return 'badge-warning';
    return 'badge-error';
  };

  const getRoundTypeIcon = (type: RoundType) => {
    switch (type) {
      case 'Coding':
        return <ClipboardList className="h-5 w-5 text-primary" />;
      case 'SystemDesign':
        return <FileText className="h-5 w-5 text-info" />;
      case 'FrameworkSpecific':
        return <Star className="h-5 w-5 text-warning" />;
      case 'Behavioural':
        return <User className="h-5 w-5 text-success" />;
      case 'KnowledgeBased':
        return <Award className="h-5 w-5 text-secondary" />;
      default:
        return <ClipboardList className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-0 p-0">
      <div>
        <button 
          className="btn btn-ghost mb-4 flex items-center gap-2"
          onClick={() => navigate(-1)} 
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 1, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {candidateInfo?.name || 'Candidate'} - {jobInfo?.name || 'Job'}
            </h1>
            
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge ${getStatusBadgeClass(interview.status)}`}>
                {interview.status || 'Not Set'}
              </span>
              
              {overallScore !== null && (
                <span className={`badge ${getScoreBadgeClass(overallScore)}`}>
                  Score: {overallScore}%
                </span>
              )}
              
              <span className="text-base-content/70 text-sm">
                {jobInfo?.company?.name || 'Company'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Candidate Info Card */}
      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-body">
          <div className="border-b border-base-300 pb-4 mb-4">
            <h2 className="card-title flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Candidate Information
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-base-content/70">Name</span>
              <span className="text-base">{candidateInfo?.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-base-content/70">Email</span>
              <span className="text-base">{candidateInfo?.email}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interview Rounds */}
      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <div className="card-body">
          <div className="border-b border-base-300 pb-4 mb-4">
            <h2 className="card-title flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Interview Rounds
            </h2>
          </div>
          
          {interview.rounds.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base-content/70">No rounds have been configured for this interview yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {interview.rounds.map((round, index) => (
                <div 
                  key={`${round.type}-${index}`} 
                  className="card bg-base-200 transition-all hover:shadow-md cursor-pointer"
                  onClick={() => navigate(`/employee/interviews/${interviewId}/rounds/${index}`)}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRoundTypeIcon(round.type)}
                        <h3 className="text-lg font-medium">{round.type} Round</h3>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`badge ${getStatusBadgeClass(round.status)}`}>
                          {round.status || 'Not Started'}
                        </span>
                        
                        {round.score !== undefined && (
                          <span className={`badge ${getScoreBadgeClass(round.score)}`}>
                            Score: {round.score}%
                          </span>
                        )}
                        
                        <ChevronRight className="h-5 w-5 text-base-content/50" />
                      </div>
                    </div>
                    
                    {round.remarks && (
                      <div className="mt-2">
                        <p className="text-base-content/70 text-sm line-clamp-1">
                          {round.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewDetailPage; 