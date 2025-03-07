import React from 'react';
const Hero: React.FC = () => {
    return (
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI-Powered Technical Interviews for the Modern Workforce
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline your hiring process with unbiased, efficient technical assessments that save time and find the best talent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors">
                  Get Started Free
                </button>
                <button className="px-6 py-3 border border-green-600 rounded-md text-green-600 font-medium hover:bg-green-50 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/hero-image.svg" 
                alt="AI Interview Process" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Hero;