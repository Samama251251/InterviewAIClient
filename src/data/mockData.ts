import { Job, Interview } from '../types';

// Mock job data
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'We are looking for a Frontend Developer proficient in React, TypeScript, and modern CSS frameworks like Tailwind.',
    deadline: '2025-05-15T23:59:59Z',
    status: 'active',
    createdAt: '2025-04-01T10:30:00Z',
    applicantCount: 12,
    pendingInterviewsCount: 8,
    completedInterviewsCount: 4
  },
  {
    id: '2',
    title: 'Backend Engineer',
    description: 'Seeking a Backend Engineer with expertise in Node.js, Express, and database design.',
    deadline: '2025-05-20T23:59:59Z',
    status: 'active',
    createdAt: '2025-04-02T14:15:00Z',
    applicantCount: 9,
    pendingInterviewsCount: 6,
    completedInterviewsCount: 3
  },
  {
    id: '3',
    title: 'DevOps Specialist',
    description: 'Looking for a DevOps specialist with experience in AWS, Docker, and CI/CD pipelines.',
    deadline: '2025-05-10T23:59:59Z',
    status: 'active',
    createdAt: '2025-04-03T09:45:00Z',
    applicantCount: 7,
    pendingInterviewsCount: 5,
    completedInterviewsCount: 2
  },
  {
    id: '4',
    title: 'UX Designer',
    description: 'Seeking a UX Designer with experience in user research, wireframing, and prototyping.',
    deadline: '2025-04-25T23:59:59Z',
    status: 'closed',
    createdAt: '2025-03-15T11:20:00Z',
    applicantCount: 18,
    pendingInterviewsCount: 0,
    completedInterviewsCount: 15
  },
  {
    id: '5',
    title: 'Data Scientist',
    description: 'Looking for a Data Scientist proficient in Python, machine learning, and data visualization.',
    deadline: '2025-05-30T23:59:59Z',
    status: 'draft',
    createdAt: '2025-04-10T16:30:00Z',
    applicantCount: 0,
    pendingInterviewsCount: 0,
    completedInterviewsCount: 0
  }
];

// Mock interview data
export const mockInterviews: Record<string, Interview[]> = {
  '1': [
    {
      id: '101',
      jobId: '1',
      candidateName: 'Alex Johnson',
      candidateEmail: 'alex.johnson@example.com',
      status: 'completed',
      scheduledFor: '2025-04-08T10:00:00Z',
      completedAt: '2025-04-08T10:45:00Z',
      score: 85,
      feedback: 'Strong knowledge of React and state management. Could improve on CSS animations and performance optimization.'
    },
    {
      id: '102',
      jobId: '1',
      candidateName: 'Sam Williams',
      candidateEmail: 'sam.williams@example.com',
      status: 'completed',
      scheduledFor: '2025-04-09T14:00:00Z',
      completedAt: '2025-04-09T14:50:00Z',
      score: 72,
      feedback: 'Good understanding of TypeScript. Needs to work on React hooks and component optimization.'
    },
    {
      id: '103',
      jobId: '1',
      candidateName: 'Jordan Lee',
      candidateEmail: 'jordan.lee@example.com',
      status: 'completed',
      scheduledFor: '2025-04-10T11:00:00Z',
      completedAt: '2025-04-10T11:40:00Z',
      score: 92,
      feedback: 'Excellent knowledge of modern frontend practices. Strong problem-solving skills.'
    },
    {
      id: '104',
      jobId: '1',
      candidateName: 'Taylor Smith',
      candidateEmail: 'taylor.smith@example.com',
      status: 'pending',
      scheduledFor: '2025-04-20T15:00:00Z'
    },
    {
      id: '105',
      jobId: '1',
      candidateName: 'Morgan Brown',
      candidateEmail: 'morgan.brown@example.com',
      status: 'pending',
      scheduledFor: '2025-04-21T13:00:00Z'
    },
    {
      id: '106',
      jobId: '1',
      candidateName: 'Casey Garcia',
      candidateEmail: 'casey.garcia@example.com',
      status: 'pending',
      scheduledFor: '2025-04-22T10:00:00Z'
    },
    {
      id: '107',
      jobId: '1',
      candidateName: 'Riley Wilson',
      candidateEmail: 'riley.wilson@example.com',
      status: 'pending',
      scheduledFor: '2025-04-23T14:00:00Z'
    },
  ],
  '2': [
    {
      id: '201',
      jobId: '2',
      candidateName: 'Jordan Martinez',
      candidateEmail: 'jordan.martinez@example.com',
      status: 'completed',
      scheduledFor: '2025-04-11T09:00:00Z',
      completedAt: '2025-04-11T09:50:00Z',
      score: 88,
      feedback: 'Strong knowledge of Node.js and database design. Good understanding of API architecture.'
    },
    {
      id: '202',
      jobId: '2',
      candidateName: 'Alex Rodriguez',
      candidateEmail: 'alex.rodriguez@example.com',
      status: 'completed',
      scheduledFor: '2025-04-12T13:00:00Z',
      completedAt: '2025-04-12T13:45:00Z',
      score: 76,
      feedback: 'Good understanding of Express. Needs work on database optimization and security practices.'
    },
    {
      id: '203',
      jobId: '2',
      candidateName: 'Sam Thompson',
      candidateEmail: 'sam.thompson@example.com',
      status: 'pending',
      scheduledFor: '2025-04-24T10:00:00Z'
    },
  ]
};

// Function to get interviews by job id and status
export const getInterviewsByJobAndStatus = (jobId: string, status: 'pending' | 'completed'): Interview[] => {
  const jobInterviews = mockInterviews[jobId] || [];
  return jobInterviews.filter(interview => interview.status === status);
};
