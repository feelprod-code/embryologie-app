import { useRef } from 'react';
import { HeroSection } from './HeroSection';
import { PricingSection } from './PricingSection';
import { Footer } from './Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="h-[100dvh] overflow-y-auto bg-[#FDFBEF] text-[#1E2A33] font-sans selection:bg-[#AE7D5C]/30 relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#AE7D5C] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />
      
      <main className="flex flex-col overflow-hidden">
        <HeroSection onRegisterClick={onRegisterClick} onLoginClick={onLoginClick} />
        <PricingSection onRegisterClick={onRegisterClick} />
      </main>
      <Footer />
    </div>
  );
}
