import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-green-600 text-white">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Hiring Process?</h2>
        <p className="text-xl text-green-50 mb-10 max-w-3xl mx-auto">
          Join thousands of companies and candidates who are making tech hiring smarter, faster, 
          and fairer with InterviewAI.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-white text-green-600 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Get Started for Free
          </button>
          <button className="px-8 py-3 border border-white rounded-md text-white font-medium hover:bg-green-700 transition-colors">
            Request a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;