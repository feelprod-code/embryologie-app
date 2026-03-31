import { motion } from 'framer-motion';
import { PlayCircle, ChevronDown, ListVideo, FileText, Ear } from 'lucide-react';

export function ShowcaseSection() {
  return (
    <section className="py-24 bg-[#FAF6ED] relative overflow-hidden font-sans">
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- SECTION 1 : LE PODCAST --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 flex flex-col items-start text-left"
          >
            <span className="font-bebas text-3xl text-[#4171B5] tracking-widest mb-4">LE PODCAST</span>
            <h2 className="font-anton text-5xl md:text-7xl text-[#1c2e4a] leading-[0.9] uppercase tracking-wide mb-8">
              Découvrir le chemin <br /> de Marc Damoiseaux
            </h2>
            <p className="text-[#1c2e4a]/70 text-lg md:text-xl font-light mb-6 leading-relaxed">
              Un voyage sonore intime au cœur de la Biodynamique. Découvrez comment 40 années de pratique 
              ostéopathique ont forgé une vision unique de l'écoute tissulaire et du Mouvement Présent.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/80 px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <Ear className="text-[#F27D33] w-8 h-8" />
                 <div className="flex flex-col">
                   <span className="font-bold text-slate-800 text-sm">Écoute Profonde</span>
                   <span className="text-slate-500 text-xs mt-0.5">Interview exclusive</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* IPHONE MOCKUP : PODCAST */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center perspective-[1500px]"
          >
            <div className="w-[300px] h-[620px] bg-[#111] rounded-[45px] border-[4px] border-[#333] p-[10px] shadow-[40px_30px_90px_rgba(0,0,0,0.3)] relative group transform transition-transform hover:rotate-y-[-5deg] hover:rotate-x-[5deg] duration-700">
              {/* Dynamic Island */}
              <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-[14px] z-50 flex items-center justify-end pr-3">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              <div className="w-full h-full bg-[#FAF6ED] rounded-[33px] overflow-hidden flex flex-col relative justify-center items-center">
                {/* On scale l'image pour bien s'insérer dans l'écran de l'iPhone */}
                <img src="/PODCAST.png" alt="Podcast Embryologie" className="w-[250px] object-cover scale-110 translate-y-4" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- SECTION 2 : LES VIDÉOS & L'ENDODERME --- */}
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 flex flex-col items-start gap-5"
          >
            <span className="font-bebas text-3xl text-[#F27D33] tracking-widest">ESPACE DE COURS</span>
            <h2 className="font-anton text-5xl md:text-7xl text-[#1c2e4a] leading-[0.9] uppercase tracking-wide mb-2">
              L'Endoderme & <br /> Les 3 Feuillets
            </h2>
            <p className="text-[#1c2e4a]/70 text-lg font-light mb-4 leading-relaxed">
              Explorez le développement asymétrique et la formation des organes avec une clarté visuelle absolue pour parfaire votre toucher diagnostique.
            </p>

            {/* Trailer "Pilules" exactes */}
            <div className="flex flex-col gap-5 mt-2 w-full">
              <div className="font-anton text-white bg-[#4171B5] text-2xl md:text-[32px] tracking-widest uppercase px-6 py-3 rounded-2xl shadow-xl border-[3px] border-white inline-block shadow-[#4171B5]/30 self-start">
                168 VIDÉOS DISPONIBLES
              </div>
              <div className="font-anton text-white bg-[#F27D33] text-2xl md:text-[32px] tracking-wide uppercase px-6 py-3 rounded-[20px] shadow-[0_15px_30px_rgba(242,125,51,0.3)] border-[3px] border-white -rotate-1 inline-block self-start">
                30 HEURES DE FORMATION
              </div>
              <div className="px-6 py-3 rounded-full border-2 border-slate-300 bg-white/70 text-[#1c2e4a] font-bold tracking-[0.2em] text-sm shadow-sm backdrop-blur-md mt-4 self-start flex gap-2 items-center">
                <FileText size={18} />
                EXPORT PDF & RÉFÉRENCES
              </div>
            </div>
          </motion.div>

          {/* IPHONE MOCKUP : LISTE DE VIDÉOS */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center perspective-[1500px]"
          >
            <div className="w-[300px] h-[620px] bg-[#111] rounded-[45px] border-[4px] border-[#333] p-[10px] shadow-[40px_30px_90px_rgba(0,0,0,0.3)] relative group transform transition-transform hover:rotate-y-[5deg] hover:rotate-x-[5deg] duration-700">
              {/* Dynamic Island */}
              <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-[14px] z-50 flex items-center justify-end pr-3">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              
              <div className="w-full h-full bg-[#FAF6ED] rounded-[33px] overflow-hidden flex flex-col relative pt-[70px] pb-[30px] px-4">
                {/* Header Mockup */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#4171B5]/10 flex items-center justify-center shrink-0">
                    <ListVideo className="text-[#4171B5] w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-anton text-2xl text-[#1c2e4a] leading-none tracking-wide">Endoderme</h4>
                    <span className="text-xs text-[#F27D33] font-sans font-bold uppercase tracking-wider mt-1">Chapitre 3 • 42 Leçons</span>
                  </div>
                </div>

                {/* Dropdown Items Mockup */}
                <div className="flex flex-col gap-3 h-full relative z-10">
                  {[
                    { title: "L'intestin primitif", time: "12:45", active: true },
                    { title: "Formation de l'estomac", time: "18:20", active: false },
                    { title: "Hépatisation", time: "22:10", active: false },
                    { title: "Pneumatisation des poumons", time: "15:30", active: false },
                    { title: "Pancréas et Rate", time: "14:15", active: false },
                    { title: "Développement final", time: "09:50", active: false },
                  ].map((vid, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${vid.active ? 'bg-white border-[#4171B5]/40 shadow-sm' : 'bg-[#FAF6ED] border-slate-200/60'}`}>
                      <div className="flex items-center gap-3">
                        <PlayCircle className={`w-5 h-5 ${vid.active ? 'text-[#4171B5]' : 'text-slate-300'}`} />
                        <div className="flex flex-col">
                          <span className={`text-sm font-sans font-bold leading-tight ${vid.active ? 'text-[#1c2e4a]' : 'text-slate-500'}`}>{vid.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5">{vid.time} • HD</span>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-300 shrink-0" />
                    </div>
                  ))}
                </div>
                {/* Scroll fade overlay */}
                <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-[#FAF6ED] via-[#FAF6ED]/90 to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-6 left-0 w-full flex justify-center z-30 opacity-60">
                  <div className="w-12 h-1 bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
