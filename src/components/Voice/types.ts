export interface Resume {
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    technologies: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    role: string;
  }>;
  skills: string[];
}

export interface Role {
  title: string;
  requirements: string[];
  responsibilities: string[];
  technologies: string[];
}

export interface ButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

export interface ActiveCallDetailProps {
  assistantIsSpeaking: boolean;
  volumeLevel: number;
  onEndCallClick: () => void;
}

export interface KnowledgeBasedInterviewProps {
  resume: Resume;
  role: Role;
} 