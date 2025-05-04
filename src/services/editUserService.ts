import api from './api';
import { EditUserData, EditUserResponse, User } from '@/types/user';

/**
 * Updates a user's details
 * @param userId The ID of the user to update
 * @param userData The data to update (currently only name)
 * @returns A promise with the updated user data
 */
export const editUser = async (userId: string, userData: EditUserData): Promise<User> => {
  try {
    const response = await api.put<EditUserResponse>(`/users/${userId}`, userData);
    return response.data.data;
  } catch (error) {
    // If there's an error, convert it to a more useful format and rethrow
    let errorMessage = 'Failed to update user details';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export default editUser; 