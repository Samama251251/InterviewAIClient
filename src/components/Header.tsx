import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex justify-between items-center">
          <div className="logo text-2xl font-bold">
            <span className="text-green-600">Interview</span>AI
          </div>
          
          <ul className="hidden md:flex space-x-8">
            <li><a href="#" className="text-gray-700 hover:text-green-600 transition-colors">How It Works</a></li>
            <li><a href="#" className="text-gray-700 hover:text-green-600 transition-colors">For Companies</a></li>
            <li><a href="#" className="text-gray-700 hover:text-green-600 transition-colors">For Candidates</a></li>
            <li><a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Pricing</a></li>
          </ul>
          
          <div className="flex space-x-4">
            <button className="hidden md:block px-5 py-2 border border-green-600 rounded-md text-green-600 hover:bg-green-50 transition-colors">
              Log In
            </button>
            <button className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Sign Up
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;