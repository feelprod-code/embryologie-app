import React from 'react';
import { AbsoluteFill, useCurrentFrame, Video, staticFile, interpolate, spring, useVideoConfig, Audio, Sequence } from 'remotion';
import { Wifi, BatteryFull, RotateCcw, RotateCw, Play, Maximize, CloudDownload, Home, Clock, Video as VideoIcon, Brain, LogOut, ChevronLeft, ChevronRight, VideoOff } from 'lucide-react';
import { fpsS } from './hooks/useTime';

export const SequenceG: React.FC = () => {
    const rawFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const actualFrame = rawFrame;
    const frame = actualFrame * (30 / realFps);
    
    const phoneScale = 1.1;
    const phoneW = 400 * phoneScale;
    const phoneH = 850 * phoneScale;
    const borderRadius = 45 * phoneScale;

    // Le ratio pour la compatibilité avec toutes tes formules existantes
    const f = (val: number) => val * (realFps / 30);

    // --- TIMINGS ---
    // Total Sequence Duration: 400 frames
    // 0 -> 40: Zoomed IN (1.8x). Cursor flies to "Re-transcription".
    // 40: Click tab.
    // 60 -> 90: VideoOff icon pulses/glows.
    // 90 -> 120: Cursor flies from Tab to VideoOff.
    // 120: Click VideoOff.
    // 120 -> 150: Collapse animation! Zoom OUT to 1.0x, Shift RIGHT. Video UI -> Audio UI.
    // 150 -> 190: Cursor flies slowly to the Audio Scrubber thumb.
    // 190 -> 210: Grabs scrubber.
    // 210 -> 340: Drags scrubber. AudioProgress goes 0.08 -> 0.65. Text scrolls & highlights.
    // 340 -> 400: Hold end position.

    const isTabActive = actualFrame >= f(45);
    const isVideoCollapsed = actualFrame >= f(125);

    // Collapse Progress
    const collapseTrigger = isVideoCollapsed ? actualFrame - f(125) : 0;
    const collapseProgress = spring({ frame: Math.max(0, collapseTrigger), fps: realFps, config: { damping: 14 } });
    
    // UI Layout morphs
    const combinedHeaderHeight = interpolate(collapseProgress, [0, 1], [347, 100]);
    const videoBlockOpacity = interpolate(collapseProgress, [0, 0.5], [1, 0]);
    const audioBlockOpacity = interpolate(collapseProgress, [0.5, 1], [0, 1]);

    // Master Zoom, Shift and Tilt
    const currentScale = interpolate(collapseProgress, [0, 1], [1.8, 1]);
    const currentX = interpolate(collapseProgress, [0, 1], [0, 250]); // 250px right of center
    const phoneRotateY = interpolate(frame, [300, 400], [0, -6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const phoneRotateX = interpolate(frame, [300, 400], [0, 2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // --- Cursor & Interaction Logic ---
    let cursorX = 800; // Start off-screen right
    let cursorY = 800;
    let finalCursorScale = 1;

    // Audio Progress (0.0 to 1.0)
    // Synchronize tightly with the real video playback
    const startSeconds = 331 / 30; // 11.033s
    
    // Dès la frame 135 (en 30fps), la tête de lecture avance visuellement
    // On applique un multiplicateur pour que le déplacement soit joli et perceptible sur une séquence courte
    const visualSpeedMultiplier = 6; 
    const activePlaybackFrame = Math.max(0, actualFrame - f(135));
    const currentSeconds = startSeconds + (activePlaybackFrame / realFps) * visualSpeedMultiplier;
    
    const audioProgress = currentSeconds / 519.0; // 8:39 = 519s

    // Text Progress to match human speech roughly over ~15 seconds
    const textProgress = interpolate(actualFrame, [f(120), f(600)], [0.0, 0.45], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    // Spring animations for cursor flights
    const fly1 = spring({ frame: Math.max(0, actualFrame), fps: realFps, config: { damping: 14 } }); // to tab
    const fly2 = spring({ frame: Math.max(0, actualFrame - f(90)), fps: realFps, config: { damping: 13 } }); // to VideoOff
    // Cursor stays near VideoOff instead of dragging scrubber
    const fly3 = spring({ frame: Math.max(0, actualFrame - f(160)), fps: realFps, config: { damping: 12 } }); // moves out of the way

    // Clicks
    const click1 = 1 - (spring({ frame: Math.max(0, actualFrame - f(40)), fps: realFps, config: { damping: 14 } }) * 0.2) + (spring({ frame: Math.max(0, actualFrame - f(50)), fps: realFps, config: { damping: 14 } }) * 0.2);
    const click2 = 1 - (spring({ frame: Math.max(0, actualFrame - f(120)), fps: realFps, config: { damping: 14 } }) * 0.2) + (spring({ frame: Math.max(0, actualFrame - f(130)), fps: realFps, config: { damping: 14 } }) * 0.2);

    if (frame < 90) {
        cursorX = interpolate(fly1, [0, 1], [400, 315]); // Tab Right-half Center
        cursorY = interpolate(fly1, [0, 1], [700, 530]); // Lowered into the button body
        finalCursorScale = click1;
    } else if (frame < 180) {
        cursorX = interpolate(fly2, [0, 1], [315, 386]); // VideoOff icon - shifted left
        cursorY = interpolate(fly2, [0, 1], [530, 455]); // VideoOff icon - lowered further
        finalCursorScale = click2;
    } else {
        cursorX = interpolate(fly3, [0, 1], [386, 408]); // Move out of the way to the right
        cursorY = interpolate(fly3, [0, 1], [455, 480]); // Slightly down
        finalCursorScale = 1;
    }

    // VideoOff Pulse (happens before cursor arrives: 60 -> 90)
    const iconPulseScale = frame > 60 && frame < 90 ? interpolate(Math.sin((frame - 60) * 0.3), [-1, 1], [1, 1.25]) : 1;
    const iconPulseShadowOpacity = frame > 60 && frame < 90 ? interpolate(Math.sin((frame - 60) * 0.3), [-1, 1], [0, 0.6]) : 0;
    const isIconHighlighted = frame > 60 && frame < 90;

    // Text on the left appears when collapsed
    const leftTextFadeIn = interpolate(collapseProgress, [0.8, 1], [0, 1], { extrapolateLeft: 'clamp' });

    // Scrubber Time math
    const m = Math.floor(currentSeconds / 60);
    const s = Math.floor(currentSeconds % 60).toString().padStart(2, '0');
    const currentScrubberTimeStr = `${m}:${s}`;

    // Highlighter Helper
    const Highlighter = ({ min, max, children }: { min: number, max: number, children: React.ReactNode }) => {
        const active = textProgress > min && textProgress <= max;
        // Text changes color when it's reached or fully past
        const past = textProgress > max;
        return (
            <span 
                className={`px-1 rounded -mx-1 align-baseline ${active ? 'bg-[#facc15]/30 text-slate-900' : 'bg-transparent'} ${past || active ? 'text-slate-800' : 'text-slate-500'} leading-loose`}
            >
                {children}
            </span>
        );
    };

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center overflow-hidden">
            <Sequence name="Bruitage - click.wav" from={fpsS(40, realFps)} durationInFrames={fpsS(30, realFps)}>
                <Audio src={staticFile('click.wav')} volume={0.5} />
            </Sequence>
            {/* AUDIO CLICKS REMOVED AFTER FRAME 127 */}
            
            {/* TEXT ON THE LEFT */}
            <div 
                className="absolute left-[5%] flex flex-col items-start justify-center h-full w-[45%] z-0 p-8 gap-4" 
                style={{ opacity: leftTextFadeIn }}
            >
                <div className="font-handwriting text-[#5A9C51] text-[60px] font-bold drop-shadow-sm leading-none rotate-[-3deg] mb-2">
                    Concentrez-vous sur l'essentiel...
                </div>
                <h2 className="font-bebas text-[#4171B5] text-[105px] leading-[0.95] tracking-wider drop-shadow-sm uppercase">
                    LECTURE
                    <br />
                    IMMERSIVE
                </h2>
                <div className="font-anton text-white bg-[#F27D33] text-[35px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white mt-3 rotate-[1deg]">
                    RETRANSCRIPTION ACTIVE
                </div>
                <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug mt-5 border-l-4 border-slate-300 pl-6 max-w-xl">
                    Désactivez la vidéo pour lire confortablement.
                    <br />
                    Gardez le contrôle parfait du défilement audio et de l'interactivité.
                </p>
            </div>

            {/* THE PHONE CONTAINER WITH MASTER TRANSFORM */}
            <div 
                className="absolute"
                style={{ 
                    left: '50%', 
                    top: '50%',
                    transform: `translate(calc(-50% + ${currentX}px), -50%) scale(${currentScale}) perspective(1200px) rotateY(${phoneRotateY}deg) rotateX(${phoneRotateX}deg) translateZ(0px)`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                    transformOrigin: '50% 30%', // Keeps tabs and video-off roughly in the center during extreme 1.8x zoom!
                    width: phoneW,
                    height: phoneH,
                    backgroundColor: '#ffffff',
                    borderRadius: borderRadius,
                    border: `${8 * phoneScale}px solid #1a1a1a`,
                    boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.4)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'sans-serif'
                }}
            >
                
                {/* 1. iOS Status Bar */}
                <div className="flex justify-between items-center px-6 py-4 text-black font-semibold text-lg" style={{ fontSize: 16 * phoneScale }}>
                    <span>11:09</span>
                    <div className="w-24 h-7 bg-black rounded-full" /> 
                    <div className="flex gap-2 items-center text-black">
                        <Wifi size={18 * phoneScale} />
                        <BatteryFull size={22 * phoneScale} />
                    </div>
                </div>

                {/* 2. Top Tabs */}
                <div className="flex px-4 pt-2 pb-4 gap-2 border-b border-slate-100 bg-[#FAF6ED]">
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden">
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 tracking-tight uppercase whitespace-nowrap">L'ECTODERME</span>
                        <span className="text-[9px] text-slate-500 font-semibold mt-0.5">9H 5M</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden">
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 tracking-tight uppercase whitespace-nowrap">L'ENDODERME</span>
                        <span className="text-[9px] text-slate-500 font-semibold mt-0.5">5H 43M</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden">
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 tracking-tight uppercase whitespace-nowrap">LE MÉSODERME</span>
                        <span className="text-[9px] text-slate-500 font-semibold mt-0.5">4H 56M</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-[#F5C544] rounded-xl shadow-md border border-[#edbd3f] overflow-hidden">
                        <span className="text-[8px] sm:text-[9px] font-bold text-white tracking-tight uppercase whitespace-nowrap drop-shadow-sm">L'OEIL</span>
                        <span className="text-[9px] text-white/90 font-semibold mt-0.5">4H 2M</span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col bg-[#FAF6ED] relative">
                    
                    {/* COMBINED MEDIA HEADER BLOCK (Smooth height transition to prevent inner layout thrashing) */}
                    <div style={{ height: combinedHeaderHeight, overflow: 'hidden', position: 'relative', flexShrink: 0 }} className="w-full bg-[#FAF6ED] border-b border-slate-100">
                        {/* AUDIO MODE BLOCK (Fades in, expands) */}
                        <div style={{ opacity: audioBlockOpacity, height: 100, position: 'absolute', bottom: 0, left: 0, right: 0 }} className="flex flex-col justify-center">
                            <div className="px-4 py-3">
                                {/* Title Row */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-[#facc15] font-bebas text-[18px] tracking-wider uppercase mt-1 leading-none">05- INFLUENCE NOTOCHORDE</h2>
                                        <span className="text-slate-500 font-bold text-[13px]">03:50</span>
                                    </div>
                                    <div className="p-1 border border-slate-200 rounded-lg bg-white text-slate-400 shadow-sm shrink-0">
                                        <VideoIcon size={16} /> 
                                    </div>
                                </div>
                                {/* Scrubber Row */}
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <ChevronLeft size={16} className="text-slate-400" />
                                        <div className="bg-[#1e293b] rounded-full p-2.5 shadow-md border-2 border-[#1e293b] hover:bg-slate-800">
                                            <Play size={14} fill="white" className="ml-0.5 text-white" />
                                        </div>
                                        <ChevronRight size={16} className="text-slate-400" />
                                    </div>
                                    
                                    <div className="flex-1 ml-4 flex items-center gap-2 text-[12px] text-slate-500 font-semibold font-sans">
                                        <span className="w-[30px] text-right tabular-nums">{currentScrubberTimeStr}</span>
                                        <div className="flex-1 h-[6px] bg-slate-200 rounded-full relative ml-1 mr-1">
                                            <div className="absolute top-0 left-0 bg-[#facc15] h-full rounded-full" style={{ width: `${audioProgress * 100}%` }} />
                                            {/* Scrubber Thumb */}
                                            <div className="absolute top-1/2 -translate-y-1/2 -ml-2.5 w-[14px] h-[14px] bg-[#facc15] border-2 border-white shadow shadow-black/30 rounded-full pointer-events-none" style={{ left: `${audioProgress * 100}%` }} />
                                        </div>
                                        <span className="w-[30px] text-left tabular-nums">8:39</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* VIDEO MODE BLOCK (Fades out, shrinks) */}
                        <div style={{ opacity: videoBlockOpacity, height: 347, position: 'absolute', top: 0, left: 0, right: 0 }} className="flex flex-col">
                            
                            {/* 3. The Video Player Container (247px) */}
                        <div className="px-4 py-3 shrink-0 h-[247px]">
                            <div className="w-full h-full bg-black rounded-[20px] overflow-hidden relative shadow-lg ring-1 ring-black/5">
                                <Video 
                                    src={staticFile("5-Influence Notochorde.m4v")} 
                                    className="w-full h-full object-cover" 
                                    startFrom={331} // Continues perfectly from adjusted SeqF duration
                                />
                                
                                <div className="absolute top-0 w-full bg-gradient-to-b from-white/95 to-white/40 pt-2 pb-6 px-4">
                                    <h3 className="text-[13px] font-bold text-slate-800 text-center leading-tight">
                                        Biodynamique du Developpement Embryonnaire de l'Oeil
                                    </h3>
                                    <p className="text-[10px] text-slate-500 text-right mt-0.5 font-medium">Marc Damoiseaux</p>
                                </div>

                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-12 pb-3 px-4">
                                    <div className="flex items-center gap-3 text-white text-[11px] font-medium mb-3">
                                        <span>0:23</span>
                                        <div className="flex-1 h-[4px] bg-white/30 rounded-full relative">
                                            <div className="absolute top-0 left-0 h-full bg-[#facc15] rounded-full w-[8%]" />
                                            <div className="absolute top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-[#facc15] border-2 border-white rounded-full shadow" style={{ left: `calc(8% - 5px)` }} />
                                        </div>
                                        <span>8:39</span>
                                    </div>
                                    <div className="flex items-center justify-between text-white px-2">
                                        <div className="flex gap-5">
                                            <RotateCcw size={18} strokeWidth={2.5} className="!text-white opacity-90" />
                                            <Play size={20} fill="white" className="!text-white" />
                                            <RotateCw size={18} strokeWidth={2.5} className="!text-white opacity-90" />
                                        </div>
                                        <div className="flex gap-5">
                                            <Maximize size={18} strokeWidth={2.5} className="!text-white opacity-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Controls Below Video (50px) */}
                        <div className="px-3 pb-3 relative z-10 bg-[#FAF6ED] shrink-0 h-[50px] flex items-center">
                            <div className="flex justify-between items-center w-full bg-[#fdfaf5] border border-slate-200 rounded-xl p-2.5 shadow-sm">
                                <div className="flex gap-2">
                                    <div className="px-3 py-1.5 bg-[#fef3c7] text-[#d97706] text-[11px] font-bold rounded-lg border border-[#fde68a]">x1</div>
                                    <div className="px-2 py-1.5 text-slate-500 text-[11px] font-bold rounded-lg border border-slate-200 bg-white shadow-sm">x1.25</div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm font-bold"><ChevronLeft size={16} strokeWidth={3} /></div>
                                    <div className="px-5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm font-bold"><ChevronRight size={16} strokeWidth={3} /></div>
                                </div>
                                <div className="p-2 border border-slate-200 text-slate-500 rounded-full bg-white shadow-sm"><CloudDownload size={16} strokeWidth={2} /></div>
                            </div>
                        </div>

                        {/* 5. Title block (50px) */}
                        <div className="px-4 py-3 border-y border-slate-100 flex justify-between items-center bg-[#FAF6ED] shrink-0 h-[50px]">
                            <div className="flex items-center gap-2">
                                <h2 className="text-[#facc15] font-bebas text-[18px] tracking-wider uppercase mt-1 leading-none">05- INFLUENCE NOTOCHORDE</h2>
                                <span className="text-slate-500 font-bold text-[13px]">03:50</span>
                            </div>
                            
                            {/* VIDEO-OFF ICON WITH PULSE EFFECT */}
                            <div className="relative">
                                {/* Glow element */}
                                <div className="absolute inset-0 bg-yellow-400 rounded-lg mix-blend-multiply" style={{ opacity: iconPulseShadowOpacity * 0.5, transform: `scale(${iconPulseScale * 1.5})`, filter: 'blur(6px)' }} />
                                
                                <div className={`p-1.5 border border-slate-200 rounded-lg bg-white ${isIconHighlighted ? 'text-yellow-500 border-yellow-300' : 'text-slate-400'} shadow-sm relative z-10`} style={{ transform: `scale(${iconPulseScale})` }}>
                                    <VideoOff size={16} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* 6. Tabs for Transcript (Always visible, moves up precisely) */}
                    <div className="px-4 py-3 bg-[#FAF6ED] shrink-0 border-b border-transparent relative z-20">
                        <div className="flex items-center relative gap-1 bg-white p-[5px] rounded-[12px] shadow-sm border border-slate-200/50">
                            <div className={`flex-1 flex justify-center py-2.5 rounded-[8px] text-[13px] pointer-events-none ${!isTabActive ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100 text-slate-800 font-bold' : 'font-medium text-slate-500 border border-transparent'}`}>
                                Résumé
                            </div>
                            <div className={`flex-1 flex justify-center py-2.5 rounded-[8px] text-[13px] pointer-events-none ${isTabActive ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100 text-slate-800 font-bold' : 'font-medium text-slate-500 border border-transparent'}`}>
                                Re-transcription interactive
                            </div>
                            
                            {isTabActive && (
                                <div className="absolute right-0 -top-5 flex items-center gap-1.5 mr-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-[11px] font-medium text-slate-500">Auto</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 7. Transcript Text Area */}
                    <div className="flex-1 px-5 pt-3 relative overflow-hidden bg-[#FAF6ED]">
                        {!isTabActive ? (
                            <div className="absolute w-[calc(100%-40px)] space-y-5">
                                <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
                                    Cette vidéo explore le rôle essentiel de la notochorde dans le développement embryonnaire...
                                </p>
                            </div>
                        ) : (
                            <div 
                                style={{ transform: `translateY(${interpolate(audioProgress, [0.15, 0.65], [0, -180], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}px) translateZ(0)`, willChange: 'transform' }} 
                                className="absolute w-[calc(100%-40px)] space-y-4 pt-1"
                            >
                                <h1 className="font-bebas text-[30px] leading-[1] text-[#1e293b] tracking-wider mb-5 uppercase mt-1">
                                    Influence de la notochorde<br/>sur le développement embryonnaire
                                </h1>
                                <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                    <Highlighter min={0.0} max={0.16}>
                                        La <b className={textProgress >= 0.0 ? 'text-[#1e293b]' : ''}>notochorde</b> joue un rôle crucial dans le développement embryonnaire, influençant notamment le <b className={textProgress >= 0.0 ? 'text-[#1e293b]' : ''}>tube neural</b>. Il est essentiel de comprendre que cette notochorde émet des signaux,
                                    </Highlighter>
                                    {" "}
                                    <Highlighter min={0.16} max={0.30}>
                                        appelés <b className={textProgress >= 0.16 ? 'text-[#1e293b]' : ''}>systèmes sonétiques 5-hatch</b>, qui incluent des éléments comme la <b className={textProgress >= 0.16 ? 'text-[#1e293b]' : ''}>40A</b> et la <b className={textProgress >= 0.16 ? 'text-[#1e293b]' : ''}>40T</b>.
                                    </Highlighter>
                                    {" "}
                                    <Highlighter min={0.30} max={0.60}>
                                        Ces phénomènes d'induction sont significatifs, notamment en ce qui concerne le <b className={textProgress >= 0.30 ? 'text-[#1e293b]' : ''}>bêta-carotène</b> et les <b className={textProgress >= 0.30 ? 'text-[#1e293b]' : ''}>vitamines A</b>, qui sont intégrées avec la 40T et sont vitales pour le développement de l'<b className={textProgress >= 0.30 ? 'text-[#1e293b]' : ''}>œil</b>. L'<b className={textProgress >= 0.30 ? 'text-[#1e293b]' : ''}>acide rétinoïque</b> est également important à ce stade, impliquant de grands gènes.
                                    </Highlighter>
                                </p>

                                <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-10 font-sans">
                                    <Highlighter min={0.80} max={0.90}>Imaginez un axe central autour duquel se développe le tube neural.</Highlighter>
                                    {" "}
                                    <Highlighter min={0.90} max={1.05}>Cet axe notochordal fournit des informations par un <b className={textProgress >= 0.90 ? 'text-[#1e293b]' : ''}>champ électromagnétique</b> de position,</Highlighter>
                                    {" "}
                                    <Highlighter min={1.05} max={1.25}>agissant comme un <b className={textProgress >= 1.05 ? 'text-[#1e293b]' : ''}>GPS</b> pour les cellules environnantes, ce qui entraîne la réaction de diverses <b className={textProgress >= 1.05 ? 'text-[#1e293b]' : ''}>protéines</b>. Par exemple, les yeux se développeront à un endroit précis, tandis que d'autres</Highlighter>
                                </p>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-[#FAF6ED] via-[#FAF6ED]/80 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* 8. Bottom Navigation (Slightly shorter for elegance) */}
                <div className="border-t border-slate-200 bg-[#FAF6ED]/95 flex justify-between px-2 pt-2 pb-6 shrink-0 relative z-20">
                    <div className="flex flex-col items-center flex-1 text-slate-500"><Home size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Accueil</span></div>
                    <div className="flex flex-col items-center flex-1 text-slate-400"><Clock size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Chronolo...</span></div>
                    <div className="flex flex-col items-center flex-1 text-slate-800"><VideoIcon size={22} strokeWidth={2.5} /><span className="text-[10px] font-bold mt-1">Vidéos</span></div>
                    <div className="flex flex-col items-center flex-1 text-slate-400"><Brain size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Assistant ...</span></div>
                    <div className="flex flex-col items-center flex-1 text-[#e11d48]"><LogOut size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Quitter</span></div>
                    <div className="flex flex-col items-center flex-1 text-slate-400">
                        <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-200 overflow-hidden relative">
                            <div className="absolute inset-0 bg-blue-600 w-1/3"></div>
                            <div className="absolute inset-0 bg-white left-1/3 w-1/3"></div>
                            <div className="absolute inset-0 bg-red-600 left-2/3 w-1/3"></div>
                        </div>
                        <span className="text-[10px] font-medium mt-1 text-slate-300">FR</span>
                    </div>
                </div>

                {/* Mouse Cursor INSIDE PHONE */}
                <div 
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: cursorX,
                        top: cursorY,
                        transform: `scale(${finalCursorScale})`,
                        filter: 'drop-shadow(0px 6px 10px rgba(0,0,0,0.4))',
                        transformOrigin: 'top left',
                        opacity: frame >= 127 ? 0 : 1
                    }}
                >
                    <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.77 21.4L11.44 17.14C11.66 16.94 11.95 16.83 12.25 16.83H18.5C19.16 16.83 19.5 16.03 19.03 15.56L6.53 3.06C6.06 2.59 5.5 2.82 5.5 3.21Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
            
        </AbsoluteFill>
    );
};
