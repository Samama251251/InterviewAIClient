import { User } from './user';
import { RoundType } from './job';

export interface JobReference {
  _id: string;
  name: string;
  description: string;
  company_id: {
    _id: string;
    name: string;
  };
}

export interface InterviewRound {
  type: RoundType;
  score?: number;
  remarks?: string;
  status?: string;
}

export interface Interview {
  _id: string;
  job_id: string | JobReference;
  user_id: string | User;
  time: string;
  date: string; // ISO format date string
  role?: 'interviewee' | 'interviewer'; // Role field in response according to API docs
  status?: 'pending' | 'completed' | string; // Status of the interview
  rounds: InterviewRound[]; // Interview rounds data - not optional based on API spec
}

export interface CreateInterviewInput {
  job_id: string;
  user_id: string;
  time: string;
  date: string; // ISO format date string
}

export interface UpdateInterviewInput {
  time?: string;
  date?: string; // ISO format date string
  status?: 'pending' | 'completed' | string;
}

export interface UpdateInterviewRoundsInput {
  rounds: InterviewRound[];
}

export interface InterviewResponse {
  status: string;
  data: Interview;
}

export interface InterviewsResponse {
  status: string;
  data: Interview[];
}

export interface InterviewDeleteResponse {
  status: string;
  message: string;
}