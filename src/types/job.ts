export enum RoundType {
  Coding = "Coding",
  FrameworkSpecific = "FrameworkSpecific",
  SystemDesign = "SystemDesign",
  Behavioural = "Behavioural",
  KnowledgeBased = "KnowledgeBased"
}

export interface Round {
  type: RoundType;
  score?: number;
  remarks?: string;
}

export interface Job {
  _id: string;
  name: string;
  description: string;
  role: string;
  framework: string;
  rounds: Round[];
  deadline: string; // ISO date string
  company_id: string;
  relationship?: 'owner' | 'employee' | 'applicant'; // Added by the API for client-side use
}

export interface CreateJobInput {
  name: string;
  description: string;
  role: string;
  framework: string;
  rounds?: Round[];
  deadline: string; // ISO date string
  company_id: string;
}

export interface UpdateJobInput {
  name?: string;
  description?: string;
  role?: string;
  framework?: string;
  rounds?: Round[];
  deadline?: string; // ISO date string
}