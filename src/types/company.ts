import { User } from './user';

export interface Company {
  _id: string;
  name: string;
  description?: string;
  owner_id: string | User;
  role?: 'owner' | 'employee' | 'interviewing';
}

export interface CreateCompanyInput {
  name: string;
  description?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  description?: string;
}

export interface CompanyResponse {
  status: string;
  data: Company;
}

export interface CompaniesResponse {
  status: string;
  data: Company[];
}

export interface CompanyDeleteResponse {
  status: string;
  message: string;
} 