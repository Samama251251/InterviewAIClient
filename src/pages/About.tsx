import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

const About: React.FC = () => (
  <div className="container mx-auto p-8">
    <h1 className="text-4xl font-bold mb-4 text-center">About InterviewAI</h1>
    <div className="flex flex-col items-center md:items-start gap-8 mb-10 max-w-4xl mx-auto">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-7 h-7 text-primary" />
          <h2 className="text-2xl font-semibold">Our Mission</h2>
        </div>
        <p className="mb-4 text-lg text-base-content/80 max-w-xl">
          Our mission is to make technical interviews fair, efficient, and insightful for everyone. We believe in empowering candidates and companies with AI-driven tools for a smarter hiring process.
        </p>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-7 h-7 text-primary" />
          <h2 className="text-2xl font-semibold">What We Do</h2>
        </div>
        <p className="mb-8 text-base-content/80 max-w-xl">
          InterviewAI leverages artificial intelligence to generate questions, evaluate answers, and provide instant feedback. Whether you're preparing for your dream job or hiring top talent, InterviewAI is your trusted partner.
        </p>
      </div>
    </div>
    <div className="text-center mt-10">
      <p className="text-base-content/70 text-lg">Want to collaborate or learn more? <span className="font-semibold text-primary">Contact us!</span></p>
    </div>
  </div>
);

export default About; 