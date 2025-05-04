import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee';
import { useToast } from './useToast';

// Query keys
const EMPLOYEES = 'employees';

// Hook for employees data
export const useEmployees = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Get all employees
  const getEmployees = useQuery({
    queryKey: [EMPLOYEES],
    queryFn: async () => {
      try {
        const response = await api.get('/employees');
        return response.data.data;
      } catch (error) {
        toast.error('Failed to fetch employees');
        throw error;
      }
    }
  });

  // Get employee by ID
  const getEmployeeById = (id: string) => useQuery({
    queryKey: [EMPLOYEES, id],
    queryFn: async () => {
      try {
        const response = await api.get(`/employees/${id}`);
        return response.data.data;
      } catch (error) {
        toast.error('Failed to fetch employee details');
        throw error;
      }
    },
    enabled: !!id, // Only run if ID is provided
  });

  // Create a new employee
  const createEmployee = useMutation({
    mutationFn: async (data: CreateEmployeeInput) => {
      const response = await api.post('/employees', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Employee added successfully');
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES] });
    },
    onError: () => {
      toast.error('Failed to add employee');
    },
  });

  // Update an employee
  const updateEmployee = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmployeeInput }) => {
      const response = await api.put(`/employees/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Employee updated successfully');
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES] });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES, variables.id] });
    },
    onError: () => {
      toast.error('Failed to update employee');
    },
  });

  // Delete an employee
  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Employee removed successfully');
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES] });
    },
    onError: () => {
      toast.error('Failed to remove employee');
    },
  });

  return {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}; 