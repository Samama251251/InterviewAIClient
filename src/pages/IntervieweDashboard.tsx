import { useQuery } from "@tanstack/react-query";
import { getIntervieweeJobs, getIntervieweeInterviews } from "@/services/api/interviewee";
import { useState } from "react";
import { UserAuth } from "@/contexts/AuthContext";

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
  const upcomingInterviews = interviewsQuery.data?.filter(interview => 
    new Date(interview.date) > new Date()
  ) || [];
  const pastInterviews = interviewsQuery.data?.filter(interview => 
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading dashboard</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name || 'User'}!</h1>
            <p className="text-gray-600">
              {upcomingInterviews.length > 0 
                ? `You have ${upcomingInterviews.length} upcoming ${upcomingInterviews.length === 1 ? 'interview' : 'interviews'}.` 
                : "No interviews scheduled yet."}
            </p>
          </div>
          <div className="flex items-center">
            {user?.image && (
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <div className="text-sm">
              <div className="font-medium">{user?.name || 'User'}</div>
              <div className="text-gray-500">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-4 px-1 ${
              activeTab === "upcoming"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming Interviews
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-4 px-1 ${
              activeTab === "past"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Past Interviews
          </button>
          <button
            onClick={() => setActiveTab("guidelines")}
            className={`py-4 px-1 ${
              activeTab === "guidelines"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Guidelines
          </button>
        </nav>
      </div>

      {/* Main Content */}
      {activeTab === "upcoming" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Upcoming Interviews</h2>
          {upcomingInterviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">No upcoming interviews scheduled.</p>
              <p className="mt-2">When you apply for jobs, your interviews will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingInterviews.map((interview) => (
                <div 
                  key={interview._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{interview.job_id.name}</h3>
                    <p className="text-gray-600 mb-4">
                      Company: {interview.job_id.company_id.name}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <span className="w-20 text-gray-500">Date:</span>
                        <span className="font-medium">{formatDate(interview.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-gray-500">Time:</span>
                        <span className="font-medium">{interview.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out">
                      Prepare for Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "past" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Interviews</h2>
          {pastInterviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">No past interviews found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastInterviews.map((interview) => (
                <div 
                  key={interview._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{interview.job_id.name}</h3>
                    <p className="text-gray-600 mb-4">
                      Company: {interview.job_id.company_id.name}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <span className="w-20 text-gray-500">Date:</span>
                        <span>{formatDate(interview.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-gray-500">Time:</span>
                        <span>{interview.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Completed
                      </span>
                    </div>
                    <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out">
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "guidelines" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Interview Guidelines</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h3 className="font-medium">Before the Interview</h3>
              <ul className="list-disc ml-5 mt-2 text-gray-700">
                <li>Research the company and the role thoroughly</li>
                <li>Prepare questions to ask the interviewer</li>
                <li>Test your camera and microphone if it's a remote interview</li>
                <li>Have your resume and portfolio ready</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h3 className="font-medium">During the Interview</h3>
              <ul className="list-disc ml-5 mt-2 text-gray-700">
                <li>Don't close the browser during online assessments</li>
                <li>Ensure your webcam is enabled if required</li>
                <li>Be professional and maintain good body language</li>
                <li>Speak clearly and confidently</li>
                <li>Plagiarism on coding tests is strictly monitored</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h3 className="font-medium">After the Interview</h3>
              <ul className="list-disc ml-5 mt-2 text-gray-700">
                <li>Send a thank-you email to your interviewer</li>
                <li>Follow up if you don't hear back within the specified timeframe</li>
                <li>Review and reflect on your performance</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              If you face any technical issues during the interview process, please contact support.
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IntervieweeDashboard;