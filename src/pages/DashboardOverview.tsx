import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, CheckCheck, Clock, Users, BriefcaseBusiness, Building2, PanelRight, Calendar, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Dummy data for now, structured to match API response format
const dummyJobsData = {
  appliedJobs: [
    {
      _id: "job1",
      name: "Frontend Developer",
      description: "Build and maintain modern web applications",
      company_id: {
        _id: "company1",
        name: "TechCorp",
        description: "Leading tech company",
        owner_id: "user1"
      }
    },
    {
      _id: "job2",
      name: "Backend Engineer",
      description: "Design and implement server-side solutions",
      company_id: {
        _id: "company2",
        name: "DataSystems",
        description: "Data processing company",
        owner_id: "user2"
      }
    }
  ],
  ownedCompanyJobs: [
    {
      _id: "job3",
      name: "UI/UX Designer",
      description: "Create beautiful and functional user interfaces",
      company_id: {
        _id: "company3",
        name: "DesignLab",
        description: "Design agency",
        owner_id: "user3"
      }
    }
  ],
  employeeCompanyJobs: [
    {
      _id: "job4",
      name: "DevOps Engineer",
      description: "Manage and optimize infrastructure",
      company_id: {
        _id: "company4", 
        name: "CloudTech",
        description: "Cloud solutions provider",
        owner_id: "user4"
      }
    },
    {
      _id: "job5",
      name: "Product Manager",
      description: "Lead product development and strategy",
      company_id: {
        _id: "company4",
        name: "CloudTech",
        description: "Cloud solutions provider",
        owner_id: "user4"
      }
    }
  ]
};

// Dummy companies data
const dummyCompanies = [
  {
    _id: "company1",
    name: "TechCorp",
    description: "Leading technology solutions provider",
    owner_id: "user123",
    role: "employee"
  },
  {
    _id: "company3",
    name: "DesignLab",
    description: "Creative design and branding agency",
    owner_id: "currentUser", // Assuming this is the current user's ID
    role: "owner"
  },
  {
    _id: "company4",
    name: "CloudTech",
    description: "Cloud infrastructure and DevOps solutions",
    owner_id: "user456",
    role: "employee"
  },
  {
    _id: "company5",
    name: "InnovateX",
    description: "Innovation and product development consultancy",
    owner_id: "currentUser", // Assuming this is the current user's ID
    role: "owner"
  }
];

// Dummy interviews data
const dummyInterviews = [
  {
    _id: "interview1",
    job_id: {
      _id: "job1",
      name: "Frontend Developer",
      description: "Build and maintain modern web applications",
      company_id: {
        _id: "company1",
        name: "TechCorp"
      }
    },
    user_id: "user1",
    time: "14:00",
    date: "2023-12-15T00:00:00.000Z",
    status: "pending"
  },
  {
    _id: "interview2",
    job_id: {
      _id: "job2",
      name: "Backend Engineer",
      description: "Design and implement server-side solutions",
      company_id: {
        _id: "company2",
        name: "DataSystems"
      }
    },
    user_id: "user1",
    time: "10:30",
    date: "2023-12-20T00:00:00.000Z",
    status: "completed"
  },
  {
    _id: "interview3",
    job_id: {
      _id: "job3",
      name: "UI/UX Designer",
      description: "Create beautiful and functional user interfaces",
      company_id: {
        _id: "company3",
        name: "DesignLab"
      }
    },
    user_id: "user1",
    time: "11:00",
    date: "2023-12-22T00:00:00.000Z",
    status: "completed"
  }
];

const DashboardOverview = () => {
  const navigate = useNavigate();
  
  // Use dummy data
  const jobsData = dummyJobsData;
  const interviewsData = dummyInterviews;
  const companiesData = dummyCompanies;

  // Calculate statistics
  const totalJobs = 
    (jobsData.appliedJobs?.length || 0) + 
    (jobsData.ownedCompanyJobs?.length || 0) + 
    (jobsData.employeeCompanyJobs?.length || 0);
    
  const applicantCount = Math.floor(Math.random() * 50) + 10; // Random dummy applicant count for now
  const pendingInterviews = interviewsData.filter(interview => interview.status === 'pending').length;
  const completedInterviews = interviewsData.filter(interview => interview.status === 'completed').length;

  // Get upcoming interviews, sorted by date
  const upcomingInterviews = [...interviewsData]
    .filter(interview => interview.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Combine all jobs into a single array for display
  const allJobs = [
    ...(jobsData.ownedCompanyJobs || []).map(job => ({ ...job, relationship: 'owner' })),
    ...(jobsData.employeeCompanyJobs || []).map(job => ({ ...job, relationship: 'employee' })),
    ...(jobsData.appliedJobs || []).map(job => ({ ...job, relationship: 'applicant' }))
  ].slice(0, 5);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Count companies by role
  const ownedCompanies = companiesData.filter(company => company.role === 'owner').length;
  const employeeCompanies = companiesData.filter(company => company.role === 'employee').length;

  return (
    <motion.div 
      className="p-4 md:p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-base-content/70 mt-2">
          Welcome to your InterviewAI dashboard. Manage your companies and jobs from here.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Total Jobs</h3>
              <BriefcaseBusiness className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{totalJobs}</div>
              <p className="text-xs text-base-content/70 mt-1">
                Across all companies
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Companies</h3>
              <Building2 className="h-5 w-5 text-secondary" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{companiesData.length}</div>
              <p className="text-xs text-base-content/70 mt-1">
                {ownedCompanies} owned, {employeeCompanies} employed
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Applicants</h3>
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{applicantCount}</div>
              <p className="text-xs text-base-content/70 mt-1">
                Across all job postings
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="card-title text-sm font-medium">Interviews</h3>
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{pendingInterviews + completedInterviews}</div>
              <p className="text-xs text-base-content/70 mt-1">
                {pendingInterviews} pending, {completedInterviews} completed
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Jobs Table Section */}
        <motion.div 
          className="lg:col-span-7 card bg-base-100 shadow-sm border border-base-300"
          variants={itemVariants}
        >
          <div className="card-body p-0">
            <div className="p-4 md:p-6 border-b border-base-300">
              <div className="flex justify-between items-center">
                <h3 className="card-title">Recent Jobs</h3>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => navigate('/jobs')}
                >
                  View all
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200/50">
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Relationship</th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-base-200/50">
                      <td className="font-medium">{job.name}</td>
                      <td>{job.company_id.name}</td>
                      <td>
                        <span className={`badge ${
                          job.relationship === 'owner' 
                            ? 'badge-primary' 
                            : job.relationship === 'employee' 
                              ? 'badge-secondary' 
                              : 'badge-accent'
                        } badge-sm`}>
                          {job.relationship}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/employee/jobs/${job._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {allJobs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-base-content/70">
                        No jobs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Companies Section */}
        <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>
          {/* Companies */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="card-title">Your Companies</h3>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => navigate('/companies')}
                >
                  View all
                </button>
              </div>
              
              <div className="space-y-3">
                {companiesData.map((company) => (
                  <div 
                    key={company._id}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors cursor-pointer"
                    onClick={() => navigate(`/companies/${company._id}`)}
                  >
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full ${
                      company.role === 'owner' ? 'bg-primary/10' : 'bg-secondary/10'
                    } flex items-center justify-center`}>
                      <Building2 className={`h-5 w-5 ${
                        company.role === 'owner' ? 'text-primary' : 'text-secondary'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{company.name}</p>
                      <p className="text-xs text-base-content/70 truncate">{company.description}</p>
                    </div>
                    <div>
                      <span className={`badge ${
                        company.role === 'owner' ? 'badge-primary' : 'badge-secondary'
                      } badge-sm`}>
                        {company.role}
                      </span>
                    </div>
                  </div>
                ))}
                
                {companiesData.length === 0 && (
                  <div className="text-center py-6 text-base-content/70">
                    No companies found
                  </div>
                )}
              </div>
              
              <div className="card-actions mt-4">
                <button 
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => navigate('/employee/companies/new')}
                >
                  Create New Company
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="card bg-base-100 shadow-sm border border-base-300"
        variants={itemVariants}
      >
        <div className="card-body">
          <h3 className="card-title mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/jobs/new')}
            >
              Post New Job
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/employee/candidates')}
            >
              View Candidates
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/employee/settings')}
            >
              Account Settings
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/employee/reports')}
            >
              Generate Reports
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
