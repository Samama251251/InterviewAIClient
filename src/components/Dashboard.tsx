import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './Dashboard/DashboardLayout';
import Overview from './Dashboard/Overview';
import JobPostings from './Dashboard/JobPostings';
import JobDetail from './Dashboard/JobDetail';
import Candidates from './Dashboard/ Candidates';
import CandidateDetail from './Dashboard/ CandidateDetail';
import Settings from './Dashboard/Settings';

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="jobs" element={<JobPostings />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/:candidateId" element={<CandidateDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;