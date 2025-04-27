import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signin from "@/pages/Signin"
import Signup from "@/pages/Signup"
import DashboardLayout from "@/components/layout/DashbordLayout"
import DashboardOverview from "@/pages/dashboard/DashboardOverview"
import JobsPage from "@/pages/dashboard/JobsPage"
import Landing from "@/pages/Landing"
import NotFound from "./pages/NotFound"
import JobDetailPage from "@/pages/dashboard/JobDetailPage"
import CandidatesPage from "@/pages/dashboard/CandidatesPage"
import SettingsPage from "@/pages/dashboard/SettingsPage"
import ProfilePage from "@/pages/dashboard/ProfilePage"
import PrivateRoute from "@/components/PrivateRoute"
import IntervieweeDashboard from "@/pages/IntervieweDashboard"
function App() {
  return (
    <div className="font-sans">
      <Router>
        <Routes>
          <Route path = "/int" element = {<IntervieweeDashboard/>}/>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
            <Route path="jobs/:jobId" element={<PrivateRoute><JobDetailPage /></PrivateRoute>} />
            <Route path="candidates" element={<PrivateRoute><CandidatesPage /></PrivateRoute>} />
            <Route path="settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
