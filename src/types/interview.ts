import { Job } from './job';
import { User } from './user';

export interface Interview {
  _id: string;
  job_id: string | Job;
  user_id: string | User;
  time: string;
  date: string; // ISO date string
  userRole?: 'interviewee' | 'interviewer'; // Added by the API for client context
}

export interface CreateInterviewInput {
  job_id: string;
  user_id: string;
  time: string;
  date: string; // ISO date string in YYYY-MM-DD format
}

export interface UpdateInterviewInput {
  time?: string;
  date?: string; // ISO date string in YYYY-MM-DD format
}