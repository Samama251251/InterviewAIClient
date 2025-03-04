import React from 'react';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  initials: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, title, initials }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow hover:border-green-200">
      <p className="text-gray-700 mb-6 italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-medium mr-4">
          {initials}
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "InterviewAI reduced our hiring timeline from weeks to days. The quality of candidates we're getting is exceptional, and our team can focus on growth instead of screening.",
      name: "Jane Doe",
      title: "CTO, TechStartup Inc.",
      initials: "JD"
    },
    {
      quote: "As a developer, I appreciate the fair assessment of my skills. The platform gave me constructive feedback even when I didn't get the job, which helped me improve.",
      name: "John Smith",
      title: "Senior Developer",
      initials: "JS"
    },
    {
      quote: "We've increased our diversity hiring by 45% since implementing InterviewAI. The unbiased screening has helped us build a more inclusive tech team.",
      name: "Amanda Rodriguez",
      title: "HR Director, Enterprise Solutions",
      initials: "AR"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              initials={testimonial.initials}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;