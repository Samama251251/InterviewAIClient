export type JobStatus = 'active' | 'closed' | 'draft';

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