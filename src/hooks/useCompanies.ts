import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Company, CreateCompanyInput, UpdateCompanyInput, CompaniesResponse, CompanyResponse, CompanyDeleteResponse } from '../types/company';
import { useToast } from './useToast';

// Query keys
const COMPANIES = 'companies';

// Hook for companies data
export const useCompanies = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Get all companies
  const getCompanies = useQuery({
    queryKey: [COMPANIES],
    queryFn: async (): Promise<Company[]> => {
      try {
        const response = await api.get<CompaniesResponse>('/companies');
        console.log(response)
        return response.data.data;
      } catch (error) {
        toast.error('Failed to fetch companies');
        throw error;
      }
    }
  });

  // Get company by ID
  const getCompanyById = (id: string) => useQuery({
    queryKey: [COMPANIES, id],
    queryFn: async (): Promise<Company> => {
      try {
        const response = await api.get<CompanyResponse>(`/companies/${id}`);
        return response.data.data;
      } catch (error) {
        toast.error('Failed to fetch company details');
        throw error;
      }
    },
    enabled: !!id, // Only run if ID is provided
  });

  // Create a new company
  const createCompany = useMutation({
    mutationFn: async (data: CreateCompanyInput): Promise<Company> => {
      const response = await api.post<CompanyResponse>('/companies', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Company created successfully');
      queryClient.invalidateQueries({ queryKey: [COMPANIES] });
    },
    onError: () => {
      toast.error('Failed to create company');
    },
  });

  // Update a company
  const updateCompany = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCompanyInput }): Promise<Company> => {
      const response = await api.put<CompanyResponse>(`/companies/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Company updated successfully');
      queryClient.invalidateQueries({ queryKey: [COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [COMPANIES, variables.id] });
    },
    onError: () => {
      toast.error('Failed to update company');
    },
  });

  // Delete a company
  const deleteCompany = useMutation({
    mutationFn: async (id: string): Promise<{ status: string; message: string }> => {
      const response = await api.delete<CompanyDeleteResponse>(`/companies/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Company deleted successfully');
      queryClient.invalidateQueries({ queryKey: [COMPANIES] });
    },
    onError: () => {
      toast.error('Failed to delete company');
    },
  });

  return {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
  };
}; 