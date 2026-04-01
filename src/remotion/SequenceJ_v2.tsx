import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, Audio, staticFile } from 'remotion';
import { MousePointer2, Hand, Clock, Wifi, BatteryFull } from 'lucide-react';
import { AppTimelineDay } from './app-ui/AppTimelineDay';
import { fpsS } from './hooks/useTime';



// Remotion UI sequence for the Embryologie timeline

export const SequenceJ: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    const baseScale = 1.1;
    const phoneW = 400 * baseScale; // 440
    const phoneH = 850 * baseScale; // 935

    // ----- TRANSITION SÉQUENTIELLE -----
    // iPhone 1 (Landscape) sort RAPIDEMENT et COMPLÈTEMENT (frames 0 à 15)
    // iPhone 2 (Portrait) rentre ensuite (commence à la frame 20)
    
    // Sortie de l'iPhone 1 avec Easing pour garantir le timing strict
    const exitProgress = interpolate(frame, [0, 15], [0, 1], { 
        extrapolateLeft: 'clamp', 
        extrapolateRight: 'clamp',
        // easing is simple linear here since we removed Easing import
    });
    const iphone1X = interpolate(exitProgress, [0, 1], [0, -1500]); // -1500 garantit une sortie totale
    
    // Entrée de l'iPhone 2 (démarre après la sortie, frame 15)
    const pushAnim2 = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 14, mass: 1 } });
    const iphone2X = interpolate(pushAnim2, [0, 1], [1500, 150]);

    // ----- SCROLL & INTERACTION TIMELINE -----
    // 3 Dates (Vues) à scroller horizontalement
    const dragJ7 = interpolate(frame, [90, 105], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const dragJ14 = interpolate(frame, [155, 170], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const dragJ28 = interpolate(frame, [220, 235], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    
    // Distances index: (j-1 -> j-7-14) = 3 pas = 399px. (j-7-14 -> j-14-21) = 1 pas = 133px. (j-14-21 -> j-28) = 3 pas = 399px.
    const scrollDays = (dragJ7 * 399) + (dragJ14 * 133) + (dragJ28 * 399);

    // activeStageId : Ce qui colore le bouton (change EXACTEMENT au clic). PAS DE LATENCE.
    let activeStageId = 'j-1';
    if (frame >= 245) activeStageId = 'j-28';
    else if (frame >= 180) activeStageId = 'j-14-21';
    else if (frame >= 115) activeStageId = 'j-7-14';

    // activeContentId : Le contenu de la page (apparaît instantanément au clic)
    let activeContentId = activeStageId;

    let simFrame = frame;
    let startScrollF = 50;
    let stopScrollF = 80;
    
    // J28 Page
    if (frame >= 245) {
        startScrollF = 250; 
        stopScrollF = 285; 
    } 
    // J14-21 Page
    else if (frame >= 180) {
        startScrollF = 185; 
        stopScrollF = 215; 
    }
    // J7-14 Page
    else if (frame >= 115) {
        startScrollF = 120;
        stopScrollF = 150; 
    }

    // ----- CURSOR ANIMATION -----
    const targetYDays = 155; // Milieu des boutons de chronologie
    const targetYBottom = phoneH - 45; // Milieu du menu bas
    const targetXBottom = phoneW * 0.3; // Icône Chronologie 2e sur 5
    const targetYMid = phoneH * 0.55; 
    const targetYDragEnd = phoneH * 0.42; 
    const contentStartX = phoneW * 0.5;
    
    const kf = [
        0,   
        30,  
        50,  
        
        80,  
        90,  
        105, 
        110, 
        115, 
        
        145, 
        155, 
        170, 
        175, 
        180, 
        
        210, 
        220, 
        235, 
        240, 
        245, 
        
        280, 
        290, 
        300  
    ];

    const cursorX = interpolate(frame, kf, [ 
        phoneW + 200,   
        phoneW + 200,   
        contentStartX,  
        
        contentStartX,  
        phoneW * 0.8,   
        phoneW * 0.2,   
        contentStartX,  
        contentStartX,  
        
        contentStartX,  
        phoneW * 0.6,   
        phoneW * 0.4,   
        contentStartX,  
        contentStartX,  
        
        contentStartX,  
        phoneW * 0.8,   
        phoneW * 0.2,   
        contentStartX,  
        contentStartX,  
        
        contentStartX,  
        contentStartX,  
        phoneW + 200    
    ], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const cursorY = interpolate(frame, kf, [ 
        phoneH * 0.8,   
        phoneH * 0.8,   
        targetYMid,     
        
        targetYDragEnd, 
        targetYDays,    
        targetYDays,    
        targetYDays,    
        targetYDays,    
        
        targetYDragEnd, 
        targetYDays,    
        targetYDays,    
        targetYDays,    
        targetYDays,    
        
        targetYDragEnd, 
        targetYDays,    
        targetYDays,    
        targetYDays,    
        targetYDays,    
        
        targetYDragEnd, 
        targetYDragEnd, 
        phoneH * 0.8    
    ], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const click1 = frame >= 110 && frame <= 120 ? interpolate(frame, [110, 115, 120], [1, 0.8, 1]) : 1;
    const click2 = frame >= 175 && frame <= 185 ? interpolate(frame, [175, 180, 185], [1, 0.8, 1]) : 1;
    const click3 = frame >= 240 && frame <= 250 ? interpolate(frame, [240, 245, 250], [1, 0.8, 1]) : 1;
    const cursorScale = click1 * click2 * click3;

    const isDraggingDays = (frame >= 90 && frame <= 105) || (frame >= 155 && frame <= 170) || (frame >= 220 && frame <= 235);
    const isDraggingContent = (frame >= 50 && frame <= 80) || (frame >= 120 && frame <= 150) || (frame >= 185 && frame <= 215) || (frame >= 250 && frame <= 285);
    const showHand = isDraggingDays || isDraggingContent;

    // ----- TEXT FLY-INS -----
    const text1Fly = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12 } });
    const text2Fly = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12 } });
    const text3Fly = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12 } });
    const text4Fly = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12 } });

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center font-sans overflow-hidden" style={{ perspective: '1500px' }}>
            
            {/* TEXTES MARKETING GAUCHE */}
            <div className="absolute left-[5%] top-1/2 -translate-y-1/2 flex flex-col items-start z-10 w-[50%]">
                <div 
                    style={{
                        opacity: text1Fly,
                        transform: `translateY(${interpolate(text1Fly, [0, 1], [50, 0])}px) rotate(-2deg)`
                    }}
                    className="mb-8"
                >
                    <div className="bg-[#1c2e4a] text-white font-anton text-[45px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white inline-block">
                        RÉVISION CHRONOLOGIQUE
                    </div>
                </div>

                <div 
                    style={{
                        opacity: text2Fly,
                        transform: `translateY(${interpolate(text2Fly, [0, 1], [50, 0])}px) scale(${interpolate(text2Fly, [0, 1], [0.8, 1])})`
                    }}
                >
                    <h2 className="font-bebas text-[#4171B5] text-[130px] leading-[0.85] tracking-wider drop-shadow-sm uppercase">
                        DE J1 À J28
                    </h2>
                </div>

                <div 
                    style={{
                        opacity: text3Fly,
                        transform: `translateX(${interpolate(text3Fly, [0, 1], [-50, 0])}px)`
                    }}
                    className="mt-6"
                >
                    <div className="font-handwriting text-[#F27D33] text-[75px] font-bold drop-shadow-sm leading-none rotate-[-4deg]">
                        idéal pour mémoriser !
                    </div>
                </div>

                <div 
                    style={{
                        opacity: text4Fly,
                        transform: `translateY(${interpolate(text4Fly, [0, 1], [30, 0])}px)`
                    }}
                    className="mt-8 border-l-4 border-slate-300 pl-6"
                >
                    <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug">
                        Retrouvez toutes les phases du développement,<br/>
                        classées jour après jour, semaine après semaine.
                    </p>
                </div>
            </div>

            {/* IPHONE 1 (PAYSAGE) - QUITTANT L'ÉCRAN */}
            <div 
                className="absolute z-10"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${iphone1X}px), -50%) rotate(-90deg)`,
                    width: phoneW,
                    height: phoneH
                }}
            >
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                            key={`layer-l-${i}`}
                            className="absolute inset-0 bg-[#1e293b] rounded-[45px] border border-slate-700 pointer-events-none"
                            style={{ transform: `translateZ(${-i - 1}px)` }}
                        />
                    ))}
                    <div 
                        className="absolute inset-0 bg-black rounded-[45px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
                        style={{ border: `12px solid #1E293B`, outline: `3px solid #0F172A` }}
                    >
                        <div className="absolute inset-0 w-full h-full bg-[#FAF6ED] rounded-[33px] overflow-hidden flex flex-col items-center justify-center p-8 text-center relative z-0">
                            {/* Mode Portrait Requis text oriented +90deg to be upright inside the -90deg phone */}
                            <div className="flex flex-col items-center justify-center" style={{ transform: 'rotate(90deg)' }}>
                                <div className="text-[#F2A374]">
                                    <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="2" y="6" width="20" height="12" rx="2" />
                                        <circle cx="18" cy="12" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>
                                <h2 className="font-anton text-[36px] text-slate-800 uppercase mt-4 my-0 leading-[1.1]">Mode Portrait Requis</h2>
                                <p className="text-slate-600 font-sans mt-4 text-[17px] leading-relaxed px-4">
                                    Pour une expérience optimale, veuillez pivoter votre appareil et utiliser l'application verticalement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* IPHONE 2 (PORTRAIT) - ARRIVANT SUR L'ÉCRAN */}
            <div 
                className="absolute z-20"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${iphone2X}px), -50%)`,
                    width: phoneW,
                    height: phoneH
                }}
            >
                {/* Boitier iPhone (3D) */}
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                            key={`layer-p-${i}`}
                            className="absolute inset-0 bg-[#1e293b] rounded-[45px] border border-slate-700 pointer-events-none"
                            style={{ transform: `translateZ(${-i - 1}px)` }}
                        />
                    ))}

                    <div 
                        className="absolute inset-0 bg-black rounded-[45px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
                        style={{ border: `12px solid #1E293B`, outline: `3px solid #0F172A` }}
                    >
                        <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-[33px] overflow-hidden flex flex-col relative z-0">
                            
                            {/* Persistent Dynamic Island Layer */}
                            <div className="absolute top-0 w-full flex justify-between items-start px-6 pt-4 text-slate-800 font-semibold text-lg z-[200] pointer-events-none" style={{ fontSize: 16 }}>
                                <span className="mt-1">11:15</span>
                                <div className="w-[124px] h-[34px] bg-black rounded-full relative shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_0_4px_rgba(0,0,0,0.5)] flex items-center justify-between px-3 mt-0.5">
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#111] border border-[#222] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#111]"></div>
                                </div>
                                <div className="flex gap-2 items-center text-slate-800 mt-1">
                                    <Wifi size={18} />
                                    <BatteryFull size={22} />
                                </div>
                            </div>

                            {/* AppTimelineDay (Chronologie) - INCLUT DÉJÀ SON MENU DE NAV */}
                            <div className="absolute inset-0 z-0 bg-[#FAF6ED] pt-[15px]">
                                <AppTimelineDay
                                    activeStageId={activeStageId}
                                    activeContentId={activeContentId}
                                    scrollDays={scrollDays}
                                    simulatedFrame={simFrame}
                                    startScrollFrame={startScrollF}
                                    stopScrollFrame={stopScrollF}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* WIDGET CHRONOLOGIE + EFFET LOUPE + BULLE (Style SequenceH) */}
                {frame >= 10 && (() => {
                    const popAnim = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 100 } });
                    const fadeOut = interpolate(frame, [35, 45], [1, 0], { extrapolateRight: 'clamp' });
                    const pulse = interpolate((frame - 15) % 45, [0, 45], [0, 1]);

                    // Animation d'apparition de la bulle carrée
                    const magScale = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 100 } });
                    // Léger flottement
                    const floatY = Math.sin((frame - 20) * 0.05) * 5;

                    return (
                        <>
                            {/* EFFET LOUPE SUR L'ICÔNE (Dans l'iPhone) */}
                            {/* Assombrissement local derrière l'icône, pas global */}
                            <div 
                                className="absolute pointer-events-none rounded-full bg-slate-200/50"
                                style={{
                                    left: targetXBottom,
                                    top: targetYBottom,
                                    width: 48,
                                    height: 48,
                                    transform: `translate(-50%, -50%) scale(${interpolate(popAnim, [0, 1], [1, 1.4])})`,
                                    opacity: fadeOut,
                                    zIndex: 40
                                }}
                            />
                            
                            {/* Icône agrandie (Effet loupe) */}
                            <div 
                                className="absolute pointer-events-none flex items-center justify-center bg-[#FAF6ED] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#F2A374]/30"
                                style={{
                                    left: targetXBottom,
                                    top: targetYBottom,
                                    width: 44,
                                    height: 44,
                                    transform: `translate(-50%, -50%) scale(${interpolate(popAnim, [0, 1], [0.5, 1.5])})`,
                                    opacity: fadeOut,
                                    zIndex: 42
                                }}
                            >
                                <Clock size={24} className="text-[#F2A374]" strokeWidth={2.5} />
                            </div>

                            {/* Onde lumineuse autour de l'icône agrandie */}
                            <div 
                                className="absolute pointer-events-none rounded-full border-2 border-[#F2A374]"
                                style={{
                                    left: targetXBottom,
                                    top: targetYBottom,
                                    width: 44,
                                    height: 44,
                                    transform: `translate(-50%, -50%) scale(${interpolate(pulse, [0, 1], [1.5, 2.5])})`,
                                    opacity: interpolate(pulse, [0, 0.2, 1], [0, 1, 0]) * fadeOut,
                                    zIndex: 41
                                }}
                            />

                            {/* LA BULLE CARRÉE (Style SequenceH) */}
                            <div 
                                className="absolute flex items-center justify-center transform-gpu drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                                style={{ 
                                    left: phoneW + 80,
                                    top: targetYBottom - 120,
                                    opacity: fadeOut,
                                    transform: `translate(0, -50%) translateY(${floatY}px) scale(${magScale})`,
                                    transformOrigin: 'left center',
                                    zIndex: 50
                                }}
                            >
                                <div className="relative w-[220px] h-[220px] flex items-center justify-center">
                                    
                                    {/* The Bubble Tail (Curved comic stem pointing DOWN-LEFT toward the clock icon) */}
                                    <div className="absolute top-[75%] left-[-35px] w-[50px] h-[45px] pointer-events-none -translate-y-1/2 rotate-[15deg]">
                                        <svg viewBox="0 0 50 45" fill="rgba(255, 255, 255, 0.95)" className="w-full h-full drop-shadow-[-4px_2px_8px_rgba(0,0,0,0.06)]">
                                            <path d="M 50 5 Q 25 15 0 22 Q 25 30 50 40 Z" />
                                        </svg>
                                    </div>
                                    
                                    {/* The Bubble Body (Squircle) */}
                                    <div className="absolute inset-0 rounded-[45px] bg-white/95 backdrop-blur-xl border border-slate-100" />
                                    
                                    {/* Soft Inner Shadow for depth */}
                                    <div className="absolute inset-0 rounded-[45px] shadow-[inset_0_4px_15px_rgba(255,255,255,1)] pointer-events-none" />

                                    {/* Content Inside */}
                                    <div className="relative z-10 flex flex-col items-center justify-center">
                                        <Clock size={90} className="text-slate-400 drop-shadow-sm" strokeWidth={1.5} />
                                        <span className="font-sans font-extrabold text-[#111827] text-[17px] tracking-widest uppercase mt-4">Chronologie</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })()}

                {/* Magic Cursor (À l'extérieur de l'écran iPhone pour ne pas être coupé) */}
                {frame <= 580 && (
                    <div 
                        className="absolute pointer-events-none z-[80] flex items-center justify-center"
                        style={{
                            left: cursorX,
                            top: cursorY,
                            transform: `translate(-50%, -50%) scale(${cursorScale})`,
                        }}
                    >
                        <div 
                            className="absolute w-[45px] h-[45px] rounded-full bg-black/10 flex items-center justify-center"
                            style={{
                                transform: `scale(${interpolate(cursorScale, [0.8, 1], [1, 0])})`,
                                opacity: interpolate(cursorScale, [0.8, 1], [1, 0])
                            }}
                        />
                        <div className="text-slate-700 drop-shadow-md" style={{ transform: 'rotate(-15deg)' }}>
                            {showHand ? (
                                <Hand size={36} strokeWidth={1} fill="white" />
                            ) : (
                                <MousePointer2 size={36} strokeWidth={1} fill="white" />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* --- SOUND EFFECTS --- */}
            <Sequence name="Bruitage - click.wav" from={fpsS(110, realFps)} durationInFrames={fpsS(30, realFps)}>
                <Audio src={staticFile('click.wav')} volume={0.8} />
            </Sequence>
            <Sequence name="Bruitage - click.wav" from={fpsS(175, realFps)} durationInFrames={fpsS(30, realFps)}>
                <Audio src={staticFile('click.wav')} volume={0.8} />
            </Sequence>
            <Sequence name="Bruitage - click.wav" from={fpsS(240, realFps)} durationInFrames={fpsS(30, realFps)}>
                <Audio src={staticFile('click.wav')} volume={0.8} />
            </Sequence>

        </AbsoluteFill>
    );
};
