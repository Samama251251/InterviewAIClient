import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import KnowledgeBasedInterview from '@/components/Voice/KnowledgeBasedInterview';

const KnowledgeBasedInterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract jobId from query params
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    if (!jobId) {
      navigate('/candidate/interviews');
      return;
    }

    setLoading(true);
    axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
      withCredentials: true
    })
      .then(res => {
        setJob(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details');
        setLoading(false);
      });
  }, [jobId, navigate]);

  if (!jobId) return <div className="p-8 text-center">No job selected.</div>;
  if (loading) return <div className="p-8 text-center">Loading job details...</div>;
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
    />
  );
};

export default KnowledgeBasedInterviewPage; 