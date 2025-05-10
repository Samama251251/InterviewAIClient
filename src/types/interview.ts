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
  role?: 'interviewee' | 'interviewer'; // Role field in response according to API docs
  status?: 'pending' | 'completed'; // Status of the interview
  rounds: InterviewRound[]; // Interview rounds data - not optional based on API spec
  cv_url?: string; // URL to candidate's CV
  parsed_cv?: string; // Parsed text from candidate's CV
  score?: number; // Final interview score
  remarks?: string; // Final interview remarks
}

export interface CreateInterviewInput {
  job_id: string;
  user_id: string;
}

export interface UpdateInterviewInput {
  status?: 'pending' | 'in_progress' | 'completed' | string;
}

export interface UpdateInterviewRoundsInput {
  rounds: InterviewRound[];
}

export interface FinalEvaluationResponse {
  status: string;
  data: {
    score: number;
    remarks: string;
  };
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