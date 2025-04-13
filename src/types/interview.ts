export type InterviewStatus = 'pending' | 'completed' | 'cancelled';

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