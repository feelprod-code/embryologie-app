import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile, Audio, Sequence } from 'remotion';
import { Trash2, Briefcase, Mail } from 'lucide-react';


const ExactLoginApp: React.FC<{ variant: 'mobile' | 'tablet' | 'desktop' }> = ({ variant }) => {
    const layouts = {
        mobile: { w: 400, h: 876, scale: 210 / 400 }, // Screen: 210 inner width
        tablet: { w: 768, h: 1063, scale: 416 / 768 }, // Screen: 416 inner width
        desktop: { w: 1920, h: 1146, scale: 868 / 1920 }, // Screen: 868 inner width
    };
    
    const { w, h, scale } = layouts[variant];
    const isMobile = variant === 'mobile';
    const isTablet = variant === 'tablet';

    // Helper pour reproduire exactement les media-queries Tailwind (car la vidéo est tjs en 1920px)
    const bp = <T,>(mobileVal: T, tabletVal: T, desktopVal: T): T => {
        if (isMobile) return mobileVal;
        if (isTablet) return tabletVal;
        return desktopVal;
    };

    return (
        <div className="w-full h-full bg-[#FBF7EC] overflow-hidden relative">
            <div 
                className="absolute top-0 left-0 bg-[#FBF7EC] flex justify-center no-scrollbar"
                style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                {/* Main container exactement comme AuthScreen.tsx */}
                <div className={`relative w-full max-w-md ${bp('px-4 pt-8 pb-32 justify-start', 'px-8 pt-8 pb-40 justify-center', 'px-8 pt-8 pb-40 justify-center')} bg-transparent flex flex-col items-center z-10 min-h-full`}>

                    {/* Logo wrapper */}
                    <div className={`${bp('w-[10rem] h-[10rem] mb-2 mt-4', 'w-[11rem] h-[11rem] mb-0 mt-2', 'w-[14rem] h-[14rem] mb-0 mt-0')} overflow-hidden bg-transparent flex items-center justify-center rounded-full shrink-0`}>
                        <Img src={staticFile('icon-emb.png')} alt="Embryologie" className="w-full h-full object-contain rounded-full" />
                    </div>

                    <div className="w-full flex flex-col items-center">
                        {/* Title container */}
                        <div className={`flex flex-col items-center justify-center w-full ${bp('mb-3 mt-2', 'mb-4 mt-4', 'mb-6 mt-8')}`}>
                            <h1 className={`${bp('text-4xl', 'text-5xl', 'text-6xl')} font-anton tracking-widest text-slate-700 uppercase leading-[0.85] text-center`}>
                                L'EMBRYOLOGIE
                            </h1>
                            <h2 className={`${bp('text-3xl mt-1', 'text-4xl mt-2', 'text-5xl mt-2')} font-anton text-[#F27D33] uppercase tracking-widest leading-[0.9] text-center`}>
                                BIODYNAMIQUE
                            </h2>
                        </div>

                        <h4 className={`${bp('text-[10px] mb-5', 'text-xs mb-6', 'text-sm mb-10')} font-light text-slate-500 text-center uppercase tracking-widest`}>
                            le cours de Marc Damoiseaux, <span className="font-medium text-slate-700">Ostéopathe D.O</span>
                        </h4>
                    </div>

                    {/* Form elements mockup (identical styling) */}
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className={`w-1/2 ${bp('px-4 py-3 rounded-xl', 'px-4 py-4 rounded-2xl', 'px-4 py-4 rounded-2xl')} bg-[#FAF6ED]/70 border-2 border-slate-100 flex items-center shadow-inner`}>
                                <span className="text-slate-400 font-medium text-[16px]">Prénom</span>
                            </div>
                            <div className={`w-1/2 ${bp('px-4 py-3 rounded-xl', 'px-4 py-4 rounded-2xl', 'px-4 py-4 rounded-2xl')} bg-[#FAF6ED]/70 border-2 border-slate-100 flex items-center shadow-inner`}>
                                <span className="text-slate-400 font-medium text-[16px]">Nom</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 ${bp('pl-4', 'pl-5', 'pl-5')} flex items-center pointer-events-none`}>
                                <Briefcase className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className={`w-full ${bp('pl-12 pr-4 py-3 rounded-xl', 'pl-14 pr-5 py-4 rounded-2xl', 'pl-14 pr-5 py-4 rounded-2xl')} bg-[#FAF6ED]/70 border-2 border-slate-100 flex items-center shadow-inner`}>
                                <span className="text-slate-400 font-medium text-[16px]">Profession (ex: Ostéopathe)</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 ${bp('pl-4', 'pl-5', 'pl-5')} flex items-center pointer-events-none`}>
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className={`w-full ${bp('pl-12 pr-4 py-3 rounded-xl', 'pl-14 pr-5 py-4 rounded-2xl', 'pl-14 pr-5 py-4 rounded-2xl')} bg-[#FAF6ED]/70 border-2 border-slate-100 flex items-center shadow-inner`}>
                                <span className="text-slate-400 font-medium text-[16px]">votre@email.com</span>
                            </div>
                        </div>

                        <div className={`w-full bg-[#A06C50] text-white ${bp('py-3 rounded-xl text-base', 'py-4 rounded-2xl text-lg', 'py-4 rounded-2xl text-lg')} font-bold tracking-[0.2em] uppercase flex items-center justify-center mt-2 shadow-lg shadow-[#A06C50]/30`}>
                            ACCÈS
                        </div>
                    </div>
                </div>
                
                {/* Footer exactly as AuthScreen */}
                <div className={`absolute ${bp('bottom-4', 'bottom-8', 'bottom-8')} w-full flex flex-col items-center justify-end opacity-90 z-20 gap-4`}>
                    <div className={`flex items-center justify-center gap-1 ${bp('text-[11px]', 'text-xs', 'text-xs')} font-bold text-[#4171B5] px-3 py-1.5`}>
                        <Trash2 className="w-3.5 h-3.5" /> Vider le cache de l'appareil
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <span className={`${bp('text-[10px]', 'text-[11px]', 'text-sm')} text-slate-500/80 font-medium uppercase tracking-[0.3em] text-center relative z-20`}>
                            Réalisation Feelprod
                        </span>
                        <div className="w-12 h-[1px] bg-slate-300/50 mt-0.5"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export const SequenceL: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // --- PHASE 1 : TITRES PERCUTANTS ---
    const titles = [
        { 
            text: "L'ÉQUIVALENT DE 4 SÉMINAIRES", 
            className: "font-bebas text-[110px] text-[#1c2e4a] leading-[0.9] tracking-wide drop-shadow-sm"
        },
        { 
            text: "24 HEURES DE COURS EN VIDÉO", 
            className: "font-anton text-white bg-[#4171B5] text-[50px] tracking-widest uppercase px-10 py-3 rounded-2xl shadow-xl border-4 border-white mt-2"
        },
        { 
            text: "SOUS-TITRES EN 7 LANGUES", 
            className: "font-sans font-bold text-[45px] text-slate-500 italic border-l-[6px] border-[#4171B5] pl-6 ml-10 mt-4 align-self-start"
        },
        { 
            text: "RÉVISIONS CHRONOLOGIQUES", 
            className: "font-anton text-white bg-[#F27D33] text-[50px] tracking-wide uppercase px-8 py-3 rounded-[20px] shadow-[0_15px_30px_rgba(242,125,51,0.3)] border-4 border-white rotate-[-1.5deg] mt-6"
        },
        { 
            text: "ASSISTANT I.A. INTÉGRÉ", 
            className: "font-anton text-[#5A9C51] text-[80px] tracking-widest uppercase mt-4 drop-shadow-sm"
        },
        { 
            text: "EXPORT PDF & RÉFÉRENCES", 
            className: "px-10 py-4 rounded-full border-2 border-slate-300 bg-white/70 text-[#1c2e4a] font-bold tracking-[0.2em] text-[35px] shadow-sm backdrop-blur-md mt-6"
        }
    ];

    const titleDuration = 25; // Rythme d'empilement
    const titlesEnd = titles.length * titleDuration;

    // Les titres seront rendus via un map() plus bas avec leur propre state.


    // --- PHASE 2 : MOCKUPS ---
    const mockupsStart = titlesEnd + 10; // 190

    // Texte "Disponible sur tous vos écrans" centré en bas
    const finalPhraseY = spring({
        fps,
        frame: frame - mockupsStart,
        config: { damping: 14 },
    });
    const finalPhraseOpacity = interpolate(frame, [mockupsStart, mockupsStart + 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Animations des devices - Dévoilement simultané mais échelonné
    const deviceAnimStart = mockupsStart + 20;

    // L'iMac est au centre, bien visible
    const imacEntry = spring({
        fps,
        frame: frame - deviceAnimStart,
        config: { damping: 13, mass: 0.8 },
    });

    // L'iPad est à gauche, légèrement devant
    const ipadEntry = spring({
        fps,
        frame: frame - (deviceAnimStart + 8),
        config: { damping: 13, mass: 0.8 },
    });

    // L'iPhone est à droite, également légèrement devant
    const iphoneEntry = spring({
        fps,
        frame: frame - (deviceAnimStart + 16), 
        config: { damping: 13, mass: 0.8 },
    });

    return (
        <AbsoluteFill className="bg-[#FAF6ED] overflow-hidden flex items-center justify-center font-sans">
            
            {/* --- ECRAN NOIR DE FOND (TRANSITION DE NOTRE SUJET PRECEDENT) --- */}
            {/* (Optionnel, ici on a déjà le bg beige) */}

            {/* --- PHASE 1 : TEXTES PERCUTANTS (PILULES) --- */}
            {frame < mockupsStart + 20 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none z-0">
                    {titles.map((title, i) => {
                        const startFrame = i * titleDuration;
                        const localFrame = frame - startFrame;
                        
                        // Si pas encore apparu
                        if (localFrame < 0) return null;

                        const scale = spring({
                            fps,
                            frame: localFrame,
                            config: { damping: 12, mass: 0.8 },
                        });

                        const translateY = interpolate(scale, [0, 1], [50, 0]);
                        const opacityIn = interpolate(localFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
                        
                        // Disparition en fondu avant l'arrivée des mockups
                        const fadeOutFrame = frame - (mockupsStart - 10);
                        const opacityOut = interpolate(fadeOutFrame, [0, 15], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

                        return (
                            <div 
                                key={i}
                                className={`${title.className} shadow-2xl flex items-center justify-center`}
                                style={{
                                    transform: `scale(${scale}) translateY(${translateY}px)`,
                                    opacity: opacityIn * opacityOut,
                                }}
                            >
                                {title.text}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* --- PHASE 2 : MOCKUPS & ÉCRANS --- */}
            {frame >= mockupsStart && (
                <AbsoluteFill className="z-10 flex flex-col items-center justify-center">
                    {/* SCÈNE 3D POUR DEVICES */}
                    <div className="relative w-full h-[700px] flex items-center justify-center perspective-[2500px] mt-10">

                        {/* ======================= 1. iMAC (Desktop) - DROITE ======================= */}
                        <div 
                            className="absolute z-10"
                            style={{
                                transform: `
                                    translateX(200px)
                                    translateY(${interpolate(imacEntry, [0, 1], [400, 0])}px) 
                                    translateZ(-150px)
                                    scale(${interpolate(imacEntry, [0, 1], [0.95, 1.0])})
                                `,
                                opacity: imacEntry,
                                filter: `drop-shadow(0 40px 80px rgba(0,0,0,${interpolate(imacEntry, [0, 1], [0, 0.4])}))`
                            }}
                        >
                            <div className="w-[900px] h-[550px] bg-black rounded-[35px] border-[2px] border-[#3a3a3c] p-[16px] relative flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
                                <div className="w-full flex-1 bg-[#FBF7EC] rounded-[20px] overflow-hidden flex flex-col relative">
                                    <ExactLoginApp variant="desktop" />
                                </div>
                                <div className="absolute bottom-[-1px] left-[-1px] right-[-1px] h-[58px] bg-[#d1d1d6] rounded-b-[33px] flex items-center justify-center overflow-hidden z-10">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                                    <div className="w-6 h-6 rounded-full border-2 border-black/10 opacity-30 mix-blend-overlay" />
                                </div>
                            </div>
                            <div className="mx-auto w-[160px] h-[110px] bg-gradient-to-b from-[#b0b0b8] to-[#d1d1d6] mt-[-10px] shadow-xl relative clip-imac-stand">
                                <div className="absolute bottom-0 w-full h-2 bg-[#8e8e93]" />
                            </div>
                        </div>

                        {/* ======================= 2. iPAD (Portrait) - MILIEU GAUCHE ======================= */}
                        <div 
                            className="absolute z-20"
                            style={{
                                transform: `
                                    translateX(${-240}px)
                                    translateY(${interpolate(ipadEntry, [0, 1], [450, 30])}px) 
                                    translateZ(50px)
                                    scale(${interpolate(ipadEntry, [0, 1], [0.85, 1.05])})
                                `,
                                opacity: ipadEntry,
                            }}
                        >
                            <div className="w-[440px] h-[600px] bg-black rounded-[28px] border-[1px] border-[#444] p-[12px] shadow-[30px_35px_70px_rgba(0,0,0,0.55)] relative flex">
                                <div className="absolute top-0 right-0 w-[40%] h-[150%] bg-gradient-to-l from-white/10 to-transparent rotate-12 -translate-y-10 pointer-events-none" />
                                <div className="w-full h-full bg-[#FBF7EC] rounded-[16px] overflow-hidden flex flex-col relative z-20">
                                    <ExactLoginApp variant="tablet" />
                                </div>
                            </div>
                        </div>

                        {/* ======================= 3. iPHONE (Mobile) - EXTRÊME GAUCHE ======================= */}
                        <div 
                            className="absolute z-30"
                            style={{
                                transform: `
                                    translateX(${-520}px)
                                    translateY(${interpolate(iphoneEntry, [0, 1], [500, 80])}px)
                                    translateZ(250px)
                                    scale(${interpolate(iphoneEntry, [0, 1], [0.80, 0.95])})
                                `,
                                opacity: iphoneEntry,
                            }}
                        >
                            <div className="w-[230px] h-[480px] bg-[#111] rounded-[38px] border-[2px] border-[#444] p-[10px] shadow-[40px_30px_90px_rgba(0,0,0,0.6)] relative flex">
                                {/* Dynamic Island */}
                                <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[70px] h-[22px] bg-black rounded-[10px] z-50 flex items-center justify-end pr-3">
                                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                </div>
                                <div className="absolute top-0 right-0 w-[60%] h-[150%] bg-gradient-to-l from-white/10 to-transparent rotate-12 -translate-y-10 pointer-events-none" />
                                <div className="w-full h-full bg-[#FBF7EC] rounded-[28px] overflow-hidden flex flex-col relative z-20">
                                    <ExactLoginApp variant="mobile" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Titre Principal (Bas de l'écran) */}
                    <div 
                        className="absolute bottom-10 left-0 right-0 flex justify-center text-slate-800 font-medium text-[50px] tracking-tight z-40"
                        style={{
                            opacity: finalPhraseOpacity,
                            transform: `translateY(${interpolate(finalPhraseY, [0, 1], [60, 0])}px)`
                        }}
                    >
                        Disponible sur tous v<span className="text-[#F2A374]">o</span>s écrans.
                    </div>
                    
                </AbsoluteFill>
            )}

            {/* --- BRUITAGES APPARITION DES TITRES --- */}
            {titles.map((_, i) => {
                const startFrame = i * titleDuration;
                const fromFrame = Math.round(startFrame * (realFps / 30));
                
                // FeelProd: Tu peux glisser ces 5 bruitages depuis des banques pros (Artlist, Epidemic)
                // directement dans le dossier "public/" (en remplaçant mes fichiers temporaires)
                const sfxFiles = [
                    'impact-deep.mp3',       // 1. Coup lourd, profond
                    'whoosh-hit.mp3',        // 2. Aspiration puissante vers l'avant
                    'cinematic-boom.mp3',    // 3. Explosion lointaine, grave
                    'glitch-transition.mp3', // 4. Un effet plus digital, cassure
                    'epic-riser-hit.mp3',    // 5. Impact sec façon "Transformers"
                    'impact-heavy.mp3'       // 6. Impact lourd final et résonance
                ];

                const sfxFile = sfxFiles[i % sfxFiles.length];

                return (
                    <Sequence key={`sfx-${i}`} name={`SFX - Titre ${i + 1} (${sfxFile})`} from={fromFrame}>
                        <Audio 
                            src={staticFile(sfxFile)} 
                            volume={0.8} 
                            playbackRate={1} // Tu pourras ajuster ça si l'impact est trop sec
                        />
                    </Sequence>
                );
            })}
            
            <style dangerouslySetInnerHTML={{__html: `
                .clip-imac-stand {
                    clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
            `}} />
        </AbsoluteFill>
    );
};
