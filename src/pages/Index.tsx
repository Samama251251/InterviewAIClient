import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-2">
            <Link to="/dashboard">
              <Button variant="outline">Log In</Button>
            </Link>
            <Button className="bg-interviewai-green hover:bg-interviewai-green/90">Sign Up</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-gray-800">AI-Powered Technical Interviews</span>
              <br />
              <span className="text-gray-500">for the Modern Workforce</span>
            </h1>
            
            <p className="text-xl text-gray-600">
              Streamline your hiring process with unbiased, efficient technical assessments that 
              save time and find the best talent.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/dashboard">
                <Button className="bg-interviewai-green hover:bg-interviewai-green/90 text-lg px-6 py-6 h-auto">
                  Get Started Free
                </Button>
              </Link>
              <Button variant="outline" className="text-lg px-6 py-6 h-auto">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <p className="text-gray-500 mt-4 md:mt-0">
              © 2025 InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
