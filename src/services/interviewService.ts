import axios from 'axios';
import { Violation } from '@/types/interview';
import api from '@/services/api';


/**
 * Reports a violation for a given interview.
 * @param interviewId The ID of the interview.
 * @param violation The violation data (type and timestamp).
 * @returns The server response.
 * @throws Will throw an error if the API call fails.
 */
export const reportViolation = async (interviewId: string, violation: Violation) => {
  try {
    // The request body should be { "violation": { ... } } as per server controller
    // Using the 'api' instance which has baseURL and withCredentials configured
    const response = await api.put(
      `/interviews/${interviewId}/violations`, // Path is relative to the api instance baseURL
      { violation } 
      // withCredentials is true by default in the api instance
    );
    return response.data; // Expected: { status: "success" }
  } catch (error) {
    console.error('Error reporting violation:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Use the error message from the server if available
      throw new Error(error.response.data.message || 'Failed to report violation via API.');
    }
    // Fallback error message
    throw new Error('Failed to report violation due to an unexpected error.');
  }
}; 