import { useNavigate } from 'react-router-dom';
import { Users, BriefcaseBusiness, Building2, Calendar, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useJobs } from '@/hooks/useJobs';
import { useInterviews } from '@/hooks/useInterviews';
import { useEmployees } from '@/hooks/useEmployees';
import { UserAuth } from '@/contexts/AuthContext';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();
  const { session } = UserAuth();
  
  // Fetch data using the hooks
  const { getJobs } = useJobs();
  const { getInterviews } = useInterviews();
  const { getEmployees } = useEmployees();
  
  const { data: jobsData, isLoading: isLoadingJobs } = getJobs;
  const { data: interviewsData = [], isLoading: isLoadingInterviews } = getInterviews;
  const { data: employeesData = [], isLoading: isLoadingEmployees } = getEmployees;

  // Filter data based on the selected company
  const companyJobs = selectedCompany ? [
    ...(jobsData?.ownedCompanyJobs || []),
    ...(jobsData?.employeeCompanyJobs || [])
  ].filter(job => {
    const companyId = typeof job.company_id === 'object' 
      ? job.company_id._id 
      : job.company_id;
    return companyId === selectedCompany._id;
  }) : [];

  // Filter interviews to only show those for the current company's jobs
  const companyJobIds = companyJobs.map(job => job._id);
  const companyInterviews = interviewsData.filter(interview => 
    typeof interview.job_id === 'object' && 
    companyJobIds.includes(interview.job_id._id)
  );

  // Filter employees to only show those for the current company
  const companyEmployees = employeesData.filter(employee => {
    const companyId = typeof employee.company_id === 'object' 
      ? employee.company_id._id 
      : employee.company_id;
    return companyId === selectedCompany?._id;
  });

  // Calculate statistics
  const totalJobs = companyJobs.length;
  const isOwner = selectedCompany?.role === 'owner';
  const employeeCount = companyEmployees.length;
  
  // For illustration, let's count unique user IDs in interviews as applicants
  const applicantIds = new Set(companyInterviews.map(interview => 
    typeof interview.user_id === 'object' ? interview.user_id._id : interview.user_id
  ));
  const applicantCount = applicantIds.size;
  
  // Count pending and completed interviews
  const pendingInterviews = companyInterviews.filter(interview => !interview.status || interview.status === 'pending').length;
  const completedInterviews = companyInterviews.filter(interview => interview.status === 'completed').length;

  // Helper to get user initials
  const getUserInitials = (name: string = '') => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

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

  // Loading state
  const isLoading = isLoadingJobs || isLoadingInterviews || isLoadingEmployees;

  return (
    <motion.div 
      className="p-4 md:p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-base-content/70 mt-2">
          {selectedCompany ? (
            <>
              Viewing dashboard for <span className="font-medium">{selectedCompany.name}</span>.
              {isOwner ? ' You are the owner of this company.' : ' You are an employee of this company.'}
            </>
          ) : (
            'Select a company to view its dashboard data.'
          )}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : selectedCompany ? (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div 
              className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
              variants={itemVariants}
            >
              <div className="card-body p-6">
                <div className="flex justify-between items-center">
                  <h3 className="card-title text-sm font-medium">Total Jobs</h3>
                  <BriefcaseBusiness className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{totalJobs}</div>
                  <p className="text-xs text-base-content/70 mt-1">
                    Active job postings
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
                  <h3 className="card-title text-sm font-medium">Team Members</h3>
                  <UserCheck className="h-5 w-5 text-secondary" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{employeeCount}</div>
                  <p className="text-xs text-base-content/70 mt-1">
                    Total employees
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
                  <h3 className="card-title text-sm font-medium">Applicants</h3>
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{applicantCount}</div>
                  <p className="text-xs text-base-content/70 mt-1">
                    Across all job postings
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
                  <h3 className="card-title text-sm font-medium">Interviews</h3>
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{pendingInterviews + completedInterviews}</div>
                  <p className="text-xs text-base-content/70 mt-1">
                    {pendingInterviews} pending, {completedInterviews} completed
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Jobs Table Section */}
            <motion.div 
              className="lg:col-span-7 card bg-base-100 shadow-sm border border-base-300"
              variants={itemVariants}
            >
              <div className="card-body p-0">
                <div className="p-4 md:p-6 border-b border-base-300">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title">Company Jobs</h3>
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={() => navigate('/employee/jobs')}
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
                        <th>Role</th>
                        <th>Framework</th>
                        <th className="w-24"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyJobs.slice(0, 5).map((job) => (
                        <tr key={job._id} className="hover:bg-base-200/50">
                          <td className="font-medium">{job.name}</td>
                          <td>{job.role}</td>
                          <td>{job.framework}</td>
                          <td>
                            <button 
                              className="btn btn-ghost btn-sm"
                              onClick={() => navigate(`/employee/jobs/${job._id}`)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {companyJobs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-base-content/70">
                            No jobs found for this company
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
              {/* Team Members Section */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="card-title">Team Members</h3>
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={() => navigate('/employee/team')}
                    >
                      View all
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {companyEmployees.slice(0, 3).map((employee) => {
                      const user = typeof employee.user_id === 'object' ? employee.user_id : null;
                      // Check if this user matches the current authenticated user
                      const isCurrentUser = user && session?.user?.email === user.email;
                      
                      return (
                        <div 
                          key={employee._id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-base-200/50"
                        >
                          <div className="avatar placeholder">
                            {isCurrentUser && session?.user?.image ? (
                              <div className="w-8 h-8 rounded-full">
                                <img src={session.user.image} alt={session.user.name} className="rounded-full" />
                              </div>
                            ) : (
                              <div className="bg-primary text-primary-content w-8 rounded-full">
                                <span className="text-xs">
                                  {getUserInitials(user?.name)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user?.name || 'Employee'}</p>
                            <p className="text-xs text-base-content/70">{employee.role}</p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {companyEmployees.length === 0 && (
                      <div className="text-center py-4 text-base-content/70 text-sm">
                        No team members found
                      </div>
                    )}
                    
                    {isOwner && (
                      <button 
                        className="btn btn-outline btn-sm w-full mt-3"
                        onClick={() => navigate('/employee/team/add')}
                      >
                        Add Team Member
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="card bg-base-100 shadow-sm border border-base-300"
            variants={itemVariants}
          >
            <div className="card-body">
              <h3 className="card-title mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/employee/jobs/new')}
                >
                  Post New Job
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/employee/candidates')}
                >
                  View Candidates
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/employee/interviews/new')}
                >
                  Schedule Interview
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/employee/reports')}
                >
                  Generate Reports
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="card bg-base-100 shadow-sm border border-base-300 p-8 text-center">
          <Building2 className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Company Selected</h3>
          <p className="text-base-content/70 mb-6">
            Please select a company from the dropdown in the header or create a new company to get started.
          </p>
          <button 
            className="btn btn-primary w-full max-w-xs mx-auto"
            onClick={() => navigate('/employee/companies/new')}
          >
            Create New Company
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardOverview;
