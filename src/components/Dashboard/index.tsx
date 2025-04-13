import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Overview from './Overview';
import JobPostings from './JobPostings';
import JobDetail from './JobDetail';
import Candidates from './ Candidates';
import CandidateDetail from './ CandidateDetail';
import Settings from './Settings';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/jobs" element={<JobPostings />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;