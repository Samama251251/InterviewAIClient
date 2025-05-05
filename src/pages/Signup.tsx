import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Mail, AlertCircle } from "lucide-react";
import { UserAuth } from "@/contexts/AuthContext";
import { AuthCard } from "@/components/Auth/AuthCard";
import { SocialButton } from "@/components/Auth/SocialButton";
import { motion } from "framer-motion";

export function Signup() {
  const { signInWithGoogle, signInWithGithub } = UserAuth();
  
  // Local loading states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    try {
      setError(null);
      setIsGoogleLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    try {
      setError(null);
      setIsGithubLoading(true);
      await signInWithGithub();
    } catch (err) {
      setError("Failed to sign up with Github. Please try again.");
      console.error(err);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create an account" 
      subtitle="Sign up to get started with InterviewAI"
    >
      {/* Social signup buttons */}
      <div className="mt-6">
        <SocialButton 
          provider="github"
          icon={Github}
          text="Continue with GitHub"
          onClick={handleGithubSignUp}
          isLoading={isGithubLoading}
        />
        
        <SocialButton 
          provider="google"
          icon={Mail}
          text="Continue with Google"
          onClick={handleGoogleSignUp}
          isLoading={isGoogleLoading}
        />
      </div>

      {/* Error message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error/10 text-error rounded-lg p-3 mt-4 flex items-center gap-2"
        >
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Login link */}
      <div className="mt-6 text-center">
        <p className="text-base-content/70 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default Signup; 