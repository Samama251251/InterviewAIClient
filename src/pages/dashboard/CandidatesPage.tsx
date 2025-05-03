import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Check, Clock } from 'lucide-react';
import { mockInterviews } from '@/data/mockData';

const CandidatesPage: React.FC = () => {
  // Get all unique candidates from all interviews
  const allInterviews = Object.values(mockInterviews).flat();
  const uniqueCandidates = Array.from(
    new Map(
      allInterviews.map(interview => [
        interview.candidateEmail,
        {
          name: interview.candidateName,
          email: interview.candidateEmail,
          interviews: allInterviews.filter(i => i.candidateEmail === interview.candidateEmail),
        }
      ])
    ).values()
  );

  return (
    <div className="space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="text-base-content/70 mt-2">
          Manage and view all candidates across your job postings.
        </p>
      </motion.div>

      <motion.div 
        className="card bg-base-100 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-300 bg-base-200/50">
            <h2 className="card-title flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> 
              All Candidates
            </h2>
            <p className="text-base-content/70 text-sm">
              A list of all candidates who have applied to your job postings.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th className="font-medium">Name</th>
                  <th className="font-medium">Email</th>
                  <th className="font-medium text-center">Total Interviews</th>
                  <th className="font-medium text-center">Completed</th>
                  <th className="font-medium text-center">Pending</th>
                  <th className="font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uniqueCandidates.map((candidate) => (
                  <motion.tr 
                    key={candidate.email}
                    className="hover:bg-base-200"
                    whileHover={{ backgroundColor: 'rgba(var(--primary-color), 0.05)' }}
                  >
                    <td className="font-medium">{candidate.name}</td>
                    <td className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary/70" />
                      {candidate.email}
                    </td>
                    <td className="text-center">{candidate.interviews.length}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Check className="h-4 w-4 text-success" />
                        {candidate.interviews.filter(i => i.status === 'completed').length}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-warning" />
                        {candidate.interviews.filter(i => i.status === 'pending').length}
                      </div>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-xs btn-primary">View</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CandidatesPage;
