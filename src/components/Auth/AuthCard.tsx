import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <motion.div 
        className="max-w-md w-full bg-base-100 rounded-box shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">Interview<span className="text-primary">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-base-content">{title}</h1>
          <p className="text-base-content/70 mt-2">{subtitle}</p>
        </div>
        
        {children}
      </motion.div>
    </div>
  );
} 