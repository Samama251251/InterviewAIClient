import api from './api';
import { CVResponse } from '@/types/cv';

/**
 * Upload a CV for an interview
 * @param interviewId The ID of the interview
 * @param cvBase64 The CV file as a base64 string
 * @returns Promise with the CV upload response
 */
export const uploadCV = async (interviewId: string, cvBase64: string): Promise<CVResponse> => {
  try {
    const response = await api.post<{status: string, data: CVResponse, message?: string}>('/cv/upload', {
      interviewId,
      cvBase64
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};

/**
 * Get CV information for an interview
 * @param interviewId The ID of the interview
 * @returns Promise with the CV information
 */
export const getCV = async (interviewId: string): Promise<CVResponse> => {
  try {
    const response = await api.get<{status: string, data: CVResponse}>(`/cv/${interviewId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching CV:', error);
    throw error;
  }
};

/**
 * Parse an already uploaded CV
 * @param interviewId The ID of the interview
 * @returns Promise with the parsed CV information
 */
export const parseCV = async (interviewId: string): Promise<CVResponse> => {
  try {
    const response = await api.post<{status: string, data: CVResponse}>(`/cv/${interviewId}/parse`);
    return response.data.data;
  } catch (error) {
    console.error('Error parsing CV:', error);
    throw error;
  }
}; 