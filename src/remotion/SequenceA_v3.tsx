import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate, Img, Easing, staticFile, Sequence, Audio } from 'remotion';
import { Play } from 'lucide-react';
import { fpsS } from './hooks/useTime';

export const SequenceA_v3: React.FC<{ layoutFormat?: '16:9' | '9:16' | '1:1', alternate?: boolean }> = ({ layoutFormat = '16:9', alternate = false }) => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // --- TIMELINE HYPER ACCÉLÉRÉE (V3.1) ---
    // Objectif : Arriver au texte "ÉCOUTONS MARC..." à la frame 36 exactement (pour finir à 8.16 = 8 * 30 + 16 = 256 frames, sachant qu'on commence à 220)

    // 1. Thumbnail
    const thumbProgress = spring({ frame: frame - 27, fps, config: { damping: 14 } });
    
    // 2. Play Button Appears
    const playProgress = spring({ frame: frame - 30, fps, config: { damping: 12 } });
    
    // 3. Mouse Cursor flies in
    const cursorFlyProgress = spring({ frame: frame - 33, fps, config: { damping: 14 } });
    
    // 4. Mouse Clicks (Frame 36 to 40)
    let clickScale = 1;
    if (frame >= 36 && frame < 38) {
        clickScale = interpolate(frame, [36, 38], [1, 0.8]);
    } else if (frame >= 38 && frame < 40) {
        clickScale = interpolate(frame, [38, 40], [0.8, 1]);
    }

    // 5. Progress Bar Appears just after the click
    const progressProgress = spring({ frame: frame - 38, fps, config: { damping: 14 } });

    // 6. Shrink and Encapsulate into iPhone
    const encapsulateFrame = 41;
    const encapsulateProgress = spring({ frame: frame - encapsulateFrame, fps, config: { damping: 14, mass: 1.2 } });
    
    // 7. 3D Rotation (Ultra rapide)
    const rotateFrame = 47;
    const rotateProgress = interpolate(frame, [rotateFrame, rotateFrame + 14], [0, 1], {
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // 8. Texts appear once Rotation Finishes (Frame 61)
    const appearAfterRotation = 61;
    const topTextProgress = spring({ frame: frame - appearAfterRotation, fps, config: { damping: 12 } });
    const transcriptProgress = spring({ frame: frame - appearAfterRotation - 2, fps, config: { damping: 12 } });

    // Typography on the Right Side
    const rightTextStart = 61;
    const text2Progress = spring({ frame: frame - rightTextStart, fps, config: { damping: 14 } });
    const text3Progress = spring({ frame: frame - rightTextStart - 5, fps, config: { damping: 14 } });

    // 9. Playback Animation
    const playbackPercentage = interpolate(frame, [45, 275], [0, 3], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'extend'
    });
    const currentSeconds = Math.floor((playbackPercentage / 100) * 4817);
    const m = Math.floor(currentSeconds / 60);
    const s = (currentSeconds % 60).toString().padStart(2, '0');
    const currentTimeStr = `${m}:${s}`;

    // Math for Encapsulation
    const innerWrapperScale = interpolate(encapsulateProgress, [0, 1], [1.3, 0.9]);
    const iphoneOpacity = interpolate(encapsulateProgress, [0, 0.5], [0, 1]);
    const iphoneBorder = interpolate(encapsulateProgress, [0, 1], [0, 14]); 
    
    // Math for 3D Rotation & Positioning based on Layout
    const rotX = interpolate(rotateProgress, [0, 1], [0, 15]);
    const rotY = interpolate(rotateProgress, [0, 1], [0, 35]);
    const rotZ = interpolate(rotateProgress, [0, 1], [0, -5]);
    const translateZ = interpolate(rotateProgress, [0, 1], [0, 100]);
    
    let translateX = interpolate(rotateProgress, [0, 1], [0, -450]); 
    let translateY = 0;
    let globalScale = 1;

    if (layoutFormat === '9:16') {
        globalScale = 0.9;
        translateX = 0; // Center horizontally
        // Alternate: Text in bottom, Phone top, OR vice versa
        translateY = interpolate(rotateProgress, [0, 1], [0, alternate ? 350 : -350]); 
    } else if (layoutFormat === '1:1') {
        globalScale = 0.8;
        translateY = 0; // Center vertically
        translateX = interpolate(rotateProgress, [0, 1], [0, alternate ? 250 : -250]);
    }

    // Formatting CSS classes for Typography Block based on layout
    let textBlockClasses = "absolute right-[2%] top-1/2 transform -translate-y-1/2 flex flex-col items-start justify-center w-[55%] z-0 p-8 gap-4"; // 16:9 base
    if (layoutFormat === '9:16') {
        textBlockClasses = `absolute ${alternate ? 'top-[5%]' : 'bottom-[10%]'} left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center w-[90%] z-0 p-8 gap-4 text-center`;
    } else if (layoutFormat === '1:1') {
        textBlockClasses = `absolute ${alternate ? 'left-[5%]' : 'right-[2%]'} top-1/2 transform -translate-y-1/2 flex flex-col ${alternate ? 'items-end' : 'items-start'} justify-center w-[45%] z-0 p-4 gap-2`;
    }

    // 3D Layers
    const thicknessLayers = Array.from({ length: 16 }).map((_, i) => (
        <div 
            key={`layer-${i}`}
            className="absolute inset-0 bg-slate-800 rounded-[55px] border border-slate-700 pointer-events-none"
            style={{ 
                transform: `translateZ(${-i - 1}px)`,
                opacity: rotateProgress > 0 ? interpolate(rotateProgress, [0, 0.15], [0, 1]) : 0
            }}
        />
    ));

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center font-sans overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* BRUITAGES INTÉGRÉS */}
            <Sequence name="Bruitage - click.wav" from={fpsS(36, realFps)}>
                <Audio src={staticFile('click.wav')} volume={0.8} />
            </Sequence>

            {/* Typography Block */}
            <div className={textBlockClasses}>
                
                {/* Main Title */}
                <h2 
                    style={{ 
                        opacity: text2Progress, 
                        transform: `translateY(${interpolate(text2Progress, [0, 1], [40, 0])}px)` 
                    }}
                    className={`font-bebas text-[#4171B5] leading-[0.95] tracking-wider drop-shadow-md mt-2 ${layoutFormat === '9:16' ? 'text-[70px] text-center' : layoutFormat === '1:1' ? 'text-[65px]' : 'text-[85px]'}`}
                >
                    ÉCOUTONS MARC QUI PRÉSENTE
                    {layoutFormat === '9:16' ? ' ' : <br />}
                    SON PARCOURS
                </h2>
                
                {/* Orange Anton Box */}
                <div 
                    style={{ 
                        opacity: text3Progress, 
                        transform: `translateY(${interpolate(text3Progress, [0, 1], [40, 0])}px) rotate(-1deg)` 
                    }}
                    className={`font-anton text-white bg-[#F27D33] tracking-wide uppercase px-8 py-3 rounded-2xl shadow-xl border-4 border-white mt-4 ${layoutFormat === '9:16' ? 'text-[40px] text-center' : layoutFormat === '1:1' ? 'text-[35px]' : 'text-[50px]'}`}
                >
                    PODCAST DES TECHNIQUES TISSULAIRES
                </div>

                <div 
                    style={{ 
                        opacity: text3Progress, 
                        transform: `translateY(${interpolate(text3Progress, [0, 1], [40, 0])}px)` 
                    }}
                    className={`font-sans text-slate-600 font-semibold italic mt-6 border-l-4 border-slate-300 pl-6 ${layoutFormat === '9:16' ? 'text-[24px] text-center ml-0 border-l-0 border-t-4 pt-4' : layoutFormat === '1:1' ? 'text-[22px] ml-2' : 'text-[30px] ml-4'}`}
                >
                    Vers l'embryologie biodynamique...
                </div>
            </div>

            {/* 3D Scene Wrapper */}
            <div 
                className="relative flex items-center justify-center w-[380px] h-[820px] z-10"
                style={{ 
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    transform: `scale(${globalScale}) translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`
                }}
            >
                {/* CSS 3D iPhone Thickness (Bezel) */}
                {thicknessLayers}

                {/* iPhone Chassis */}
                <div 
                    className="absolute inset-0 bg-[#FAF6ED] rounded-[55px] overflow-hidden transform-gpu flex flex-col justify-between pb-[65px]"
                    style={{ 
                        opacity: iphoneOpacity, 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                    }}
                >
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 shadow-inner flex items-center justify-between px-3">
                        <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#111]"></div>
                    </div>

                    <div 
                        className="w-full pt-16 flex flex-col items-center px-4"
                        style={{ opacity: topTextProgress, transform: `translateY(${interpolate(topTextProgress, [0, 1], [-20, 0])}px)` }}
                    >
                        <span className="text-[10px] font-sans tracking-[0.2em] text-slate-400 font-bold mb-1">FORMATION PAR</span>
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-[12px] font-sans font-extrabold text-[#333] tracking-wide">MARC DAMOISEAUX</span>
                            <span className="text-[12px] font-sans text-slate-400 font-semibold tracking-wide">OSTÉOPATHE D.O.</span>
                        </div>
                        <h1 className="text-[38px] font-anton tracking-[0.03em] text-[#333] uppercase leading-[0.85]">
                            L'EMBRYOLOGIE
                        </h1>
                        <h2 className="text-[38px] font-anton text-[#F27D33] uppercase tracking-[0.03em] leading-[0.9] mt-1">
                            BIODYNAMIQUE
                        </h2>
                    </div>

                    <div className="flex-1" />

                    <div 
                        className="w-full flex flex-col items-center gap-3 pb-8 px-6 z-40"
                        style={{ 
                            opacity: transcriptProgress,
                            transform: `translateY(${interpolate(transcriptProgress, [0, 1], [20, 0])}px)`
                        }}
                    >
                        <div className="font-handwriting text-[36px] text-slate-600 -rotate-2 mt-4 translate-y-6">
                            Pour commencer !
                        </div>
                    </div>
                </div>

                <div 
                    className="absolute inset-0 rounded-[55px] pointer-events-none z-[100]"
                    style={{ 
                        opacity: iphoneOpacity,
                        boxShadow: `inset 0 0 0 ${iphoneBorder}px black` 
                    }}
                />

                <div 
                    className="absolute inset-x-0 mx-auto flex flex-col items-center z-20"
                    style={{ 
                        width: 320, 
                        top: '50%',
                        transform: `translateY(${interpolate(encapsulateProgress, [0, 1], [-50, -50])}%) scale(${innerWrapperScale}) translateZ(25px)`,
                        marginTop: interpolate(encapsulateProgress, [0, 1], [0, 48])
                    }}
                >
                    <div 
                        style={{ 
                            opacity: thumbProgress,
                            transform: `translateY(${interpolate(thumbProgress, [0, 1], [30, 0])}px) scale(${interpolate(thumbProgress, [0, 1], [0.8, 1])})`,
                        }}
                        className="relative w-full aspect-square shrink-0 overflow-hidden border border-slate-100 bg-slate-200"
                    >
                        <Img src={staticFile('PODCAST_comp.jpg')} className="absolute inset-0 w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center w-full mt-6 gap-3">
                        <div className="relative shrink-0">
                            <div 
                                style={{ 
                                    opacity: playProgress,
                                    transform: `scale(${interpolate(playProgress, [0, 1], [0, 1])}) scale(${clickScale})`
                                }}
                                className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#F27D33] text-white relative z-20"
                            >
                                <Play size={24} fill="currentColor" className="ml-[2px]" />
                            </div>

                            <div 
                                style={{
                                    opacity: interpolate(cursorFlyProgress, [0, 1], [0, 1]) * interpolate(frame, [18, 23], [1, 0]),
                                    transform: `translate(${interpolate(cursorFlyProgress, [0, 1], [150, 15])}px, ${interpolate(cursorFlyProgress, [0, 1], [150, 20])}px) scale(${clickScale})`
                                }}
                                className="absolute top-0 left-0 z-30 pointer-events-none"
                            >
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="#333" strokeWidth="1.5">
                                    <path d="M4 3l7 19l4 -8l8 -4z" />
                                </svg>
                            </div>
                        </div>

                        <div 
                            style={{ 
                                opacity: progressProgress,
                                transform: `translateX(${interpolate(progressProgress, [0, 1], [20, 0])}px)`
                            }}
                            className="flex items-center gap-2 flex-1 pt-1"
                        >
                            <span className="text-[12px] text-slate-500 font-medium tracking-tighter w-[28px] text-right">{currentTimeStr}</span>
                            <div className="relative flex-1 h-2 flex items-center">
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden" />
                                <div 
                                    className="absolute left-0 h-1.5 bg-[#F27D33] rounded-l-full" 
                                    style={{ width: `${playbackPercentage}%` }}
                                />
                                <div 
                                    className="absolute h-3 w-3 bg-[#F27D33] rounded-full -translate-x-1/2 z-10" 
                                    style={{ left: `${playbackPercentage}%` }}
                                />
                            </div>
                            <span className="text-[12px] text-slate-400 font-medium tracking-tighter">80:17</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOUND EFFECTS */}
            <Sequence name="Bruitage - click.wav" from={fpsS(36, fps)} durationInFrames={fpsS(30, fps)}>
                {/* Frame 464 globally at 60fps -> Frame 36 locally at 30fps */}
                <Audio src={staticFile('click.wav')} volume={0.8} />
            </Sequence>

            <Sequence name="Bruitage - click.wav" from={fpsS(166, fps)} durationInFrames={fpsS(30, fps)}>
                {/* Frame 724 globally at 60fps -> Frame 166 locally at 30fps */}
                <Audio src={staticFile('click.wav')} volume={0.8} />
            </Sequence>
        </AbsoluteFill>
    );
};
