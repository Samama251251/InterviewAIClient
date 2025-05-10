import React from 'react';
import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Evaluating...' }) => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="mb-4 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary" />
    <span className="text-lg text-white font-semibold mt-2">{message}</span>
  </motion.div>
); 