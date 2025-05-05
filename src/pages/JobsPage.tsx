import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowUpDown, Eye, Trash, Briefcase, AlertTriangle } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useCompanyContext } from '@/contexts/CompanyContext';
import CreateJobModal from '@/components/Job/CreateJobModal';
import JobFilters from '@/components/Job/JobFilters';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();
  const { getJobs, deleteJob } = useJobs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'deadline' | 'applicants'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);

  // Get jobs data
  const { data: jobsData = { appliedJobs: [], ownedCompanyJobs: [], employeeCompanyJobs: [] }, isLoading } = getJobs;

  // Get jobs for the selected company
  const companyJobs = useMemo(() => {
    if (!selectedCompany) return [];
    
    // Combine jobs from owned and employee companies that match the selected company
    return [
      ...jobsData.ownedCompanyJobs.filter(job => {
        const companyId = typeof job.company_id === 'string' 
          ? job.company_id 
          : job.company_id._id;
        return companyId === selectedCompany._id;
      }),
      ...jobsData.employeeCompanyJobs.filter(job => {
        const companyId = typeof job.company_id === 'string' 
          ? job.company_id 
          : job.company_id._id;
        return companyId === selectedCompany._id;
      })
    ];
  }, [selectedCompany, jobsData]);

  const handleJobClick = (jobId: string) => {
    navigate(`/employee/jobs/${jobId}`);
  };

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      await deleteJob.mutateAsync(jobToDelete._id);
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  // Apply role and technology filters
  const filteredByRoleAndTechJobs = useMemo(() => {
    return companyJobs.filter(job => {
      // If no filters are applied, show all jobs
      if (!selectedRole && !selectedTechnology) return true;
      
      // Filter by role if selected
      if (selectedRole && job.role !== selectedRole) return false;
      
      // Filter by technology if selected
      if (selectedTechnology) {
        // Handle both string and array frameworks
        const frameworks = Array.isArray(job.framework) 
          ? job.framework 
          : [job.framework];
          
        // Check if any of the job's frameworks match the selected technology
        if (!frameworks.some(tech => tech.includes(selectedTechnology))) return false;
      }
      
      return true;
    });
  }, [companyJobs, selectedRole, selectedTechnology]);

  // Filter jobs by search term
  const filteredJobs = filteredByRoleAndTechJobs.filter(
    (job) => job.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'applicants') {
      // This is a placeholder since we don't have applicant count in the API
      return sortOrder === 'asc' ? 1 : -1;
    } else {
      // sort by deadline
      return sortOrder === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    }
  });

  const toggleSort = (column: 'name' | 'deadline' | 'applicants') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Helper to get filter description for empty state message
  const getFilterDescription = () => {
    const filters = [];
    if (selectedRole) filters.push(`role "${selectedRole}"`);
    if (selectedTechnology) filters.push(`technology "${selectedTechnology}"`);
    
    if (filters.length === 0) return '';
    if (filters.length === 1) return ` with ${filters[0]}`;
    return ` with ${filters[0]} and ${filters[1]}`;
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
          <p className="text-base-content/70 mt-1">
            {selectedCompany ? (
              <>Manage job postings for <span className="font-medium text-primary">{selectedCompany.name}</span></>
            ) : (
              'Select a company to manage job postings'
            )}
          </p>
        </div>
        <button
          className="btn btn-primary mt-4 sm:mt-0"
          onClick={() => setIsDialogOpen(true)}
          disabled={!selectedCompany}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Job
        </button>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative w-full sm:w-auto flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-4 w-4" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="input input-bordered pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <JobFilters 
          selectedRole={selectedRole}
          selectedTechnology={selectedTechnology}
          onRoleChange={setSelectedRole}
          onTechnologyChange={setSelectedTechnology}
        />
      </motion.div>

      {isLoading ? (
        <div className="w-full flex justify-center p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !selectedCompany ? (
        <div className="text-center p-8 bg-base-200 rounded-box">
          <Briefcase className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Company Selected</h3>
          <p className="text-base-content/70">
            Please select a company from the dropdown in the header to view and manage job postings.
          </p>
        </div>
      ) : sortedJobs.length === 0 ? (
        <div className="text-center p-8 bg-base-200 rounded-box">
          <Briefcase className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Jobs Found</h3>
          <p className="text-base-content/70">
            {searchTerm 
              ? 'No jobs match your search criteria.' 
              : (selectedRole || selectedTechnology)
                ? `No jobs found${getFilterDescription()}.`
                : 'No jobs have been created for this company yet.'}
          </p>
          <button 
            className="btn btn-primary mt-4" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Job
          </button>
        </div>
      ) : (
        <motion.div 
          className="rounded-md border bg-base-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="cursor-pointer py-3 px-4" onClick={() => toggleSort('name')}>
                    <div className="flex items-center">
                      Job Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th className="cursor-pointer py-3 px-4" onClick={() => toggleSort('deadline')}>
                    <div className="flex items-center">
                      Deadline
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Framework</th>
                  <th className="py-3 px-4">Round Types</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="py-3 px-4 font-medium">{job.name}</td>
                    <td className="py-3 px-4 text-base-content/70">
                      {format(new Date(job.deadline), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4">{job.role}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(job.framework) ? (
                          job.framework.map((tech) => (
                            <span 
                              key={tech} 
                              className={`badge badge-sm ${
                                selectedTechnology === tech 
                                  ? 'badge-secondary' 
                                  : 'badge-outline badge-secondary'
                              }`}
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="badge badge-sm badge-outline badge-secondary">
                            {job.framework}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {job.roundTypes.map((type) => (
                          <span key={type} className="badge badge-sm badge-outline badge-primary">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-sm btn-ghost btn-square"
                          onClick={() => handleJobClick(job._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost btn-square text-error"
                          onClick={() => handleDeleteClick(job)}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Job creation modal */}
      <CreateJobModal 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedCompany={selectedCompany}
      />

      {/* Delete confirmation modal */}
      <dialog className={`modal ${isDeleteDialogOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-error mr-2" />
            Confirm Deletion
          </h3>
          <p className="py-4">
            Are you sure you want to delete the job <span className="font-medium">{jobToDelete?.name}</span>?
            This will also delete all associated interviews and cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={cancelDelete}>Cancel</button>
            <button 
              className="btn btn-error" 
              onClick={confirmDelete}
              disabled={deleteJob.isPending}
            >
              {deleteJob.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Deleting...
                </>
              ) : (
                'Delete Job'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={cancelDelete}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default JobsPage;
