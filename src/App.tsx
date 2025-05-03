import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Landing } from "@/pages/Landing"

function App() {
  return (
    <div className="min-h-screen bg-base-100" data-theme="emerald">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
