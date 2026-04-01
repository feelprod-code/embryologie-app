import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, Sequence, staticFile } from 'remotion';
import { Home, Clock, Video, Brain } from 'lucide-react';
import { fpsS } from './hooks/useTime';



export const SequenceD: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // 1. iPhone recentering (0 to 20)
    const recenterProgress = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 60 },
        durationInFrames: 20
    });

    // iPhone X position: starts at -450 (where Seq C left off) and goes to 0
    const iphoneX = interpolate(recenterProgress, [0, 1], [-450, 0]);

    // 2. Camera Zoom to bottom (20 to 50)
    // We zoom into the bottom menu area of the iPhone.
    const zoomProgress = spring({
        frame: Math.max(0, frame - 20),
        fps,
        config: { damping: 16, stiffness: 50 },
        durationInFrames: 30
    });

    // The whole scene container scales up, centered on the bottom of the screen
    const sceneScale = interpolate(zoomProgress, [0, 1], [1, 2.4]);
    // Also push the scene slightly up so the bottom menu isn't cut off by the screen edge
    const sceneY = interpolate(zoomProgress, [0, 1], [0, -100]);

    // 3. Bottom Menu Icons Reveal Staggering
    // We have 6 icons, FR is persistent. Let's reveal the remaining 5 sequentially from right to left, starting around frame 55 (after zoom stabilizes)
    const iconsRevealStart = 55;
    const staggeredReveal = (index: number) => {
        // Index 4 is Quitter (rightmost of the animated ones), Index 0 is Accueil.
        // We want index 4 to appear first, so delay is (4 - index) * 3
        return spring({
            frame: Math.max(0, frame - (iconsRevealStart + (4 - index) * 3)),
            fps,
            config: { damping: 12, stiffness: 80 },
            durationInFrames: 20
        });
    };

    // 4. Video Icon Selected Highlight (from frame 90)
    const selectionProgress = spring({
        frame: Math.max(0, frame - 90),
        fps,
        config: { damping: 14, stiffness: 45 },
        durationInFrames: 30
    });

    // Calculate reveal progress for each icon (FR is not animated here)
    const icon1Progress = staggeredReveal(0); // Accueil
    const icon2Progress = staggeredReveal(1); // Chronolo...
    const icon3Progress = staggeredReveal(2); // Vidéos (The Star)
    const icon4Progress = staggeredReveal(3); // Assistant ...

    // Icon dims for non-selected items when selection happens
    const inactiveOpacity = interpolate(selectionProgress, [0, 1], [1, 0.4]);
    
    // Video icon special effects
    const videoScale = interpolate(selectionProgress, [0, 0.5, 1], [1, 1.4, 1.2]);

    // 5. Massive Ripple Explosion (from frame 130)
    const rippleProgress = spring({
        frame: Math.max(0, frame - 130),
        fps,
        config: { damping: 15, stiffness: 60 },
        durationInFrames: 36
    });

    const rippleScale = interpolate(rippleProgress, [0, 1], [0.5, 30]);
    // Stay at 1 so the sequence ends perfectly covered in Orange!
    const rippleOpacity = interpolate(rippleProgress, [0, 0.4, 1], [0, 1, 1]);

    // "Vidéos" specific elements
    // We tint it from #64748B (slate-500) to #F27D33 (brand orange)
    
    return (
        <AbsoluteFill className="bg-[#FAF6ED] overflow-hidden">
            {/* SOUND DESIGN: CLICS */}
            <Sequence name="Bruitage - click.wav" from={fpsS(90, realFps)} durationInFrames={fpsS(15, realFps)}>
                <Audio src={staticFile('click.wav')} />
            </Sequence>

            {/* The Cinematic Background Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#FAF6ED_0%,_#FAF6ED_60%)] pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#FAF6ED]/50 to-[#FAF6ED] pointer-events-none z-0"></div>

            {/* Huge Ripple explosion */}
            <div 
                className="absolute left-1/2 bottom-1/4 rounded-full bg-[#F27D33] z-[100]"
                style={{
                    width: '100px',
                    height: '100px',
                    transform: `translate(-50%, 50%) scale(${rippleScale})`,
                    opacity: rippleOpacity,
                    display: rippleScale > 0.5 ? 'block' : 'none'
                }}
            />

            {/* The Main Scene Container (Applying Camera Zoom) */}
            <div 
                className="absolute inset-0 flex items-center justify-center transform-gpu"
                style={{
                    transformOrigin: '50% 90%', // Zoom towards the bottom
                    transform: `scale(${sceneScale}) translateY(${sceneY}px)`
                }}
            >
                {/* The iPhone Container with Black Border */}
                <div 
                    className="relative bg-white shadow-2xl overflow-hidden flex flex-col transform-gpu"
                    style={{
                        width: '380px',
                        height: '800px',
                        borderRadius: '50px',
                        border: '12px solid #1E293B',
                        outline: '4px solid #0F172A',
                        transform: `translateX(${iphoneX}px)`
                    }}
                >
                    {/* Static Transcript Background (From Sequence C) */}
                    <div className="flex-1 overflow-hidden bg-[#FAF6ED] w-full relative pointer-events-none flex flex-col pt-12 pb-[15px]">
                        
                        {/* Top Sticky Header */}
                        <div className="w-full pt-4 pb-4 px-6 shadow-sm z-30 bg-[#FAF6ED] border-b border-slate-200">
                            <div className="flex items-center w-full gap-3">
                                <div className="flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[#F27D33] text-white shadow-md shrink-0">
                                    <Video size={20} fill="currentColor" className="ml-[2px]" />
                                </div>
                                <div className="flex items-center gap-2 flex-1 relative top-0.5">
                                    <span className="text-[12px] text-[#F27D33] font-medium tracking-tighter w-[32px] text-left">3:42</span>
                                    <div className="relative flex-1 h-1.5 flex items-center">
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full" />
                                        <div className="absolute left-0 h-1.5 bg-[#F27D33] rounded-l-full w-[56%]" />
                                        <div className="absolute w-3.5 h-3.5 bg-[#F27D33] rounded-full -translate-x-1/2 shadow-sm left-[56%]" />
                                    </div>
                                    <span className="text-[12px] text-slate-400 font-medium tracking-tighter">80:17</span>
                                </div>
                            </div>
                        </div>

                        {/* Title bar of transcript */}
                        <div className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-slate-100 z-20 shadow-sm relative">
                            <span className="text-[11px] font-bold tracking-widest text-[#8E5A3E] uppercase">RETRANSCRIPTION</span>
                        </div>

                        {/* Scrolling Content mask */}
                        <div className="flex-1 bg-white w-full px-6 pt-6 -translate-y-[150px]">
                            <div className="flex flex-col gap-6">
                                {[
                                    { speaker: "Philippe Guillaume", time: "3:22", text: "魅力的ですね。対称軸についてもう少し詳しく調べることはできますか？" },
                                    { speaker: "Marc Damoiseaux", time: "3:45", text: "はい、左右対称性の年代順は非常に強力な指標であり、この章で厳密に研究していきます。" },
                                    { speaker: "Philippe Guillaume", time: "4:12", text: "完璧です！この概念の3Dデモンストレーションを本当に楽しみにしています。" },
                                    { speaker: "Marc Damoiseaux", time: "4:30", text: "この理論的な紹介のすぐ後でそれについて説明します。" },
                                    { speaker: "Philippe Guillaume", time: "5:05", text: "Alors, continuons notre exploration de l'axe antéro-postérieur avec cette prochaine question." },
                                    { speaker: "Marc Damoiseaux", time: "5:40", text: "L'axe antéro-postérieur est en effet fascinant car il détermine l'organisation de tout le reste du feuillet." },
                                    { speaker: "Philippe Guillaume", time: "6:15", text: "On parle souvent de gradient morphogénétique, est-ce à ce niveau qu'il intervient ?" },
                                    { speaker: "Marc Damoiseaux", time: "6:33", text: "Tout à fait, et nous le verrons en profondeur avec la vidéo de démonstration 3D sur les gènes Hox." }
                                ].map((item, idx) => (
                                    <div key={idx} className={`transition-colors duration-500 rounded-xl p-3 -mx-3 bg-orange-50/70 border-orange-100`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-[#8E5A3E] text-[13px]">{item.speaker}</span>
                                            <span className="text-slate-400 text-[11px] font-medium">{item.time}</span>
                                        </div>
                                        <p className="text-slate-600 text-[14px] leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Bottom Navigation Bar (The Hero of Seq D) */}
                    <nav className="absolute bottom-0 w-full bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 pb-[16px] shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)] flex justify-between px-2 pt-2 z-20">
                        
                        {/* 1. Accueil */}
                        <div className="flex flex-col items-center flex-1 text-slate-800 relative">
                            <div 
                                className="flex flex-col items-center w-full"
                                style={{
                                    opacity: icon1Progress,
                                    transform: `scale(${interpolate(icon1Progress, [0, 0.7, 1], [0.5, 1.2, 1])}) translateY(${interpolate(icon1Progress, [0, 1], [20, 0])}px)`
                                }}
                            >
                                <Home size={22} style={{ opacity: inactiveOpacity }} strokeWidth={2.5} />
                                <span className="mt-1 text-[10px] font-bold text-slate-800 transition-all w-full text-center px-0.5 truncate" style={{ opacity: inactiveOpacity }}>Accueil</span>
                            </div>
                        </div>

                        {/* 2. Chronolo... */}
                        <div className="flex flex-col items-center flex-1 text-slate-400 relative">
                            <div 
                                className="flex flex-col items-center w-full"
                                style={{
                                    opacity: icon2Progress,
                                    transform: `scale(${interpolate(icon2Progress, [0, 0.7, 1], [0.5, 1.2, 1])}) translateY(${interpolate(icon2Progress, [0, 1], [20, 0])}px)`
                                }}
                            >
                                <Clock size={22} style={{ opacity: inactiveOpacity }} strokeWidth={2} />
                                <span className="mt-1 text-[10px] font-medium transition-all w-full text-center px-0.5" style={{ opacity: inactiveOpacity }}>Chronolo...</span>
                            </div>
                        </div>

                        {/* 3. Vidéos (The Target) */}
                        <div className="flex flex-col items-center flex-1 text-slate-400 relative z-30">
                            {/* Target Highlight Glow behind icon */}
                            <div 
                                className="absolute top-1 left-1/2 rounded-full bg-[#F27D33]/20 blur-md pointer-events-none"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    transform: 'translate(-50%, 0)',
                                    opacity: selectionProgress
                                }}
                            />
                            
                            <div 
                                className="flex flex-col items-center w-full"
                                style={{
                                    opacity: icon3Progress,
                                    transform: `scale(${interpolate(icon3Progress, [0, 0.7, 1], [0.5, 1.2, 1])}) translateY(${interpolate(icon3Progress, [0, 1], [20, 0])}px)`
                                }}
                            >
                                <div style={{ transform: `scale(${videoScale})`, transition: 'all' }}>
                                    {/* Crossfade between Slate icon and Orange icon manually if needed, or CSS filter */}
                                    <Video 
                                        size={22} 
                                        color={selectionProgress > 0.5 ? '#F27D33' : '#94A3B8'} 
                                        strokeWidth={selectionProgress > 0.5 ? 2.5 : 2}
                                    />
                                </div>
                                <span 
                                    className="mt-1 text-[10px] w-full text-center px-0.5 font-medium relative"
                                    style={{
                                        color: selectionProgress > 0.5 ? '#F27D33' : '#94A3B8',
                                        fontWeight: selectionProgress > 0.5 ? 700 : 500,
                                        transform: `scale(${interpolate(selectionProgress, [0, 1], [1, 1.2])})`,
                                    }}
                                >
                                    Vidéos
                                </span>
                            </div>
                        </div>

                        {/* 4. Assistant ... */}
                        <div className="flex flex-col items-center flex-1 text-slate-400 relative">
                            <div 
                                className="flex flex-col items-center w-full"
                                style={{
                                    opacity: icon4Progress,
                                    transform: `scale(${interpolate(icon4Progress, [0, 0.7, 1], [0.5, 1.2, 1])}) translateY(${interpolate(icon4Progress, [0, 1], [20, 0])}px)`
                                }}
                            >
                                <Brain size={22} style={{ opacity: inactiveOpacity }} strokeWidth={2} />
                                <span className="mt-1 text-[10px] font-medium transition-all w-full text-center px-0.5 truncate" style={{ opacity: inactiveOpacity }}>Assistant ...</span>
                            </div>
                        </div>

                        {/* 5. FR (Persistent) */}
                        <div className="flex flex-col items-center flex-1 text-slate-800 relative">
                            <div className="flex flex-col items-center w-full">
                                <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-300 overflow-hidden relative shadow-sm" style={{ opacity: inactiveOpacity }}>
                                    <div className="absolute inset-0 bg-blue-600 w-1/3"></div>
                                    <div className="absolute inset-0 bg-white left-1/3 w-1/3"></div>
                                    <div className="absolute inset-0 bg-red-600 left-2/3 w-1/3"></div>
                                </div>
                                <span className="text-[10px] font-bold mt-1 text-slate-800" style={{ opacity: inactiveOpacity }}>FR</span>
                            </div>
                        </div>

                    </nav>
                </div>
            </div>
        </AbsoluteFill>
    );
};
