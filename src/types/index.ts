// Job posting and interview types

export type JobStatus = 'active' | 'closed' | 'draft';

export type InterviewStatus = 'pending' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO string
  status: JobStatus;
  createdAt: string; // ISO string
  applicantCount: number;
  pendingInterviewsCount: number;
  completedInterviewsCount: number;
}

export interface Interview {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  status: InterviewStatus;
  scheduledFor?: string; // ISO string
  completedAt?: string; // ISO string
  score?: number;
  feedback?: string;
}