import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Landing } from "@/pages/Landing"
import { NotFound } from "@/pages/NotFound"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import DashboardLayout from "@/components/layout/DashbordLayout"
import MainLayout from "@/components/layout/MainLayout"
import InterviewPageWrapper from "@/components/layout/InterviewPageWrapper"
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
import CandidateInterviewsPage from "@/pages/CandidateInterviewsPage"
import CandidateInterviewDetailPage from "@/pages/CandidateInterviewDetailPage"
import KnowledgeBasedInterviewPage from "@/pages/KnowledgeBasedInterviewPage"
import { CodingProblem } from './pages/CodingProblem';
import SystemDesign from "@/pages/SystemDesign"
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-8ME8VZGHWF";

ReactGA.initialize(GA_MEASUREMENT_ID, {
  gaOptions: { debug_mode: true },
});

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Send full URL (page_location) for proper UTM/referrer attribution.
    // GA4 prioritizes UTM params over document referrer.
    ReactGA.send({
      hitType: "pageview",
      page: `${location.pathname}${location.search}`,
      location: window.location.href,
      title: document.title,
    });
  }, [location]);

  return null;
}

// In your router configuration

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
        <RouteTracker />
        <Routes>
          <Route element={<MainLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<Landing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route 
            path="/coding-problem" 
            element={
              <InterviewPageWrapper>
                <CodingProblem />
              </InterviewPageWrapper>
            } 
          />
          
          <Route 
            path="/knowledge-based" 
            element={
              <PrivateRoute>
                <InterviewPageWrapper>
                  <KnowledgeBasedInterviewPage />
                </InterviewPageWrapper>
              </PrivateRoute>
            } 
          />
          <Route path="/system-design/:interviewId/:roundIndex" element={
            <PrivateRoute>
              <InterviewPageWrapper>
                <SystemDesign />
              </InterviewPageWrapper>
            </PrivateRoute>
          }/>
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
            <Route path="interviews" element={<CandidateInterviewsPage />} />
            <Route path="interviews/:interviewId" element={<CandidateInterviewDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route 
              path="coding-problem" 
              element={
                <InterviewPageWrapper>
                  <CodingProblem />
                </InterviewPageWrapper>
              } 
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
