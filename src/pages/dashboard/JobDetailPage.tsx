import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, CheckCircle, FileText, Star } from 'lucide-react';
import { mockJobs, getInterviewsByJobAndStatus } from '@/data/mockData';
import { Interview } from '@/types/interview';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  
  // Find job details
  const job = mockJobs.find(j => j.id === jobId);
  
  // Get interviews based on active tab
  const pendingInterviews = getInterviewsByJobAndStatus(jobId || '', 'pending');
  const completedInterviews = getInterviewsByJobAndStatus(jobId || '', 'completed');

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/jobs')}
        >
          Return to Jobs List
        </button>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'closed':
        return 'badge-neutral';
      case 'draft':
        return 'badge-secondary';
      default:
        return 'badge-ghost';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreBadgeClass = (score?: number) => {
    if (!score) return 'badge-ghost';
    if (score >= 80) return 'badge-success';
    if (score >= 60) return 'badge-warning';
    return 'badge-error';
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
                  <th>Completion Date</th>
                </>
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview.id}>
                <td className="font-medium">{interview.candidateName}</td>
                <td>{interview.candidateEmail}</td>
                <td>{interview.scheduledFor ? formatDateTime(interview.scheduledFor) : '-'}</td>
                {activeTab === 'completed' && (
                  <>
                    <td>
                      <span className={`badge ${getScoreBadgeClass(interview.score)}`}>
                        {interview.score}%
                      </span>
                    </td>
                    <td>{interview.completedAt ? formatDateTime(interview.completedAt) : '-'}</td>
                  </>
                )}
                <td>
                  <button className="btn btn-xs btn-primary">View</button>
                </td>
              </tr>
            ))}
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
          onClick={() => navigate('/dashboard/jobs')} 
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
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <div className="flex items-center mt-2">
              <span className={`badge ${getStatusBadgeClass(job.status)} mr-2`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <span className="text-base-content/70 text-sm">
                Posted on {formatDate(job.createdAt)}
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
                  <p className="text-sm font-medium">Total Applicants</p>
                  <p className="text-sm text-base-content/70">{job.applicantCount}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Interviews</p>
                  <p className="text-sm text-base-content/70">{job.pendingInterviewsCount + job.completedInterviewsCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="card-body">
          <div className="border-b border-base-300 pb-4 mb-6">
            <h2 className="card-title flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Interviews
            </h2>
            <p className="text-sm text-base-content/70">
              View and manage interviews for this job posting
            </p>
          </div>
          
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
    </div>
  );
};

export default JobDetailPage;