import { useState, useEffect } from 'react';
import { PlayCircle, Video, ArrowRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export function HeroSection({ onRegisterClick, onLoginClick }: HeroSectionProps) {
  const [currentScreen, setCurrentScreen] = useState(0);

  // Alternance des "pages" de l'application toutes les 4 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] pt-20 pb-16 flex flex-col items-center justify-between overflow-hidden bg-[#FDFBEF]">
      
      {/* Background subtil */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-[#AE7D5C]/5 blur-[80px]" />
      </div>

      {/* Bouton Connexion */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-0 right-0 p-6 z-30"
      >
        <button 
          onClick={onLoginClick}
          className="text-[#1E2A33]/50 hover:text-[#AE7D5C] text-xs font-sans tracking-[0.2em] uppercase transition-all flex items-center gap-2"
        >
          Connexion <ArrowRight size={14} />
        </button>
      </motion.div>

      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center h-full gap-12 sm:gap-16 flex-1 justify-center max-w-5xl">
        
        {/* --- TIER 1 : L'iPhone en 3D avec écrans alternés --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="perspective-[1600px] w-full flex justify-center"
        >
          <motion.div 
            animate={{ 
              rotateY: [-5, 5, -5],
              rotateX: [2, 4, 2],
              y: [-5, 5, -5] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="relative w-[260px] sm:w-[300px] h-[540px] sm:h-[620px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Boîtier iPhone ultra premium */}
            <div className="w-full h-full bg-[#FCFAFA] rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(174,125,92,0.2)] ring-1 ring-[#1E2A33]/5 p-[8px] flex flex-col absolute inset-0 z-10">
              
              {/* Écran */}
              <div className="w-full h-full bg-[#FAF6ED] rounded-[2.5rem] overflow-hidden relative border border-[#1E2A33]/5 flex flex-col">
                
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1E2A33] rounded-full z-50 flex items-center justify-center">
                  <div className="w-8 h-1 bg-white/20 rounded-full" />
                </div>
                
                {/* Header constant */}
                <div className="pt-10 pb-3 px-5 border-b border-[#AE7D5C]/10 bg-white/50 backdrop-blur-md z-40 flex justify-between items-center">
                  <img src="/icon-emb.png" className="w-6 h-6 mix-blend-multiply opacity-80" alt="logo" />
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-[#1E2A33]/30" />
                    <div className="w-1 h-1 rounded-full bg-[#1E2A33]/30" />
                  </div>
                </div>

                {/* Contenu de l'application (Alternance) */}
                <div className="relative flex-1 bg-[#FDFBEF] w-full h-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    
                    {/* ÉCRAN 1 : Liste Vidéos */}
                    {currentScreen === 0 && (
                      <motion.div 
                        key="screen1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 p-4 flex flex-col gap-3"
                      >
                         <div className="h-4 w-1/2 bg-[#AE7D5C]/20 rounded-full mb-2" />
                         {[1, 2, 3, 4].map(i => (
                           <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-[#1E2A33]/5 flex gap-3 items-center">
                              <div className="w-12 h-10 bg-[#FAF6ED] rounded-lg flex items-center justify-center">
                                <Video size={14} className="text-[#AE7D5C]/60" />
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="h-2 w-full bg-[#1E2A33]/10 rounded-full" />
                                <div className="h-1.5 w-1/2 bg-[#AE7D5C]/30 rounded-full" />
                              </div>
                           </div>
                         ))}
                      </motion.div>
                    )}

                    {/* ÉCRAN 2 : Assistant IA */}
                    {currentScreen === 1 && (
                      <motion.div 
                        key="screen2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 p-4 flex flex-col"
                      >
                         <div className="flex-1 overflow-hidden flex flex-col justify-end gap-3 pb-4">
                            <div className="self-end bg-[#AE7D5C]/10 p-3 rounded-2xl rounded-br-none w-3/4">
                              <div className="h-2 w-full bg-[#AE7D5C]/30 rounded-full mb-1" />
                              <div className="h-2 w-2/3 bg-[#AE7D5C]/30 rounded-full" />
                            </div>
                            <div className="self-start bg-white border border-[#1E2A33]/5 p-3 rounded-2xl rounded-bl-none w-4/5 flex gap-2">
                              <Brain size={14} className="text-[#5A9C51] shrink-0" />
                              <div className="flex flex-col gap-2 w-full mt-1">
                                <div className="h-2 w-full bg-[#1E2A33]/15 rounded-full" />
                                <div className="h-2 w-full bg-[#1E2A33]/15 rounded-full" />
                                <div className="h-2 w-1/2 bg-[#1E2A33]/15 rounded-full" />
                              </div>
                            </div>
                         </div>
                         <div className="h-10 w-full bg-white rounded-xl border border-[#1E2A33]/10 flex items-center px-3">
                           <div className="h-2 w-1/3 bg-[#1E2A33]/10 rounded-full" />
                         </div>
                      </motion.div>
                    )}

                    {/* ÉCRAN 3 : Lecteur Vidéo */}
                    {currentScreen === 2 && (
                      <motion.div 
                        key="screen3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col"
                      >
                         <div className="w-full h-48 bg-[#1E2A33] flex items-center justify-center relative">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <PlayCircle size={24} className="text-white" />
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded-full">
                              <div className="w-1/3 h-full bg-[#AE7D5C] rounded-full" />
                            </div>
                         </div>
                         <div className="p-5 flex flex-col gap-3">
                           <div className="h-4 w-3/4 bg-[#1E2A33]/20 rounded-full" />
                           <div className="h-2 w-full bg-[#1E2A33]/10 rounded-full" />
                           <div className="h-2 w-full bg-[#1E2A33]/10 rounded-full" />
                           <div className="h-2 w-2/3 bg-[#1E2A33]/10 rounded-full" />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Reflet vitre */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none rounded-[3rem] z-20" />
            {/* Ombre portée 3D */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/10 blur-[20px] rounded-[100%] pointer-events-none z-0" />
          </motion.div>
        </motion.div>

        {/* --- TIER 2 : Le Menu "Pills" en dessous --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-3 w-full max-w-2xl px-4"
        >
          {[
            { label: "24h de cours", icon: null },
            { label: "Vidéos de séminaires", icon: <Video size={14} /> },
            { label: "Intelligence Artificielle", icon: <Brain size={14} /> },
            { label: "Multilingue", icon: null }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#1E2A33] shadow-[0_4px_15px_rgba(174,125,92,0.08)] border border-[#AE7D5C]/10 font-sans font-medium tracking-wide text-xs sm:text-sm uppercase"
            >
              {item.icon && <span className="text-[#AE7D5C]">{item.icon}</span>}
              {item.label}
            </div>
          ))}
        </motion.div>

        {/* --- TIER 3 : Les Titres et le Bouton (Dernier tiers) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center w-full mt-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bebas text-[#1E2A33] tracking-widest uppercase leading-tight text-center">
            L'EMBRYOLOGIE BIODYNAMIQUE
          </h1>
          <h2 className="text-xl sm:text-2xl font-bebas text-[#AE7D5C] tracking-widest uppercase mt-2 text-center">
            de Marc Damoiseaux
          </h2>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
            <button 
              onClick={onRegisterClick}
              className="px-10 py-4 bg-[#AE7D5C] hover:bg-[#9B6B4D] text-white rounded-full font-sans font-medium text-sm sm:text-base tracking-[0.1em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Découvrir le programme
            </button>
            <button 
              onClick={() => document.getElementById('trailer-showcase')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent hover:bg-[#AE7D5C]/5 text-[#1E2A33] rounded-full font-sans font-medium text-sm sm:text-base tracking-[0.1em] uppercase transition-all flex items-center gap-3 border border-[#1E2A33]/10"
            >
              <PlayCircle size={20} className="text-[#AE7D5C]" />
              Voir le Trailer
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
