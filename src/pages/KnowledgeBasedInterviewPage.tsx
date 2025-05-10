import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInterviews } from '@/hooks/useInterviews';
import { useJobs } from '@/hooks/useJobs';
import KnowledgeBasedInterview from '@/components/Voice/KnowledgeBasedInterview';

const KnowledgeBasedInterviewPage = () => {
  const { interviewId, roundIndex } = useParams<{ interviewId: string, roundIndex: string }>();
  
  // Get interview data
  const { getInterviewById } = useInterviews();
  const { data: interview, isLoading: isInterviewLoading, isError: isInterviewError } = 
    getInterviewById(interviewId || '');
  
  // Get job data
  const { getJobById } = useJobs();
  const jobId = typeof interview?.job_id === 'object' ? interview.job_id._id : interview?.job_id;
  const { data: job, isLoading: isJobLoading, isError: isJobError } = 
    getJobById(jobId || '');

  const [error, setError] = useState<string | null>(null);
  
  // Find the round
  const round = interview?.rounds?.[Number(roundIndex)];

  useEffect(() => {
    if (!interviewId || !roundIndex) {
      setError('Interview ID or round index missing.');
    } else if (!interview || !round) {
      setError('Interview or round not found.');
    }
  }, [interviewId, roundIndex, interview, round]);

  const isLoading = isInterviewLoading || isJobLoading;
  const isError = isInterviewError || isJobError;

  if (isLoading) return <div className="p-8 text-center">Loading interview...</div>;
  if (isError || error || !interview || !round || !job) 
    return <div className="p-8 text-center text-error">{error || 'Interview or round not found.'}</div>;

  const role = {
    title: job.role,
    requirements: job.description ? [job.description] : [],
    responsibilities: [],
    technologies: job.framework || []
  };

  const frameworks = job.framework || [];
  const resume = { experience: [], projects: [], skills: [] };

  return (
    <KnowledgeBasedInterview 
      role={role} 
      frameworks={frameworks} 
      resume={resume} 
    />
  );
};

export default KnowledgeBasedInterviewPage; 