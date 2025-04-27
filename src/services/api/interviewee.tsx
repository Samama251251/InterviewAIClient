import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Define interfaces based on the API schema
interface Company {
  _id: string;
  name: string;
  description?: string;
  owner_id: string;
  role: string;
}

interface Job {
  _id: string;
  name: string;
  description: string;
  company_id: {
    _id: string;
    name: string;
    description?: string;
    owner_id?: string;
  };
}

interface Interview {
  _id: string;
  job_id: {
    _id: string;
    name: string;
    description?: string;
    company_id: {
      _id: string;
      name: string;
    };
  };
  user_id: string;
  time: string;
  date: string;
}

interface JobsResponse {
  appliedJobs: Job[];
  ownedCompanyJobs: Job[];
  employeeCompanyJobs: Job[];
}

/**
 * Get all interviews for the authenticated interviewee
 * @returns {Promise<Interview[]>} Promise object representing the interviews
 */
export const getIntervieweeInterviews = async (): Promise<Interview[]> => {
  const response = await axios.get(`${API_URL}/interviews`, {
    withCredentials: true, // Send cookies with the request for authentication
  });
  return response.data.data;
};

/**
 * Get all companies the interviewee is interviewing with
 * @returns {Promise<Company[]>} Promise object representing the companies
 */
export const getIntervieweeCompanies = async (): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}/companies`, {
    withCredentials: true, // Send cookies with the request for authentication
  });
  // Filter for companies where role is 'interviewing'
  return response.data.data.filter((company: Company) => company.role === 'interviewing');
};

/**
 * Get all jobs the interviewee has applied for
 * @returns {Promise<Job[]>} Promise object representing the jobs
 */
export const getIntervieweeJobs = async (): Promise<Job[]> => {
  const response = await axios.get<{ data: JobsResponse }>(`${API_URL}/jobs`, {
    withCredentials: true, // Send cookies with the request for authentication
  });
  // Return only the applied jobs from the response
  return response.data.data.appliedJobs;
};

/**
 * Get details of a specific interview
 * @param {string} id - The interview ID
 * @returns {Promise<Interview>} Promise object representing the interview details
 */
export const getInterviewDetails = async (id: string): Promise<Interview> => {
  const response = await axios.get(`${API_URL}/interviews/${id}`, {
    withCredentials: true, // Send cookies with the request for authentication
  });
  return response.data.data;
};

/**
 * Apply for a job (this creates an interview)
 * @param {string} jobId - The job ID to apply for
 * @returns {Promise<Interview>} Promise object representing the created interview
 */
export const applyForJob = async (jobId: string): Promise<Interview> => {
  const response = await axios.post(
    `${API_URL}/jobs/${jobId}/apply`,
    {},
    {
      withCredentials: true, // Send cookies with the request for authentication
    }
  );
  return response.data.data;
};
