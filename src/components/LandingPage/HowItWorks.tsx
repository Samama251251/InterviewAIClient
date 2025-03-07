import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Create an Assessment",
      description: "Design custom technical interviews or choose from our library of pre-built assessments."
    },
    {
      number: "02",
      title: "Invite Candidates",
      description: "Send automated invitations to candidates to complete the assessment at their convenience."
    },
    {
      number: "03",
      title: "AI Evaluation",
      description: "Our AI evaluates responses, providing detailed insights on technical skills and problem-solving."
    },
    {
      number: "04",
      title: "Review Results",
      description: "Get comprehensive reports and make data-driven hiring decisions with confidence."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">How InterviewAI Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-block bg-green-600 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;