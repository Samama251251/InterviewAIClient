import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, CheckCircle, Briefcase, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        if (result.needsVerification) {
          setVerificationSent(true);
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (verificationSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
        <Card className="w-full max-w-md mx-4 shadow-lg border border-green-100">
          <CardHeader className="space-y-1 border-b border-green-100 bg-green-50/50">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-center text-green-800">
              Verification Email Sent!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="mb-4 text-green-700">
              We've sent a verification email to <strong>{email}</strong>
            </p>
            <p className="mb-4 text-green-700">
              Please check your inbox and click the verification link to complete your registration.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-green-100 pt-4">
            <Link to="/">
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                Return to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
            Create your account to start using our platform
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-green-600">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-green-600">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-green-200 focus-visible:ring-green-500"
                  required
                />
                <div 
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-green-600 hover:text-green-800"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-green-600">
                  <Lock size={18} />
                </div>
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 border-green-200 focus-visible:ring-green-500"
                  required
                />
                <div 
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-green-600 hover:text-green-800"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-green-700">I am registering as:</Label>
              <RadioGroup 
                defaultValue="candidate" 
                value={role}
                onValueChange={setRole}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-50">
                  <RadioGroupItem 
                    value="candidate" 
                    id="candidate"
                    className="border-green-400 text-green-600" 
                  />
                  <Label htmlFor="candidate" className="flex items-center cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4 text-green-600" />
                    Candidate
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-50">
                  <RadioGroupItem 
                    value="admin" 
                    id="admin"
                    className="border-green-400 text-green-600" 
                  />
                  <Label htmlFor="admin" className="flex items-center cursor-pointer">
                    <ShieldCheck className="mr-2 h-4 w-4 text-green-600" />
                    Company Admin
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {error && (
              <div className="px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
            
            <div className="text-sm text-center text-green-700">
              Already have an account?{" "}
              <Link to="/" className="text-green-600 hover:text-green-800 font-medium underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;