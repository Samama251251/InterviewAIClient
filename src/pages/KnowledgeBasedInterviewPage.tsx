import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import KnowledgeBasedInterview from '@/components/Voice/KnowledgeBasedInterview';

// Define proper types for job and interview
interface JobType {
  _id: string;
  name: string;
  role: string;
  description: string;
  framework: string[];
  requirements?: string[];
  responsibilities?: string[];
}

interface InterviewRound {
  type: string;
  status?: string;
}

interface InterviewType {
  _id: string;
  rounds: InterviewRound[];
}

const KnowledgeBasedInterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knowledgeRoundIndex, setKnowledgeRoundIndex] = useState<number | undefined>(undefined);

  // Extract jobId and interviewId from query params
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get('jobId');
  const interviewId = searchParams.get('interviewId');

  console.log('KnowledgeBasedInterviewPage: Extracted from URL - jobId:', jobId, 'interviewId:', interviewId);

  useEffect(() => {
    if (!jobId) {
      navigate('/candidate/interviews');
      return;
    }

    // Fetch job details
    const fetchData = async () => {
      setLoading(true);
      try {
        const jobRes = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          withCredentials: true
        });
        setJob(jobRes.data.data);

        // If interviewId is provided, fetch interview details
        if (interviewId) {
          const interviewRes = await axios.get(`http://localhost:5000/api/interviews/${interviewId}`, {
            withCredentials: true
          });
          
          // Find the index of the KnowledgeBased round
          const index = interviewRes.data.data.rounds.findIndex(
            (round: InterviewRound) => round.type === 'KnowledgeBased'
          );
          setKnowledgeRoundIndex(index !== -1 ? index : undefined);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, interviewId, navigate]);

  if (!jobId) return <div className="p-8 text-center">No job selected.</div>;
  if (loading) return <div className="p-8 text-center">Loading details...</div>;
  if (error || !job) return <div className="p-8 text-center text-error">{error || 'Job not found.'}</div>;

  const role = {
    title: job.role,
    requirements: job.requirements || [],
    responsibilities: job.responsibilities || [],
    technologies: job.framework || []
  };

  const frameworks = job.framework || [];

  const resume = { experience: [], projects: [], skills: [] };

  return (
    <KnowledgeBasedInterview 
      role={role} 
      frameworks={frameworks} 
      resume={resume} 
      interviewId={interviewId || undefined}
      roundIndex={knowledgeRoundIndex}
    />
  );
};

export default KnowledgeBasedInterviewPage; 