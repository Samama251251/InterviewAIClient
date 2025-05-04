import { User } from './user';
import { Company } from './company';

export interface Employee {
  _id: string;
  company_id: string | Company;
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