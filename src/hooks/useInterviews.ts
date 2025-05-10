import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Interview, CreateInterviewInput, UpdateInterviewInput, InterviewsResponse, InterviewResponse, InterviewDeleteResponse } from '../types/interview';
import { useToast } from './useToast';

// Query keys
const INTERVIEWS = 'interviews';

// Hook for interviews data
export const useInterviews = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Get all interviews
  const getInterviews = useQuery({
    queryKey: [INTERVIEWS],
    queryFn: async (): Promise<Interview[]> => {
      try {
        const response = await api.get<InterviewsResponse>('/interviews');
        return response.data.data;
      } catch (error) {
        toast.error('Failed to fetch interviews');
        throw error;
      }
    }
  });

  // Get interview by ID
  const getInterviewById = (id: string) => {
    const query = useQuery({
      queryKey: [INTERVIEWS, id],
      queryFn: async (): Promise<Interview> => {
        try {
          const response = await api.get<InterviewResponse>(`/interviews/${id}`);
          return response.data.data;
        } catch (error) {
          toast.error('Failed to fetch interview details');
          throw error;
        }
      },
      enabled: !!id, // Only run if ID is provided
    });
    
    return {
      ...query,
      refetch: query.refetch
    };
  };

  // Create a new interview
  const createInterview = useMutation({
    mutationFn: async (data: CreateInterviewInput): Promise<Interview> => {
      const response = await api.post<InterviewResponse>('/interviews', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Interview scheduled successfully');
      queryClient.invalidateQueries({ queryKey: [INTERVIEWS] });
    },
    onError: () => {
      toast.error('Failed to schedule interview');
    },
  });

  // Update an interview
  const updateInterview = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInterviewInput }): Promise<Interview> => {
      const response = await api.put<InterviewResponse>(`/interviews/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Interview updated successfully');
      queryClient.invalidateQueries({ queryKey: [INTERVIEWS] });
      queryClient.invalidateQueries({ queryKey: [INTERVIEWS, variables.id] });
    },
    onError: () => {
      toast.error('Failed to update interview');
    },
  });

  // Delete an interview
  const deleteInterview = useMutation({
    mutationFn: async (id: string): Promise<{ status: string; message: string }> => {
      const response = await api.delete<InterviewDeleteResponse>(`/interviews/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Interview canceled successfully');
      queryClient.invalidateQueries({ queryKey: [INTERVIEWS] });
    },
    onError: () => {
      toast.error('Failed to cancel interview');
    },
  });

  return {
    getInterviews,
    getInterviewById,
    createInterview,
    updateInterview,
    deleteInterview,
  };
}; 