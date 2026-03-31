import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const TOTAL_FRAMES = 26;

export function TrailerShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [currentFrame, setCurrentFrame] = useState(1);

  // Preload images to avoid flickering
  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/IMAGES TRAILER/${i.toString().padStart(2, '0')}.png`;
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 0 to 1 maps to 1 to 26
    const exactFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.floor(latest * TOTAL_FRAMES) + 1));
    setCurrentFrame(exactFrame);
  });

  return (
    <section ref={containerRef} className="relative h-[1200vh] bg-[#FAF6ED] font-sans">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden py-4 md:py-10">
        
        {/* Background blobs for aesthetics */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-[120px] -z-10 pointer-events-none">
          <div className="w-[60vw] h-[60vw] bg-[#F27D33] rounded-full mix-blend-multiply opacity-40" />
          <div className="w-[60vw] h-[60vw] bg-[#4171B5] rounded-full mix-blend-multiply -ml-[30vw] opacity-40" />
        </div>

        {/* Text Header */}
        <div className="text-center mb-6 md:mb-8 z-10 px-4 mt-8 md:mt-0">
          <span className="font-bebas text-xl md:text-3xl text-[#4171B5] tracking-widest mb-1 md:mb-2 inline-block">VISITE GUIDÉE SÉQUENTIELLE</span>
          <h2 className="font-anton text-4xl md:text-6xl lg:text-7xl text-[#1c2e4a] leading-none uppercase tracking-wide">
            Au cœur de <span className="text-[#F27D33]">l'Application</span>
          </h2>
        </div>
        
        {/* Mockup iPhone */}
        <div className="relative z-10 perspective-[1500px] flex-1 min-h-0 flex items-center justify-center my-4 md:my-8">
          <div className="w-[300px] h-[620px] md:w-[320px] md:h-[660px] bg-[#111] rounded-[48px] border-[4px] border-[#333] p-[10px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative group transform transition-transform duration-500 hover:scale-[1.02]">
            {/* Dynamic Island */}
            <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-[15px] z-50 flex items-center justify-end pr-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
            </div>
            
            {/* Screen */}
            <div className="w-full h-full bg-[#FAF6ED] rounded-[36px] overflow-hidden flex flex-col relative justify-center items-center">
                {Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
                    const frameNumber = i + 1;
                    const formatted = frameNumber.toString().padStart(2, '0');
                    return (
                        <img 
                            key={frameNumber}
                            src={`/IMAGES TRAILER/${formatted}.png`} 
                            alt={`App screenshot ${formatted}`} 
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ${currentFrame === frameNumber ? 'opacity-100' : 'opacity-0'}`}
                        />
                    );
                })}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-bebas text-lg md:text-xl text-[#1c2e4a]/70 tracking-[0.2em] mb-2">SCROLLEZ POUR EXPLORER</span>
          <div className="w-[2px] h-8 md:h-12 bg-gradient-to-b from-[#1c2e4a]/50 to-transparent" />
        </motion.div>

      </div>
    </section>
  );
}
