import { useQuery } from "@tanstack/react-query";
import { getIntervieweeJobs, getIntervieweeInterviews } from "@/services/api/interviewee";
import { useState } from "react";
import { UserAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, AlertCircle, Building } from "lucide-react";

// Interface to match the API types
interface Interview {
  _id: string;
  job_id: {
    _id: string;
    name: string;
    description?: string;
    company_id: {
      _id: string;
      name: string;
    };
  };
  user_id: string;
  time: string;
  date: string;
}

function IntervieweeDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { session } = UserAuth();
  const user = session?.user;

  // Fetch jobs
  const jobsQuery = useQuery({
    queryKey: ["userJobs"],
    queryFn: getIntervieweeJobs,
    staleTime: 30000
  });

  // Fetch interviews
  const interviewsQuery = useQuery<Interview[]>({
    queryKey: ["userInterviews"],
    queryFn: getIntervieweeInterviews,
    staleTime: 30000
  });

  // Derived data
  const upcomingInterviews = interviewsQuery.data?.filter((interview: Interview) => 
    new Date(interview.date) > new Date()
  ) || [];
  const pastInterviews = interviewsQuery.data?.filter((interview: Interview) => 
    new Date(interview.date) <= new Date()
  ) || [];

  const isLoading = jobsQuery.isLoading || interviewsQuery.isLoading;
  const isError = jobsQuery.isError || interviewsQuery.isError;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error">
          <AlertCircle />
          <span>Error loading dashboard</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Welcome Section */}
      <motion.div 
        className="card bg-base-100 shadow-md mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-body">
          <div className="flex justify-between items-start flex-col sm:flex-row">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name || 'User'}!</h1>
              <p className="text-base-content/70">
                {upcomingInterviews.length > 0 
                  ? `You have ${upcomingInterviews.length} upcoming ${upcomingInterviews.length === 1 ? 'interview' : 'interviews'}.` 
                  : "No interviews scheduled yet."}
              </p>
            </div>
            <div className="flex items-center mt-4 sm:mt-0">
              {user?.image ? (
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-primary ring-opacity-10">
                    <img src={user.image} alt={user.name || "User"} />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span className="text-xl">{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                </div>
              )}
              <div className="ml-4">
                <div className="font-medium">{user?.name || 'User'}</div>
                <div className="text-sm opacity-70">{user?.email || ''}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="tabs tabs-boxed bg-base-200">
          <a 
            className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Interviews
          </a>
          <a 
            className={`tab ${activeTab === "past" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Interviews
          </a>
          <a 
            className={`tab ${activeTab === "guidelines" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("guidelines")}
          >
            Guidelines
          </a>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === "upcoming" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Your Upcoming Interviews</h2>
          {upcomingInterviews.length === 0 ? (
            <div className="card bg-base-100 shadow-md">
              <div className="card-body text-center">
                <p className="text-base-content/70">No upcoming interviews scheduled.</p>
                <p className="mt-2">When you apply for jobs, your interviews will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingInterviews.map((interview: Interview) => (
                <motion.div 
                  key={interview._id}
                  className="card bg-base-100 shadow-md"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="card-body">
                    <h3 className="card-title">{interview.job_id.name}</h3>
                    <div className="flex items-center text-base-content/70 mb-2">
                      <Building size={16} className="mr-2" />
                      <span>{interview.job_id.company_id.name}</span>
                    </div>
                    <div className="space-y-2 my-3">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-primary mr-2" />
                        <span>{formatDate(interview.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-primary mr-2" />
                        <span>{interview.time}</span>
                      </div>
                    </div>
                    <div className="card-actions justify-between items-center">
                      <span className="badge badge-primary">Upcoming</span>
                      <button className="btn btn-primary btn-sm">
                        Prepare
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "past" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Past Interviews</h2>
          {pastInterviews.length === 0 ? (
            <div className="card bg-base-100 shadow-md">
              <div className="card-body text-center">
                <p className="text-base-content/70">No past interviews found.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastInterviews.map((interview: Interview) => (
                <motion.div 
                  key={interview._id}
                  className="card bg-base-100 shadow-md"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="card-body">
                    <h3 className="card-title">{interview.job_id.name}</h3>
                    <div className="flex items-center text-base-content/70 mb-2">
                      <Building size={16} className="mr-2" />
                      <span>{interview.job_id.company_id.name}</span>
                    </div>
                    <div className="space-y-2 my-3">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-primary mr-2" />
                        <span>{formatDate(interview.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-primary mr-2" />
                        <span>{interview.time}</span>
                      </div>
                    </div>
                    <div className="card-actions justify-between items-center">
                      <span className="badge badge-neutral">Completed</span>
                      <button className="btn btn-neutral btn-sm">
                        View Report
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "guidelines" && (
        <motion.div 
          className="card bg-base-100 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-body">
            <h2 className="card-title">Interview Guidelines</h2>
            <div className="space-y-4 mt-2">
              <div className="alert bg-primary/10 border-primary">
                <h3 className="font-medium">Before the Interview</h3>
                <ul className="list-disc ml-5 mt-2">
                  <li>Research the company and the role thoroughly</li>
                  <li>Prepare questions to ask the interviewer</li>
                  <li>Test your camera and microphone if it's a remote interview</li>
                  <li>Have your resume and portfolio ready</li>
                </ul>
              </div>
              
              <div className="alert bg-success/10 border-success">
                <h3 className="font-medium">During the Interview</h3>
                <ul className="list-disc ml-5 mt-2">
                  <li>Don't close the browser during online assessments</li>
                  <li>Ensure your webcam is enabled if required</li>
                  <li>Be professional and maintain good body language</li>
                  <li>Speak clearly and confidently</li>
                  <li>Plagiarism on coding tests is strictly monitored</li>
                </ul>
              </div>
              
              <div className="alert bg-secondary/10 border-secondary">
                <h3 className="font-medium">After the Interview</h3>
                <ul className="list-disc ml-5 mt-2">
                  <li>Send a thank-you email to your interviewer</li>
                  <li>Follow up if you don't hear back within the specified timeframe</li>
                  <li>Review and reflect on your performance</li>
                </ul>
              </div>
            </div>
            
            <div className="alert alert-warning mt-6">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Need Help?</h3>
                <div className="text-sm">If you face any technical issues during the interview process, please contact support.</div>
              </div>
              <button className="btn btn-warning btn-sm">Contact Support</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default IntervieweeDashboard;