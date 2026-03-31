import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

interface PricingSectionProps {
  onRegisterClick: () => void;
}

const languages = ['fr', 'en', 'es', 'it', 'de', 'pt', 'cn'];

export function PricingSection({ onRegisterClick }: PricingSectionProps) {
  return (
    <section className="py-24 md:py-32 bg-[#FDFBEF] relative overflow-hidden flex items-center justify-center">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#4171B5]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
          className="max-w-5xl mx-auto bg-white rounded-[3rem] p-10 md:p-20 shadow-[0_20px_50px_-20px_rgba(30,42,51,0.15)] border border-[#1E2A33]/5 relative overflow-hidden flex flex-col items-center"
        >
          {/* Internal Deco */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4171B5]/5 rounded-bl-[100px]" />
          
          <Lock className="text-[#AE7D5C] w-12 h-12 mb-8 opacity-80" />
          <span className="text-[#AE7D5C] font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            Accès Premium
          </span>
          <h2 className="font-anton text-5xl md:text-7xl lg:text-8xl text-[#1c2e4a] mb-6 leading-none tracking-wide text-center uppercase">
            REJOIGNEZ LA <span className="text-[#F27D33]">MOUVANCE</span>
          </h2>

          {/* TRAILER VISUAL PILLS LIST */}
          <div className="flex flex-col items-center gap-6 my-12 w-full">
            
            <motion.h3 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }}
              className="font-bebas text-4xl text-[#1c2e4a] tracking-widest uppercase mb-2"
            >
              L'ÉQUIVALENT DE 4 SÉMINAIRES
            </motion.h3>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }} transition={{ delay: 0.1 }}
              className="font-anton text-white bg-[#4171B5] text-2xl md:text-4xl tracking-widest uppercase px-8 py-4 rounded-2xl shadow-xl border-4 border-white shadow-[#4171B5]/30"
            >
              24 HEURES DE COURS EN VIDÉO
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once:true }} transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4 bg-slate-50/80 px-10 py-6 rounded-3xl border border-slate-100"
            >
              <h4 className="font-sans font-bold text-slate-500 italic text-xl uppercase tracking-widest text-center">
                SOUS-TITRES EN 7 LANGUES
              </h4>
              <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
                {languages.map((langCode) => (
                  <img 
                    key={langCode}
                    src={`https://flagsapi.com/${langCode.toUpperCase()}/flat/64.png`} 
                    alt={langCode}
                    className="w-10 h-10 md:w-12 md:h-12 drop-shadow-sm hover:scale-110 transition-transform cursor-pointer" 
                  />
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }} whileInView={{ opacity: 1, scale: 1, rotate: -1.5 }} viewport={{ once:true }} transition={{ delay: 0.3 }}
              className="font-anton text-white bg-[#F27D33] text-2xl md:text-4xl tracking-wide uppercase px-8 py-4 rounded-[20px] shadow-[0_15px_30px_rgba(242,125,51,0.3)] border-4 border-white mt-4"
            >
              RÉVISIONS CHRONOLOGIQUES
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once:true }} transition={{ delay: 0.4 }}
              className="font-anton text-[#5A9C51] text-3xl md:text-5xl tracking-widest uppercase mt-6 drop-shadow-sm"
            >
              ASSISTANT I.A. INTÉGRÉ
            </motion.div>

          </div>

          <button 
            onClick={onRegisterClick}
            className="px-12 py-5 bg-[#F27D33] hover:bg-[#e06c27] text-white rounded-[20px] font-anton text-3xl tracking-[0.1em] uppercase shadow-[0_15px_30px_rgba(242,125,51,0.3)] border-4 border-[#F27D33] hover:border-white transition-all hover:-translate-y-1 flex items-center justify-center gap-4 group w-full sm:w-auto mt-8"
          >
            Créer mon compte
            <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <p className="mt-6 text-slate-400 text-sm font-bold uppercase tracking-wider">
            Une seule inscription. Accès à vie.
          </p>
          
        </motion.div>
      </div>
    </section>
  );
}
