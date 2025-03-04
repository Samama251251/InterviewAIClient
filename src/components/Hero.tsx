import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-green-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hero-content">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              AI-Powered Tech Interviews.<br/>No Human Bias.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              InterviewAI automates the entire tech interview process, saving time for companies 
              and providing fair evaluations for candidates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors">
                Hire Top Talent
              </button>
              <button className="px-8 py-3 border border-green-600 rounded-md text-green-600 bg-white font-medium hover:bg-green-50 transition-colors">
                Find Your Next Role
              </button>
            </div>
          </div>
          
          <div className="hero-image bg-white p-8 rounded-xl shadow-lg">
            {/* Placeholder for an image - in a real implementation, you'd use an actual image */}
            <div className="aspect-w-4 aspect-h-3 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="text-green-600 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">AI Interview Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;