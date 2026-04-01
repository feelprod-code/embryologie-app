import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate, Img, staticFile, Sequence, Audio } from 'remotion';
import { Play, BookOpen } from 'lucide-react';
import { fpsS } from './hooks/useTime';

export const SequenceB: React.FC<{ layoutFormat?: '16:9' | '9:16' | '1:1', alternate?: boolean }> = ({ layoutFormat = '16:9', alternate = false }) => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // 1. Text from A out
    const textOutProgress = spring({ frame: frame - 10, fps, config: { damping: 14 } });
    
    // 2. iPhone moving from left (-450) to right (450)
    const iphoneMoveProgress = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 1.2 } });

    // 3. iPhone Tilt adjustments for perfect symmetry
    const rotX = 15;
    const rotY = interpolate(iphoneMoveProgress, [0, 1], [35, -35]);
    const rotZ = interpolate(iphoneMoveProgress, [0, 1], [-5, 5]);
    const translateZ = 100;

    let translateX = interpolate(iphoneMoveProgress, [0, 1], [-450, 450]);
    let translateY = 0;
    let globalScale = 1;

    if (layoutFormat === '9:16') {
        globalScale = 0.9;
        translateX = 0;
        translateY = interpolate(iphoneMoveProgress, [0, 1], [alternate ? 350 : -350, alternate ? -350 : 350]);
    } else if (layoutFormat === '1:1') {
        globalScale = 0.8;
        translateY = 0;
        translateX = interpolate(iphoneMoveProgress, [0, 1], [alternate ? 250 : -250, alternate ? -250 : 250]);
    }

    // 4. "Afficher la retranscription" Button fades in
    const btnAppearProgress = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 80, mass: 0.8 } });

    // 5. Cursor flies in & Clicks the button
    // User timeline (60fps global): seq B starts at 724
    // 749 (frame 12.5 at 30fps): Pointer lowers ("baisse un peu")
    // 786 (frame 31 at 30fps): Pointer stays without jumping ("reste un peu ne sautille pas")
    // 820 (frame 48 at 30fps): Pointer disappears at 821
    
    // Cursor flies in between 10 and 20
    const cursorFlyProgress = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.8 } });

    let clickScale = 1;
    // Click action around 749 (at 60fps) => 25 / 2 = 12.5 (at 30fps)
    if (frame >= 12 && frame < 15) {
        clickScale = interpolate(frame, [12, 15], [1, 0.8]);
    } else if (frame >= 15 && frame < 18) {
        clickScale = interpolate(frame, [15, 18], [0.8, 1]);
    }

    // 6. Transition to Transcript View (Crossfade View A out, View B in)
    const transcriptViewProgress = spring({ frame: frame - 25, fps, config: { damping: 16, mass: 0.8 } });

    // Default pointer opacity
    const pointerOpacity = 1;

    // 7. Auto-scroll of Transcript text (Continuous!)
    const scrollY = interpolate(frame, [40, 400], [0, -450], { extrapolateLeft: 'clamp', extrapolateRight: 'extend' });

    // 8. Progress values for playhead visualization
    const playbackPercentage = interpolate(frame + 12, [20, 250], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'extend' });
    const currentSeconds = Math.floor((playbackPercentage / 100) * 4817);
    const m = Math.floor(currentSeconds / 60);
    const s = (currentSeconds % 60).toString().padStart(2, '0');
    const currentTimeStr = `${m}:${s}`;

    const transcriptPlaybackPct = interpolate(frame, [90, 400], [52.2, 54.0], { extrapolateLeft: 'clamp', extrapolateRight: 'extend' });
    const tsSeconds = Math.floor((transcriptPlaybackPct / 100) * 4817);
    const tm = Math.floor(tsSeconds / 60);
    const ts = (tsSeconds % 60).toString().padStart(2, '0');
    const tsTimeStr = `${tm}:${ts}`;

    // Thickness 3D Bezel
    const thicknessLayers = Array.from({ length: 16 }).map((_, i) => (
        <div 
            key={`layer-${i}`}
            className="absolute inset-0 bg-slate-800 rounded-[55px] border border-slate-700 pointer-events-none"
            style={{ transform: `translateZ(${-i - 1}px)` }}
        />
    ));

    let textAOutClasses = "absolute right-[2%] top-1/2 flex flex-col items-start justify-center w-[55%] z-0 p-8 gap-4"; // 16:9 base
    let textAOutTransform = `translateY(-50%) translateX(${interpolate(textOutProgress, [0, 1], [0, 300])}px)`;
    
    if (layoutFormat === '9:16') {
        textAOutClasses = `absolute ${alternate ? 'top-[5%]' : 'bottom-[10%]'} left-1/2 flex flex-col items-center justify-center w-[90%] z-0 p-8 gap-4 text-center`;
        textAOutTransform = `translateX(-50%) translateY(${interpolate(textOutProgress, [0, 1], [0, alternate ? -200 : 200])}px)`;
    } else if (layoutFormat === '1:1') {
        textAOutClasses = `absolute ${alternate ? 'left-[5%]' : 'right-[2%]'} top-1/2 flex flex-col ${alternate ? 'items-end' : 'items-start'} justify-center w-[45%] z-0 p-4 gap-2`;
        textAOutTransform = `translateY(-50%) translateX(${interpolate(textOutProgress, [0, 1], [0, alternate ? -200 : 200])}px)`;
    }

    let textBInClasses = "absolute left-[5%] top-1/2 flex flex-col items-start justify-center w-[45%] z-0 p-8 gap-4";
    let textBInTransform = `translateY(-50%) translateX(${interpolate(transcriptViewProgress, [0, 1], [-50, 0])}px)`;
    
    if (layoutFormat === '9:16') {
        textBInClasses = `absolute ${alternate ? 'bottom-[10%]' : 'top-[5%]'} left-1/2 flex flex-col items-center justify-center w-[90%] z-0 p-8 gap-4 text-center`;
        textBInTransform = `translateX(-50%) translateY(${interpolate(transcriptViewProgress, [0, 1], [alternate ? 50 : -50, 0])}px)`;
    } else if (layoutFormat === '1:1') {
        textBInClasses = `absolute ${alternate ? 'right-[2%]' : 'left-[5%]'} top-1/2 flex flex-col ${alternate ? 'items-start' : 'items-end'} justify-center w-[45%] z-0 p-4 gap-2`;
        textBInTransform = `translateY(-50%) translateX(${interpolate(transcriptViewProgress, [0, 1], [alternate ? 50 : -50, 0])}px)`;
    }

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center font-sans overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* The outgoing Text from Sequence A sliding OUT to the right */}
            <div 
                className={textAOutClasses}
                style={{
                    opacity: interpolate(textOutProgress, [0, 0.5], [1, 0]), 
                    transform: textAOutTransform
                }}
            >
                {/* 1. Main Title */}
                <h2 
                    style={{ 
                        opacity: 1, 
                        transform: `translateY(0px)` 
                    }}
                    className={`font-bebas text-[#4171B5] leading-[0.95] tracking-wider drop-shadow-md mt-2 ${layoutFormat === '9:16' ? 'text-[70px] text-center' : layoutFormat === '1:1' ? 'text-[65px]' : 'text-[85px]'}`}
                >
                    ÉCOUTONS MARC QUI PRÉSENTE
                    {layoutFormat === '9:16' ? ' ' : <br />}
                    SON PARCOURS
                </h2>
                
                {/* 2. Orange Anton Box */}
                <div 
                    style={{ 
                        opacity: 1, 
                        transform: `translateY(0px) rotate(-1deg)` 
                    }}
                    className={`font-anton text-white bg-[#F27D33] tracking-wide uppercase px-8 py-3 rounded-2xl shadow-xl border-4 border-white mt-4 ${layoutFormat === '9:16' ? 'text-[40px] text-center' : layoutFormat === '1:1' ? 'text-[35px]' : 'text-[50px]'}`}
                >
                    PODCAST DES TECHNIQUES TISSULAIRES
                </div>

                {/* 3. Italic Subtitle */}
                <div 
                    style={{ 
                        opacity: 1, 
                        transform: `translateY(0px)` 
                    }}
                    className={`font-sans text-slate-600 font-semibold italic mt-6 border-l-4 border-slate-300 pl-6 ${layoutFormat === '9:16' ? 'text-[24px] text-center ml-0 border-l-0 border-t-4 pt-4' : layoutFormat === '1:1' ? 'text-[22px] ml-2' : 'text-[30px] ml-4'}`}
                >
                    Vers l'embryologie biodynamique...
                </div>
            </div>

            {/* Incoming Text for Sequence B */}
            <div 
                className={textBInClasses}
                style={{
                    opacity: interpolate(transcriptViewProgress, [0, 1], [0, 1]), 
                    transform: textBInTransform
                }}
            >
                <div className={`font-handwriting text-[#5A9C51] font-bold drop-shadow-sm leading-none rotate-[-3deg] mb-2 ${layoutFormat === '9:16' ? 'text-[60px]' : 'text-[70px]'}`}>
                    La preuve par le texte...
                </div>
                <h2 className={`font-bebas text-[#4171B5] leading-[0.95] tracking-wider drop-shadow-sm uppercase ${layoutFormat === '9:16' ? 'text-[80px]' : layoutFormat === '1:1' ? 'text-[75px]' : 'text-[105px]'}`}>
                    RETRANSCRIPTIONS
                    {layoutFormat === '9:16' ? ' ' : <br />}
                    INTÉGRALES
                </h2>
                <div className={`font-anton text-white bg-[#F27D33] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white mt-2 rotate-[1deg] ${layoutFormat === '9:16' ? 'text-[28px]' : 'text-[35px]'}`}>
                    AUTO-SCROLL EN TEMPS RÉEL
                </div>
                <p className={`font-sans text-slate-500 font-medium leading-snug mt-4 border-l-4 border-slate-300 pl-6 ${layoutFormat === '9:16' ? 'text-[22px] ml-0 border-l-0 border-t-4 pt-4' : 'text-[26px]'}`}>
                    Un mot vous échappe ?
                    <br />
                    Mots-clés surlignés, auto-scroll synchronisé et formatage par interlocuteur.
                </p>
            </div>

            {/* 3D Scene Wrapper (The iPhone) */}
            <div 
                className="relative flex items-center justify-center w-[380px] h-[820px] z-10"
                style={{ 
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    transform: `scale(${globalScale}) translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`
                }}
            >
                {thicknessLayers}

                {/* iPhone Screen Content */}
                <div 
                    className="absolute inset-0 bg-[#FAF6ED] rounded-[55px] overflow-hidden transform-gpu flex flex-col justify-between pb-[65px]"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 shadow-inner flex items-center justify-between px-3">
                        <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#111]"></div>
                    </div>

                    {/* ========================================================= */}
                    {/* VIEW A: Pre-click (Podcast Intro view with timeline) */}
                    {/* ========================================================= */}
                    <div 
                        className="absolute inset-0 flex flex-col justify-between pb-[65px]"
                        style={{ opacity: interpolate(transcriptViewProgress, [0, 0.5], [1, 0]) }}
                    >
                        {/* Header Details */}
                        <div className="w-full pt-16 flex flex-col items-center px-4">
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
                        
                        {/* Fake Content Below video before transcript overtakes */}
                        <div className="w-full flex flex-col items-center gap-3 pb-8 px-6 z-10">
                            <div className="font-handwriting text-[36px] text-slate-600 -rotate-2 mt-4 translate-y-6">
                                Pour commencer !
                            </div>
                        </div>
                    </div>

                    {/* ========================================= */}
                    {/* VIEW B: Transcript View Rollup */}
                    {/* ========================================= */}
                    <div 
                        className="absolute inset-0 bg-[#FAF6ED] flex flex-col pt-12 pb-[65px] z-30"
                        style={{ 
                            opacity: interpolate(transcriptViewProgress, [0.5, 1], [0, 1]), 
                            transform: `translateY(${interpolate(transcriptViewProgress, [0, 1], [60, 0])}px)`
                        }}
                    >
                        {/* Top Sticky Header for player inside transcript view */}
                        <div className="w-full pt-4 pb-4 px-6 shadow-sm z-30 bg-[#FAF6ED] border-b border-slate-200">
                            <div className="flex items-center w-full gap-3">
                                <div className="flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[#F27D33] text-white shadow-md shrink-0">
                                    <Play size={20} fill="currentColor" className="ml-[2px]" />
                                </div>
                                <div className="flex items-center gap-2 flex-1 relative top-0.5">
                                    <span className="text-[12px] text-[#F27D33] font-medium tracking-tighter w-[32px] text-left">{tsTimeStr}</span>
                                    <div className="relative flex-1 h-1.5 flex items-center">
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full" />
                                        <div className="absolute left-0 h-1.5 bg-[#F27D33] rounded-l-full" style={{ width: `${transcriptPlaybackPct}%` }} />
                                        <div className="absolute w-3.5 h-3.5 bg-[#F27D33] rounded-full -translate-x-1/2 shadow-sm" style={{ left: `${transcriptPlaybackPct}%` }} />
                                    </div>
                                    <span className="text-[12px] text-slate-400 font-medium tracking-tighter">80:17</span>
                                </div>
                            </div>
                            
                            <div className="w-full mt-5 py-3 bg-[#EFE8D8] text-[#8E5A3E] rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm border border-[#E2D5BE]">
                                <BookOpen size={14} />
                                MASQUER LA RETRANSCRIPTION
                            </div>
                        </div>

                        {/* Title bar of transcript */}
                        <div className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-slate-100 z-20 shadow-sm relative">
                            <span className="text-[11px] font-bold tracking-widest text-[#8E5A3E] uppercase">RETRANSCRIPTION</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)] animate-pulse" />
                                <span className="text-[10px] font-bold text-[#5A9C51]">Auto-scroll</span>
                            </div>
                        </div>

                        {/* Scrolling Content mask */}
                        <div className="flex-1 overflow-hidden bg-white w-full relative pointer-events-none">
                            <div 
                                className="px-6 pt-6 pb-20 flex flex-col gap-6"
                                style={{ transform: `translateY(${scrollY}px)` }}
                            >
                                <div className="transition-all duration-300 rounded-xl p-3 -mx-3 bg-orange-50/70 border border-orange-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">0:09</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed">
                                        Bonjour à tous et bienvenue sur le podcast des techniques douces tissulaires, aujourd'hui orienté vers l'embryologie biodynamique.
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">0:49</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        Bonjour Guillaume.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">0:52</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        C'est un véritable plaisir partagé. Pour commencer, est-ce que tu peux nous expliquer ce concept fondamental de la ligne médiane ?
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">1:15</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        Absolument. La ligne médiane n'est pas qu'une construction anatomique abstraite. C'est le point de référence central autour duquel tout le développement embryonnaire s'organise et se déploie de manière systémique.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">1:22</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        C'est fascinant. Pouvons-nous explorer les axes de symétrie plus en détail et comprendre comment ils s'articulent ?
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">1:45</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        Oui, la chronologie des symétries bilatérales est un marqueur très fort que nous allons étudier rigoureusement dans la suite de ce chapitre.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">2:10</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        Parfait ! Je suis vraiment impatient d'arriver à la démonstration en 3 dimensions de ce concept très attendu.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">2:25</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        Nous allons y venir juste après cette introduction théorique.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Bottom Fade */}
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                        </div>
                    </div>
                </div>

                {/* iPhone Black Outline Overlay */}
                <div 
                    className="absolute inset-0 rounded-[55px] pointer-events-none z-[100]" 
                    style={{ boxShadow: `inset 0 0 0 14px black` }} 
                />

                    {/* Floating Components strictly outside the transcript overlay flow */}
                    <div 
                        className="absolute inset-x-0 mx-auto flex flex-col items-center z-20 pointer-events-none"
                        style={{ 
                            width: 320, 
                            top: '50%',
                            transform: `translateY(-50%) scale(0.9) translateZ(25px)`,
                            marginTop: 48,
                            opacity: interpolate(transcriptViewProgress, [0, 0.5], [1, 0])
                        }}
                    >
                        {/* The Video Image Placeholder */}
                        <div className="relative w-full aspect-square shrink-0 overflow-hidden border border-slate-100 bg-slate-200">
                            <Img src={staticFile('PODCAST_comp.jpg')} className="absolute inset-0 w-full h-full object-cover" />
                        </div>

                        {/* Basic Player UI Mock */}
                        <div className="flex items-center w-full mt-6 gap-3">
                            <div className="relative shrink-0">
                                {/* Play btn */}
                                <div className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#F27D33] text-white relative z-20">
                                    <Play size={24} fill="currentColor" className="ml-[2px]" />
                                </div>
                            </div>

                            {/* Progress Bar Mock */}
                            <div className="flex items-center gap-2 flex-1 pt-1">
                                <span className="text-[12px] text-slate-500 font-medium tracking-tighter w-[28px] text-right">{currentTimeStr}</span>
                                <div className="relative flex-1 h-2 flex items-center">
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden" />
                                    <div className="absolute left-0 h-1.5 bg-[#F27D33] rounded-l-full" style={{ width: `${playbackPercentage}%` }} />
                                    <div className="absolute h-3 w-3 bg-[#F27D33] rounded-full -translate-x-1/2 z-10" style={{ left: `${playbackPercentage}%` }} />
                                </div>
                                <span className="text-[12px] text-slate-400 font-medium tracking-tighter">80:17</span>
                            </div>
                        </div>

                        {/* Transcript Button positioned directly under timeline */}
                        <div className="absolute top-[100%] w-full mt-6 z-40 pointer-events-auto">
                            <div 
                                style={{ 
                                    opacity: btnAppearProgress,
                                    transform: `translateY(${interpolate(btnAppearProgress, [0, 1], [-20, 0])}px) scale(${interpolate(btnAppearProgress, [0, 1], [0.8, 1])}) scale(${clickScale})`
                                }}
                                className="w-full py-3 bg-[#EFE8D8] text-[#8E5A3E] rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm border border-[#E2D5BE]"
                            >
                                <BookOpen size={16} />
                                AFFICHER LA RETRANSCRIPTION
                            </div>
                        </div>
                    </div>

                    {/* Cursor Container - Same position as Floating Components but no opacity fade */}
                    <div 
                        className="absolute inset-x-0 mx-auto flex flex-col items-center z-[200] pointer-events-none"
                        style={{ 
                            width: 320, 
                            top: '50%',
                            transform: `translateY(-50%) scale(0.9) translateZ(25px)`,
                            marginTop: 48,
                        }}
                    >
                        {/* Invisible placeholders to push cursor to exact same coordinates without drawing them */}
                        <div className="w-full aspect-square shrink-0 opacity-0 invisible"></div>
                        <div className="flex items-center w-full mt-6 gap-3 opacity-0 invisible"></div>

                        {/* Absolute wrapper relative to our transparent block so it perfectly matches button */}
                        <div className="absolute top-[100%] w-full mt-6 pointer-events-none">
                            {/* Mouse Cursor */}
                            <div 
                                style={{
                                    opacity: interpolate(cursorFlyProgress, [0, 1], [0, 1]) * pointerOpacity,
                                    transform: `translate(${interpolate(cursorFlyProgress, [0, 1], [150, 160])}px, ${interpolate(cursorFlyProgress, [0, 1], [400, 24])}px) scale(${clickScale}) rotate(-10deg)`,
                                    zIndex: 200
                                }}
                                className="absolute top-0 left-0 pointer-events-none drop-shadow-xl"
                            >
                                {/* Native macOS style cursor SVG */}
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="#333" strokeWidth="1.5">
                                    <path d="M4 3l7 19l4 -8l8 -4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

            </div>
            
            {/* BRUITAGES INTÉGRÉS */}
            <Sequence name="Bruitage - click.wav" from={fpsS(12, realFps)} durationInFrames={fpsS(30, realFps)}>
                <Audio src={staticFile('click.wav')} volume={0.8} />
            </Sequence>

        </AbsoluteFill>
    );
};
