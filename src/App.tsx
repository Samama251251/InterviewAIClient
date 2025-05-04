import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Landing } from "@/pages/Landing"
import { NotFound } from "@/pages/NotFound"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import DashboardLayout from "@/components/layout/DashbordLayout"
import MainLayout from "@/components/layout/MainLayout"
import DashboardOverview from "@/pages/DashboardOverview"
import JobsPage from "@/pages/JobsPage"
import JobDetailPage from "@/pages/JobDetailPage"
import JobCandidatesPage from "@/pages/JobCandidatesPage"
import InterviewDetailPage from "@/pages/InterviewDetailPage"
import InterviewRoundDetailPage from "@/pages/InterviewRoundDetailPage"
import EmployeesPage from "@/pages/EmployeesPage"
import SettingsPage from "@/pages/SettingsPage"
import ProfilePage from "@/pages/ProfilePage"
import IntervieweeDashboard from "@/pages/IntervieweDashboard"
import CreateCompanyPage from "@/pages/CreateCompanyPage"
import PrivateRoute from "@/components/common/PrivateRoute"
import { useState, useEffect } from 'react';
import { CompanyProvider } from '@/contexts/CompanyContext';

function App() {
  // Theme state and toggle function
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'forest' : 'lemonade');
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'lemonade' ? 'forest' : 'lemonade');
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Router>
        <Routes>
          <Route element={<MainLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<Landing />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dashboard routes with Navbar and no Footer */}
          <Route 
            path="/employee" 
            element={
              <PrivateRoute>
                <CompanyProvider>
                  <DashboardLayout theme={theme} toggleTheme={toggleTheme} />
                </CompanyProvider>
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="jobs/:jobId/candidates" element={<JobCandidatesPage />} />
            <Route path="interviews/:interviewId" element={<InterviewDetailPage />} />
            <Route path="interviews/:interviewId/rounds/:roundIndex" element={<InterviewRoundDetailPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="companies/new" element={<CreateCompanyPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          <Route 
            path="/candidate" 
            element={
              <PrivateRoute>
                <DashboardLayout theme={theme} toggleTheme={toggleTheme} />
              </PrivateRoute>
            }
          >
            <Route index element={<IntervieweeDashboard />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
