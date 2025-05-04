import { Company } from './company';
import { User } from './user';

export interface CompanyReference {
  _id: string;
  name: string;
  description?: string;
}

export interface Employee {
  _id: string;
  company_id: string | CompanyReference;
  user_id: string | User;
  role: string;
}

export interface CreateEmployeeInput {
  company_id: string;
  user_id: string;
  role: string;
}

export interface UpdateEmployeeInput {
  role: string;
}

export interface EmployeeResponse {
  status: string;
  data: Employee;
}

export interface EmployeesResponse {
  status: string;
  data: Employee[];
}

export interface EmployeeDeleteResponse {
  status: string;
  message: string;
} 