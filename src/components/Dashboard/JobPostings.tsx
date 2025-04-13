import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_JOBS } from './mockData';
import { Job } from '../../types';

// Types
interface NewJobForm {
  title: string;
  description: string;
  field: string;
  deadline: string;
  interview_rounds: {
    dsa: boolean;
    techStack: boolean;
    systemDesign: boolean;
    behavioral: boolean;
  };
  csvFile: File | null;
}

const JobPostings: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<NewJobForm>({
    title: '',
    description: '',
    field: 'Web Development',
    deadline: '',
    interview_rounds: {
      dsa: false,
      techStack: false,
      systemDesign: false,
      behavioral: false
    },
    csvFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      setJobs(MOCK_JOBS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interview_rounds: {
        ...prev.interview_rounds,
        [name]: checked
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      csvFile: file
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      field: 'Web Development',
      deadline: '',
      interview_rounds: {
        dsa: false,
        techStack: false,
        systemDesign: false,
        behavioral: false
      },
      csvFile: null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create a new job with mock data
      const newJob: Job = {
        id: `${jobs.length + 1}`,
        title: formData.title,
        description: formData.description,
        field: formData.field,
        deadline: formData.deadline,
        status: 'active',
        interview_rounds: Object.entries(formData.interview_rounds)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        applicants_count: 0,
        pending_count: 0,
        completed_count: 0,
        created_at: new Date().toISOString(),
        created_by: 'user-1'
      };
      
      // Update the local state
      setJobs(prevJobs => [newJob, ...prevJobs]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      resetForm();
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Closed</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="mt-2 text-gray-600">Manage your active job postings and create new ones.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Post New Job
        </button>
      </div>

      {/* Job Listings */}
      {isLoading ? (
        <div className="flex justify-center mt-8">
          <p>Loading job postings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                  {getStatusBadge(job.status)}
                </div>
                <p className="mt-3 text-gray-600 line-clamp-3">{job.description}</p>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-6 mt-4">
                    <div className="text-sm">
                      <i className="fas fa-user-friends mr-1 text-blue-500"></i>
                      <span>{job.applicants_count} Applicants</span>
                    </div>
                    <div className="text-sm">
                      <i className="fas fa-clock mr-1 text-yellow-500"></i>
                      <span>{job.pending_count} Pending</span>
                    </div>
                    <div className="text-sm">
                      <i className="fas fa-check-circle mr-1 text-green-500"></i>
                      <span>{job.completed_count} Completed</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/dashboard/jobs/${job.id}`}
                    className="text-green-500 hover:text-green-600 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Create New Job Posting</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p className="text-gray-600 mb-6">Enter the job details below to create a new job posting.</p>
              
              <form onSubmit={handleSubmit}>
                {/* Job Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="E.g. Frontend Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                {/* Job Field */}
                <div className="mb-4">
                  <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Field
                  </label>
                  <select
                    id="field"
                    name="field"
                    value={formData.field}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                  </select>
                </div>
                
                {/* Job Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the job responsibilities and requirements..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                {/* Interview Rounds */}
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Rounds
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dsa"
                        name="dsa"
                        checked={formData.interview_rounds.dsa}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                      />
                      <label htmlFor="dsa" className="ml-2 block text-sm text-gray-700">
                        DSA Coding Round
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="techStack"
                        name="techStack"
                        checked={formData.interview_rounds.techStack}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                      />
                      <label htmlFor="techStack" className="ml-2 block text-sm text-gray-700">
                        Tech Stack Round
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="systemDesign"
                        name="systemDesign"
                        checked={formData.interview_rounds.systemDesign}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                      />
                      <label htmlFor="systemDesign" className="ml-2 block text-sm text-gray-700">
                        System Design Round
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="behavioral"
                        name="behavioral"
                        checked={formData.interview_rounds.behavioral}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                      />
                      <label htmlFor="behavioral" className="ml-2 block text-sm text-gray-700">
                        Behavioral Round
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* CSV Upload */}
                <div className="mb-4">
                  <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload CSV with Candidates (Optional)
                  </label>
                  <input
                    type="file"
                    id="csvFile"
                    name="csvFile"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">No file selected</p>
                </div>
                
                {/* Job Deadline */}
                <div className="mb-6">
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;