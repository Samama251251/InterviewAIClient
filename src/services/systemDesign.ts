import api from './api';
import { 
  SystemDesignQuestion, 
  SystemDesignSubmission, 
  SystemDesignSubmitRequest,
  SystemDesignSubmitResponse,
  SystemDesignQuestionsResponse
} from '../types/systemDesign';

/**
 * Fetch system design questions from the server
 * @param limit Optional limit for the number of questions to retrieve (default: 5)
 * @returns Promise with system design questions
 */
export const getSystemDesignQuestions = async (limit: number = 5): Promise<SystemDesignQuestion[]> => {
  try {
    const response = await api.get<SystemDesignQuestionsResponse>(
      `/system-design?limit=${limit}`
    );

    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch system design questions');
    }
  } catch (error) {
    console.error('Error fetching system design questions:', error);
    throw error;
  }
};

/**
 * Submit system design solutions for evaluation
 * @param interviewId The ID of the interview
 * @param submissions Array of system design submissions
 * @returns Promise with submission response
 */
export const submitSystemDesign = async (
  interviewId: string,
  submissions: SystemDesignSubmission[]
): Promise<SystemDesignSubmitResponse> => {
  try {
    console.log("Submissions: ", submissions);
    const payload: SystemDesignSubmitRequest = {
      interviewId,
      submissions
    };

    const response = await api.post<SystemDesignSubmitResponse>(
      `/system-design`,
      payload
    );

    console.log("Response: ", response.data);

    return response.data;
  } catch (error) {
    console.error('Error submitting system design:', error);
    throw error;
  }
};

/**
 * Save diagram data to the server
 * @param interviewId The ID of the interview  
 * @param diagramData The diagram data to save
 * @returns Promise with save response
 */
export const saveDiagram = async (interviewId: string, diagramData: any): Promise<any> => {
  try {
    const response = await api.post(`/system-design/diagrams/${interviewId}`, {
      diagramData
    });
    return response.data;
  } catch (error) {
    console.error('Error saving diagram:', error);
    throw error;
  }
};

/**
 * Get saved diagram data from the server
 * @param interviewId The ID of the interview
 * @returns Promise with diagram data
 */
export const getDiagram = async (interviewId: string): Promise<any> => {
  try {
    const response = await api.get(`/system-design/diagrams/${interviewId}`);
    return response.data.diagramData;
  } catch (error) {
    console.error('Error getting diagram:', error);
    throw error;
  }
};

/**
 * Save diagram data to local storage
 * @param diagramData The diagram data to save
 * @param key The key to save the data under
 */
export const saveLocal = (diagramData: any, key: string): void => {
  localStorage.setItem(key, JSON.stringify(diagramData));
};

/**
 * Load diagram data from local storage
 * @param key The key to load the data from
 * @returns The diagram data or null if not found
 */
export const loadLocal = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Convert an image file to base64 string
 * @param file The image file to convert
 * @returns Promise with base64 string
 */
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
