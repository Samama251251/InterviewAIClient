import React from 'react';
import { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({ label, onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      {isLoading ? 'Connecting...' : label}
    </button>
  );
};

export default Button; 