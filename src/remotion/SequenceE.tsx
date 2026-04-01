import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from 'remotion';
import { AppVideoLibrary } from './app-ui/AppVideoLibrary';
import { AppVideoPlayer } from './app-ui/AppVideoPlayer';
import { videoCourses } from './data/videoCourses';
import { fpsS } from './hooks/useTime';

export const SequenceE: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // L'iPhone occupe TOUT l'écran (1080p hauteur)
    const basePhoneScale = 1.25;
    const phoneW = 400 * basePhoneScale;
    const phoneH = 850 * basePhoneScale;


    // Suppression de la flottaison suite à la demande
    const yTranslate = 0; 
    
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
    
    // uiActivePhaseIndex is -1 initially, changes to 0 at localFrame 25, then 0 to 1 at next phase localFrame 25, etc.
    const uiActivePhaseIndex = localFrame < 25 ? pointerTargetPhase - 1 : pointerTargetPhase;
    // clamping to 0 for internal lookup logic
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

    const currentStats = getCategoryStats(selectedCategory);

    // Positions des onglets (top nav)
    // Plus bas pour viser le bas du bouton (ex: pour lire "L'ENDODERME" clairement)
    const tabY = 170; 
    const tabXs = [phoneW * 0.15, phoneW * 0.38, phoneW * 0.62, phoneW * 0.85];

    // Calcul de la position du pointeur
    let pointerX = phoneW + 100;
    let pointerY = phoneH + 100;
    let clickAnim = 1;

    const currentTabX = tabXs[pointerTargetPhase]; 
    // Le pointeur vient toujours de l'extérieur vers l'onglet ciblé au début de chaque phase
    const prevTabX = phoneW + 100;
    const prevTabY = tabY + 100;
    
    // Le vol du pointeur
    // DEMANDE USER : "il doit arriver BING et ça travaille", donc damping très élevé pour AUCUN wobble ! 14 -> 100
    const flyIn = spring({ frame: Math.max(0, localFrame), fps, config: { damping: 100, mass: 0.5, stiffness: 200 } });
    
    pointerX = interpolate(flyIn, [0, 1], [prevTabX, currentTabX]);
    pointerY = interpolate(flyIn, [0, 1], [prevTabY, tabY]);

    // Animation du clic a lieu autour de la frame 20-25
    clickAnim = 1 - (spring({ frame: Math.max(0, localFrame - 20), fps, config: { damping: 14 } }) * 0.2) + (spring({ frame: Math.max(0, localFrame - 30), fps, config: { damping: 14 } }) * 0.2);

    // Le pointeur apparaît (0-15), reste pour cliquer, puis disparaît (35-45) AVANT la main.
    let pointerOpacity = 0;
    if (localFrame < 15) pointerOpacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    else if (localFrame < 35) pointerOpacity = 1;
    else pointerOpacity = interpolate(localFrame, [35, 45], [1, 0], { extrapolateRight: 'clamp' });

    // MAIN QUI SWIPE (SCROLL)
    // Apparaît POUR CHAQUE CATÉGORIE juste après le pointeur, pousse, et le scroll commence !
    const handFlyIn = interpolate(localFrame, [40, 50], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const handFadeOut = interpolate(localFrame, [60, 70], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    let handX = phoneW * 0.6; // Au centre droit
    let handY = phoneH + 200; 
    let handOpacity = localFrame < 55 ? handFlyIn : handFadeOut;
    let handScale = interpolate(localFrame, [45, 55, 65], [1, 0.9, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    if (localFrame >= 40 && localFrame <= 75) {
        // La main vient et swipe pour indiquer le scroll
        const enterY = interpolate(localFrame, [40, 50], [phoneH + 100, phoneH * 0.7], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        const swipeY = interpolate(localFrame, [50, 65], [0, phoneH * 0.3], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        handY = enterY - swipeY;
    }
    
    // CROSSFADE LOGIC for category changes
    const prevPhase = Math.max(0, uiActivePhase - 1);
    const prevCategory = categories[prevPhase];
    
    // Crossfade happens in the 15 frames AFTER the click! (localFrame 25 to 40)
    const isTransitioning = uiActivePhaseIndex > 0 && localFrame >= 25 && localFrame < 40;
    const fadeOp = isTransitioning ? interpolate(localFrame, [25, 40], [1, 0], { extrapolateRight: 'clamp' }) : 0;

    // ---- EXTENSION ZOOM & SCROLL FINALE (frame > 500) ----
    const zoomProgress = spring({
        frame: Math.max(0, frame - 500),
        fps,
        config: { damping: 100, mass: 0.5, stiffness: 100 }
    });
    
    // THE FINAL FLUID SCROLL (Double swipe restauré avec une amplitude TRÈS précise)
    // 1st swipe (down to see top), 2nd swipe (precise push up to reach Video 5)
    // Timeline compacted: Hand flies in 520, Swipes 525 & 570, Pointer 615, Click 635.
    const scrollUpAnim = spring({ frame: Math.max(0, frame - 525), fps, config: { damping: 14, mass: 1 } });
    const scrollDownAnim = spring({ frame: Math.max(0, frame - 570), fps, config: { damping: 18, mass: 1.1 } });

    if (frame >= 520 && frame <= 630) {
        const handFlyIn2 = interpolate(frame, [520, 530], [0, 1], { extrapolateRight: 'clamp' });
        const handFadeOut2 = interpolate(frame, [610, 620], [1, 0], { extrapolateRight: 'clamp' });
        handOpacity = frame < 610 ? handFlyIn2 : handFadeOut2;

        // Hand movements: Swipe down, lift and reset, swipe up
        const handOffset1 = interpolate(scrollUpAnim, [0, 1], [0, -100]); // 1er ptit swipe
        const resetFinger = interpolate(frame, [550, 570], [0, 100], { extrapolateRight: 'clamp' });
        const handOffset2 = interpolate(scrollDownAnim, [0, 1], [0, 200]); // 2e swipe (beaucoup plus mesuré)
        
        const totalOffset = handOffset1 + resetFinger + handOffset2;
        
        handY = phoneH * 0.6 - totalOffset; 
        handX = phoneW * 0.5; // Center
        
        // Gentle press effect ONLY during the actual swipes
        const press1 = interpolate(scrollUpAnim, [0, 0.5, 1], [1, 0.9, 1]);
        const press2 = interpolate(scrollDownAnim, [0, 0.5, 1], [1, 0.9, 1]);
        handScale = Math.min(press1, interpolate(frame, [550, 560, 570], [1, 1.05, 1], { extrapolateRight: 'clamp' }));
        if (frame >= 570) handScale = press2;
    }

    let highlightedIndex = -1;
    
    const fullScreenZoomProgress = spring({
        frame: Math.max(0, frame - 670),
        fps,
        config: { damping: 100, mass: 0.5, stiffness: 100 }
    });

    if (frame >= 615) {
        let clickAnim2 = 1 - (spring({ frame: Math.max(0, frame - 635), fps, config: { damping: 14 } }) * 0.2) + (spring({ frame: Math.max(0, frame - 645), fps, config: { damping: 14 } }) * 0.2);
        
        if (frame >= 660) {
            clickAnim2 -= (spring({ frame: Math.max(0, frame - 660), fps, config: { damping: 14 } }) * 0.2);
            clickAnim2 += (spring({ frame: Math.max(0, frame - 670), fps, config: { damping: 14 } }) * 0.2);
        }

        const flyIn2 = spring({ frame: Math.max(0, frame - 615), fps, config: { damping: 14 } });
        pointerX = interpolate(flyIn2, [0, 1], [phoneW + 100, 50]);
        // Le pointeur vient se placer "juste en dessous du texte" de video 5 (sur le bouton Play de couleur)
        pointerY = interpolate(flyIn2, [0, 1], [phoneH + 100, 570]); 
        
        pointerOpacity = interpolate(frame, [615, 630], [0, 1], { extrapolateRight: 'clamp' });
        if (frame >= 670) {
            pointerOpacity = interpolate(frame, [670, 680], [1, 0], { extrapolateRight: 'clamp' });
        }
        clickAnim = clickAnim2;
        
        // La surbrillance jaillit après le clic
        if (frame >= 642) highlightedIndex = 4; // Video 05 (0-indexed = 4)
    }

    const currentScrollStart = uiActivePhase * 120 + 55;
    let simScrollFrame = 0;
    if (frame > currentScrollStart) {
        if (uiActivePhase === 3) {
            // Scroll decoupled from handY
            // Target final simScrollFrame must be exactly 13! 
            const baseCreep = interpolate(frame, [currentScrollStart, 525], [0, 5], { extrapolateRight: 'clamp' });
            const swipe1 = interpolate(scrollUpAnim, [0, 1], [0, -3]); // Goes up slightly (5 -> 2)
            const swipe2 = interpolate(scrollDownAnim, [0, 1], [0, 11]); // Goes down gently (2 -> 13)
            
            simScrollFrame = baseCreep + swipe1 + swipe2;
        } else {
            simScrollFrame = (frame - currentScrollStart) * 0.25;
        }
    }
    
    // PIVOT DE L'IPHONE
    // Animé dès le début de la séquence globale
    const pivotProgress = spring({
        frame: frame,
        fps,
        config: { damping: 100, mass: 0.5, stiffness: 100 } // Fix wobble
    });
    
    const baseTranslateX = interpolate(pivotProgress, [0, 1], [0, -350]);
    const baseRotateY = interpolate(pivotProgress, [0, 1], [0, 20]);
    const baseScale = interpolate(pivotProgress, [0, 1], [1, 0.95]);

    const targetTranslateX = interpolate(fullScreenZoomProgress, [0, 1], [0, 320]);
    const phoneTranslateX = interpolate(zoomProgress, [0, 1], [baseTranslateX, targetTranslateX]);
    const phoneRotateY = interpolate(zoomProgress, [0, 1], [baseRotateY, 0]);
    
    // Zoom important, puis ré-ajustement pour la page vidéo (pour bien la voir en entier)
    let uiScale = interpolate(zoomProgress, [0, 1], [baseScale, 1.7]);
    uiScale = interpolate(fullScreenZoomProgress, [0, 1], [uiScale, 0.95]); 

    // Y translate to keep it centered when moving to video page
    let currentYTranslate = yTranslate;
    currentYTranslate = interpolate(fullScreenZoomProgress, [0, 1], [currentYTranslate, 0]);

    const categoryColors = ["bg-[#5A9C51]", "bg-[#4171B5]", "bg-[#F27D33]", "bg-[#F2B729]"];

    // Title departs to the right
    const textTranslateX = interpolate(zoomProgress, [0, 1], [0, 1200]);

    // Transition values for the new video page
    const videoPageFade = interpolate(frame, [670, 680], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* SOUND DESIGN: CLICS */}
            {[20, 140, 260, 380, 635].map((clickFrame) => (
                <Sequence name="Bruitage - click.wav" key={clickFrame} from={fpsS(clickFrame, realFps)} durationInFrames={fpsS(15, realFps)}>
                    <Audio src={staticFile('click.wav')} />
                </Sequence>
            ))}

            {/* The Cinematic Background Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#FAF6ED_0%,_#FAF6ED_60%)] pointer-events-none z-0"></div>

            {/* TEXTE EXPLICATIF DE LA PHASE (A DROITE) */}
            <div 
                className="absolute flex flex-col items-start transition-all duration-300 ease-in-out"
                style={{
                    right: '6%', 
                    top: '50%',
                    opacity: interpolate(zoomProgress, [0, 0.2], [pivotProgress, 0]),
                    transform: `translate(calc(${textTranslateX}px), calc(-50% + ${interpolate(pivotProgress, [0, 1], [50, 0])}px))`
                }}
            >
                <div className="mb-4 ml-4 text-5xl font-bebas tracking-widest text-[#555] opacity-80 uppercase">
                    PHASE {uiActivePhase + 1}
                </div>
                
                {/* FUN COLORED PILL FOR THE TITLE - Anton, tilted, no border */}
                <h1 
                    className={`font-anton text-white text-[80px] tracking-wide uppercase px-10 py-4 rounded-3xl shadow-xl mb-10 ${categoryColors[uiActivePhase]}`}
                    style={{ transform: 'rotate(-2deg)' }}
                >
                    {categoryNames[uiActivePhase]}
                </h1>
                
                <div className="flex gap-6 mb-6 ml-2">
                    <div className="bg-slate-700 text-white px-8 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-xl">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span className="text-4xl font-sans font-bold tracking-wide">{currentStats.hours}H {currentStats.minutes.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="bg-white text-slate-700 px-8 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-xl border border-gray-200">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                        <span className="text-4xl font-sans font-bold tracking-wide">{currentStats.count} VIDÉOS</span>
                    </div>
                </div>
                
                <p className="text-[#555] text-3xl max-w-[700px] mt-6 ml-2 leading-relaxed font-sans">
                    Découvrez le module complet avec toutes ses vidéos détaillées, réparties méthodiquement pour un apprentissage optimal.
                </p>
            </div>

            {/* 2D Positioning Parent */}
            <div 
                className="absolute"
                style={{ 
                    left: '50%', 
                    top: '50%',
                    transform: `translate(calc(-50% + ${phoneTranslateX}px), calc(-50% + ${currentYTranslate}px)) scale(${uiScale})`,
                }}
            >
                {/* 3D Rotating Wrapper */}
                <div 
                    className="relative flex items-center justify-center z-10"
                    style={{
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        transform: `perspective(1200px) rotateY(${phoneRotateY}deg)`,
                        width: phoneW,
                        height: phoneH,
                    }}
                >
                    {/* 3D Thickness Layers */}
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div 
                            key={`layer-${i}`}
                            className="absolute inset-0 bg-slate-800 border border-slate-700 pointer-events-none rounded-[55px]"
                            style={{ 
                                transform: `translateZ(${-i - 1}px)`
                            }}
                        />
                    ))}
                    
                    {/* iPhone Chassis (Base + Rounded Clipper) */}
                    <div
                        className="absolute inset-0 bg-[#FAF6ED] rounded-[55px] overflow-hidden transform-gpu flex flex-col"
                        style={{
                            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.4)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
                        }}
                    >
                        {/* Dynamic Island */}
                        <div 
                            className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[100] shadow-inner flex items-center justify-between px-3"
                        >
                            <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#111]"></div>
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
                                highlightedIndex={highlightedIndex}
                                forceNoSelectedTab={forceNoSelectedTab}
                            />
                        </div>

                        {/* FINAL NEW VIDEO PAGE */}
                        {frame >= 670 && (
                            <div className="absolute inset-x-0 bottom-0 top-[44px] z-20 bg-[#FAF6ED]" style={{ opacity: videoPageFade }}>
                                <Sequence from={fpsS(670, realFps)}>
                                    <AppVideoPlayer 
                                        videoSrc="5-Influence Notochorde.m4v"
                                        title="05- INFLUENCE NOTOCHORDE"
                                        duration="03:50"
                                        summary="Cette vidéo explore le rôle essentiel de la notochorde dans le développement embryonnaire, notamment son influence sur le tube neural par le biais de systèmes sonétiques S-hatch, des éléments cruciaux comme la 40A et la 40T. Les étudiants apprendront comment la notochorde émet des signaux électromagnétiques qui agissent comme un GPS pour la formation des organes..."
                                    />
                                </Sequence>
                            </div>
                        )}
                        
                        {/* La main qui swipe (Hand Icon) */}
                        <div 
                            className="absolute z-40 drop-shadow-2xl pointer-events-none"
                            style={{
                                left: handX,
                                top: handY,
                                opacity: handOpacity,
                                transform: `translate(-50%, -50%) scale(${handScale})`
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
                                transform: `translate(-10px, -5px) scale(${clickAnim})`
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
                        className="absolute inset-0 pointer-events-none z-[110] rounded-[55px]" 
                        style={{ 
                            boxShadow: `inset 0 0 0 14px black` 
                        }} 
                    />
                </div>
            </div>

            {/* LECTURE VIDEO TITLE (Fades in when video starts playing) */}
            <div 
                className="absolute flex flex-col items-start z-[50]"
                style={{
                    left: '12%', 
                    top: '40%',
                    opacity: interpolate(frame, [670, 700], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                }}
            >
                <div className="mb-4 ml-4 text-3xl font-bebas tracking-widest text-[#555] opacity-80 uppercase">
                    FORMATION OPTIMISÉE
                </div>
                
                <h1 
                    className="text-7xl font-anton uppercase tracking-wider text-white px-8 py-3 rounded-2xl transform -rotate-2 bg-[#F2B729]"
                    style={{ textShadow: "0px 4px 15px rgba(0,0,0,0.3)" }}
                >
                    CHAPITRAGE & RÉSUMÉS
                </h1>

                <p className="mt-8 text-2xl font-sans text-slate-700 max-w-[550px] leading-relaxed">
                    Prenez connaissance de la synthèse complète de la leçon, puis lancez le visionnage immersif pour plonger dans l'étude détaillée du vivant.
                </p>
            </div>
        </AbsoluteFill>
    );
};
