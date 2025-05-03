import { Code, Zap, FileText, BrainCircuit, MonitorPlay, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, scrollReveal, MotionContainer } from '@/components/common/AnimationStyles';

export function AssessmentTypesSection() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={scrollReveal}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="badge badge-secondary p-3 mb-4">ASSESSMENT TYPES</motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">Comprehensive Evaluation Methods</motion.h2>
          <motion.div variants={fadeInUp} className="divider max-w-sm mx-auto"></motion.div>
          <motion.p variants={fadeInUp} className="mt-2 text-lg opacity-80 max-w-2xl mx-auto">
            Evaluate candidates across multiple dimensions
          </motion.p>
        </motion.div>

        {/* Use consistent card styling with primary & secondary colors */}
        <MotionContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div 
            custom={0}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="card bg-primary text-primary-content shadow-md"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 500 }}>
                  <Code size={24} />
                </motion.div>
                <h3 className="card-title text-lg">Coding Challenges</h3>
              </div>
              <p className="text-sm opacity-90">DSA problems with real-time execution in our integrated IDE.</p>
            </div>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div 
            custom={1}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="card bg-secondary text-secondary-content shadow-md"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 500 }}>
                  <Zap size={24} />
                </motion.div>
                <h3 className="card-title text-lg">System Design</h3>
              </div>
              <p className="text-sm opacity-90">Interactive whiteboard for architectural diagrams with transcription analysis.</p>
            </div>
          </motion.div>
          
          {/* Card 3 */}
          <motion.div 
            custom={2}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="card bg-primary text-primary-content shadow-md"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 500 }}>
                  <FileText size={24} />
                </motion.div>
                <h3 className="card-title text-lg">Knowledge-Based</h3>
              </div>
              <p className="text-sm opacity-90">Custom questions based on candidate's resume and role requirements.</p>
            </div>
          </motion.div>
          
          {/* Card 4 */}
          <motion.div 
            custom={3}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="card bg-secondary text-secondary-content shadow-md"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 500 }}>
                  <BrainCircuit size={24} />
                </motion.div>
                <h3 className="card-title text-lg">Framework-Specific</h3>
              </div>
              <p className="text-sm opacity-90">Technical questions tailored to specific languages, frameworks, and tools.</p>
            </div>
          </motion.div>
          
          {/* Card 5 */}
          <motion.div 
            custom={4}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="card bg-primary text-primary-content shadow-md"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 500 }}>
                  <MonitorPlay size={24} />
                </motion.div>
                <h3 className="card-title text-lg">Behavioral Assessment</h3>
              </div>
              <p className="text-sm opacity-90">Video recording with speech-to-text and sentiment analysis.</p>
            </div>
          </motion.div>
          
          {/* Card 6 */}
          <motion.div 
            custom={5}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="card bg-secondary text-secondary-content shadow-md"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 500 }}>
                  <BarChart size={24} />
                </motion.div>
                <h3 className="card-title text-lg">Detailed Reporting</h3>
              </div>
              <p className="text-sm opacity-90">Automated performance analysis with insights on skills and traits.</p>
            </div>
          </motion.div>
        </MotionContainer>
      </div>
    </section>
  );
} 