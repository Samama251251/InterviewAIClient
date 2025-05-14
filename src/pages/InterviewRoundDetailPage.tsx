import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, Award, AlertCircle, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useInterviews } from '@/hooks/useInterviews';
import { RoundType } from '@/types/job';

const InterviewRoundDetailPage: React.FC = () => {
  const { interviewId = '', roundIndex = '0' } = useParams<{ interviewId: string; roundIndex: string }>();
  const navigate = useNavigate();
  
  // Convert roundIndex from string to number
  const roundIdx = parseInt(roundIndex, 10);
  
  // Use useInterviews hook to fetch interview details
  const { getInterviewById } = useInterviews();
  const { data: interview, isLoading, error } = getInterviewById(interviewId);
  
  // Extract the specific round
  const round = useMemo(() => {
    if (!interview?.rounds || roundIdx >= interview.rounds.length) return null;
    return interview.rounds[roundIdx];
  }, [interview, roundIdx]);
  
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
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4">Loading round details...</p>
      </div>
    );
  }

  // If error fetching interview, show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error loading round details</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/employee/interviews/${interviewId}`)}
        >
          Back to Interview
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
          onClick={() => navigate(`/employee/interviews`)}
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  // If round not found, show not found state
  if (!round) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h1 className="text-2xl font-bold mb-4">Round not found</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/employee/interviews/${interviewId}`)}
        >
          Back to Interview
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
        return <ClipboardList className="h-6 w-6 text-primary" />;
      case 'SystemDesign':
        return <FileText className="h-6 w-6 text-info" />;
      case 'KnowledgeBased':
        return <Award className="h-6 w-6 text-secondary" />;
      default:
        return <ClipboardList className="h-6 w-6 text-primary" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <Clock className="h-5 w-5 text-warning" />;
    
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-error" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  return (
    <div className="space-y-0 p-0">
      <div>
        <button 
          className="btn btn-ghost mb-4 flex items-center gap-2"
          onClick={() => navigate(`/employee/interviews/${interviewId}`)} 
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Interview
        </button>
        
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {round.type} Round
            </h1>
            
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge ${getStatusBadgeClass(round.status)}`}>
                {round.status || 'Not Started'}
              </span>
              
              {round.score !== undefined && (
                <span className={`badge ${getScoreBadgeClass(round.score)}`}>
                  Score: {round.score}%
                </span>
              )}
              
              <span className="text-base-content/70 text-sm">
                {candidateInfo?.name} · {jobInfo?.company?.name}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Round Details */}
      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            {getRoundTypeIcon(round.type)}
            <h2 className="card-title text-2xl">{round.type} Assessment</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-3 p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-medium">Status</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(round.status)}
                <span className="text-lg">
                  {round.status || 'Not Started'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-medium">Score</h3>
              {round.score !== undefined ? (
                <div className="flex items-center gap-2">
                  <div className="radial-progress text-primary" style={{ "--value": round.score } as any}>
                    {round.score}%
                  </div>
                </div>
              ) : (
                <p className="text-lg text-base-content/70">Not scored yet</p>
              )}
            </div>
          </div>
          
          {/* Remarks Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">AI Remarks</h3>
            <div className="bg-base-200 p-4 rounded-lg min-h-24">
              {round.remarks ? (
                <p className="whitespace-pre-line">{round.remarks}</p>
              ) : (
                <p className="text-base-content/50 italic">No remarks provided yet.</p>
              )}
            </div>
          </div>
          
          {/* Candidate Information */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Candidate</h3>
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-xl">{candidateInfo?.name?.[0]}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">{candidateInfo?.name}</p>
                  <p className="text-sm text-base-content/70">{candidateInfo?.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Information */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Job</h3>
            <div className="bg-base-200 p-4 rounded-lg">
              <p className="font-medium">{jobInfo?.name}</p>
              <p className="text-sm text-base-content/70">{jobInfo?.company?.name}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewRoundDetailPage; 