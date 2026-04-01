import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from 'remotion';
import { AppVideoLibrary } from './app-ui/AppVideoLibrary';
import { AppVideoPlayer } from './app-ui/AppVideoPlayer';
import { fpsS } from './hooks/useTime';

export const SequenceE_Zoom_v8: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps); // Normalisé à 30fps
    const fps = 30;

    // Dimensions V8
    const phoneW = 560;
    const phoneH = 1200;

    // État constant pour cette séquence
    // Total Sequence Duration: 400 frames

    // --- ZOOM PROGRESS (frame 500 de V1 = frame 0 ici) ---
    const zoomProgress = spring({
        frame: frame,
        fps,
        config: { damping: 100, mass: 0.5, stiffness: 100 }
    });

    // --- HAND SWIPES & LE CLIC (V1: 520 à 635 -> V7: 20 à 135) ---
    const scrollUpAnim = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 14, mass: 1 } });
    const scrollDownAnim = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 18, mass: 1.1 } });

    let handOpacity = 0;
    let handX = phoneW * 0.5;
    let handY = phoneH + 200;
    let handScale = 1;

    if (frame >= 20 && frame <= 130) {
        const handFlyIn2 = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' });
        const handFadeOut2 = interpolate(frame, [110, 120], [1, 0], { extrapolateRight: 'clamp' });
        handOpacity = frame < 110 ? handFlyIn2 : handFadeOut2;

        const handOffset1 = interpolate(scrollUpAnim, [0, 1], [0, -100]);
        const resetFinger = interpolate(frame, [50, 70], [0, 100], { extrapolateRight: 'clamp' });
        const handOffset2 = interpolate(scrollDownAnim, [0, 1], [0, 200]);
        
        const totalOffset = handOffset1 + resetFinger + handOffset2;
        handY = phoneH * 0.6 - totalOffset; 
        
        const press1 = interpolate(scrollUpAnim, [0, 0.5, 1], [1, 0.9, 1]);
        const press2 = interpolate(scrollDownAnim, [0, 0.5, 1], [1, 0.9, 1]);
        handScale = Math.min(press1, interpolate(frame, [50, 60, 70], [1, 1.05, 1], { extrapolateRight: 'clamp' }));
        if (frame >= 70) handScale = press2;
    }

    // --- LE POINTEUR ET LE CLIC SUR LA VIDÉO 5 (V1: 615 -> V7: 115) ---
    let pointerX = phoneW + 100;
    let pointerY = phoneH + 100;
    let clickAnim = 1;
    let pointerOpacity = 0;
    let highlightedIndex = -1;

    // Transition vers la page vidéo finale (V1: 670 -> V7: 170, mais on l'active ici à 160 pour voir la fin)
    const fullScreenZoomProgress = spring({
        frame: Math.max(0, frame - 160),
        fps,
        config: { damping: 100, mass: 0.5, stiffness: 100 }
    });

    if (frame >= 115) {
        let clickAnim2 = 1 - (spring({ frame: Math.max(0, frame - 135), fps, config: { damping: 14 } }) * 0.2) + (spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 14 } }) * 0.2);
        
        if (frame >= 160) {
            clickAnim2 -= (spring({ frame: Math.max(0, frame - 160), fps, config: { damping: 14 } }) * 0.2);
        }

        const flyIn2 = spring({ frame: Math.max(0, frame - 115), fps, config: { damping: 14 } });
        pointerX = interpolate(flyIn2, [0, 1], [phoneW + 100, 50]);
        pointerY = interpolate(flyIn2, [0, 1], [phoneH + 100, 570]); 
        
        pointerOpacity = interpolate(frame, [115, 130], [0, 1], { extrapolateRight: 'clamp' });
        if (frame >= 160) {
            pointerOpacity = interpolate(frame, [160, 170], [1, 0], { extrapolateRight: 'clamp' });
        }
        clickAnim = clickAnim2;
        
        if (frame >= 142) highlightedIndex = 4; // Video 05
    }

    // --- SYNCHRONISATION DU SCROLL UI ---
    // Dans la V1, currentScrollStart c'était 415. À frame 500, simScroll = ~3.8
    // On reprend la formule du scroll décorrélé de V1
    const baseCreep = interpolate(frame, [0, 25], [3.8, 5], { extrapolateRight: 'clamp' });
    const swipe1 = interpolate(scrollUpAnim, [0, 1], [0, -3]); 
    const swipe2 = interpolate(scrollDownAnim, [0, 1], [0, 11]); 
    const simScrollFrame = baseCreep + swipe1 + swipe2;

    // --- POSITIONNEMENT 3D ET FORMAT (V7/V8) ---
    // En V8 / Split-Screen, le téléphone reste ancré à droite, comme à la fin de SequenceE_v8 !
    const translateZ = 0;
    const currentRotY = -35;
    const currentRotX = 15;
    const currentRotZ = 2;
    
    // Léger scale up du téléphone sur place (sans prendre tout l'écran) :
    let uiScale = interpolate(zoomProgress, [0, 1], [1, 1.05]);
    uiScale = interpolate(fullScreenZoomProgress, [0, 1], [uiScale, 1.08]); 

    // ANCIEN TEXTE (Phase 4 l'Oeil) qui disparait pour laisser place au nouveau.
    // En V8, dans SequenceE_v8, le texte est à gauche. On le fade out ici ou on le fait s'échapper.
    const textTranslateY = interpolate(zoomProgress, [0, 1], [0, -100]);
    const textOpacity = interpolate(zoomProgress, [0, 0.5], [1, 0]);

    // NOUVEAU TEXTE GAUCHE OVERLAY (qui apparait)
    const newTextFade = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const newTextTranslateY = interpolate(frame, [10, 30], [50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    
    const videoPageFade = interpolate(frame, [160, 170], [0, 1], { extrapolateRight: 'clamp' });

    // On remonte un peu le téléphone ("moins bas") pendant le zoom
    const uiTop = interpolate(zoomProgress, [0, 1], [50, 45]);

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* SON */}
            <Sequence name="Bruitage - click.wav" from={fpsS(135, realFps)} durationInFrames={fpsS(15, realFps)}>
                <Audio src={staticFile('click.wav')} />
            </Sequence>

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#FAF6ED_0%,_#FAF6ED_60%)] pointer-events-none z-0"></div>

            {/* ANCIEN TEXTE GAUCHE (disparait) */}
            <div 
                className="absolute flex flex-col items-start justify-center z-[20] w-[45%] h-full left-[4%] gap-4 text-left"
                style={{
                    opacity: textOpacity,
                    transform: `translateY(${textTranslateY}px)`
                }}
            >
                <div className={`font-handwriting text-[#F2B729] text-[50px] font-bold drop-shadow-sm leading-none rotate-[-3deg] -mb-2`}>
                    Phase 4
                </div>
                <h2 className={`font-bebas text-[#F2B729] text-[110px] leading-[0.9] tracking-wider drop-shadow-md uppercase mt-4`}>
                    L'Oeil
                </h2>
                <div className="flex gap-4 mt-4 items-center">
                    <div className={`bg-[#F2B729] text-white px-8 py-3 rounded-2xl flex items-center gap-3 shadow-lg border-4 border-white rotate-[1deg]`}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span className="font-sans text-[26px] font-bold tracking-wide">0H 41</span>
                    </div>
                </div>
            </div>

            {/* NOUVEAU TEXTE GAUCHE OVERLAY (qui apparait) */}
            <div 
                className="absolute flex flex-col items-start justify-center z-[50] w-[45%] h-full left-[4%] gap-3 text-left"
                style={{
                    opacity: newTextFade,
                    transform: `translateY(${newTextTranslateY}px)`
                }}
            >
                <div className="font-handwriting text-[#5A9C51] text-[50px] font-bold drop-shadow-sm leading-none rotate-[-3deg] -mb-2">
                    Formation optimisée...
                </div>
                <h2 className="font-bebas text-[#4171B5] text-[100px] leading-[0.9] tracking-wider drop-shadow-md uppercase mt-4">
                    CHAPITRAGE
                    <br />
                    & RÉSUMÉS
                </h2>
                <div className="font-anton text-white bg-[#F27D33] text-[35px] tracking-wide uppercase px-8 py-3 rounded-2xl shadow-lg border-4 border-white mt-1 rotate-[1deg]">
                    DÉTAILLÉS À LA MINUTE
                </div>
            </div>

            {/* 2D Positioning Parent (Right side fixed) */}
            <div 
                className="absolute z-10"
                style={{ 
                    left: 'calc(50% + 220px)', 
                    top: `${uiTop}%`,
                    transform: `translate(-50%, -50%) scale(${uiScale})`,
                }}
            >
                {/* 3D Rotating Wrapper */}
                <div 
                    className="relative flex items-center justify-center z-10 mx-auto"
                    style={{
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        transform: `translateZ(${translateZ}px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) rotateZ(${currentRotZ}deg)`,
                        width: phoneW,
                        height: phoneH,
                    }}
                >
                    {/* 3D Thickness Layers */}
                    {Array.from({ length: 18 }).map((_, i) => (
                        <div 
                            key={`layer-${i}`}
                            className="absolute inset-0 bg-slate-800 border border-slate-700 pointer-events-none rounded-[60px]"
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
                            {/* Bibliothèque Vidéo */}
                            <div className="absolute inset-x-0 bottom-0 top-[44px] z-10">
                                <AppVideoLibrary 
                                    simulatedFrame={simScrollFrame} 
                                    startScrollFrame={0} 
                                    stopScrollFrame={165} 
                                    selectedCategory={"oeil"} 
                                    highlightedIndex={highlightedIndex}
                                    forceNoSelectedTab={false}
                                />
                            </div>

                            {/* FINAL NEW VIDEO PAGE */}
                            {frame >= 160 && (
                                <div className="absolute inset-x-0 bottom-0 top-[44px] z-20 bg-[#FAF6ED]" style={{ opacity: videoPageFade }}>
                                    <Sequence from={fpsS(160, realFps)}>
                                        <AppVideoPlayer 
                                            videoSrc="5-Influence Notochorde.m4v"
                                            title="05- INFLUENCE NOTOCHORDE"
                                            duration="03:50"
                                            summary="Cette vidéo explore le rôle essentiel de la notochorde dans le développement embryonnaire, notamment son influence sur le tube neural par le biais de systèmes sonétiques S-hatch, des éléments cruciaux comme la 40A et la 40T. Les étudiants apprendront comment la notochorde émet des signaux électromagnétiques qui agissent comme un GPS pour la formation des organes..."
                                        />
                                    </Sequence>
                                </div>
                            )}
                            
                            {/* La main */}
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
