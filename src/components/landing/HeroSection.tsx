import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export function HeroSection({ onRegisterClick, onLoginClick }: HeroSectionProps) {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-[#1E2A33]">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40">
        <video 
          className="w-full h-full object-cover mix-blend-overlay"
          autoPlay 
          muted 
          loop 
          playsInline
          src="/videos/trailer_bg.mov" 
        />
        {/* Soft elegant gradient matching TDT color palette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2A33] via-[#1E2A33]/70 to-[#1E2A33]/20" />
      </div>

      {/* Header court pour accès membre */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute top-0 left-0 w-full p-6 z-20 flex justify-end"
      >
        <button 
          onClick={onLoginClick}
          className="text-[#FDFBEF]/80 hover:text-[#FDFBEF] text-sm md:text-base font-medium tracking-wider transition-colors uppercase"
          style={{ letterSpacing: '0.1em' }}
        >
          Espace Praticien →
        </button>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 text-center mt-12 md:mt-24"
      >
        {/* Title container matching SequenceL_v7 */}
        <motion.div variants={fadeIn} className="flex flex-col items-center mb-8">
          <h1 className="font-anton text-6xl md:text-8xl lg:text-[130px] text-white tracking-widest uppercase leading-[0.85] text-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            L'EMBRYOLOGIE
          </h1>
          <h2 className="font-anton text-5xl md:text-7xl lg:text-[110px] text-[#F27D33] uppercase tracking-widest leading-[0.9] text-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] mt-2 md:mt-4 mb-6">
            BIODYNAMIQUE
          </h2>
          <h4 className="text-sm md:text-lg font-light text-white/80 text-center uppercase tracking-[0.3em] mb-12 drop-shadow-md">
            le cours de Marc Damoiseaux, <span className="font-medium text-white">Ostéopathe D.O</span>
          </h4>
        </motion.div>

        {/* Call to Actions */}
        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onRegisterClick}
            className="w-full sm:w-auto px-10 py-4 bg-[#F27D33] hover:bg-[#e06c27] text-white rounded-[20px] font-anton text-2xl tracking-[0.15em] uppercase shadow-[0_15px_30px_rgba(242,125,51,0.3)] border-4 border-[#F27D33] hover:border-white transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group"
          >
            S'inscrire à la Masterclass
            <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
             href="#features"
            className="w-full sm:w-auto px-10 py-4 bg-transparent hover:bg-white/10 backdrop-blur-md text-white rounded-[20px] font-anton text-2xl tracking-[0.1em] uppercase transition-all border-4 border-white flex items-center justify-center gap-3"
          >
            <PlayCircle size={28} className="opacity-100" />
            Voir le programme
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator down */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-[30px] h-[50px] rounded-full border-[3px] border-white/50 flex justify-center p-1">
          <motion.div 
            animate={{
              y: [0, 15, 0],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-3 bg-[#F27D33] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
