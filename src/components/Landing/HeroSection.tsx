import { ArrowRight, BarChart, Users, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, bounceAnimation, pulseAnimation, staggerContainer, MotionContainer } from '@/components/common/AnimationStyles';

export function HeroSection() {
  return (
    <section className="hero min-h-[calc(100vh-4rem)] bg-base-200">
      <MotionContainer className="hero-content flex-col container mx-auto py-16 text-center max-w-4xl">
        <motion.div 
          animate={bounceAnimation}
          className="badge badge-primary py-3 px-4 font-semibold"
        >
          🚀 AI-Powered Interviews
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-2"
        >
          <span className="text-base-content">Transform Your </span>
          <span className="text-primary">Technical</span>
          <br className="md:hidden" />
          <span className="text-secondary"> Hiring</span>
          <span className="text-base-content"> Process</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="py-6 text-xl opacity-80 max-w-3xl mx-auto"
        >
          Our AI-powered platform automates technical interviews, making the hiring process
          faster, fairer, and more efficient. Evaluate candidates with customized coding
          challenges, system design problems, and behavioral assessments.
        </motion.p>
        
        {/* Join buttons - centered */}
        <motion.div 
          variants={fadeInUp}
          className="join shadow-lg my-4"
        >
          <motion.button 
            animate={pulseAnimation}
            whileHover={{ scale: 1.05 }}
            className="btn btn-primary join-item group"
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
            className="btn btn-outline btn-primary join-item"
          >
            Watch Demo
          </motion.button>
        </motion.div>
        
        {/* Stats - centered, horizontal layout */}
        <motion.div 
          variants={fadeInUp}
          className="mt-10 stats shadow stats-horizontal overflow-hidden group bg-base-100 max-w-3xl mx-auto"
        >
          <motion.div 
            whileHover={{ backgroundColor: "var(--b2)", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="stat"
          >
            <div className="stat-figure text-primary">
              <BarChart className="inline-block w-8 h-8 stroke-current"/>
            </div>
            <div className="stat-title">Time Saved</div>
            <div className="stat-value text-primary">70%</div>
            <div className="stat-desc">vs. Traditional methods</div>
          </motion.div>

          <motion.div 
            whileHover={{ backgroundColor: "var(--b2)", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="stat"
          >
            <div className="stat-figure text-secondary">
              <Users className="inline-block w-8 h-8 stroke-current"/>
            </div>
            <div className="stat-title">Companies Using</div>
            <div className="stat-value text-secondary">500+</div>
            <div className="stat-desc">Across the globe</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ backgroundColor: "var(--b2)", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="stat"
          >
            <div className="stat-figure text-primary">
              <BrainCircuit className="inline-block w-8 h-8 stroke-current"/>
            </div>
            <div className="stat-title">Candidates Evaluated</div>
            <div className="stat-value text-primary">25K+</div>
            <div className="stat-desc">Monthly interviews</div>
          </motion.div>
        </motion.div>
      </MotionContainer>
    </section>
  );
} 