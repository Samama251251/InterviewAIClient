import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Github, Mail, ArrowRight, MailCheck, Loader2, AlertCircle } from "lucide-react";
import { UserAuth } from "@/contexts/AuthContext";
import { AuthCard } from "@/components/Auth/AuthCard";
import { SocialButton } from "@/components/Auth/SocialButton";
import { AuthDivider } from "@/components/Auth/AuthDivider";
import { motion } from "framer-motion";

export function Login() {
  const { session, isPending, signInWithGoogle, signInWithGithub } = UserAuth();
  
  // Local loading states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsGoogleLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setError(null);
      setIsGithubLoading(true);
      await signInWithGithub();
    } catch (err) {
      setError("Failed to sign in with Github. Please try again.");
      console.error(err);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome back" 
      subtitle="Sign in to your account to continue"
    >
      {/* Social login buttons */}
      <div className="mt-6">
        <SocialButton 
          provider="github"
          icon={Github}
          text="Continue with GitHub"
          onClick={handleGithubSignIn}
          isLoading={isGithubLoading}
        />
        
        <SocialButton 
          provider="google"
          icon={Mail}
          text="Continue with Google"
          onClick={handleGoogleSignIn}
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

      {/* Sign up link */}
      <div className="mt-6 text-center">
        <p className="text-base-content/70 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default Login; 