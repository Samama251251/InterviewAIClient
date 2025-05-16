import { ArrowRight, BarChart, Users, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, bounceAnimation, pulseAnimation, MotionContainer } from '@/components/common/AnimationStyles';

export function HeroSection() {
  return (
    <section className="hero min-h-[calc(100vh-4rem)] bg-base-200">
      <MotionContainer className="hero-content flex-col container mx-auto py-8 md:py-16 px-4 text-center max-w-4xl">
        <motion.div 
          animate={bounceAnimation}
          className="badge badge-primary py-2 md:py-3 px-3 md:px-4 font-semibold text-xs md:text-sm"
        >
           AI-Powered Interviews
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-4 md:mt-6 mb-2 leading-tight"
        >
          <span className="text-base-content">Transform Your </span>
          <span className="text-primary">Technical</span>
          <br className="sm:hidden" />
          <span className="text-secondary"> Hiring</span>
          <span className="text-base-content"> Process</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="py-4 md:py-6 text-base md:text-xl opacity-80 max-w-3xl mx-auto px-2"
        >
          Our AI-powered platform automates technical interviews, making the hiring process
          faster, fairer, and more efficient. Evaluate candidates with customized coding
          challenges, system design problems, and behavioral assessments.
        </motion.p>
        
        {/* Join buttons - centered */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-3 sm:join sm:shadow-lg my-4 w-full sm:w-auto justify-center"
        >
          <motion.button 
            animate={pulseAnimation}
            whileHover={{ scale: 1.05 }}
            className="btn btn-primary sm:join-item group"
          >
            Get Started
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight size={16} className="ml-1" />
            </motion.div>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="btn btn-outline btn-primary sm:join-item"
          >
            Watch Demo
          </motion.button>
        </motion.div>
        
        {/* Stats - responsive layout that switches to vertical on mobile */}
        <motion.div 
          variants={fadeInUp}
          className="mt-8 md:mt-10 stats shadow flex-col sm:flex-row overflow-hidden group bg-base-100 max-w-3xl mx-auto w-full"
        >
          <motion.div 
            whileHover={{ backgroundColor: "var(--b2)", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="stat"
          >
            <div className="stat-figure text-primary">
              <BarChart className="inline-block w-6 h-6 md:w-8 md:h-8 stroke-current"/>
            </div>
            <div className="stat-title text-sm md:text-base">Time Saved</div>
            <div className="stat-value text-primary text-2xl md:text-4xl">70%</div>
            <div className="stat-desc text-xs md:text-sm">vs. Traditional methods</div>
          </motion.div>

          <motion.div 
            whileHover={{ backgroundColor: "var(--b2)", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="stat"
          >
            <div className="stat-figure text-secondary">
              <Users className="inline-block w-6 h-6 md:w-8 md:h-8 stroke-current"/>
            </div>
            <div className="stat-title text-sm md:text-base">Companies Using</div>
            <div className="stat-value text-secondary text-2xl md:text-4xl">500+</div>
            <div className="stat-desc text-xs md:text-sm">Across the globe</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ backgroundColor: "var(--b2)", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="stat"
          >
            <div className="stat-figure text-primary">
              <BrainCircuit className="inline-block w-6 h-6 md:w-8 md:h-8 stroke-current"/>
            </div>
            <div className="stat-title text-sm md:text-base">Candidates Evaluated</div>
            <div className="stat-value text-primary text-2xl md:text-4xl">25K+</div>
            <div className="stat-desc text-xs md:text-sm">Monthly interviews</div>
          </motion.div>
        </motion.div>
      </MotionContainer>
    </section>
  );
} 