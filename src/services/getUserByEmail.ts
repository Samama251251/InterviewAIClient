import api from "@/services/api";

// User response type for GET /users/email/:email endpoint
interface UserResponse {
    status: string;
    data: {
      _id: string;
      name: string;
      email: string;
    };
  }

  // Function to get user by email
 export const getUserByEmail = async (email: string) => {
    try {
      const response = await api.get<UserResponse>(`/users/email/${email}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('User not found. Please ensure the email is registered.');
      }
      throw new Error('Failed to fetch user information.');
    }
  };