import { CompanyReference } from './employee';

export type RoundType = 'Coding' | 'FrameworkSpecific' | 'SystemDesign' | 'Behavioural' | 'KnowledgeBased';

export interface Round {
  type: RoundType;
  score?: number;
  remarks?: string;
  status?: string;
}

export interface Job {
  _id: string;
  name: string;
  description: string;
  role: string;
  framework: string[];
  roundTypes: RoundType[]; // API returns roundTypes array
  deadline: string; // ISO format date string
  company_id: string | CompanyReference;
  relationship?: 'owner' | 'employee' | 'applicant'; // Added by API for client use
}

export interface CreateJobInput {
  name: string;
  description: string;
  role: string;
  framework: string[];
  roundTypes: RoundType[]; // Changed from rounds to roundTypes to match API
  deadline: string; // ISO format date string
  company_id: string;
}

export interface UpdateJobInput {
  name?: string;
  description?: string;
  role?: string;
  framework?: string[];
  roundTypes?: RoundType[]; // Changed from rounds to roundTypes to match API
  deadline?: string; // ISO format date string
}

export interface JobsGroupedResponse {
  status: string;
  data: {
    appliedJobs: Job[];
    ownedCompanyJobs: Job[];
    employeeCompanyJobs: Job[];
  };
}

export interface JobResponse {
  status: string;
  data: Job;
}

export interface JobDeleteResponse {
  status: string;
  message: string;
}