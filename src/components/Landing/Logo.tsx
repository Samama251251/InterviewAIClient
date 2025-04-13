
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center text-2xl font-bold text-interviewai-green">
      <span>Interview</span>
      <span className="text-black">AI</span>
    </Link>
  );
};

export default Logo;
    