import { useState } from "react";
import { UserAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.83 0-1.5.67-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>;

const SignUp = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle } = UserAuth();

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google Sign-Up/Sign-In failed:", err);
      setError("Failed to sign up with Google. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <Card className="w-full max-w-md mx-4 shadow-lg border border-green-100">
        <CardHeader className="space-y-1 border-b border-green-100 bg-green-50/50">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-green-800">
            Join TechInterviewPro
          </CardTitle>
          <CardDescription className="text-center text-green-700">
            Create your account or sign in using Google
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          <Button 
            variant="outline"
            className="w-full border-slate-200 hover:bg-slate-50 text-slate-700"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              "Redirecting..."
            ) : (
              <>
                <GoogleIcon /> Continue with Google
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md text-center">
              {error}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-2">
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;