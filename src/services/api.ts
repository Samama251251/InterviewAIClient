import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


export default api; 