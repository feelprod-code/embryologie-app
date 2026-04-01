import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { Mail, Briefcase } from 'lucide-react';
import { CursorPointer } from './CursorPointer';

// Typing effect Hook
const useTyping = (text: string, startFrame: number, frame: number, speed: number = 3) => {
    if (frame < startFrame) return "";
    const length = Math.floor((frame - startFrame) / speed);
    return text.substring(0, length);
};

export const MockAuthForm: React.FC<{ frame: number }> = ({ frame }) => {
    const { fps } = useVideoConfig();
    
    // Adjusted timings to finish typing before frame 118
    const firstName = useTyping("Marc", 5, frame, 2);
    const lastName = useTyping("Damoiseaux", 20, frame, 2);
    const profession = useTyping("Ostéopathe", 45, frame, 2);
    const email = useTyping("contact@osteopathe.com", 70, frame, 1); // very fast email

    // Cursor moves to ACCÈS button after typing finishes (around frame 90)
    // Clicks precisely at frame 118 (absolute 218)
    const cursorMove = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 15 }});
    const cursorX = interpolate(cursorMove, [0, 1], [350, 200]);
    // The ACCÈS button is near the bottom
    const cursorY = interpolate(cursorMove, [0, 1], [300, 560]);

    const cursorClick = spring({ frame: Math.max(0, frame - 118), fps, config: { damping: 15, stiffness: 200 }});
    const cursorScale = interpolate(cursorClick, [0, 0.5, 1], [1, 0.8, 1]);
    const buttonScale = interpolate(cursorClick, [0, 0.5, 1], [1, 0.95, 1]);
    
    // Button background: clair avant le clic (frame 118), brun terre après
    const buttonBg = frame >= 118 ? '#8B5E45' : '#D2A88A';

    return (
        <div className="w-full h-full flex flex-col relative font-sans overflow-visible bg-transparent">
            {/* Wrapper interne pour ne pas déborder le bg texture */}
            <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#FBF7EC] rounded-[24px]">
                <div className="absolute inset-0 bg-[url('https://feelprod.com/wp-content/uploads/2023/11/bg-texture.jpg')] opacity-[0.03] bg-cover mix-blend-multiply pointer-events-none"></div>
                
                <div className="relative w-full px-6 pt-10 pb-12 bg-transparent flex flex-col items-center z-10 min-h-full">
                    <div className="w-24 h-24 mb-6 overflow-hidden bg-transparent flex items-center justify-center rounded-full shrink-0">
                        <img src="/icon-emb.png" alt="Embryologie" className="w-full h-full object-contain rounded-full shadow-md" />
                    </div>
                
                <div className="w-full flex flex-col items-center mb-10">
                    <h1 className="text-4xl font-anton tracking-widest text-[#4171B5] uppercase leading-[0.85] text-center">
                        L'EMBRYOLOGIE
                    </h1>
                    <h2 className="text-3xl font-anton text-[#F27D33] uppercase tracking-widest leading-[0.9] mt-1 text-center">
                        BIODYNAMIQUE
                    </h2>
                    <h4 className="text-[12px] font-light text-slate-500 mt-3 text-center uppercase tracking-widest">
                        le cours de Marc Damoiseaux, <span className="font-medium text-slate-700">Ostéopathe D.O</span>
                    </h4>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className={`w-1/2 px-4 py-4 bg-[#FAF6ED]/70 border-2 rounded-xl font-medium text-[16px] shadow-inner relative transition-colors ${frame >= 5 && frame < 20 ? 'border-[#3B82F6]' : 'border-slate-100'}`}>
                            {firstName ? <span className="text-slate-800">{firstName}</span> : <span className="text-slate-400">Prénom</span>}
                            {frame >= 5 && frame < 20 && <span className="absolute animate-pulse border-r-2 border-slate-800 h-5 mt-0.5 ml-1 inline-block"></span>}
                        </div>
                        <div className={`w-1/2 px-4 py-4 bg-[#FAF6ED]/70 border-2 rounded-xl font-medium text-[16px] shadow-inner relative transition-colors ${frame >= 20 && frame < 45 ? 'border-[#3B82F6]' : 'border-slate-100'}`}>
                            {lastName ? <span className="text-slate-800">{lastName}</span> : <span className="text-slate-400">Nom</span>}
                            {frame >= 20 && frame < 45 && <span className="absolute animate-pulse border-r-2 border-slate-800 h-5 mt-0.5 ml-1 inline-block"></span>}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Briefcase className={`h-5 w-5 ${frame >= 45 && frame < 70 ? 'text-[#3B82F6]' : 'text-slate-400'}`} />
                        </div>
                        <div className={`w-full pl-12 pr-4 py-4 bg-[#FAF6ED]/70 border-2 rounded-xl font-medium text-[16px] shadow-inner relative transition-colors ${frame >= 45 && frame < 70 ? 'border-[#3B82F6]' : 'border-slate-100'}`}>
                            {profession ? <span className="text-slate-800">{profession}</span> : <span className="text-slate-400">Profession (ex: Ostéopathe)</span>}
                            {frame >= 45 && frame < 70 && <span className="absolute animate-pulse border-r-2 border-slate-800 h-5 mt-0.5 ml-1 inline-block"></span>}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className={`h-5 w-5 ${frame >= 70 && frame < 95 ? 'text-[#3B82F6]' : 'text-slate-400'}`} />
                        </div>
                        <div className={`w-full pl-12 pr-4 py-4 bg-[#FAF6ED]/70 border-2 rounded-xl font-medium text-[16px] shadow-inner relative transition-colors ${frame >= 70 && frame < 95 ? 'border-[#3B82F6]' : 'border-slate-100'}`}>
                            {email ? <span className="text-slate-800">{email}</span> : <span className="text-slate-400">votre@email.com</span>}
                            {frame >= 70 && frame < 95 && <span className="absolute animate-pulse border-r-2 border-slate-800 h-5 mt-0.5 ml-1 inline-block"></span>}
                        </div>
                    </div>

                    <div className="w-full text-white py-4 rounded-xl font-bold tracking-[0.2em] text-[17px] uppercase flex items-center justify-center mt-4 shadow-lg shadow-[#8B5E45]/20 transition-all origin-center duration-300"
                         style={{ transform: `scale(${buttonScale})`, backgroundColor: buttonBg }}>
                        ACCÈS
                    </div>
                </div>
            </div>
            {/* Close the overflow-hidden wrapper here */}
            </div>

            {/* Cursor */}
            {frame >= 90 && (
                <div className="absolute z-50 pointer-events-none origin-top-left" style={{ left: cursorX, top: cursorY, transform: `scale(${cursorScale})` }}>
                    <CursorPointer size={30} />
                </div>
            )}

            {/* Bulle BD Geante (Zoom externe) from previous step, appearing perfectly at relative frame 5 (absolute 105) */}
            {frame >= 5 && (
                 <div className="absolute right-[115%] top-[-2%] w-[580px] bg-white rounded-[36px] p-10 shadow-[0_30px_70px_rgba(0,0,0,0.25)] flex items-start gap-8 z-50 border border-slate-100"
                      style={{ 
                          opacity: spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 15 } }),
                          transform: `scale(${interpolate(spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 15 } }), [0, 1], [0.8, 1])})`
                      }}>
                     
                     <div className="flex flex-col flex-1">
                         <span className="text-black font-semibold text-[26px] flex justify-between items-center">
                             Embryologie <span className="text-slate-500 font-normal text-[20px] mr-2">maintenant</span>
                         </span>
                         <span className="text-slate-800 font-bold text-[28px] mt-2 leading-tight">
                             Votre accès étudiant 🧬
                         </span>
                         <span className="text-slate-600 text-[24px] leading-snug mt-4 font-medium">
                             Cliquez ici pour configurer votre compte et accéder.
                         </span>
                     </div>
                     
                     {/* Flèche de la bulle pointant vers l'iPhone */}
                     <div className="absolute top-[60px] -right-[20px] w-12 h-12 bg-white rotate-45 border-t border-r border-slate-100 shadow-[4px_-4px_10px_rgba(0,0,0,0.02)]" />
                 </div>
            )}
        </div>
    );
};
