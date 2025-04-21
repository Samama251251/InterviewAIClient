import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Signin from "@/pages/Signin"
import Signup from "@/pages/Signup"
import { UserAuth } from "@/contexts/AuthContext"
import DashboardLayout from "@/components/layout/DashbordLayout"
import DashboardOverview from "@/pages/dashboard/DashboardOverview"
import JobsPage from "@/pages/dashboard/JobsPage"
import Landing from "@/pages/Landing"
import NotFound from "./pages/NotFound"
import JobDetailPage from "@/pages/dashboard/JobDetailPage"
import CandidatesPage from "@/pages/dashboard/CandidatesPage"
import SettingsPage from "@/pages/dashboard/SettingsPage"
import ProfilePage from "@/pages/dashboard/ProfilePage"

function App() {
  const { session } = UserAuth();

  return (
      <Router>
        <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} 
        />
        </Routes>
      </Router>
  )
}

export default App
