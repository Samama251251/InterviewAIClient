import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function NotFound() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-base-100 rounded-box shadow-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-error/10 rounded-full">
            <AlertTriangle size={48} className="text-error" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold text-base-content mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-2xl font-semibold text-base-content mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          className="text-base-content/70 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sorry, the page you are looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/" 
            className="btn btn-primary gap-2 transition-all duration-300 hover:gap-3"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-xs text-base-content/50"
        >
          If you think this is an error, please contact support.
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound; 