import { HeroSection } from "@/components/Landing/HeroSection";
import { FeaturesSection } from "@/components/Landing/FeaturesSection";
import { AssessmentTypesSection } from "@/components/Landing/AssessmentTypesSection";
import { TestimonialsSection } from "@/components/Landing/TestimonialsSection";
import { motion } from "framer-motion";

// Smooth scrolling component
const SmoothScrollWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export function Landing() {
  return (
    <SmoothScrollWrapper>
      <div className="min-h-screen font-sans">
        <HeroSection />
        <FeaturesSection />
        <AssessmentTypesSection />
        <TestimonialsSection />
      </div>
    </SmoothScrollWrapper>
  );
}

export default Landing;
