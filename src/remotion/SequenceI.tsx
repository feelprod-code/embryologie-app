import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Video, Audio, Sequence } from 'remotion';
import { RotateCw, RotateCcw, Play, Maximize, Wifi, BatteryFull, Minimize2, Home, Clock, Video as VideoIcon, Brain, LogOut, ChevronLeft, ChevronRight, CloudDownload, X } from 'lucide-react';
import { fpsS } from './hooks/useTime';

export const SequenceI: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // 1. Phone scale and dimensions
    const baseScale = 1.1; // Baseline scale when vertical
    const phoneW = 400 * baseScale;
    const phoneH = 850 * baseScale;

    // --- Timeline of Events --- //

    // Movement interpolations
    const fly1 = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 14 } }); // Idle -> CC
    const fly2 = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 14 } }); // CC -> Lang Menu
    const fly3 = spring({ frame: Math.max(0, frame - 160), fps, config: { damping: 14 } }); // Lang -> EN
    const fly4 = spring({ frame: Math.max(0, frame - 205), fps, config: { damping: 14 } }); // EN -> ES
    const fly5 = spring({ frame: Math.max(0, frame - 250), fps, config: { damping: 14 } }); // ES -> DE
    const fly6 = spring({ frame: Math.max(0, frame - 295), fps, config: { damping: 14 } }); // DE -> IT
    const fly7 = spring({ frame: Math.max(0, frame - 340), fps, config: { damping: 14 } }); // IT -> PT
    const fly8 = spring({ frame: Math.max(0, frame - 385), fps, config: { damping: 14 } }); // PT -> JA
    const fly8b = spring({ frame: Math.max(0, frame - 425), fps, config: { damping: 14 } }); // JA -> Right of English
    const fly9 = spring({ frame: Math.max(0, frame - 460), fps, config: { damping: 14 } }); // -> FullScreen


    // Clicks
    const click1 = frame >= 75  && frame <= 90  ? interpolate(frame, [75, 82, 90], [1, 0.8, 1]) : 1; // CC Icon
    const click2 = frame >= 130 && frame <= 145 ? interpolate(frame, [130, 137, 145], [1, 0.8, 1]) : 1; // Settings Icon
    const click3 = frame >= 175 && frame <= 190 ? interpolate(frame, [175, 182, 190], [1, 0.8, 1]) : 1; // EN
    const click4 = frame >= 220 && frame <= 235 ? interpolate(frame, [220, 227, 235], [1, 0.8, 1]) : 1; // ES
    const click5 = frame >= 265 && frame <= 280 ? interpolate(frame, [265, 272, 280], [1, 0.8, 1]) : 1; // DE
    const click6 = frame >= 310 && frame <= 325 ? interpolate(frame, [310, 317, 325], [1, 0.8, 1]) : 1; // IT
    const click7 = frame >= 355 && frame <= 370 ? interpolate(frame, [355, 362, 370], [1, 0.8, 1]) : 1; // PT
    const click8 = frame >= 400 && frame <= 415 ? interpolate(frame, [400, 407, 415], [1, 0.8, 1]) : 1; // ZH
    const clickFS = frame >= 490 && frame <= 505 ? interpolate(frame, [490, 497, 505], [1, 0.8, 1]) : 1; // FS
    const clickX = frame >= 660 && frame <= 675 ? interpolate(frame, [660, 667, 675], [1, 0.8, 1]) : 1; // Click X

    const generalClickScale = click1 * click2 * click3 * click4 * click5 * click6 * click7 * click8 * clickFS * clickX;

    // Rotate to Landscape (-90deg), Phone shrinks
    const rotateAnim = spring({ frame: Math.max(0, frame - 570), fps, config: { damping: 12, mass: 1.2 } });
    const landscapeProgress = rotateAnim;

    // As explicitly requested, the black bars and vertical center video happen in exactly ONE frame.
    const fsProgress = Math.max(0, (frame >= 520 ? 1 : 0));
    
    // Scale removed to use exact geometric bounding tracking instead
    // 3D Angles
    const rotX = interpolate(landscapeProgress, [0, 1], [2, 0]);
    const rotY = interpolate(landscapeProgress, [0, 1], [-12, 0]);
    const rotZ = interpolate(landscapeProgress, [0, 1], [0, -90]);
    const transX = interpolate(landscapeProgress, [0, 1], [250, 0]);
    const transY = interpolate(landscapeProgress, [0, 1], [0, -180]);
    const phoneScaleAnim = interpolate(landscapeProgress, [0, 1], [baseScale, baseScale * 0.95]);

    const normalVidW = phoneW * 0.92; // Largeur à 92% pour une petite marge
    const vidTopPosition = 115 + 8; // mt-2 (8px), un peu plus haut
    const vidH = normalVidW * (9/16);

    // Text block position variables
    const textLeftAnim = interpolate(landscapeProgress, [0, 1], [5, 5]); 
    const textWidthAnim = interpolate(landscapeProgress, [0, 1], [45, 90]);
    const textTransY = interpolate(landscapeProgress, [0, 1], [0, 360]); // move down
    const textScaleAnim = interpolate(landscapeProgress, [0, 1], [1, 0.85]); 
    const textOpacityAnim = interpolate(landscapeProgress, [0, 0.4], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const title2Opacity = interpolate(landscapeProgress, [0.1, 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const title2TransY = interpolate(landscapeProgress, [0, 1], [150, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Pinch to zoom 21:9
    const zoomAnim = spring({ frame: Math.max(0, frame - 600), fps, config: { damping: 14 } });
    const zoomScale = interpolate(zoomAnim, [0, 1], [1, 1.32]);
    
    // Touch interface for the pinch
    const touchOpacity = interpolate(frame, [580, 600, 640, 655], [0, 0.5, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const touchSpread = interpolate(zoomAnim, [0, 1], [40, 180]);

    // Show 'Mode Portrait Requis' screen
    const portraitRequisEnter = spring({ frame: Math.max(0, frame - 680), fps, config: { damping: 14 } });
    const modeRequisOpacity = portraitRequisEnter;

    // Cursor visibility
    const cursorOpacity = interpolate(frame, [0, 50, 410, 411, 660, 670, 690, 710], [0, 1, 1, 0, 0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    let cursorX = 200;
    let cursorY = 800;

    let currentLang = 'fr';
    if (frame >= 407) currentLang = 'ja';
    else if (frame >= 362) currentLang = 'zh';
    else if (frame >= 317) currentLang = 'de';
    else if (frame >= 272) currentLang = 'it';
    else if (frame >= 227) currentLang = 'es';
    else if (frame >= 182) currentLang = 'en';

    // Synchronize hover state accurately with pointer fly movements
    let hoverLang = '';
    if (frame >= 470) hoverLang = ''; // pointer leaves menu
    else if (frame >= 390) hoverLang = 'ja';
    else if (frame >= 345) hoverLang = 'zh';
    else if (frame >= 300) hoverLang = 'de';
    else if (frame >= 255) hoverLang = 'it';
    else if (frame >= 210) hoverLang = 'es';
    else if (frame >= 160) hoverLang = 'en';

    let stageX = interpolate(fly1, [0, 1], [300, 303]); // Base CC Icon (further left and higher)
    let stageY = interpolate(fly1, [0, 1], [600, 311]);
    
    // The user wants the cursor to stay on the CC icon in the video screen at frame 162
    // So we don't move it to the bottom tab bar!
    stageX = interpolate(fly2, [0, 1], [stageX, 303]); // Stay on CC icon
    stageY = interpolate(fly2, [0, 1], [stageY, 311]); 

    // Y position inside the popup menu (bottom right of app)
    // The menu is 315px tall (7 items * 45px), parent has 24px bottom padding, so bottom is phoneH - 84.
    stageX = interpolate(fly3, [0, 1], [stageX, 380]); // 380 is verified as 'mieux' horizontally
    stageY = interpolate(fly3, [0, 1], [stageY, phoneH - 365.5]);  // 'en' (Encore plus haut)

    stageY = interpolate(fly4, [0, 1], [stageY, phoneH - 320.5]); // 'es'
    stageY = interpolate(fly5, [0, 1], [stageY, phoneH - 275.5]); // 'it'
    stageY = interpolate(fly6, [0, 1], [stageY, phoneH - 230.5]); // 'de'
    stageX = interpolate(fly7, [0, 1], [stageX, 380]); // 'zh' on aligne avec English à 380
    stageY = interpolate(fly7, [0, 1], [stageY, phoneH - 185.5]); // 'zh' rabaissé pour s'aligner exactement avec l'espacement de 45px
    
    stageY = interpolate(fly8, [0, 1], [stageY, phoneH - 116.5]); // 'ja'

    stageX = interpolate(fly8b, [0, 1], [stageX, 360]); 
    stageY = interpolate(fly8b, [0, 1], [stageY, phoneH - 390]); 

    stageX = interpolate(fly9, [0, 1], [stageX, 404]); // Move to FS icon (video player right, further right and higher)
    stageY = interpolate(fly9, [0, 1], [stageY, 315]); 

    // Moving Cursor to X (TopRight in player = BottomRight on actual device screen while rotated 90deg)
    // Device screen center: PhoneW/2, PhoneH/2
    // TopRight mapping in 90deg: dx = 204, dy = 451.5
    const exitLandX = (phoneW / 2) + 204;
    const exitLandY = (phoneH / 2) + 400; // Almost bottom right quadrant of screen

    const flyExitToX = spring({ frame: Math.max(0, frame - 630), fps, config: { damping: 14 } }); // Move to X in landscape
    cursorX = interpolate(flyExitToX, [0, 1], [stageX, exitLandX]);
    cursorY = interpolate(flyExitToX, [0, 1], [stageY, exitLandY]);

    const RenderSubtitleMenu = () => {
        // Only show when the menu is active
        if (frame < 140 || frame > 415) return null; 

        const langs = ['fr', 'en', 'es', 'it', 'de', 'zh', 'ja'];
        const labels: any = { fr: 'Français', en: 'English', es: 'Español', it: 'Italiano', de: 'Deutsch', zh: '中文', ja: '日本語' };
        const flags: any = { fr: 'flag-fr.svg', en: 'flag-gb.svg', es: 'flag-es.svg', it: 'flag-it.svg', de: 'flag-de.svg', zh: 'flag-cn.svg', ja: 'flag-jp.svg' };

        return (
            <div className="absolute right-0 bottom-[60px] w-[150px] bg-white backdrop-blur-xl rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[200]">
                {langs.map((lang) => {
                    const isActive = currentLang === lang;
                    const isHovered = hoverLang === lang;
                    return (
                        <div key={lang} className={`flex items-center gap-4 px-4 py-3 border-b border-slate-50 last:border-0 transition-colors ${isHovered ? 'bg-slate-100/80' : ''}`}>
                            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100/50">
                                <img src={staticFile(flags[lang])} alt={lang} className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-[13px] font-medium leading-none transition-colors ${isActive ? 'text-[#F27D33]' : 'text-slate-600'}`}>{labels[lang]}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Let's create an exact visual match of the video layout
    const SubtitleRenderer = () => {
        // Only show subtitles during specific frames
        if (frame < 120) return null;
        let text = "";
        let widthStr = "max-w-[85%]";
        let size = "text-[12px]";
        let padStr = "px-4 py-1.5";

        if (fsProgress > 0.5) {
            size = "text-[15px] md:text-[18px]";
            widthStr = "max-w-[85%] sm:max-w-[70%]";
            padStr = "px-5 py-2";
        }

        if (currentLang === 'fr') {
            text = "Synchronique entre notochorde et la mise en place du Mésoderme...";
        } else if (currentLang === 'en') {
            text = "Synchronic relationship between notochord and the mesoderm placement...";
        } else if (currentLang === 'es') {
            text = "Relación sincrónica entre la notocorda y la colocación del mesodermo...";
        } else if (currentLang === 'zh') {
            text = "脊索与中胚层放置之间的同步关系...";
        } else if (currentLang === 'it') {
            text = "Relazione sincronica tra la notocorda e il posizionamento del mesoderma...";
        } else if (currentLang === 'de') {
            text = "Synchrone Beziehung zwischen der Chorda dorsalis und der Platzierung des Mesoderms...";
        } else if (currentLang === 'pt') {
            text = "Relação sincrônica entre a notocorda e a colocação do mesoderma...";
        } else if (currentLang === 'ja') {
            text = "脊索と中胚葉の配置間の同期関係...";
        }

        return (
            <div className="absolute inset-x-0 bottom-[12%] w-full flex justify-center pointer-events-none z-[100]">
                <div className={`${widthStr} bg-white/95 text-slate-700 ${padStr} rounded-[20px] shadow-lg border border-slate-200/50 text-center backdrop-blur-md`}>
                    <p className={`font-sans font-semibold leading-snug tracking-wide ${size}`}>
                        {text}
                    </p>
                </div>
            </div>
        );
    }

    const angleDeg = interpolate(landscapeProgress, [0, 1], [0, 90]);
    const rotCos = Math.abs(Math.cos(angleDeg * Math.PI / 180));
    const rotSin = Math.abs(Math.sin(angleDeg * Math.PI / 180));
    const dynamicW = phoneW * rotCos + phoneH * rotSin;
    const dynamicH = phoneH * rotCos + phoneW * rotSin;

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center font-sans overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* SOUND DESIGN: CLICS */}
            {[75, 130, 175, 220, 265, 310, 355, 400, 490, 660].map((clickFrame) => (
                <Sequence name="Bruitage - click.wav" key={clickFrame} from={fpsS(clickFrame, realFps)} durationInFrames={fpsS(15, realFps)}>
                    <Audio src={staticFile('click.wav')} />
                </Sequence>
            ))}

            {/* Context & Deco on the Left Background */}
            <div 
                className="absolute top-1/2 flex flex-col z-0 p-8 gap-4"
                style={{
                    left: `${textLeftAnim}%`,
                    width: `${textWidthAnim}%`,
                    alignItems: landscapeProgress > 0.5 ? 'center' : 'flex-start',
                    textAlign: (landscapeProgress > 0.5 ? 'center' : 'left') as any,
                    transform: `translate(0px, calc(-50% + ${textTransY}px)) scale(${textScaleAnim})`,
                    opacity: Math.min(1, Math.max(0, (frame - 30) / 30)) * textOpacityAnim
                }}
            >
                <div className="font-handwriting text-[#5A9C51] text-[65px] font-bold drop-shadow-sm leading-none rotate-[-3deg] mb-2">
                    Option
                </div>
                <h2 className="font-bebas text-[#4171B5] text-[100px] leading-[0.95] tracking-wider drop-shadow-sm uppercase">
                    SOUS-TITRES<br/>
                    <span className="text-[75px] text-[#4171B5]/80">EN 7 LANGUES</span>
                </h2>
                <div className="font-anton text-white bg-[#F27D33] text-[35px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white mt-4 rotate-[1deg]">
                    ET MODE PLEIN ÉCRAN
                </div>
                <p 
                    className="font-sans text-[26px] text-slate-500 font-medium leading-snug mt-6 border-slate-300"
                    style={{
                        borderLeftWidth: landscapeProgress > 0.5 ? 0 : 4,
                        paddingLeft: landscapeProgress > 0.5 ? 0 : 24,
                    }}
                >
                    Basculer le format d'affichage pour une parfaite immersion.
                </p>
            </div>

            {/* Title for Landscape Mode */}
            <div 
                className="absolute flex flex-col z-0 p-8 gap-4 justify-center items-center w-full"
                style={{
                    bottom: '10%',
                    opacity: title2Opacity,
                    transform: `translateY(${title2TransY}px)`,
                }}
            >
                <div className="font-handwriting text-[#5A9C51] text-[65px] font-bold drop-shadow-sm leading-none rotate-[-2deg] mb-2">
                    Immersion totale
                </div>
                <h2 className="font-bebas text-[#4171B5] text-[110px] leading-[0.95] tracking-wider drop-shadow-sm uppercase">
                    MODE PLEIN ÉCRAN
                </h2>
            </div>

            {/* 3D Scene Wrapper (The iPhone) */}
            <div 
                className="relative flex items-center justify-center z-10"
                style={{ 
                    width: phoneW,
                    height: phoneH,
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    // The translation to the right, and 3D angle
                    transform: `translate(${transX}px, ${transY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${phoneScaleAnim})`,
                    transition: 'transform 0.1s linear'
                }}
            >
                {/* iPhone Depth Bezel */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                        key={`layer-${i}`}
                        className="absolute inset-0 bg-[#1e293b] rounded-[45px] border border-slate-700 pointer-events-none"
                        style={{ transform: `translateZ(${-i - 1}px)` }}
                    />
                ))}

                {/* iPhone Frame */}
                <div 
                    className="absolute inset-0 bg-black rounded-[45px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
                    style={{ 
                        border: `12px solid #1E293B`,
                        outline: `4px solid #0F172A`,
                    }}
                >
                    {/* Screen Container */}
                    <div className="absolute inset-0 w-full h-full bg-[#FAF6ED] rounded-[33px] overflow-hidden flex flex-col">
                        
                        {/* NORMAL UI MODE */}
                        <div 
                            className="absolute inset-0 flex flex-col"
                            style={{
                                opacity: interpolate(fsProgress, [0, 0.1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                            }}
                        >
                            {/* iOS Status Bar */}
                            <div className="flex justify-between items-start px-6 pt-4 pb-2 text-black font-semibold text-[15px] z-50">
                                <span className="mt-1 font-bold tracking-tight">15:55</span>
                                <div className="flex gap-1.5 items-center text-black mt-1">
                                    <Wifi size={18} strokeWidth={2.5} />
                                    <BatteryFull size={22} strokeWidth={2} />
                                </div>
                            </div>

                            {/* Navbar Tabs */}
                            <div className="w-full flex justify-between px-2 pt-1 bg-[#FAF6ED] pb-3 border-b border-slate-200 shrink-0">
                                <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 transition-colors bg-[#FAF6ED] text-[#1e293b] border-transparent`}>
                                    <span className="text-[10px] font-bebas tracking-wide uppercase">L'ECTODERME</span>
                                    <span className={`text-[9px] font-semibold mt-0.5 text-slate-500`}>9H 5M</span>
                                </div>
                                <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 transition-colors bg-[#FAF6ED] text-[#1e293b] border-transparent`}>
                                    <span className="text-[10px] font-bebas tracking-wide uppercase">L'ENDODERME</span>
                                    <span className={`text-[9px] font-semibold mt-0.5 text-slate-500`}>5H 43M</span>
                                </div>
                                <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 bg-[#F27D33] text-white border-[#db712e] shadow-md`}>
                                    <span className="text-[10px] font-bebas tracking-wide uppercase">LE MÉSODERME</span>
                                    <span className={`text-[9px] font-semibold mt-0.5 text-orange-100`}>4H 56M</span>
                                </div>
                                <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 transition-colors bg-[#FAF6ED] text-[#1e293b] border-transparent`}>
                                    <span className="text-[10px] font-bebas tracking-wide uppercase">L'OEIL</span>
                                    <span className={`text-[9px] font-semibold mt-0.5 text-slate-500`}>4H 2M</span>
                                </div>
                            </div>

                            <div className="w-[92%] mx-auto mt-2 mb-3 relative shrink-0 aspect-video bg-[#FAF6ED] flex flex-col justify-end">
                                {/* The actual background hole for the video - video is absolute anyway */}
                            </div>

                            {/* Controls below video (restored per user request to not forget them) */}
                            <div className="w-full flex justify-between items-center px-4 py-2 border-t border-b border-slate-200 bg-[#FAF6ED]" style={{height: 48, zIndex: 10, position: 'relative'}}>
                                <div className="flex gap-2">
                                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded shadow-sm border border-[#F27D33]/30 text-[#F27D33] bg-[#F27D33]/10`}>x1</span>
                                    <span className="text-[12px] font-bold px-2.5 py-1 rounded border border-slate-200 text-slate-500 bg-[#FAF6ED]">x1.25</span>
                                </div>
                                <div className="flex border border-slate-200 rounded-[10px] overflow-hidden bg-[#FAF6ED] shadow-sm">
                                    <div className="px-6 py-1.5 border-r border-slate-200 text-slate-400"><ChevronLeft size={18} strokeWidth={2.5}/></div>
                                    <div className="px-6 py-1.5 text-slate-700"><ChevronRight size={18} strokeWidth={2.5}/></div>
                                </div>
                                <div className="p-1.5 border border-slate-200 rounded-full bg-[#FAF6ED] shadow-sm text-slate-500 relative">
                                    <CloudDownload size={18} strokeWidth={2.5} />
                                </div>
                            </div>



                            {/* CONTENT BELOW VIDEO (Title, Toggles, Transcript) */}
                            <div 
                                className="flex-1 flex flex-col bg-[#FAF6ED] px-4 pt-3 overflow-hidden relative z-0"
                            >
                                {/* Title Row */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200 relative">
                                    <h3 className="font-bebas text-[#F27D33] text-[15px] tracking-wide leading-none mt-1">
                                        04- MISE EN PLACE DU MESODERME ET LA NOTOCHORDE
                                    </h3>
                                    <div className="flex items-center gap-2 relative z-50">
                                        <span className="text-slate-500 text-[11px] font-semibold">03:43</span>
                                        <div className="px-[5px] py-[2px] border border-slate-200 rounded text-slate-500 bg-white font-sans text-[10px] uppercase font-semibold tracking-wide shadow-xs relative">
                                            {currentLang}
                                        </div>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="flex bg-slate-100 rounded-lg p-1 mt-3 mb-4 mx-auto w-[90%]">
                                    <div className="flex-1 bg-white shadow-sm rounded-md py-1.5 text-center text-slate-800 text-[11px] font-semibold">
                                        Résumé
                                    </div>
                                    <div className="flex-1 py-1.5 text-center text-slate-500 text-[11px] font-medium">
                                        Re-transcription interactive
                                    </div>
                                </div>

                                {/* Transcript Text (Gris sur fond blanc) */}
                                <div className="flex-1 bg-white rounded-t-2xl p-4 shadow-sm border border-slate-100 mb-[70px] overflow-hidden">
                                    <p className="text-slate-500 text-[12px] leading-relaxed font-medium">
                                        {currentLang === 'fr' && "Cette vidéo vous guide à travers le processus fascinant de la mise en place du mésoderme et du rôle crucial de la notochorde dans le développement embryonnaire. Vous apprendrez comment ces structures interagissent au niveau cellulaire, notamment grâce à la ligne primitive et aux cellules en bouteille, entraînant la formation du tissu mésenchymateux primitif. De plus, vous explorerez des aspects pratiques en lien avec le coccyx, en découvrant comment les impulsions et les champs biomagnétiques influencent cette dynamique. Idéal pour approfondir vos connaissances en embryologie biodynamique."}
                                        {currentLang === 'en' && "This video guides you through the fascinating process of mesoderm placement and the crucial role of the notochord in embryonic development. You will learn how these structures interact at the cellular level, notably through the primitive streak and bottle cells, leading to the formation of primitive mesenchymal tissue. Furthermore, you will explore practical aspects related to the coccyx, discovering how impulses and biomagnetic fields influence this dynamic. Ideal for deepening your knowledge of biodynamic embryology."}
                                        {currentLang === 'es' && "Este video te guía a través del fascinante proceso de la colocación del mesodermo y el papel crucial de la notocorda en el desarrollo embrionario. Aprenderás cómo estas estructuras interactúan a nivel celular, notablemente a través de la línea primitiva y las células en botella, lo que lleva a la formación del tejido mesenquimatoso primitivo. Además, explorarás aspectos prácticos relacionados con el cóccix, descubriendo cómo los impulsos y los campos biomagnéticos influyen en esta dinámica. Ideal para profundizar tus conocimientos en embriología biodinámica."}
                                        {currentLang === 'it' && "Questo video ti guida attraverso l'affascinante processo del posizionamento del mesoderma e il ruolo cruciale della notocorda nello sviluppo embrionale. Imparerai come queste strutture interagiscono a livello cellulare, in particolare attraverso la stria primitiva e le cellule a bottiglia, portando alla formazione del tessuto mesenchimatico primitivo. Inoltre, esplorerai aspetti pratici legati al coccige, scoprendo come gli impulsi e i campi biomagnetici influenzano questa dinamica. Ideale per approfondire le tue conoscenze in embriologia biodinamica."}
                                        {currentLang === 'de' && "Dieses Video führt Sie durch den faszinierenden Prozess der Mesodermplatzierung und die entscheidende Rolle der Chorda dorsalis in der Embryonalentwicklung. Sie werden lernen, wie diese Strukturen auf zellulärer Ebene interagieren, insbesondere durch den Primitivstreifen und die Flaschenzellen, was zur Bildung von primitivem mesenchymatösen Gewebe führt. Darüber hinaus werden Sie praktische Aspekte in Bezug auf das Steißbein erkunden und entdecken, wie Impulse und biomagnetische Felder diese Dynamik beeinflussen. Ideal zur Vertiefung Ihrer Kenntnisse in der biodynamischen Embryologie."}
                                        {currentLang === 'zh' && "本视频将指导您了解中胚层放置的迷人过程以及脊索在胚胎发育中的关键作用。您将了解这些结构如何在细胞层面上相互作用，特别是通过原条和瓶状细胞，从而导致原始间充质组织的形成。此外，您将探索与尾骨相关的实践方面，发现脉冲和生物磁场如何影响这种动态。非常适合加深您对生物动力学胚胎学的知识。"}
                                        {currentLang === 'ja' && "このビデオは、中胚葉の配置という魅力的なプロセスと、胚発生における脊索の重要な役割について説明します。これらの構造が細胞レベルでどのように相互作用するか、特に原条とボトル細胞の働きがどのようにして原始間葉組織の形成につながるかを学びます。さらに、尾骨に関連する実践的な側面を探り、インパルスと生体磁場がこのダイナミクスにどのように影響するかを発見します。バイオダイナミック発生学の知識を深めるのに最適です。"}
                                    </p>
                                </div>
                            </div>

                            {/* 8. Bottom Navigation */}
                            <nav className="absolute inset-x-0 bottom-0 bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 pb-[24px] pt-2 flex justify-between px-1 z-40">
                                <div className="flex flex-col items-center flex-1 text-slate-500"><Home size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Accueil</span></div>
                                <div className="flex flex-col items-center flex-1 text-slate-500"><Clock size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Chronolo...</span></div>
                                <div className="flex flex-col items-center flex-1 text-slate-800"><VideoIcon size={22} strokeWidth={2.5} /><span className="text-[10px] font-bold mt-1">Vidéos</span></div>
                                <div className="flex flex-col items-center flex-1 text-slate-500"><Brain size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Assistant ...</span></div>
                                <div className="flex flex-col items-center flex-1 text-[#e11d48]"><LogOut size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Quitter</span></div>
                                <div className="flex flex-col items-center flex-1 text-slate-500 relative">
                                    {(() => {
                                        const tabFlags: any = { fr: 'flag-fr.svg', en: 'flag-gb.svg', es: 'flag-es.svg', it: 'flag-it.svg', de: 'flag-de.svg', zh: 'flag-cn.svg', ja: 'flag-jp.svg' };
                                        return (
                                            <>
                                                <div className="w-[20px] h-[20px] rounded-full border border-slate-200 overflow-hidden relative mb-0.5 flex shrink-0 items-center justify-center bg-white">
                                                    <img src={staticFile(tabFlags[currentLang] || 'flag-fr.svg')} alt={currentLang} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-[10px] font-medium mt-1 uppercase">{currentLang}</span>
                                            </>
                                        );
                                    })()}

                                    <RenderSubtitleMenu />
                                </div>
                            </nav>

                        </div>

                        {/* UNIVERSAL ABSOLUTE VIDEO CONTAINER (Animates cleanly to full screen) */}
                                          {/* FULL SCREEN LANDSCAPE MODE PLAYER CONTAINER */}
                                <div 
                                    className="absolute bg-black flex items-center justify-center overflow-hidden z-[60]"
                                    style={{
                                        // initially tracks normal video, then expands
                                        boxShadow: landscapeProgress > 0 ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                        left: '50%',
                                        top: interpolate(Math.max(fsProgress, landscapeProgress), [0, 1], [vidTopPosition + vidH/2, phoneH/2]),
                                        width: landscapeProgress > 0 ? dynamicW + 2 : interpolate(fsProgress, [0, 1], [normalVidW, phoneW]),
                                        height: landscapeProgress > 0 ? dynamicH + 2 : interpolate(fsProgress, [0, 1], [vidH, phoneH]),
                                        transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
                                        borderRadius: Math.max(0, interpolate(fsProgress, [0, 1], [14 * baseScale, 33])),
                                    }}
                                >
                            <Video 
                                src={staticFile('MESODERME_4.m4v')} 
                                className="object-contain" 
                                style={{ 
                                    width: '100%',
                                    height: '100%',
                                    transform: `scale(${zoomScale})`
                                }} 
                            />
                        </div> {/* END OF MAGIC MASK VIDEO CONTAINER */}

                        {/* UNIVERSAL ABSOLUTE UI CONTAINER (Matches exact phone dimensions so UI doesn't fly off-screen) */}
                        <div 
                            className="absolute flex items-center justify-center pointer-events-none z-[70]"
                            style={{
                                left: '50%',
                                top: Math.max(0, interpolate(Math.max(fsProgress, landscapeProgress), [0, 1], [vidTopPosition + vidH/2, phoneH/2])),
                                width: landscapeProgress > 0 ? dynamicW : interpolate(fsProgress, [0, 1], [normalVidW, phoneW]),
                                height: landscapeProgress > 0 ? dynamicH : interpolate(fsProgress, [0, 1], [vidH, phoneH]),
                                transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
                                borderRadius: Math.max(0, interpolate(fsProgress, [0, 1], [14 * baseScale, 33])),
                                overflow: 'hidden',
                            }}
                        >
                            
                            {/* The Controls Overlay (Visible in Normal + Visible in Fullscreen Landscape) */}
                            {fsProgress < 0.5 && (
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
                            )}
                            
                            {/* Normal UI Overlay */}
                            <div 
                                className="absolute pointer-events-none w-full h-full flex flex-col justify-end pb-3 px-3 z-30"
                                style={{ opacity: interpolate(fsProgress, [0, 0.1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}
                            >
                                <SubtitleRenderer />
                                <div className="w-full relative z-20">
                                    <div className="flex justify-between items-center text-white font-sans text-[11px] mb-2 font-medium">
                                        <span>0:00</span>
                                        <div className="flex-1 mx-3 h-[4px] bg-white/30 rounded-full relative">
                                            <div className="absolute top-0 left-0 bg-[#F27D33] h-full w-[20%] rounded-full"></div>
                                            <div className="absolute top-1/2 -translate-y-1/2 w-[12px] h-[12px] border-2 border-white bg-[#F27D33] rounded-full shadow" style={{ left: '20%' }}></div>
                                        </div>
                                        <span>3:43</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white">
                                        <div className="flex gap-4 items-center">
                                            <RotateCcw size={16} />
                                            <Play size={22} fill="white" />
                                            <RotateCw size={16} />
                                        </div>
                                        <div className="flex gap-4 items-center relative z-50 mr-4">
                                            <div className="relative flex items-center justify-center p-2 rounded transition-colors text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={frame >= 75 ? 'text-white' : 'text-white/40'}>
                                                    <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                                                    <path d="M10 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                                    <path d="M17 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                                    {frame < 75 && <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" stroke="currentColor" />}
                                                </svg>
                                                {frame >= 75 && <div className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full" style={{ bottom: '4px', backgroundColor: '#F27D33' }} />}
                                            </div>
                                            <div className="text-white p-2">
                                                {fsProgress > 0.5 ? <Minimize2 size={22} /> : <Maximize size={22} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* CC and Progress Overlay for FullScreen Mode */}
                            <div 
                                className="absolute pointer-events-none flex flex-col justify-between pb-8 pt-4 px-6 z-30 opacity-0"
                                style={{ 
                                    opacity: fsProgress > 0.8 ? 1 : 0,
                                    top: 0, left: 0, right: 0, bottom: 0
                                }}
                            >
                                {/* Top Controls */}
                                <div className="w-full flex justify-between items-start">
                                    <div className="flex-1" />
                                    {/* Center Volume Pill */}
                                    <div className="bg-black/90 rounded-full flex items-center px-4 py-2.5 backdrop-blur-md border border-white/5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 mr-12"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                        <div className="flex gap-[3px]">
                                            <div className="w-[3px] h-[3px] bg-white/30 rounded-full" />
                                            <div className="w-[3px] h-[3px] bg-white/30 rounded-full" />
                                            <div className="w-[3px] h-[3px] bg-white/30 rounded-full" />
                                            <div className="w-[3px] h-[3px] bg-white/30 rounded-full" />
                                            <div className="w-[3px] h-[3px] bg-white/30 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex justify-end">
                                        {/* Close Button */}
                                        <div className="bg-black/50 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg relative">
                                            <X size={18} />
                                            {/* Ripple effect specifically for X click */}
                                            {clickX < 1 && (
                                                <div 
                                                    className="absolute inset-0 bg-white/40 rounded-full"
                                                    style={{ 
                                                        transform: `scale(${interpolate(clickX, [0.8, 1], [1, 1.8])})`, 
                                                        opacity: interpolate(clickX, [0.8, 1], [1, 0]) 
                                                    }} 
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full">
                                    <SubtitleRenderer />
                                
                                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none -z-10" />
                                    
                                    <div className="relative z-20 flex justify-between items-center text-white/90 font-sans text-xs mb-3 font-medium">
                                        <span>{landscapeProgress > 0.5 ? "0:12" : "0:00"}</span>
                                        <div className="flex-1 mx-4 h-[4.5px] bg-[#FAF6ED]/30 rounded-full relative">
                                            <div className="absolute top-0 left-0 bg-[#5A9C51] h-full rounded-full" style={{ width: landscapeProgress > 0.5 ? '35%' : '20%' }} />
                                            <div className="absolute top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-[#FAF6ED] rounded-full shadow" style={{ left: landscapeProgress > 0.5 ? '35%' : '20%' }} />
                                        </div>
                                        <span>3:43</span>
                                    </div>
                                    <div className="relative z-20 flex justify-between items-center text-white mb-1">
                                        <div className="flex gap-4 sm:gap-6 items-center">
                                            <RotateCcw size={20} />
                                            <Play size={24} fill="white" className="-ml-1" />
                                            <RotateCw size={20} className="-ml-1" />
                                        </div>
                                        <div className="flex gap-4 sm:gap-6 items-center relative">
                                            <div className="relative flex items-center justify-center p-2 rounded text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                                    <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                                                    <path d="M10 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                                    <path d="M17 14.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3"></path>
                                                </svg>
                                                <div className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full" style={{ bottom: '4px', backgroundColor: '#5A9C51' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MODE PORTRAIT REQUIS (Fades in over everything when exited full screen but still landscape) */}
                        <div 
                            className="absolute inset-0 z-[100] bg-[#FAF6ED] flex flex-col items-center justify-center p-8 text-center"
                            style={{ opacity: modeRequisOpacity }}
                        >
                            <div className="flex flex-col items-center justify-center" style={{ transform: 'rotate(90deg)' }}>
                                <div className="text-[#F2A374]">
                                    {/* Using an inline SVG for the Rotating Tablet Icon */}
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

                    {/* Persistent Dynamic Island Layer */}
                    <div className="absolute top-0 w-full flex justify-between items-start px-6 pt-4 text-black font-semibold text-lg z-[200] pointer-events-none" style={{ fontSize: 16 }}>
                        <span className="mt-1">11:15</span>
                        <div className="w-[124px] h-[34px] bg-black rounded-full relative shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_0_4px_rgba(0,0,0,0.5)] flex items-center justify-between px-3 mt-0.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#111] border border-[#222] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#111]"></div>
                        </div>
                        <div className="flex gap-2 items-center text-black mt-1">
                            <Wifi size={18} />
                            <BatteryFull size={22} />
                        </div>
                    </div>

                    {/* Touch Indicators for Pinch Zoom (moved inside phone) */}
                    <div 
                        className="absolute z-[300] pointer-events-none"
                        style={{
                            opacity: touchOpacity,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(90deg)', // align with landscape
                            width: phoneH, // spread across the length
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{ transform: `translateX(-${touchSpread}px)` }} className="w-12 h-12 bg-white/40 rounded-full border-2 border-white/80 shadow-lg backdrop-blur-sm" />
                        <div style={{ transform: `translateX(${touchSpread}px)` }} className="w-12 h-12 bg-white/40 rounded-full border-2 border-white/80 shadow-lg backdrop-blur-sm" />
                    </div>

                    {/* Simulated Mouse Pointer (moved inside phone) */}
                    <div 
                        className="absolute left-0 top-0 z-[300] pointer-events-none drop-shadow-xl"
                        style={{
                            opacity: cursorOpacity,
                            transform: `translate(${cursorX}px, ${cursorY}px) rotate(-10deg) scale(${generalClickScale})`
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="#333" strokeWidth="1.5">
                            <path d="M4 3l7 19l4 -8l8 -4z" />
                        </svg>
                    </div>

                </div>
            </div>
            
        </AbsoluteFill>
    );
};
