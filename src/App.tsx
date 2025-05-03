import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Landing } from "@/pages/Landing"
import { NotFound } from "@/pages/NotFound"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import DashboardLayout from "@/components/layout/DashbordLayout"
import MainLayout from "@/components/layout/MainLayout"
import DashboardOverview from "@/pages/dashboard/DashboardOverview"
import JobsPage from "@/pages/dashboard/JobsPage"
import JobDetailPage from "@/pages/dashboard/JobDetailPage"
import CandidatesPage from "@/pages/dashboard/CandidatesPage"
import SettingsPage from "@/pages/dashboard/SettingsPage"
import ProfilePage from "@/pages/dashboard/ProfilePage"
import IntervieweeDashboard from "@/pages/IntervieweDashboard"
import PrivateRoute from "@/components/common/PrivateRoute"
import { useState, useEffect } from 'react';

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
          {/* Public routes with Header and Footer */}
          <Route element={<MainLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* NotFound should also use the MainLayout */}
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Dashboard routes with Navbar and no Footer */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Interviewee dashboard with same layout as company dashboard */}
          <Route 
            path="/int" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<IntervieweeDashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
