import { Job, Candidate, Interview, Profile, NotificationPreferences } from '../../types';

// Mock Jobs
export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'We are looking for a Frontend Developer proficient in React, TypeScript, and modern CSS frameworks like Tailwind.',
    deadline: '2025-05-16',
    field: 'Web Development',
    status: 'active',
    interview_rounds: ['dsa', 'techStack', 'behavioral'],
    applicants_count: 12,
    pending_count: 8,
    completed_count: 4,
    created_at: '2025-04-01',
    created_by: 'user-1'
  },
  {
    id: '2',
    title: 'Backend Engineer',
    description: 'Seeking a Backend Engineer with expertise in Node.js, Express, and database design.',
    deadline: '2025-05-21',
    field: 'Web Development',
    status: 'active',
    interview_rounds: ['techStack', 'systemDesign', 'behavioral'],
    applicants_count: 9,
    pending_count: 6,
    completed_count: 3,
    created_at: '2025-04-03',
    created_by: 'user-1'
  },
  {
    id: '3',
    title: 'DevOps Specialist',
    description: 'Looking for a DevOps specialist with experience in AWS, Docker, and CI/CD pipelines.',
    deadline: '2025-05-11',
    field: 'Web Development',
    status: 'active',
    interview_rounds: ['techStack', 'systemDesign'],
    applicants_count: 7,
    pending_count: 5,
    completed_count: 2,
    created_at: '2025-04-05',
    created_by: 'user-1'
  },
  {
    id: '4',
    title: 'UX Designer',
    description: 'Seeking a UX Designer with experience in user research, wireframing, and prototyping.',
    deadline: '2025-04-26',
    field: 'Web Development',
    status: 'closed',
    interview_rounds: ['techStack', 'behavioral'],
    applicants_count: 18,
    pending_count: 0,
    completed_count: 15,
    created_at: '2025-03-15',
    created_by: 'user-1'
  },
  {
    id: '5',
    title: 'Data Scientist',
    description: 'Looking for a Data Scientist proficient in Python, machine learning, and data visualization.',
    deadline: '2025-05-31',
    field: 'App Development',
    status: 'draft',
    interview_rounds: ['dsa', 'techStack'],
    applicants_count: 0,
    pending_count: 0,
    completed_count: 0,
    created_at: '2025-04-10',
    created_by: 'user-1'
  }
];

// Mock Candidates
export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '123-456-7890',
    job_id: '1',
    status: 'completed',
    interview_score: 8,
    created_at: '2025-04-05'
  },
  {
    id: '2',
    name: 'Sam Williams',
    email: 'sam.williams@example.com',
    job_id: '1',
    status: 'completed',
    interview_score: 7,
    created_at: '2025-04-06'
  },
  {
    id: '3',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    job_id: '1',
    status: 'completed',
    interview_score: 9,
    created_at: '2025-04-07'
  },
  {
    id: '4',
    name: 'Taylor Smith',
    email: 'taylor.smith@example.com',
    job_id: '2',
    status: 'pending',
    interview_date: '2025-04-20',
    created_at: '2025-04-08'
  },
  {
    id: '5',
    name: 'Morgan Brown',
    email: 'morgan.brown@example.com',
    phone: '234-567-8901',
    job_id: '2',
    status: 'pending',
    interview_date: '2025-04-21',
    created_at: '2025-04-09'
  },
  {
    id: '6',
    name: 'Casey Garcia',
    email: 'casey.garcia@example.com',
    job_id: '3',
    status: 'pending',
    interview_date: '2025-04-22',
    created_at: '2025-04-10'
  },
  {
    id: '7',
    name: 'Riley Wilson',
    email: 'riley.wilson@example.com',
    job_id: '3',
    status: 'pending',
    interview_date: '2025-04-23',
    created_at: '2025-04-11'
  },
  {
    id: '8',
    name: 'Jordan Martinez',
    email: 'jordan.martinez@example.com',
    phone: '345-678-9012',
    job_id: '4',
    status: 'completed',
    interview_score: 8,
    created_at: '2025-03-20'
  },
  {
    id: '9',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@example.com',
    job_id: '4',
    status: 'completed',
    interview_score: 6,
    created_at: '2025-03-21'
  },
  {
    id: '10',
    name: 'Sam Thompson',
    email: 'sam.thompson@example.com',
    job_id: '4',
    status: 'pending',
    created_at: '2025-03-22'
  }
];

// Mock Interviews
export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: '1',
    candidate_id: '1',
    interview_date: '2025-04-12T10:00:00',
    status: 'completed',
    interview_type: 'techStack',
    feedback: 'Strong knowledge of React and modern JavaScript. Good problem-solving skills.',
    score: 8,
    created_at: '2025-04-05'
  },
  {
    id: '2',
    candidate_id: '2',
    interview_date: '2025-04-13T14:00:00',
    status: 'completed',
    interview_type: 'dsa',
    feedback: 'Solved most problems efficiently. Could improve on optimization techniques.',
    score: 7,
    created_at: '2025-04-06'
  },
  {
    id: '3',
    candidate_id: '3',
    interview_date: '2025-04-14T11:00:00',
    status: 'completed',
    interview_type: 'behavioral',
    feedback: 'Excellent communication skills and team-oriented mindset. Very professional.',
    score: 9,
    created_at: '2025-04-07'
  },
  {
    id: '4',
    candidate_id: '4',
    interview_date: '2025-04-20T10:00:00',
    status: 'scheduled',
    interview_type: 'techStack',
    created_at: '2025-04-08'
  },
  {
    id: '5',
    candidate_id: '5',
    interview_date: '2025-04-21T15:00:00',
    status: 'scheduled',
    interview_type: 'systemDesign',
    created_at: '2025-04-09'
  },
  {
    id: '6',
    candidate_id: '6',
    interview_date: '2025-04-22T11:00:00',
    status: 'scheduled',
    interview_type: 'techStack',
    created_at: '2025-04-10'
  },
  {
    id: '7',
    candidate_id: '7',
    interview_date: '2025-04-23T14:00:00',
    status: 'scheduled',
    interview_type: 'behavioral',
    created_at: '2025-04-11'
  },
  {
    id: '8',
    candidate_id: '8',
    interview_date: '2025-03-25T10:00:00',
    status: 'completed',
    interview_type: 'techStack',
    feedback: 'Good understanding of design principles and UX methodologies.',
    score: 8,
    created_at: '2025-03-20'
  },
  {
    id: '9',
    candidate_id: '9',
    interview_date: '2025-03-26T13:00:00',
    status: 'completed',
    interview_type: 'behavioral',
    feedback: 'Could improve communication skills. Technical knowledge is good.',
    score: 6,
    created_at: '2025-03-21'
  }
];

// Mock Profile and Preferences
export const MOCK_PROFILE: Profile = {
  id: '1',
  user_id: 'user-1',
  full_name: 'John Doe',
  email: 'john.doe@example.com',
  company_name: 'Acme Inc.',
  position: 'HR Manager',
  company_bio: 'Acme Inc. is a leading technology company focused on innovation and growth.',
  created_at: '2025-01-01',
  updated_at: '2025-04-01'
};

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  id: '1',
  user_id: 'user-1',
  email_notifications: true,
  new_interview_alerts: true,
  interview_results: true,
  weekly_reports: false,
  created_at: '2025-01-01',
  updated_at: '2025-04-01'
};