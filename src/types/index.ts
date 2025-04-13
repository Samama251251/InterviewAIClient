// User types
export interface User {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  }
  
  // Auth context types
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
  }
  
  // Job related types
  export interface Job {
    id: string;
    title: string;
    description: string;
    deadline: string;
    field: string;
    status: 'active' | 'closed' | 'draft';
    interview_rounds: string[];
    applicants_count: number;
    pending_count: number;
    completed_count: number;
    created_at: string;
    created_by: string;
  }
  
  export interface NewJob {
    title: string;
    description: string;
    field: string;
    deadline: string;
    interview_rounds: {
      dsa: boolean;
      techStack: boolean;
      systemDesign: boolean;
      behavioral: boolean;
    };
  }
  
  // Candidate related types
  export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone?: string;
    resume_url?: string;
    job_id: string;
    status: 'pending' | 'completed';
    interview_score?: number;
    interview_feedback?: string;
    interview_date?: string;
    created_at: string;
  }
  
  // Interview related types
  export interface Interview {
    id: string;
    candidate_id: string;
    interview_date: string;
    status: 'completed' | 'scheduled' | 'canceled';
    interview_type: string;
    feedback?: string;
    score?: number;
    created_at: string;
  }
  
  // Profile related types
  export interface Profile {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    company_name: string;
    position: string;
    company_bio: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface NotificationPreferences {
    id: string;
    user_id: string;
    email_notifications: boolean;
    new_interview_alerts: boolean;
    interview_results: boolean;
    weekly_reports: boolean;
    created_at: string;
    updated_at: string;
  }