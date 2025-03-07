import React from 'react';

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow hover:border-green-200">
      <div className="flex items-start mb-4">
        <div className="text-3xl mr-4 text-green-600">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: "⏱️",
      title: "Save 80% of Hiring Time",
      description: "Automate screening and interviewing to focus only on the best-matched candidates."
    },
    {
      icon: "🤖",
      title: "Unbiased Evaluations",
      description: "Our AI evaluates candidates purely on merit, eliminating unconscious bias from the process."
    },
    {
      icon: "💻",
      title: "Real-world Coding Challenges",
      description: "Technical assessments that simulate actual work scenarios for relevant skill evaluation."
    },
    {
      icon: "📊",
      title: "Data-Driven Insights",
      description: "Detailed analytics and comparative data to make informed hiring decisions."
    },
    {
      icon: "🔄",
      title: "Flexible Scheduling",
      description: "Candidates can interview 24/7, increasing your applicant pool and reducing dropoffs."
    },
    {
      icon: "📱",
      title: "Seamless Integration",
      description: "Works with your existing ATS and HR systems for a smooth hiring workflow."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose InterviewAI</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;