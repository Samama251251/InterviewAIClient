import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Landing/Logo";
import { Search, Briefcase, Users, Zap, CheckCircle, UserPlus, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Improved mobile responsiveness */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/signin">
              <Button variant="outline" className="hidden sm:inline-flex hover:bg-primary/5">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" className="shadow-md hover:shadow-lg transition-shadow">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Enhanced animations and responsiveness */}
        <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background via-background to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="block text-foreground leading-tight">Find Your Dream Tech Role</span>
                <span className="block text-primary mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  Powered by AI Insights
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Our intelligent platform connects top talent with innovative companies,
                streamlining the technical interview process like never before.
              </p>
            </div>
            <div className="max-w-xl mx-auto mb-12 animate-fade-in-up">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  className="h-12 pl-10 pr-20 text-base border-border focus:ring-primary shadow-sm hover:shadow-md transition-shadow"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-4 shadow-sm">
                  Search
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fade-in-up">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg hover:bg-primary/5">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section - Improved card styling */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-4">Why Choose InterviewAI?</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto px-4">
              We leverage AI to make hiring faster, fairer, and more effective for everyone involved.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* AI-Powered Card */}
              <Card className="group text-center bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">AI-Powered Matching</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Our algorithms match candidates to roles based on skills and potential, not just keywords.
                </CardContent>
              </Card>

              {/* Assessments Card */}
              <Card className="group text-center bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">Efficient Assessments</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Standardized, unbiased technical challenges that save engineers valuable time.
                </CardContent>
              </Card>

              {/* Reduced Bias Card */}
              <Card className="group text-center bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">Reduced Bias</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Focus on skills and performance, creating a more equitable hiring process for all candidates.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section - Enhanced with better spacing and hover effects */}
        <section id="how-it-works" className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">Get Hired in 3 Simple Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center group">
                <div className="bg-primary/10 text-primary rounded-full p-4 mb-4 group-hover:scale-110 transition-transform">
                  <UserPlus className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">1. Create Profile</h3>
                <p className="text-muted-foreground max-w-sm">Sign up and showcase your skills, experience, and aspirations.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center group">
                <div className="bg-primary/10 text-primary rounded-full p-4 mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">2. Take Assessments</h3>
                <p className="text-muted-foreground max-w-sm">Complete relevant technical challenges designed by industry experts.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center group">
                <div className="bg-primary/10 text-primary rounded-full p-4 mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">3. Get Matched</h3>
                <p className="text-muted-foreground max-w-sm">Our AI connects you with companies looking for talent like yours.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Improved spacing and responsiveness */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Find Your Future?</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto px-4">
              Join thousands of developers and companies building the future of tech.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg hover:bg-primary/5">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Enhanced with better spacing */}
      <footer className="bg-muted border-t">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;