import { CalendarCheck, BrainCircuit, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, scrollReveal, MotionContainer } from '@/components/common/AnimationStyles';

export function FeaturesSection() {
  const featureCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const iconContainerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 10,
        delay: 0.2
      }
    }
  };

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={scrollReveal}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="badge badge-primary badge-outline p-3 mb-4">CORE FEATURES</motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">Key Platform Capabilities</motion.h2>
          <motion.div variants={fadeInUp} className="divider max-w-sm mx-auto"></motion.div>
          <motion.p variants={fadeInUp} className="mt-2 text-lg opacity-80 max-w-2xl mx-auto">
            Our platform offers comprehensive solutions for technical hiring
          </motion.p>
        </motion.div>

        <MotionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <motion.div 
            variants={featureCardVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="card bg-base-200 shadow-md border border-transparent hover:border-primary/30 group"
          >
            <figure className="px-10 pt-10">
              <motion.div 
                variants={iconContainerVariants}
                className="avatar placeholder"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="bg-primary/10 text-primary rounded-xl w-16 p-4"
                >
                  <CalendarCheck className="h-8 w-8" />
                </motion.div>
              </motion.div>
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title">Company Portal</h3>
              <p className="text-sm opacity-70">Centralized dashboard for managing job descriptions, candidates, and interviews with custom assessment criteria.</p>
            </div>
          </motion.div>

          {/* Feature Card 2 */}
          <motion.div 
            variants={featureCardVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="card bg-base-200 shadow-md border border-transparent hover:border-secondary/30 group"
          >
            <figure className="px-10 pt-10">
              <motion.div 
                variants={iconContainerVariants}
                className="avatar placeholder"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="bg-secondary/10 text-secondary rounded-xl w-16 p-4"
                >
                  <BrainCircuit className="h-8 w-8" />
                </motion.div>
              </motion.div>
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title">AI-Powered Questions</h3>
              <p className="text-sm opacity-70">Automatically generate tailored questions based on job descriptions, candidate resumes, and skill requirements.</p>
            </div>
          </motion.div>

          {/* Feature Card 3 */}
          <motion.div 
            variants={featureCardVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="card bg-base-200 shadow-md border border-transparent hover:border-primary/30 group"
          >
            <figure className="px-10 pt-10">
              <motion.div 
                variants={iconContainerVariants}
                className="avatar placeholder"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="bg-primary/10 text-primary rounded-xl w-16 p-4"
                >
                  <ShieldCheck className="h-8 w-8" />
                </motion.div>
              </motion.div>
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title">Secure Assessment</h3>
              <p className="text-sm opacity-70">Video proctoring, identity verification, and anti-plagiarism measures ensure fair and secure interviews.</p>
            </div>
          </motion.div>
        </MotionContainer>
      </div>
    </section>
  );
} 