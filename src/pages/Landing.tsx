import { Link } from "react-router-dom";
import { Zap, Code, ShieldCheck, Users, BarChart, MonitorPlay, BrainCircuit, FileText, CalendarCheck, ArrowRight, Star, ChevronLeft, ChevronRight, Terminal } from 'lucide-react';

export function Landing() {
  // Function to prevent default behavior for testimonial navigation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    // Set a theme - using 'forest' which has nice green tones
    <div className="min-h-screen font-sans" data-theme="forest">
      {/* Navbar - Sticky with gradient */}
      <div className="navbar bg-gradient-to-r from-neutral to-neutral-focus text-neutral-content sticky top-0 z-50 shadow-lg">
        <div className="navbar container mx-auto">
          <div className="navbar-start">
            <div className="dropdown lg:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm transition duration-150 ease-in-out hover:bg-neutral-focus active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52 text-sm">
                <li><a className="transition duration-150 ease-in-out hover:text-accent hover:bg-neutral-focus">Features</a></li>
                <li><a className="transition duration-150 ease-in-out hover:text-accent hover:bg-neutral-focus">Pricing</a></li>
                <li><a className="transition duration-150 ease-in-out hover:text-accent hover:bg-neutral-focus">About</a></li>
                <li><a className="transition duration-150 ease-in-out hover:text-accent hover:bg-neutral-focus">Contact</a></li>
              </ul>
            </div>
            <Link to="/" className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">Interview<span className="text-accent">AI</span></span>
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1 text-sm">
              <li><a className="transition duration-150 ease-in-out hover:text-accent rounded-md">Features</a></li>
              <li><a className="transition duration-150 ease-in-out hover:text-accent rounded-md">Pricing</a></li>
              <li><a className="transition duration-150 ease-in-out hover:text-accent rounded-md">About</a></li>
              <li><a className="transition duration-150 ease-in-out hover:text-accent rounded-md">Contact</a></li>
            </ul>
          </div>
          <div className="navbar-end gap-2">
            {/* Adjusted button colors for better contrast/hierarchy */}
            <Link to="/login" className="btn btn-outline btn-accent btn-sm transition duration-150 ease-in-out hover:bg-accent hover:text-accent-content active:scale-95">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm transition duration-150 ease-in-out hover:bg-primary-focus active:scale-95">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Updated to center content without image */}
      <section className="hero min-h-[calc(100vh-4rem)] bg-gradient-to-br from-base-300 via-base-200 to-base-300">
        <div className="hero-content flex-col container mx-auto py-16 text-center max-w-4xl">
          <div className="badge badge-accent py-3 px-4 font-semibold animate-bounce-slow">🚀 AI-Powered Interviews</div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-2">
            <span className="text-accent">Transform</span> Your <span className="text-primary">Technical</span> <span className="text-secondary">Hiring</span> <span className="text-accent">Process</span>
          </h1>
          
          <p className="py-6 text-xl opacity-80 max-w-3xl mx-auto">
            Our AI-powered platform automates technical interviews, making the hiring process
            faster, fairer, and more efficient. Evaluate candidates with customized coding
            challenges, system design problems, and behavioral assessments.
          </p>
          
          {/* Join buttons - centered */}
          <div className="join shadow-lg my-4">
            <button className="btn btn-primary join-item animate-pulse-slow group">
              Get Started
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
            </button>
            <button className="btn btn-outline join-item">Watch Demo</button>
          </div>
          
          {/* Stats - centered, horizontal layout */}
          <div className="mt-10 stats shadow stats-horizontal overflow-hidden group bg-base-100 max-w-3xl mx-auto">
            <div className="stat transition-all duration-300 hover:bg-base-200">
              <div className="stat-figure text-primary">
                <BarChart className="inline-block w-8 h-8 stroke-current"/>
              </div>
              <div className="stat-title">Time Saved</div>
              <div className="stat-value text-primary">70%</div>
              <div className="stat-desc">vs. Traditional methods</div>
            </div>

            <div className="stat transition-all duration-300 hover:bg-base-200">
              <div className="stat-figure text-secondary">
                <Users className="inline-block w-8 h-8 stroke-current"/>
              </div>
              <div className="stat-title">Companies Using</div>
              <div className="stat-value text-secondary">500+</div>
              <div className="stat-desc">Across the globe</div>
            </div>
            
            <div className="stat transition-all duration-300 hover:bg-base-200">
              <div className="stat-figure text-accent">
                <BrainCircuit className="inline-block w-8 h-8 stroke-current"/>
              </div>
              <div className="stat-title">Candidates Evaluated</div>
              <div className="stat-value text-accent">25K+</div>
              <div className="stat-desc">Monthly interviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Card animations, Lucide icons */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <div className="badge badge-secondary badge-outline p-3 mb-4">CORE FEATURES</div>
            <h2 className="text-3xl md:text-4xl font-bold">Key Platform Capabilities</h2>
             <div className="divider max-w-sm mx-auto"></div>
            <p className="mt-2 text-lg opacity-80 max-w-2xl mx-auto">Our platform offers comprehensive solutions for technical hiring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-primary/30 group">
              <figure className="px-10 pt-10">
                 <div className="avatar placeholder">
                    <div className="bg-primary/10 text-primary rounded-xl w-16 p-4 transition-transform duration-300 group-hover:scale-110">
                       <CalendarCheck className="h-8 w-8" />
                    </div>
                 </div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Company Portal</h3>
                <p className="text-sm opacity-70">Centralized dashboard for managing job descriptions, candidates, and interviews with custom assessment criteria.</p>
              </div>
            </div>

            {/* Feature Card 2 */}
             <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-secondary/30 group">
              <figure className="px-10 pt-10">
                 <div className="avatar placeholder">
                     <div className="bg-secondary/10 text-secondary rounded-xl w-16 p-4 transition-transform duration-300 group-hover:scale-110">
                       <BrainCircuit className="h-8 w-8" />
                    </div>
                 </div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">AI-Powered Questions</h3>
                <p className="text-sm opacity-70">Automatically generate tailored questions based on job descriptions, candidate resumes, and skill requirements.</p>
              </div>
            </div>

            {/* Feature Card 3 */}
             <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-accent/30 group">
              <figure className="px-10 pt-10">
                 <div className="avatar placeholder">
                     <div className="bg-accent/10 text-accent rounded-xl w-16 p-4 transition-transform duration-300 group-hover:scale-110">
                       <ShieldCheck className="h-8 w-8" />
                    </div>
                 </div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Secure Assessment</h3>
                <p className="text-sm opacity-70">Video proctoring, identity verification, and anti-plagiarism measures ensure fair and secure interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Assessments - Improved card style */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <div className="badge badge-accent p-3 mb-4">ASSESSMENT TYPES</div>
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Evaluation Methods</h2>
             <div className="divider max-w-sm mx-auto"></div>
            <p className="mt-2 text-lg opacity-80 max-w-2xl mx-auto">Evaluate candidates across multiple dimensions</p>
          </div>

          {/* Use individual cards with specific colors - no dynamic classes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card bg-primary text-primary-content shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-105">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <Code size={24} />
                  <h3 className="card-title text-lg">Coding Challenges</h3>
                </div>
                <p className="text-sm opacity-90">DSA problems with real-time execution in our integrated IDE.</p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="card bg-secondary text-secondary-content shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-105">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={24} />
                  <h3 className="card-title text-lg">System Design</h3>
                </div>
                <p className="text-sm opacity-90">Interactive whiteboard for architectural diagrams with transcription analysis.</p>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="card bg-accent text-accent-content shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-105">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <FileText size={24} />
                  <h3 className="card-title text-lg">Knowledge-Based</h3>
                </div>
                <p className="text-sm opacity-90">Custom questions based on candidate's resume and role requirements.</p>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="card bg-neutral text-neutral-content shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-105">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <BrainCircuit size={24} />
                  <h3 className="card-title text-lg">Framework-Specific</h3>
                </div>
                <p className="text-sm opacity-90">Technical questions tailored to specific languages, frameworks, and tools.</p>
              </div>
            </div>
            
            {/* Card 5 */}
            <div className="card bg-info text-info-content shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-105">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <MonitorPlay size={24} />
                  <h3 className="card-title text-lg">Behavioral Assessment</h3>
                </div>
                <p className="text-sm opacity-90">Video recording with speech-to-text and sentiment analysis.</p>
              </div>
            </div>
            
            {/* Card 6 */}
            <div className="card bg-success text-success-content shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-105">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart size={24} />
                  <h3 className="card-title text-lg">Detailed Reporting</h3>
                </div>
                <p className="text-sm opacity-90">Automated performance analysis with insights on skills and traits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Improved card design */}
      <section className="py-20 bg-base-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold">What Our Clients Say</h2>
            <div className="divider max-w-sm mx-auto"></div>
            <p className="mt-2 text-lg opacity-80 max-w-2xl mx-auto">Don't just take our word for it</p>
          </div>

          {/* Updated carousel with fixed height to prevent scrolling */}
          <div className="relative mx-auto max-w-3xl">
            <div className="carousel w-full rounded-lg bg-base-100 max-w-3xl mx-auto min-h-[26rem]">
              {/* Testimonial 1 */}
              <div id="slide1" className="carousel-item relative w-full">
                <div className="w-full flex flex-col items-center justify-center px-8 py-12 text-center">
                  <div className="avatar mb-8">
                    <div className="w-24 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                      <img src="https://picsum.photos/200/200?random=1" alt="Sarah Johnson's Avatar" />
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-xl italic mb-8 text-center max-w-2xl">
                    "This platform has cut our hiring time in half while improving the quality of our technical hires. The automated question generation is spot on."
                  </p>
                  <h3 className="font-bold text-xl">Sarah Johnson</h3>
                  <p className="text-sm opacity-70">CTO, TechCorp</p>
                </div>
              </div> 
              
              {/* Testimonial 2 */}
              <div id="slide2" className="carousel-item relative w-full">
                <div className="w-full flex flex-col items-center justify-center px-8 py-12 text-center">
                  <div className="avatar mb-8">
                    <div className="w-24 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                      <img src="https://picsum.photos/200/200?random=2" alt="Michael Chen's Avatar" />
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-xl italic mb-8 text-center max-w-2xl">
                    "The behavioral assessment module gives us insights we couldn't get from traditional interviews. It's like having an expert interviewer on staff 24/7."
                  </p>
                  <h3 className="font-bold text-xl">Michael Chen</h3>
                  <p className="text-sm opacity-70">HR Director, DataWave</p>
                </div>
              </div> 
              
              {/* Testimonial 3 */}
              <div id="slide3" className="carousel-item relative w-full">
                <div className="w-full flex flex-col items-center justify-center px-8 py-12 text-center">
                  <div className="avatar mb-8">
                    <div className="w-24 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                      <img src="https://picsum.photos/200/200?random=3" alt="Jessica Lee's Avatar" />
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-xl italic mb-8 text-center max-w-2xl">
                    "Our candidates love the fairness and consistency of the platform. The system design whiteboard feature is exceptional for evaluating senior engineers."
                  </p>
                  <h3 className="font-bold text-xl">Jessica Lee</h3>
                  <p className="text-sm opacity-70">Engineering Manager, BuildFast</p>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2 w-full px-4 z-10">
              <a 
                href="#slide3" 
                onClick={handleNavClick}
                className="btn btn-circle btn-success bg-success/70 border-none hover:bg-success"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </a>
              <a 
                href="#slide2" 
                onClick={handleNavClick}
                className="btn btn-circle btn-success bg-success/70 border-none hover:bg-success"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </a>
            </div>
            
            {/* Bottom indicators */}
            <div className="flex justify-center gap-2 mt-4">
              <a href="#slide1" onClick={handleNavClick} className="btn btn-xs btn-circle btn-success">1</a> 
              <a href="#slide2" onClick={handleNavClick} className="btn btn-xs btn-circle btn-outline">2</a> 
              <a href="#slide3" onClick={handleNavClick} className="btn btn-xs btn-circle btn-outline">3</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Using DaisyUI structure */}
      <footer className="bg-neutral text-neutral-content">
        <div className="footer py-14 container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 px-6">
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
             {/* Updated logo to match header */}
            <Link to="/" className="flex items-center mb-6">
              <Terminal className="h-6 w-6 text-accent mr-2" />
              <span className="text-2xl font-bold">Interview<span className="text-accent">AI</span></span>
            </Link>
            <p className="max-w-xs text-neutral-content/80 mb-6">
              Automating technical interviews to make hiring faster, fairer, and more efficient.
            </p>
             {/* Social Links - Using primary color for consistency */}
            <div className="flex space-x-4">
              {['Twitter', 'YouTube', 'Facebook', 'LinkedIn'].map((social, i) => (
                 <a 
                    key={i} 
                    className="btn btn-circle btn-sm btn-outline border-neutral-content/30 hover:bg-primary hover:border-primary"
                    aria-label={social}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                 </a>
              ))}
            </div>
          </div>

          <nav> 
            <h6 className="footer-title text-lg font-semibold mb-4 opacity-90">Company</h6>
            <ul className="space-y-3">
              <li><a className="link link-hover transition-all hover:text-accent">About us</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Contact</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Careers</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Press kit</a></li>
            </ul>
          </nav>

          <nav>
            <h6 className="footer-title text-lg font-semibold mb-4 opacity-90">Product</h6>
            <ul className="space-y-3">
              <li><a className="link link-hover transition-all hover:text-accent">Features</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Pricing</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Demo</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Integrations</a></li>
            </ul>
          </nav>

          <nav>
            <h6 className="footer-title text-lg font-semibold mb-4 opacity-90">Legal</h6>
            <ul className="space-y-3">
              <li><a className="link link-hover transition-all hover:text-accent">Terms of use</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Privacy policy</a></li>
              <li><a className="link link-hover transition-all hover:text-accent">Cookie policy</a></li>
            </ul>
          </nav>
        </div>
        <div className="bg-neutral-focus text-neutral-content/70">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} InterviewAI · All rights reserved.</p>
            <div className="flex mt-4 md:mt-0 space-x-6">
              <a className="hover:text-accent transition-colors">Accessibility</a>
              <a className="hover:text-accent transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-float {
          animation: floating 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse {
           50% {
             opacity: .8;
           }
        }
      `}</style>
    </div>
  );
}

export default Landing;
