import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Job, CreateJobInput, UpdateJobInput } from '../types/job';
import { useToast } from './useToast';

// Query keys
const JOBS = 'jobs';

// Hook for jobs data
export const useJobs = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Get all jobs
  const getJobs = useQuery({
    queryKey: [JOBS],
    queryFn: async () => {
      try {
        const response = await api.get('/jobs');
        return response.data.data;
      } catch (error) {
        toast.error('Failed to fetch jobs');
        throw error;
      }
    }
  });

  // Get job by ID
  const getJobById = (id: string) => useQuery({
    queryKey: [JOBS, id],
    queryFn: async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        return response.data.data;
      } catch (error) {
        toast.error('Failed to fetch job details');
        throw error;
      }
    },
    enabled: !!id, // Only run if ID is provided
  });

  // Create a new job
  const createJob = useMutation({
    mutationFn: async (data: CreateJobInput) => {
      const response = await api.post('/jobs', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Job created successfully');
      queryClient.invalidateQueries({ queryKey: [JOBS] });
    },
    onError: () => {
      toast.error('Failed to create job');
    },
  });

  // Update a job
  const updateJob = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateJobInput }) => {
      const response = await api.put(`/jobs/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Job updated successfully');
      queryClient.invalidateQueries({ queryKey: [JOBS] });
      queryClient.invalidateQueries({ queryKey: [JOBS, variables.id] });
    },
    onError: () => {
      toast.error('Failed to update job');
    },
  });

  // Delete a job
  const deleteJob = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Job deleted successfully');
      queryClient.invalidateQueries({ queryKey: [JOBS] });
    },
    onError: () => {
      toast.error('Failed to delete job');
    },
  });

  return {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
  };
}; 