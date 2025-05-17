import { useMemo } from "react";
import { UserAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  Building, 
  CheckCircle2, 
  BriefcaseBusiness, 
  FileCheck, 
  CalendarDays, 
} from "lucide-react";
import { useJobs } from "../hooks/useJobs";
import { useInterviews } from "../hooks/useInterviews";
import { Interview, InterviewRound } from "../types/interview";
import { useNavigate } from "react-router-dom";

function IntervieweeDashboard() {
  const navigate = useNavigate();
  const { session } = UserAuth();
  const user = session?.user;

  // Use our custom hooks
  const { getJobs } = useJobs();
  const { getInterviews } = useInterviews();

  // Fetch jobs
  const jobsQuery = getJobs;

  // Fetch interviews
  const interviewsQuery = getInterviews;


  // Get all jobs I've applied to (as an interviewee)
  const appliedJobs = useMemo(() => {
    return jobsQuery.data?.appliedJobs || [];
  }, [jobsQuery.data]);

  // Get all interviews for me as an interviewee
  const myInterviews = useMemo(() => {
    return interviewsQuery.data?.filter(interview => 
      interview.role === 'interviewee'
    ) || [];
  }, [interviewsQuery.data]);

  // Get all interview rounds
  const allInterviewRounds = useMemo(() => {
    const rounds: { interview: Interview; round: InterviewRound }[] = [];
    
    myInterviews.forEach(interview => {
      (interview.rounds || []).forEach(round => {
        rounds.push({ interview, round });
      });
    });
    
    return rounds;
  }, [myInterviews]);

  // Split upcoming and past interview rounds
  const upcomingInterviewRounds = useMemo(() => {
    return allInterviewRounds.filter(({ round }) => 
      round.status === "pending"
    );
  }, [allInterviewRounds]);

  const pastInterviewRounds = useMemo(() => {
    return allInterviewRounds.filter(({ round }) => 
      round.status === "completed"
    );
  }, [allInterviewRounds]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to get job details
  const getJobDetails = (interview: Interview) => {
    const jobRef = interview.job_id;
    
    if (typeof jobRef === 'string') {
      // Find in applied jobs
      const job = appliedJobs.find(j => j._id === jobRef);
      return {
        name: job?.name || 'Unknown Job',
        company: typeof job?.company_id === 'string' 
          ? job?.company_id 
          : job?.company_id?.name || 'Unknown Company'
      };
    } else {
      // Job reference is already an object
      return {
        name: jobRef.name,
        company: typeof jobRef.company_id === 'string'
          ? jobRef.company_id
          : jobRef.company_id?.name || 'Unknown Company'
      };
    }
  };

  const isLoading = jobsQuery.isLoading || interviewsQuery.isLoading;
  const isError = jobsQuery.isError || interviewsQuery.isError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error">
          <AlertCircle />
          <span>Error loading dashboard</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-4 md:p-6 space-y-2"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-base-content/70 mt-2">
          Welcome back, {user?.name || 'User'}! Here's an overview of your interview progress.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Applied Jobs</h3>
              <BriefcaseBusiness className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{appliedJobs.length}</div>
              <p className="text-xs text-base-content/70 mt-1">
                Total jobs you've applied to
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Total Rounds</h3>
              <FileCheck className="h-5 w-5 text-secondary" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{allInterviewRounds.length}</div>
              <p className="text-xs text-base-content/70 mt-1">
                Interview rounds across all jobs
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Upcoming Rounds</h3>
              <CalendarDays className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{upcomingInterviewRounds.length}</div>
              <p className="text-xs text-base-content/70 mt-1">
                Interview rounds yet to complete
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Completed Rounds</h3>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{pastInterviewRounds.length}</div>
              <p className="text-xs text-base-content/70 mt-1">
                Interview rounds with feedback
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Applied Jobs Section */}
        <motion.div 
          className="lg:col-span-7 card bg-base-100 shadow-sm border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-0">
            <div className="p-4 md:p-6 border-b border-base-300">
              <div className="flex justify-between items-center">
                <h3 className="card-title">Applied Jobs</h3>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => navigate('interviews')}
                >
                  View all
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200/50">
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {appliedJobs.slice(0, 5).map((job) => (
                    <tr key={job._id} className="hover:bg-base-200/50">
                      <td className="font-medium">{job.name}</td>
                      <td>
                        {typeof job.company_id === 'string' 
                          ? job.company_id 
                          : job.company_id?.name || 'Unknown'}
                      </td>
                      <td>
                        <span className="badge badge-primary badge-sm">Applied</span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/job/${job._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {appliedJobs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-base-content/70">
                        You haven't applied to any jobs yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Interviews Section */}
        <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>              
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="card-title">Upcoming Interview Rounds</h3>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => navigate('/interviews')}
                >
                  View all
                </button>
              </div>
              
              <div className="space-y-3">
                {upcomingInterviewRounds.slice(0, 3).map(({ interview, round }, index) => {
                  const { name: jobName, company: companyName } = getJobDetails(interview);
                  
                  return (
                    <div 
                      key={`${interview._id}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200/50 border border-base-200"
                    >
                      <div className="flex gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content w-8 rounded-full">
                            <span className="text-xs">{companyName.substring(0, 2).toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{jobName}</p>
                          <div className="flex items-center text-xs text-base-content/70">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{companyName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="badge badge-accent badge-sm">{round.type}</span>
                      </div>
                    </div>
                  );
                })}
                
                {upcomingInterviewRounds.length === 0 && (
                  <div className="text-center py-4 text-base-content/70 text-sm">
                    No upcoming interview rounds scheduled
                  </div>
                )}
                
                <button 
                  className="btn btn-primary btn-sm w-full mt-3"
                  onClick={() => navigate('/candidate/interviews')}
                >
                  View All Interviews
                </button>
              </div>
            </div>
          </div>

          {/* Guidelines Card */}
        </motion.div>
      </div>

      
    </motion.div>
  );
}

export default IntervieweeDashboard;