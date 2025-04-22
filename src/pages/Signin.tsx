import { useState } from "react";
import { UserAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
// Only import GitHub icon from react-icons
import { FaGithub } from "react-icons/fa";

// Custom Google logo component for better accuracy
const GoogleLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2 h-4 w-4">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

const SignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{google: boolean, github: boolean}>({
    google: false,
    github: false
  });

  const { signInWithGoogle, signInWithGithub } = UserAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(prev => ({...prev, google: true}));
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google Sign-In failed:", err);
      setError("Failed to sign in with Google. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(prev => ({...prev, google: false}));
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(prev => ({...prev, github: true}));
    setError(null);
    try {
      await signInWithGithub();
    } catch (err) {
      console.error("GitHub Sign-In failed:", err);
      setError("Failed to sign in with GitHub. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(prev => ({...prev, github: false}));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Card className="w-full max-w-md mx-4 shadow-lg border border-green-100">
        <CardHeader className="space-y-2 border-b border-green-100 bg-green-50/50 pb-6">
          <div className="flex items-center justify-center mb-3">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-green-800">
            Welcome to TechInterviewPro
          </CardTitle>
          <CardDescription className="text-center text-green-700 text-base">
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-4">
            <Button 
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 py-6 flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow"
              onClick={handleGoogleSignIn}
              disabled={isLoading.google || isLoading.github}
            >
              {isLoading.google ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting...
                </div>
              ) : (
                <>
                  <GoogleLogo /> Continue with Google
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 py-6 flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow"
              onClick={handleGithubSignIn}
              disabled={isLoading.google || isLoading.github}
            >
              {isLoading.github ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting...
                </div>
              ) : (
                <>
                  <FaGithub className="mr-2 h-4 w-4" /> Continue with GitHub
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md text-center">
              {error}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 text-center text-sm text-green-700">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;