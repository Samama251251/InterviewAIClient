import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search,
  Filter,
  AlertCircle, 
  Building,
  Eye,
  FileCheck
} from "lucide-react";
import { useInterviews } from "@/hooks/useInterviews";
import { Interview } from "@/types/interview";

const CandidateInterviewsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch interviews
  const { getInterviews } = useInterviews();
  const interviewsQuery = getInterviews;

  // Filter for candidate's interviews only
  const myInterviews = useMemo(() => {
    return interviewsQuery.data?.filter(interview => 
      interview.role === 'interviewee'
    ) || [];
  }, [interviewsQuery.data]);

  // Apply filters and search
  const filteredInterviews = useMemo(() => {
    return myInterviews.filter(interview => {
      // Filter by status
      if (filterStatus !== "all") {
        const isCompleted = interview.rounds.every(round => round.status === "completed");
        const isPending = interview.rounds.some(round => round.status === "pending");
        
        if (filterStatus === "completed" && !isCompleted) return false;
        if (filterStatus === "pending" && !isPending) return false;
      }

      // Search term filter
      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        const jobName = typeof interview.job_id === 'string' 
          ? 'Unknown Job'
          : interview.job_id.name;
        
        const companyName = typeof interview.job_id === 'string'
          ? 'Unknown Company'
          : typeof interview.job_id.company_id === 'string'
            ? interview.job_id.company_id
            : interview.job_id.company_id.name;
        
        return jobName.toLowerCase().includes(searchLower) || 
               companyName.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }, [myInterviews, searchTerm, filterStatus]);

  // Helper function to get job and company details
  const getInterviewDetails = (interview: Interview) => {
    const jobRef = interview.job_id;
    
    if (typeof jobRef === 'string') {
      return {
        jobName: 'Unknown Job',
        companyName: 'Unknown Company',
      };
    } else {
      return {
        jobName: jobRef.name,
        companyName: typeof jobRef.company_id === 'string'
          ? jobRef.company_id
          : jobRef.company_id?.name || 'Unknown Company'
      };
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate interview status
  const getInterviewStatus = (interview: Interview) => {
    const completedRounds = interview.rounds.filter(round => round.status === "completed").length;
    const totalRounds = interview.rounds.length;
    
    if (completedRounds === 0) return "Not Started";
    if (completedRounds < totalRounds) return `${completedRounds}/${totalRounds} Completed`;
    return "Completed";
  };

  const getStatusBadgeClass = (interview: Interview) => {
    const completedRounds = interview.rounds.filter(round => round.status === "completed").length;
    const totalRounds = interview.rounds.length;
    
    if (completedRounds === 0) return "badge-secondary";
    if (completedRounds < totalRounds) return "badge-primary";
    return "badge-success";
  };

  const isLoading = interviewsQuery.isLoading;
  const isError = interviewsQuery.isError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="alert alert-error max-w-md">
          <AlertCircle />
          <span>Failed to load interviews. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-4 md:p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Interviews</h1>
          <p className="text-base-content/70 mt-1">
            View and manage all your interview sessions
          </p>
        </div>
        <div className="stat bg-base-100 shadow-sm border border-base-300 p-3 rounded-box">
          <div className="stat-figure text-primary">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="stat-title text-xs">Total Interviews</div>
          <div className="stat-value text-xl">{myInterviews.length}</div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by job title or company..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-base-content/70" />
          <select 
            className="select select-bordered w-full max-w-[200px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Interview List */}
      <motion.div 
        variants={itemVariants}
        className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200/50">
              <tr>
                <th>Job & Company</th>
                <th>Rounds</th>
                <th>Status</th>
                <th className="w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-base-content/70">
                    {searchTerm || filterStatus !== "all" 
                      ? "No interviews match your filters" 
                      : "You don't have any interviews yet"}
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((interview) => {
                  const { jobName, companyName } = getInterviewDetails(interview);
                  return (
                    <tr key={interview._id} className="hover:bg-base-200/50">
                      <td>
                        <div className="font-medium">{jobName}</div>
                        <div className="text-sm text-base-content/70 flex items-center">
                          <Building className="w-3.5 h-3.5 mr-1" />
                          {companyName}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {interview.rounds.map((round, idx) => (
                            <span 
                              key={idx} 
                              className={`badge badge-sm ${round.status === 'completed' ? 'badge-accent' : 'badge-outline'}`}
                            >
                              {round.type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(interview)}`}>
                          {getInterviewStatus(interview)}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/candidate/interviews/${interview._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* No interviews message */}
      {myInterviews.length === 0 && (
        <motion.div 
          variants={itemVariants}
          className="text-center py-10"
        >
          <div className="text-base-content/50 text-lg font-medium mb-2">No interviews found</div>
          <p className="text-base-content/70">
            When you apply for jobs, your interviews will appear here.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CandidateInterviewsPage; 