export type CompanyRole = 'owner' | 'employee' | 'interviewing';

export interface Company {
  _id: string;
  name: string;
  description?: string;
  owner_id: string;
  role?: CompanyRole; // Added by the API for client-side use
}

export interface CreateCompanyInput {
  name: string;
  description?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  description?: string;
} 