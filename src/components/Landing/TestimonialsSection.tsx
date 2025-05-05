import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CTO, TechCorp",
      avatar: "https://picsum.photos/200/200?random=1",
      quote: "This platform has cut our hiring time in half while improving the quality of our technical hires. The automated question generation is spot on."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "HR Director, DataWave",
      avatar: "https://picsum.photos/200/200?random=2",
      quote: "The behavioral assessment module gives us insights we couldn't get from traditional interviews. It's like having an expert interviewer on staff 24/7."
    },
    {
      id: 3,
      name: "Jessica Lee",
      role: "Engineering Manager, BuildFast",
      avatar: "https://picsum.photos/200/200?random=3",
      quote: "Our candidates love the fairness and consistency of the platform. The system design whiteboard feature is exceptional for evaluating senior engineers."
    }
  ];

  const paginate = (newDirection: number) => {
    // Calculate the new slide index
    const nextSlide = (currentSlide + newDirection + testimonials.length) % testimonials.length;
    setCurrentSlide(nextSlide);
  };

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="badge badge-primary px-5 py-3 mb-4 font-medium">TESTIMONIALS</div>
          <h2 className="text-4xl md:text-5xl font-bold">What Our Clients Say</h2>
          <div className="divider max-w-sm mx-auto"></div>
          <p className="mt-2 text-lg opacity-80 max-w-2xl mx-auto">Don't just take our word for it</p>
        </div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-3xl">
          <div className="rounded-lg bg-base-200 max-w-3xl mx-auto min-h-[26rem] overflow-hidden">
            <div className="w-full flex flex-col items-center justify-center px-8 py-12 text-center">
              <div className="avatar mb-8">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={testimonials[currentSlide].avatar} alt={`${testimonials[currentSlide].name}'s Avatar`} />
                </div>
              </div>

              <div className="flex justify-center gap-1 mb-5">
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <div key={i}>
                    <Star className="w-5 h-5 text-primary fill-primary" />
                  </div>
                ))}
              </div>

              <p className="text-xl italic mb-8 text-center max-w-2xl">
                "{testimonials[currentSlide].quote}"
              </p>

              <h3 className="font-bold text-xl">
                {testimonials[currentSlide].name}
              </h3>

              <p className="text-sm opacity-70">
                {testimonials[currentSlide].role}
              </p>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2 w-full px-4 z-10">
            <button
              onClick={() => paginate(-1)}
              className="btn btn-circle btn-primary bg-primary/70 border-none hover:bg-primary"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="btn btn-circle btn-primary bg-primary/70 border-none hover:bg-primary"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          {/* Bottom indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`btn btn-xs btn-circle ${index === currentSlide ? 'btn-primary' : 'btn-outline'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 