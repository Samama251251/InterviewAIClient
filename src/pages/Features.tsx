import React from 'react';
import { Sparkles, Code, Layout, BarChart } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />, 
    title: 'AI-powered Interview Questions',
    description: 'Generate tailored technical and behavioral questions for every role using advanced AI.'
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: 'Real-time Coding Environment',
    description: 'Solve coding problems in a live, collaborative editor with instant feedback.'
  },
  {
    icon: <Layout className="w-8 h-8 text-primary" />,
    title: 'System Design Whiteboard',
    description: 'Draw, design, and explain your system architecture with an interactive whiteboard.'
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: 'Instant Feedback & Analytics',
    description: 'Receive actionable insights and analytics on your interview performance.'
  }
];

const Features: React.FC = () => (
  <div className="container mx-auto p-8">
    <h1 className="text-4xl font-bold mb-4 text-center">Platform Features</h1>
    <p className="text-lg text-center mb-10 text-base-content/70 max-w-2xl mx-auto">
      Discover how InterviewAI empowers candidates and companies to have a smarter, fairer, and more efficient interview experience.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-start gap-4 bg-base-200 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
          <div>{feature.icon}</div>
          <div>
            <h2 className="text-xl font-semibold mb-1">{feature.title}</h2>
            <p className="text-base-content/80">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Features; 