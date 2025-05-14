import React from 'react';
import { ButtonProps } from './types';
import { motion } from 'framer-motion';

const Button: React.FC<ButtonProps> = ({ label, onClick, isLoading }) => {
  return (
    <motion.button
      className="btn btn-primary btn-lg px-8 py-4 rounded-lg shadow-lg"
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {isLoading ? (
        <div className="flex items-center">
          <span className="loading loading-spinner loading-md mr-2"></span>
          <span>Connecting...</span>
        </div>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  );
};

export default Button; 