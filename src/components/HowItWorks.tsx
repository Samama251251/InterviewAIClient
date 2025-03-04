import React from 'react';

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-2xl mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Companies Post Jobs",
      description: "Companies create detailed job listings with required skills and qualifications."
    },
    {
      number: 2,
      title: "Candidates Apply",
      description: "Job seekers submit their applications and choose interview time slots."
    },
    {
      number: 3,
      title: "AI Conducts Interviews",
      description: "Our AI evaluates technical skills through coding challenges and behavioral questions."
    },
    {
      number: 4,
      title: "Match & Hire",
      description: "Companies receive detailed reports and can make data-driven hiring decisions."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How InterviewAI Works</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <Step 
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;