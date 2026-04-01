import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from 'remotion';
import { AppVideoLibrary } from './app-ui/AppVideoLibrary';
import { videoCourses } from './data/videoCourses';
import { fpsS } from './hooks/useTime';

export const SequenceE_v8: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // Dimensions
    const phoneW = 560;
    const phoneH = 1200;

    // NOUVELLE LOGIQUE : Séquence d'actions RÉPÉTÉE pour CHAQUE catégorie !
    // Durée d'une phase complète (pointeur -> clic -> disparition -> main -> scroll) = 120 frames (4 sec)
    const PHASE_DUR = 120;
    
    let pointerTargetPhase = Math.floor(frame / PHASE_DUR);
    if (pointerTargetPhase > 3) pointerTargetPhase = 3;
    
    const localFrame = frame - pointerTargetPhase * PHASE_DUR;

    // L'interface graphique (catégorie) change exactement APRES le clic !
    // Le clic est calculé à localFrame = 25 pour chaque phase.
    const categories = ["ectoderme", "endoderme", "mesoderme", "oeil"] as const;
    const categoryNames = ["Ectoderme", "Endoderme", "Mésoderme", "L'Oeil"];
    
    const uiActivePhaseIndex = localFrame < 25 ? pointerTargetPhase - 1 : pointerTargetPhase;
    const uiActivePhase = Math.max(0, uiActivePhaseIndex); 
    const selectedCategory = categories[uiActivePhase];
    const forceNoSelectedTab = uiActivePhaseIndex === -1;

    // Calcul des statistiques
    const getCategoryStats = (catId: string) => {
        const videos = videoCourses.filter(v => v.categoryId === catId);
        const count = videos.length;
        let totalSeconds = 0;
        videos.forEach(v => {
            const parts = v.duration.split(':').map(Number);
            if (parts.length === 2) {
                totalSeconds += parts[0] * 60 + parts[1];
            } else if (parts.length === 3) {
                totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
            }
        });
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return { count, hours, minutes };
    };

    // Positions des onglets (top nav)
    const tabY = 170; 
    const tabXs = [phoneW * 0.15, phoneW * 0.38, phoneW * 0.62, phoneW * 0.85];

    // Calcul de la position du pointeur
    let pointerX = phoneW + 100;
    let pointerY = phoneH + 100;
    let clickAnim = 1;

    const currentTabX = tabXs[pointerTargetPhase]; 
    const prevTabX = phoneW + 100;
    const prevTabY = tabY + 100;
    
    const flyIn = spring({ frame: Math.max(0, localFrame), fps, config: { damping: 100, mass: 0.5, stiffness: 200 } });
    
    pointerX = interpolate(flyIn, [0, 1], [prevTabX, currentTabX]);
    pointerY = interpolate(flyIn, [0, 1], [prevTabY, tabY]);

    clickAnim = 1 - (spring({ frame: Math.max(0, localFrame - 20), fps, config: { damping: 14 } }) * 0.2) + (spring({ frame: Math.max(0, localFrame - 30), fps, config: { damping: 14 } }) * 0.2);

    let pointerOpacity = 0;
    if (localFrame < 15) pointerOpacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    else if (localFrame < 35) pointerOpacity = 1;
    else pointerOpacity = interpolate(localFrame, [35, 45], [1, 0], { extrapolateRight: 'clamp' });

    // MAIN QUI SWIPE (SCROLL)
    const handFlyIn = interpolate(localFrame, [40, 50], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const handFadeOut = interpolate(localFrame, [60, 70], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    let handX = phoneW * 0.6; 
    let handY = phoneH + 200; 
    let handOpacity = localFrame < 55 ? handFlyIn : handFadeOut;
    let handScale = interpolate(localFrame, [45, 55, 65], [1, 0.9, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    if (localFrame >= 40 && localFrame <= 75) {
        const enterY = interpolate(localFrame, [40, 50], [phoneH * 0.7, phoneH * 0.7], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        const swipeY = interpolate(localFrame, [50, 65], [0, phoneH * 0.3], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        handY = enterY - swipeY;
    }
    
    // CROSSFADE LOGIC for category changes
    const prevPhase = Math.max(0, uiActivePhase - 1);
    const prevCategory = categories[prevPhase];
    
    const isTransitioning = uiActivePhaseIndex > 0 && localFrame >= 25 && localFrame < 40;
    const fadeOp = isTransitioning ? interpolate(localFrame, [25, 40], [1, 0], { extrapolateRight: 'clamp' }) : 0;

    const currentScrollStart = uiActivePhase * 120 + 55;
    let simScrollFrame = 0;
    if (frame > currentScrollStart) {
        simScrollFrame = (frame - currentScrollStart) * 0.25;
    }

    // Split Screen Constants
    const translateZ = 0;
    const currentRotY = -35;
    const currentRotX = 15;
    const currentRotZ = 2;

    const categoryColors = ["text-[#5A9C51]", "text-[#4171B5]", "text-[#F27D33]", "text-[#F2B729]"];
    const categoryBgs = ["bg-[#5A9C51]", "bg-[#4171B5]", "bg-[#F27D33]", "bg-[#F2B729]"];

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* SOUND DESIGN: CLICS */}
            {[20, 140, 260, 380].map((clickFrame) => (
                <Sequence name={`Bruitage - click.wav ${clickFrame}`} key={clickFrame} from={fpsS(clickFrame, realFps)} durationInFrames={fpsS(15, realFps)}>
                    <Audio src={staticFile('click.wav')} />
                </Sequence>
            ))}

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#FAF6ED_0%,_#FAF6ED_60%)] pointer-events-none z-0"></div>

            {/* TEXTE GAUCHE (SPLIT SCREEN) */}
            {categoryNames.map((name, phaseIndex) => {
                const isActivePhase = uiActivePhase === phaseIndex;
                const phaseStats = getCategoryStats(categories[phaseIndex]);
                
                let textOpacity = 0;
                let textTranslateY = 20;

                if (isActivePhase) {
                    if (isTransitioning) {
                        textOpacity = interpolate(localFrame, [25, 40], [0, 1], { extrapolateRight: 'clamp' });
                        textTranslateY = interpolate(localFrame, [25, 40], [20, 0], { extrapolateRight: 'clamp' });
                    } else {
                        textOpacity = 1;
                        textTranslateY = 0;
                    }
                } else if (phaseIndex === prevPhase && isTransitioning) {
                    textOpacity = interpolate(localFrame, [25, 40], [1, 0], { extrapolateRight: 'clamp' });
                    textTranslateY = interpolate(localFrame, [25, 40], [0, -20], { extrapolateRight: 'clamp' });
                }

                if (textOpacity === 0) return null;

                return (
                    <div 
                        key={phaseIndex}
                        className="absolute flex flex-col items-start justify-center z-[50] w-[45%] h-full left-[4%] gap-4 text-left"
                        style={{
                            opacity: textOpacity,
                            transform: `translateY(${textTranslateY}px)`
                        }}
                    >
                        <div className={`font-handwriting ${categoryColors[phaseIndex]} text-[50px] font-bold drop-shadow-sm leading-none rotate-[-3deg] -mb-2`}>
                            Phase {phaseIndex + 1}
                        </div>
                        <h2 className={`font-bebas ${categoryColors[phaseIndex]} text-[110px] leading-[0.9] tracking-wider drop-shadow-md uppercase mt-4`}>
                            {name}
                        </h2>
                        
                        <div className="flex gap-4 mt-4 items-center">
                            <div className={`${categoryBgs[phaseIndex]} text-white px-8 py-3 rounded-2xl flex items-center gap-3 shadow-lg border-4 border-white rotate-[1deg]`}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span className="font-sans text-[26px] font-bold tracking-wide">{phaseStats.hours}H {phaseStats.minutes.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="bg-white text-slate-700 px-8 py-3 rounded-2xl flex items-center gap-3 shadow-lg border-2 border-slate-200 -rotate-[1deg]">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                                <span className="font-sans text-[26px] font-bold tracking-wide">{phaseStats.count} VIDÉOS</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 2D Positioning Parent (Right side fixed) */}
            <div 
                className="absolute z-10"
                style={{ 
                    left: 'calc(50% + 220px)', 
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(1.0)`,
                }}
            >
                {/* 3D Rotating Wrapper */}
                <div 
                    className="relative flex items-center justify-center z-10 w-[560px] h-[1200px]"
                    style={{
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        transform: `translateZ(${translateZ}px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) rotateZ(${currentRotZ}deg)`
                    }}
                >
                    {/* 3D Thickness Layers */}
                    {Array.from({ length: 18 }).map((_, i) => (
                        <div 
                            key={`layer-${i}`}
                            className="absolute inset-0 bg-slate-800 rounded-[60px] border border-slate-700 pointer-events-none"
                            style={{ 
                                transform: `translateZ(${-i - 1}px)`
                            }}
                        />
                    ))}
                    
                    {/* iPhone Chassis */}
                    <div
                        className="absolute inset-0 bg-[#FAF6ED] rounded-[60px] overflow-hidden transform-gpu flex flex-col"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
                        }}
                    >
                        {/* Dynamic Island */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[200px] h-[48px] bg-black rounded-full z-[100] shadow-inner flex items-center justify-between px-5">
                            <div className="w-4 h-4 rounded-full bg-[#111] border border-[#222]"></div>
                            <div className="w-4 h-4 rounded-full bg-[#111]"></div>
                        </div>

                        <div className="flex-1 overflow-hidden relative w-full h-full pt-[44px]">
                            {/* We render PREVIOUS category fading out underneath if transitioning */}
                            {isTransitioning && (
                                <div className="absolute inset-x-0 bottom-0 top-[44px] z-0" style={{ opacity: fadeOp }}>
                                    <AppVideoLibrary 
                                        simulatedFrame={999} 
                                        startScrollFrame={0} 
                                        stopScrollFrame={165} 
                                        selectedCategory={prevCategory as "ectoderme" | "mesoderme" | "endoderme" | "oeil"} 
                                        highlightedIndex={-1}
                                        forceNoSelectedTab={false}
                                    />
                                </div>
                            )}

                            {/* We render CURRENT category fading in (or solid if not transitioning) */}
                            <div className="absolute inset-x-0 bottom-0 top-[44px] z-10" style={{ opacity: isTransitioning ? 1 - fadeOp : 1 }}>
                                <AppVideoLibrary 
                                    simulatedFrame={simScrollFrame} 
                                    startScrollFrame={0} 
                                    stopScrollFrame={165} 
                                    selectedCategory={selectedCategory as "ectoderme" | "mesoderme" | "endoderme" | "oeil"} 
                                    highlightedIndex={-1}
                                    forceNoSelectedTab={forceNoSelectedTab}
                                />
                            </div>
                            
                            {/* La main qui swipe (Hand Icon) */}
                            <div 
                                className="absolute z-40 drop-shadow-2xl pointer-events-none"
                                style={{
                                    left: handX,
                                    top: handY,
                                    opacity: handOpacity,
                                    transform: `translate(-50%, -50%) scale(${handScale * 1.5})`
                                }}
                            >
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.9)" stroke="black" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 8V4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4V13.5L8.29289 11.7929C7.90237 11.4024 7.2692 11.4024 6.87868 11.7929C6.48815 12.1834 6.48815 12.8166 6.87868 13.2071L11.5 17.8284C12.2501 18.5786 13.2673 19 14.3284 19H17C18.6569 19 20 17.6569 20 16V10C20 8.89543 19.1046 8 18 8C17.7841 8 17.5755 8.03417 17.3804 8.09802C17.0628 6.892 15.9619 6 14.6667 6C14.4257 6 14.1956 6.04014 13.9829 6.11322C13.9942 6.07612 14 6.03833 14 6V8Z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>

                            {/* Le pointeur */}
                            <div 
                                className="absolute z-50 drop-shadow-xl pointer-events-none"
                                style={{
                                    left: pointerX,
                                    top: pointerY,
                                    opacity: pointerOpacity,
                                    transform: `translate(-10px, -5px) scale(${clickAnim * 1.5})`
                                }}
                            >
                                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.77 21.4L11.44 17.14C11.66 16.94 11.95 16.83 12.25 16.83H18.5C19.16 16.83 19.5 16.03 19.03 15.56L6.53 3.06C6.06 2.59 5.5 2.82 5.5 3.21Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* iPhone Black Outline Overlay */}
                    <div 
                        className="absolute inset-0 pointer-events-none z-[110] rounded-[60px]" 
                        style={{ 
                            boxShadow: `inset 0 0 0 16px black` 
                        }} 
                    />
                </div>
            </div>
        </AbsoluteFill>
    );
};
