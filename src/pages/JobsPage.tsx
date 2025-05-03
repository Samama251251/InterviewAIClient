import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { mockJobs } from '@/data/mockData';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit, Trash, UploadCloud } from 'lucide-react';

const jobFormSchema = z.object({
  title: z.string().min(3, { message: "Job title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    description: '',
    deadline: '',
    status: 'draft'
  });
  const [date, setDate] = React.useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'applicants'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
    }
  });

  const handleJobClick = (jobId: string) => {
    navigate(`/employee/jobs/${jobId}`);
  };

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.description || !date) {
      // In a real app, add proper validation and error messages
      return;
    }

    const newJobId = `${jobs.length + 1}`;
    const createdJob: Job = {
      id: newJobId,
      title: newJob.title,
      description: newJob.description,
      deadline: date.toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      applicantCount: 0,
      pendingInterviewsCount: 0,
      completedInterviewsCount: 0
    };

    setJobs([...jobs, createdJob]);
    setNewJob({
      title: '',
      description: '',
      deadline: '',
      status: 'draft'
    });
    setDate(undefined);
    setCsvFile(null);
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'closed':
        return 'bg-muted text-muted-foreground border-muted/50';
      case 'draft':
        return 'bg-accent/20 text-accent-foreground border-accent/30';
      default:
        return 'bg-secondary text-secondary-foreground border-secondary/50';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Filter jobs by search term
  const filteredJobs = jobs.filter(
    (job) => job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'applicants') {
      return sortOrder === 'asc'
        ? a.applicantCount - b.applicantCount
        : b.applicantCount - a.applicantCount;
    } else {
      // sort by date
      return sortOrder === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    }
  });

  const toggleSort = (column: 'title' | 'date' | 'applicants') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const onSubmit = async (data: JobFormValues) => {
    console.log('Form submitted:', data);
    // Here you would normally post the job to an API
    setTimeout(() => {
      // Simulate API call delay
      setIsDialogOpen(false);
    }, 1000);
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
            Manage your company's job postings and track applicants
          </p>
        </div>
        <button
          className="btn btn-primary mt-4 sm:mt-0"
          onClick={() => setIsDialogOpen(true)}
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
            <li><a>Draft Jobs</a></li>
          </ul>
        </div>
      </motion.div>

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
                <th className="cursor-pointer py-3 px-4" onClick={() => toggleSort('title')}>
                  <div className="flex items-center">
                    Job Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th className="cursor-pointer py-3 px-4" onClick={() => toggleSort('date')}>
                  <div className="flex items-center">
                    Posted Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th className="cursor-pointer py-3 px-4" onClick={() => toggleSort('applicants')}>
                  <div className="flex items-center">
                    Applicants
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs.map((job) => (
                <tr key={job.id}>
                  <td className="py-3 px-4 font-medium">{job.title}</td>
                  <td className="py-3 px-4 text-base-content/70">
                    {format(new Date(job.deadline), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{job.applicantCount}</span>
                      <span className="text-xs text-base-content/70">
                        ({job.pendingInterviewsCount} pending / {job.completedInterviewsCount} completed)
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-sm btn-ghost btn-square"
                        onClick={() => handleJobClick(job.id)}
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

      {/* Modal for creating a new job */}
      <dialog id="job_modal" className={`modal ${isDialogOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-bold text-lg mb-4">Create New Job Posting</h3>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Job Title</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Senior Frontend Developer"
                {...register('title')}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.title.message}</span>
                </label>
              )}
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Job Description</span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-24 w-full ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Describe the role, responsibilities, and company culture"
                {...register('description')}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description.message}</span>
                </label>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Requirements</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered h-24 w-full ${errors.requirements ? 'textarea-error' : ''}`}
                  placeholder="List the skills, qualifications, and experience required"
                  {...register('requirements')}
                />
                {errors.requirements && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.requirements.message}</span>
                  </label>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
                    placeholder="e.g., Remote, New York, Hybrid"
                    {...register('location')}
                  />
                  {errors.location && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.location.message}</span>
                    </label>
                  )}
                </div>
                
                <div className="form-control border border-base-300 rounded-lg p-4">
                  <label className="flex flex-col items-center cursor-pointer text-center space-y-2">
                    <UploadCloud className="w-10 h-10 text-primary opacity-70" />
                    <span className="label-text font-medium">Upload Additional Documents</span>
                    <span className="text-xs text-base-content/70">(Optional) PDF, DOCX up to 5MB</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-action mt-6">
              <button type="button" className="btn" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  'Create Job'
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDialogOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default JobsPage;
