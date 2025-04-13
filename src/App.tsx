import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Signin from "@/pages/Signin"
import Signup from "@/pages/Signup"
import PrivateRoute from "@/components/PrivateRoute"
import { AuthContextProvider, UserAuth } from "@/contexts/AuthContext"
import DashboardLayout from "@/components/layout/DashbordLayout"
import DashboardOverview from "@/pages/dashboard/DashboardOverview"
import Landing from "@/pages/Landing"
import NotFound from "./pages/NotFound"

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
            {/* <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
          <Route path="*" element={<NotFound />} 
        />
        </Routes>
      </Router>
  )
}

export default App
