import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit, Trash, Briefcase } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/useToast';
import CreateJobModal from '@/components/Job/CreateJobModal';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { selectedCompany } = useCompanyContext();
  const { getJobs } = useJobs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'deadline' | 'applicants'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  // Filter jobs by search term
  const filteredJobs = companyJobs.filter(
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
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>All Jobs</a></li>
            <li><a>Active Jobs</a></li>
            <li><a>Closed Jobs</a></li>
          </ul>
        </div>
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
            {searchTerm ? 'No jobs match your search criteria.' : 'No jobs have been created for this company yet.'}
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
                    <td className="py-3 px-4">{job.framework}</td>
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
                        <button className="btn btn-sm btn-ghost btn-square">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="btn btn-sm btn-ghost btn-square text-error">
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
    </div>
  );
};

export default JobsPage;
