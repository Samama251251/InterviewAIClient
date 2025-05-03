import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <Brain size={32} className="text-primary" />
        <motion.div
          className="absolute -inset-1 rounded-full bg-primary/20" 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </div>
      <div className="font-bold text-xl">InterviewAI</div>
    </motion.div>
  );
};

export default Logo; 