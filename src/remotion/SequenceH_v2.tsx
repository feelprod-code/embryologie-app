import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, Easing, staticFile, Audio, Sequence } from 'remotion';
import { Wifi, BatteryFull, Play, Home, Clock, Video as VideoIcon, Brain, LogOut, ChevronLeft, ChevronRight, CloudDownload, Maximize, RotateCcw, RotateCw, Trash2, Check, VideoOff, LoaderCircle } from 'lucide-react';
import { fpsS } from './hooks/useTime';

const POINTER_STEPS = [
  { frame: 550, x: 150, y: -50 },  // descends from TOP over Endoderme
  { frame: 610, x: 150, y: 55 },   // slowly arrives at ENDODERME tab
  { frame: 625, x: 150, y: 55 },   // CLICK ENDODERME!
  { frame: 655, x: 250, y: 55 },   // moves to MESODERME tab
  { frame: 670, x: 250, y: 55 },   // CLICK MESODERME!
  { frame: 700, x: 50, y: 55 },    // moves to ECTODERME tab
  { frame: 715, x: 50, y: 55 },    // CLICK ECTODERME!
  { frame: 740, x: 50, y: 55 },    // stay on ECTODERME
  { frame: 785, x: 363, y: 329 },  // arrive exactly on center of download button
  { frame: 805, x: 363, y: 329 },  // CLICK download button
  { frame: 840, x: 280, y: 460 },  // move away completely
  { frame: 950, x: 363, y: 329 },  // arrive exactly on center of trash button
  { frame: 970, x: 363, y: 329 },  // CLICK trash
  { frame: 990, x: 363, y: 329 },  // hold briefly
  { frame: 1020, x: 363, y: 329 }, // hold and fade out on spot
];

function getNavPointerPosition(frame: number, fps: number) {
  let prevStep = { frame: 850, x: 260, y: 800 }; 
  for (let i = 0; i < POINTER_STEPS.length; i++) {
    const step = POINTER_STEPS[i];
    if (frame < step.frame) {
      const progress = Math.max(0, Math.min(1, spring({ frame: frame - prevStep.frame, fps, config: { damping: 14, mass: 0.8 } })));
      return {
        x: interpolate(progress, [0, 1], [prevStep.x, step.x]),
        y: interpolate(progress, [0, 1], [prevStep.y, step.y]),
      };
    }
    prevStep = step;
  }
  return prevStep;
}

function getClickScale(frame: number) {
  const clicks = [625, 670, 715, 805, 970];
  for (const clickFrame of clicks) {
    if (frame >= clickFrame - 5 && frame < clickFrame + 15) {
      const progress = frame - (clickFrame - 5);
      return interpolate(progress, [0, 5, 20], [1, 0.8, 1], { extrapolateRight: 'clamp' });
    }
  }
  return 1;
}

export const SequenceH: React.FC = () => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    const phoneScale = 1.1;
    const phoneW = 400 * phoneScale;
    const phoneH = 850 * phoneScale;
    const borderRadius = 45 * phoneScale;

    // --- TIMINGS ---
    // Total Sequence Duration: 347 frames (adjusted down by 53 frames to match SequenceG's end)
    // 0 -> 30: Cursor flies from Scrubber to Top Tab "L'OEIL"
    // 30: Click "L'OEIL" Tab
    // 30 -> 60: Tab changes color. Video Title & Duration changes. 
    //           Phone Shifts Right (250) to Left (-250).
    //           Right side text (Ressources Intégrées) appears.
    // 60 -> 90: Cursor flies to Transcript area.
    // 90 -> 300: Transcript scrolls & highlights.
    // 300 -> 347: Hold end position.

    const shiftProgress = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 14 } });
    
    // UI Layout morphs - permanently in Audio mode for this sequence
    const videoBlockHeight = 0;
    const videoBlockOpacity = 0;
    const audioBlockHeight = 100;
    const audioBlockOpacity = 1;

    // PHASE 2 & 3
    const navTransition = spring({ frame: Math.max(0, frame - 530), fps, config: { damping: 14, mass: 0.8 } });

    // Master Pivot and Shift
    const phase1X = interpolate(shiftProgress, [0, 1], [250, -250]);
    const currentX = interpolate(navTransition, [0, 1], [phase1X, 350]);

    const phoneRotateYPhase1 = interpolate(shiftProgress, [0, 1], [-6, 8]); 
    const finalRotateY = interpolate(navTransition, [0, 1], [phoneRotateYPhase1, -25]); 
    const phoneRotateXPhase1 = 2;
    const finalRotateX = interpolate(navTransition, [0, 1], [phoneRotateXPhase1, 5]);

    // Right Text Fades In, Left Text Fades Out
    const rightTextFadeIn = interpolate(shiftProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' });
    const finalRightTextOpacity = interpolate(navTransition, [0, 0.5], [rightTextFadeIn, 0], { extrapolateRight: 'clamp' });
    const finalRightTextX = interpolate(navTransition, [0, 1], [0, 500]);

    const leftTextFadeOut = interpolate(shiftProgress, [0, 0.5], [1, 0], { extrapolateRight: 'clamp' });

    // New Text on the Left ("NAVIGATION SIMPLIFIÉE") — instant CUT at frame 780
    // Phase 1: zoom to left (720→755). Fast pivot after Ectoderme.
    const zoomToLeft = interpolate(frame, [720, 755], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    
    // Left text: disappears instant CUT at 720 (start of zoom)
    const newLeftTextOpacity = frame < 720 ? interpolate(navTransition, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' }) : 0;
    const newLeftTextX = Math.min(0, interpolate(navTransition, [0, 1], [-500, 0]));

    // Right text about offline download — smoothly fades in as phone stabilizes
    const downloadTextOpacity = interpolate(frame, [755, 770], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const downloadTextX = 0;

    // BIG MAGNIFIER BUBBLE (STATIC EFFECT)
    const magOpacity = interpolate(frame, [755, 765, 1000, 1020], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const magScaleIn = spring({ frame: Math.max(0, frame - 755), fps, config: { damping: 12, mass: 0.8, stiffness: 150 } });
    
    // The bubble stays in the empty space on the right of the screen
    const magX = 1060;
    const magY = 350;
    const magScale = magScaleIn;
    const floatY = 0; // Pas de ballottement

    // Phone Screen Opacity (Crossfade between Old UI and Nav UI)
    const oldUIOpacity = Math.max(0, interpolate(navTransition, [0.1, 0.5], [1, 0]));
    const newUIOpacity = Math.max(0, interpolate(navTransition, [0.5, 1], [0, 1]));

    // Nav category clicks (faster timing)
    const isClick1 = frame >= 625;
    const isClick2 = frame >= 670;
    const isClick3 = frame >= 715;

    let navCategory = "oeil"; 
    if (isClick3) navCategory = "ectoderme";
    else if (isClick2) navCategory = "mesoderme";
    else if (isClick1) navCategory = "endoderme";

    // Ectoderme video cycling (instant switch to video index 2 at frame 715)
    let ectoVideoIndex = 0;
    if (frame >= 715) ectoVideoIndex = 2;

    // Ectoderme video data
    const ECTO_VIDEOS = [
        { title: "01- INTRODUCTION", duration: "04:33" },
        { title: "02- LA NEURULATION", duration: "12:15" },
        { title: "03- CHRONOLOGIE DES DIFFÉRENTS SYSTÈMES", duration: "07:33" },
    ];

    // Download phase: 0=idle, 1=33%, 2=66%, 3=100%, 4=hover/trash, 5=idle again
    let downloadPhase = 0;
    if (frame >= 970) downloadPhase = 5;       // back to idle (CloudDownload)
    else if (frame >= 905) downloadPhase = 4;  // hover state -> trash icon
    else if (frame >= 875) downloadPhase = 3;  // loaded -> check pop
    else if (frame >= 840) downloadPhase = 2;  // 66%
    else if (frame >= 805) downloadPhase = 1;  // 33%

    const navPointerPos = getNavPointerPosition(frame, fps);
    const navPointerScale = getClickScale(frame);
    const showNavPointer = frame > 540;
    let pointerEntryOpacity = 0;
    if (frame < 716) {
        pointerEntryOpacity = interpolate(frame, [540, 580], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    } else if (frame >= 730 && frame <= 850) {
        pointerEntryOpacity = interpolate(frame, [730, 750, 830, 850], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    } else if (frame >= 920) {
        pointerEntryOpacity = interpolate(frame, [920, 940, 990, 1010], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    }
    
    // Video Expand logic
    const videoExpand = spring({ frame: Math.max(0, frame - 580), fps, config: { damping: 14, mass: 0.8 } });
    const videoOpacity = interpolate(videoExpand, [0.5, 1], [0, 1]);

    // Video Title and Time Morph
    const title = shiftProgress > 0.5 ? "04- MISE EN PLACE DE L'OEIL" : "05- INFLUENCE NOTOCHORDE";
    const totalTimeStr = shiftProgress > 0.5 ? "08:39" : "03:50";
    
    // Tab Colors - OEIL is constantly yellow, Ectoderme constantly white
    const ectoTabBg = 0; // 0=White
    const oeilTabBg = 1; // 1=Yellow

    // --- Cursor & Interaction Logic ---
    let cursorX = 800; 
    let cursorY = 800;
    let finalCursorScale = 1;    // Audio Progress (0.0 to 1.0)
    let audioProgress = shiftProgress > 0.5 ? 0.0 : 0.65; // Reset to 0 when Oeil starts
    
    // Swiping animation broken into 3 parts for perfect fluid control:
    // 1. Fast start to reach the first drawing quickly (frames 90 to 160)
    const progressSegment1 = interpolate(frame, [90, 160], [0, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
    // 2. Slow, constant scroll to read the drawings (frames 160 to 740)
    const progressSegment2 = interpolate(frame, [160, 740], [0, 0.60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    // 3. Fluid stop at the bottom (frames 740 to 820)
    const progressSegment3 = interpolate(frame, [740, 820], [0, 0.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
    
    const swipeProgress = Math.min(1, progressSegment1 + progressSegment2 + progressSegment3);
    
    // Smooth vertical scroll translation for right content
    const fly1 = spring({ frame: Math.max(0, frame), fps, config: { damping: 14 } }); 
    const click1 = 1 - (spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 14 } }) * 0.2) + (spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 14 } }) * 0.2);

    // Pointer cursor fades out after clicking L'OEIL
    const pointerOpacity = interpolate(frame, [45, 60], [1, 0], { extrapolateRight: 'clamp' });

    if (frame < 60) {
        // Fly from Video Toggle to Previous Video Button (ChevronLeft)
        // Starts exactly where SequenceG left it (408, 480)
        cursorX = interpolate(fly1, [0, 1], [408, 15]); 
        cursorY = interpolate(fly1, [0, 1], [480, 190]);
        finalCursorScale = click1;
    } else {
        // Pointer hides, we stop moving it around
        cursorX = 15;
        cursorY = 190;
    }

    // --- Hand Swiping Logic ---
    // The HAND fades in, does a long swipe, then fades out softly
    const handX = interpolate(shiftProgress, [0, 1], [400, 150]); // Center-ish of the phone
    const swipeDistance = -900; // Extremely slow big drag visually on the screen
    // handY is unused but kept for compatibility
    const handYActual = interpolate(swipeProgress, [0, 1], [650, 650 + swipeDistance]); 
    const handOpacity = interpolate(frame, [75, 90, 740, 760], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const handScale = interpolate(swipeProgress, [0, 0.2, 0.8, 1], [1.1, 0.95, 0.95, 1.1]) * 1.1;

    // --- Transcript Scrolling Logic ---
    // Long scroll to reveal schemas
    const maxScroll = -4200; // Increased massively to ensure we see the very bottom of the 5th schema, but moving faster
    
    if (frame > 90) {
        // Scroll deep enough to reveal all 5 schemas
        audioProgress = interpolate(swipeProgress, [0, 1], [0.0, 1.0], { extrapolateRight: 'clamp' });
    }
    const transcriptY = shiftProgress > 0.5 ? interpolate(swipeProgress, [0, 1], [0, maxScroll]) : 0;

    // Scrubber Time math 
    const currentSeconds = interpolate(audioProgress, [0, 1], [0, shiftProgress > 0.5 ? 519 : 285]); // 8*60+39=519s, 4*60+45=285s
    const m = Math.floor(currentSeconds / 60);
    const s = Math.floor(currentSeconds % 60).toString().padStart(2, '0');
    const currentScrubberTimeStr = `${m}:${s}`;

    // Highlighter Helper
    const Highlighter = ({ min, max, children }: { min: number, max: number, children: React.ReactNode }) => {
        const active = audioProgress > min && audioProgress <= max;
        // Text changes color when it's reached or fully past
        const past = audioProgress > max;
        return (
            <span 
                className={`${active ? 'bg-yellow-200/60 text-slate-900 border-b-[3px] border-yellow-400 shadow-sm px-1 rounded-t -mx-1 align-baseline' : ''} ${past || active ? 'text-slate-800' : 'text-slate-500'} transition-all duration-300 leading-loose`}
            >
                {children}
            </span>
        );
    };

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center overflow-hidden">
            
            {/* SOUND DESIGN: CLICS */}
            {[25, 625, 670, 715, 805, 970].map((clickFrame) => (
                <Sequence name="Bruitage - click.wav" key={clickFrame} from={fpsS(clickFrame, realFps)} durationInFrames={fpsS(15, realFps)}>
                    <Audio src={staticFile('click.wav')} />
                </Sequence>
            ))}

            {/* TEXT ON THE RIGHT (Fades IN, then Out at navTransition) */}
            <div 
                className="absolute right-[8%] flex flex-col items-end text-right justify-center h-full w-[38%] z-0 p-8 gap-4" 
                style={{ opacity: finalRightTextOpacity, transform: `translateX(${finalRightTextX}px)` }}
            >
                <div className="font-handwriting text-[#5A9C51] text-[60px] font-bold drop-shadow-sm leading-none rotate-[-3deg] mb-2">
                    Retrouvez vos repères
                </div>
                <h2 className="font-bebas text-[#4171B5] text-[95px] leading-[0.95] tracking-wider drop-shadow-sm uppercase">
                    Ressources
                    <br />
                    Intégrées
                </h2>
                <div className="font-anton text-white bg-[#F27D33] text-[35px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white mt-3 rotate-[1deg]">
                    SCHÉMAS
                </div>
                <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug mt-5 border-r-4 border-slate-300 pr-6 max-w-lg text-right">
                    La transcription s'enrichit automatiquement des schémas évoqués.
                    <br />
                    Visionnez les repérages anatomiques directement intégrés dans le texte.
                </p>
            </div>

            {/* TEXT ON THE LEFT (Fades OUT initially) */}
            <div 
                className="absolute left-[5%] flex flex-col items-start justify-center h-full w-[45%] z-0 p-8 gap-4 pointer-events-none"
                style={{ opacity: leftTextFadeOut }}
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

            {/* NEW TEXT ON THE LEFT (Fades IN at navTransition) */}
            <div 
                className="absolute left-[8%] flex flex-col items-start justify-center h-full w-[42%] z-0 p-8 gap-4"
                style={{ opacity: newLeftTextOpacity, transform: `translateX(${newLeftTextX}px)` }}
            >
                <div className="font-handwriting text-[#F27D33] text-[65px] font-bold drop-shadow-sm leading-none rotate-[-4deg] mb-2">
                    Plus qu'un simple lecteur...
                </div>
                <h2 className="font-bebas text-[#5A9C51] text-[105px] leading-[0.85] tracking-wider drop-shadow-sm uppercase">
                    NAVIGATION
                    <br />
                    SIMPLIFIÉE
                </h2>
                <div className="font-anton text-white bg-[#4171B5] text-[35px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white mt-4 -rotate-[2deg] self-start inline-block">
                    FLUIDE ET RAPIDE
                </div>
                <p className="font-sans text-[28px] text-slate-600 font-medium leading-snug mt-6 border-l-4 border-[#F27D33] pl-6 max-w-xl">
                    Passez d'un chapitre à l'autre en un instant et parcourez tout le corpus embryologique librement.
                </p>
            </div>

            {/* NEW RIGHT TEXT — "TÉLÉCHARGEMENT HORS-LIGNE" (Fades IN during zoom) */}
            <div 
                className="absolute right-[6%] flex flex-col items-end text-right justify-center h-full w-[40%] z-0 p-8 gap-4"
                style={{ opacity: downloadTextOpacity, transform: `translateX(${downloadTextX}px)` }}
            >
                <div className="font-handwriting text-[#4171B5] text-[60px] font-bold drop-shadow-sm leading-none rotate-[3deg] mb-2">
                    Emportez tout avec vous
                </div>
                <h2 className="font-bebas text-[#F27D33] text-[95px] leading-[0.9] tracking-wider drop-shadow-sm uppercase">
                    HORS-LIGNE
                    <br />
                    & ACCESSIBLE
                </h2>
                <div className="font-anton text-white bg-[#5A9C51] text-[35px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white mt-3 -rotate-[2deg]">
                    TÉLÉCHARGEMENT
                </div>
                <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug mt-5 border-r-4 border-[#4171B5] pr-6 max-w-lg text-right">
                    Téléchargez les vidéos pour y accéder sans connexion.
                    <br />
                    Révisez partout, même sans réseau.
                </p>
            </div>

            {/* THE PHONE CONTAINER WITH MASTER TRANSFORM */}
            <div 
                className="absolute"
                style={{ 
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: `${interpolate(zoomToLeft, [0, 1], [currentX - (phoneW/2), -580])}px`,
                    marginTop: `-${phoneH/2}px`,
                    width: phoneW,
                    height: phoneH,
                    backgroundColor: '#1E293B',
                    borderRadius: borderRadius,
                    border: `${12 * phoneScale}px solid #1E293B`,
                    outline: `${4 * phoneScale}px solid #0F172A`,
                    boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(0,0,0,1)',
                    transform: `perspective(1400px) rotateX(${interpolate(zoomToLeft, [0, 1], [finalRotateX, 2])}deg) rotateY(${interpolate(zoomToLeft, [0, 1], [finalRotateY, 12])}deg) scale(${interpolate(zoomToLeft, [0, 1], [1, 1.55])}) rotateZ(0deg)`,
                    transformStyle: 'preserve-3d',
                    fontFamily: 'sans-serif'
                }}
            >
                <div 
                    className="absolute inset-0 bg-[#FAF6ED]"
                    style={{ 
                        borderRadius: Math.max(0, borderRadius - (12 * phoneScale)),
                        overflow: 'hidden', 
                        WebkitMaskImage: '-webkit-radial-gradient(white, black)' 
                    }}
                >
                    <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ opacity: oldUIOpacity, width: '100%', height: '100%' }}>
                
                {/* 1. iOS Status Bar (Invisible spacer to preserve height for pointer coords) */}
                <div className="flex justify-between items-center px-6 py-4 opacity-0 pointer-events-none" style={{ fontSize: 16 * phoneScale }}>
                    <span>11:15</span>
                    <div className="w-[120px] h-[32px]" /> 
                    <div className="flex gap-2 items-center text-black">
                        <Wifi size={18 * phoneScale} />
                        <BatteryFull size={22 * phoneScale} />
                    </div>
                </div>

                {/* 2. Top Tabs */}
                <div className="flex px-4 pt-2 pb-4 gap-2 border-b border-slate-100 bg-[#FAF6ED]">
                    {/* L'ECTODERME TAB */}
                    <div 
                        className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl border overflow-hidden"
                        style={{
                            backgroundColor: `rgba(${245 + (255-245)*(1-ectoTabBg)}, ${197 + (255-197)*(1-ectoTabBg)}, ${68 + (255-68)*(1-ectoTabBg)}, 1)`,
                            borderColor: `rgba(${237 + (241-237)*(1-ectoTabBg)}, ${189 + (245-189)*(1-ectoTabBg)}, ${63 + (249-63)*(1-ectoTabBg)}, 1)`,
                            boxShadow: ectoTabBg > 0.5 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase whitespace-nowrap drop-shadow-sm" style={{ color: ectoTabBg > 0.5 ? 'white' : '#1e293b' }}>L'ECTODERME</span>
                        <span className="text-[9px] font-semibold mt-0.5" style={{ color: ectoTabBg > 0.5 ? 'rgba(255,255,255,0.9)' : '#64748b' }}>9H 5M</span>
                    </div>

                    {/* L'ENDODERME TAB */}
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden">
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 tracking-tight uppercase whitespace-nowrap">L'ENDODERME</span>
                        <span className="text-[9px] text-slate-500 font-semibold mt-0.5">5H 43M</span>
                    </div>

                    {/* LE MÉSODERME TAB */}
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden">
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 tracking-tight uppercase whitespace-nowrap">LE MÉSODERME</span>
                        <span className="text-[9px] text-slate-500 font-semibold mt-0.5">4H 56M</span>
                    </div>

                    {/* L'OEIL TAB */}
                    <div 
                        className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl border overflow-hidden"
                        style={{
                            backgroundColor: `rgba(${255 + (245-255)*oeilTabBg}, ${255 + (197-255)*oeilTabBg}, ${255 + (68-255)*oeilTabBg}, 1)`,
                            borderColor: `rgba(${241 + (237-241)*oeilTabBg}, ${245 + (189-245)*oeilTabBg}, ${249 + (63-249)*oeilTabBg}, 1)`,
                            boxShadow: oeilTabBg > 0.5 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase whitespace-nowrap" style={{ color: oeilTabBg > 0.5 ? 'white' : '#1e293b' }}>L'OEIL</span>
                        <span className="text-[9px] font-semibold mt-0.5" style={{ color: oeilTabBg > 0.5 ? 'rgba(255,255,255,0.9)' : '#64748b' }}>4H 2M</span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col bg-[#FAF6ED] relative">
                    
                    {/* AUDIO MODE BLOCK */}
                    <div style={{ height: audioBlockHeight, opacity: audioBlockOpacity, overflow: 'hidden' }} className="shrink-0 flex flex-col bg-[#FAF6ED] border-b border-slate-100 justify-center">
                        <div className="px-4 py-3">
                            {/* Title Row */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[#facc15] font-bebas text-[18px] tracking-wider uppercase mt-1 leading-none">{title}</h2>
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
                                    <span className="w-[30px] text-left tabular-nums">{totalTimeStr}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VIDEO MODE BLOCK (Hidden) */}
                    <div style={{ height: videoBlockHeight, opacity: videoBlockOpacity, overflow: 'hidden' }} className="shrink-0 flex flex-col relative bg-[#FAF6ED]">
                    </div>

                    {/* 6. Tabs for Transcript */}
                    <div className="px-4 py-3 bg-[#FAF6ED] shrink-0 border-b border-transparent relative z-20">
                        <div className="flex items-center relative gap-1 bg-white p-[5px] rounded-[12px] shadow-sm border border-slate-200/50">
                            <div className={`flex-1 flex justify-center py-2.5 rounded-[8px] text-[13px] transition-all duration-300 pointer-events-none font-medium text-slate-500`}>
                                Résumé
                            </div>
                            <div className={`flex-1 flex justify-center py-2.5 rounded-[8px] text-[13px] transition-all duration-300 pointer-events-none bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100 text-slate-800 font-bold`}>
                                Re-transcription interactive
                            </div>
                            
                            <div className="absolute right-0 -top-5 flex items-center gap-1.5 mr-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-[11px] font-medium text-slate-500">Auto</span>
                            </div>
                        </div>
                    </div>

                    {/* 7. Transcript Text Area (REAL TEXT FROM OEIL-04) */}
                    {shiftProgress > 0.5 ? (
                    <div className="flex-1 px-5 pt-3 relative overflow-hidden bg-[#FAF6ED]">
                        <div 
                            style={{ transform: `translateY(${transcriptY}px)` }} 
                            className="absolute w-[calc(100%-40px)] space-y-4 pt-1 transition-transform duration-[50ms]"
                        >
                            <h1 className="font-bebas text-[30px] leading-[1] text-[#1e293b] tracking-wider mb-5 uppercase mt-1">
                                Mise en place de l'œil
                            </h1>
                            
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.00} max={0.08}>L'<strong>endoderme</strong> est un épithélium, tandis que le <strong>mésoderme</strong> est un tissu conjonctif. Il est essentiel de comprendre l'équilibre entre ces deux grands types de tissus : un tissu d'intérieur et un tissu d'extérieur. Par exemple, l'épithélium digestif, bien qu'il soit à l'intérieur, agit comme un tissu de limite.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.08} max={0.15}>Le précurseur de la <strong>gouttière neurale</strong> et de la <strong>plaque neurale</strong> est la <strong>notochorde</strong>. Ce processus d'évagination dans un axe longitudinal est en rapport avec la <strong>ligne primitive</strong>, qui constitue l'axe primitif du corps. Cet axe est crucial car il organise les cellules en fonction de leur espace, de leur temps et de leur devenir.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.15} max={0.23}>Au 18ème jour, la plaque neurale se développe, et la troisième cavité, celle du <strong>cellome externe</strong>, apparaît. Ce changement de polarité et la réorganisation de l'axe créent la ligne primitive par un champ d'aspiration de la zone caudale, qui « aspire » l'information. Ce phénomène est accompagné de mouvements appelés <strong>perméation</strong> et <strong>infusion</strong>.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.23} max={0.31}>Le mouvement de perméation, un grand mouvement métabolique, se produit autour de l'embryon, faisant avancer la <strong>cavité amniotique</strong>. On distingue ainsi la cavité amniotique, la cavité viteline et un tissu appelé <strong>épiblaste</strong>, qui donnera le futur système nerveux, tandis que le tissu en dessous formera le futur système digestif.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.31} max={0.38}>Ce mouvement provoque un changement de forme de la notochorde, qui prend une forme en S. Cette croissance différentielle est liée à la polarité. L'axe primitif organise le tissu épithélial, qui réagit par des phénomènes d'induction et d'inhibition en relation avec la notochorde.</Highlighter>
                            </p>
                            <div className="my-8">
                                <div className="rounded-[18px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/50 bg-white">
                                    <Img 
                                        src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_2.jpeg" 
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <p className="text-[13px] italic font-medium text-slate-500 mt-3 text-center">Croissance différentielle</p>
                            </div>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.38} max={0.46}>La plaque neurale évolue pour devenir une <strong>gouttière neurale</strong>, qui enferme du liquide céphalo-rachidien, ou plutôt du liquide amniotique primitif.</Highlighter>
                            </p>
                            <div className="my-8">
                                <div className="rounded-[18px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/50 bg-white">
                                    <Img 
                                        src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_5.jpeg" 
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <p className="text-[13px] italic font-medium text-slate-500 mt-3 text-center">Liquide amniotique primitif</p>
                            </div>
                            <div className="my-8">
                                <div className="rounded-[18px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/50 bg-white">
                                    <Img 
                                        src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_4.jpeg" 
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <p className="text-[13px] italic font-medium text-slate-500 mt-3 text-center">Formation de la gouttière neurale</p>
                            </div>
                            <div className="my-8">
                                <div className="rounded-[18px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/50 bg-white">
                                    <Img 
                                        src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_3.jpeg" 
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <p className="text-[13px] italic font-medium text-slate-500 mt-3 text-center">Transformation de la plaque neurale en gouttière neurale</p>
                            </div>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.46} max={0.54}>La fermeture de cette gouttière forme un <strong>tube neural</strong>. Les <strong>crêtes neurales</strong>, considérées comme un quatrième tissu embryonnaire, jouent un rôle crucial dans le développement de l'œil.</Highlighter>
                            </p>
                            <div className="my-8">
                                <div className="rounded-[18px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/50 bg-white">
                                    <Img 
                                        src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_6.png" 
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <p className="text-[13px] italic font-medium text-slate-500 mt-3 text-center">Fermeture pour former le tube neural et la formation des crêtes neurales</p>
                            </div>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.54} max={0.62}>La notochorde est essentielle pour la mise en place de l'œil. Sans une notochorde équilibrée, il est impossible d'avoir un œil stable. De même, un sacrum libre est nécessaire pour garantir la stabilité du cerveau. Il est donc fondamental de rééquilibrer le sacrum pour assurer une bonne verticalité.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.62} max={0.69}>L'embryon présente la cavité amniotique, la cavity viteline et le disque didermique, qui s'organisent autour de l'axe notocordal et du tube neural. La formation de ce tube neural implique la fermeture de la cavité amniotique et de la cavité viteline.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.69} max={0.77}>Au fur et à mesure que l'axe longitudinal de l'embryon se développe, l'ébauche du cerveau se forme et se ferme au centre de l'embryon, laissant un vestige en haut. C'est dans cet espace que se développe la <strong>placode cristalline</strong>, qui formera l'œil.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.77} max={0.85}>Avant la fermeture du tube neural, un phénomène d'induction se produit pour former la notochorde, qui est à la base du développement cortical. De ce développement émergera l'œil, qui est une expansion d'un système ventriculaire rempli de liquide céphalorachidien. L'œil peut être considéré comme une sphère liquidienne, un filtre subtil pour les photons et un équilibrage de l'espace environnant.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                <Highlighter min={0.85} max={0.92}>Il est possible de rééquilibrer l'œil en travaillant sur une zone spécifique, souvent affectée par des <strong>whiplash</strong>. Ces whiplash peuvent être d'origine émotionnelle ou physique. Traiter un whiplash implique de restaurer les mouvements de <strong>séphalisation</strong>, <strong>cardialisation</strong>, <strong>diaphragmatisation</strong> et <strong>hépatisation</strong>, qui sont essentiels pour le développement embryonnaire.</Highlighter>
                            </p>
                            <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-24 font-sans">
                                <Highlighter min={0.92} max={1.00}>L'émergence de l'œil commence avec le premier battement cardiaque, vers le 22ème jour. La première transformation cellulaire épiblastique se produit en synchronisation avec ces battements cardiaques primitifs, établissant une correspondance significative entre le développement de l'œil et l'activité cardiaque.</Highlighter>
                            </p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-[#FAF6ED] via-[#FAF6ED]/80 to-transparent pointer-events-none" />
                    </div>
                    ) : (
                    <div className="flex-1 px-5 pt-3 relative overflow-hidden bg-[#FAF6ED]">
                            <div 
                                style={{ transform: `translateY(-180px)` }} 
                                className="absolute w-[calc(100%-40px)] space-y-4 pt-1"
                            >
                                <h1 className="font-bebas text-[30px] leading-[1] text-[#1e293b] tracking-wider mb-5 uppercase mt-1">
                                    Influence de la notochorde<br/>sur le développement embryonnaire
                                </h1>
                                <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-4 font-sans">
                                    <Highlighter min={0.0} max={0.16}>La <b className={audioProgress >= 0.0 ? 'text-[#1e293b]' : ''}>notochorde</b> joue un rôle crucial dans le développement embryonnaire, influençant notamment le <b className={audioProgress >= 0.0 ? 'text-[#1e293b]' : ''}>tube neural</b>.</Highlighter>
                                    {" "}
                                    <Highlighter min={0.16} max={0.30}>Il est essentiel de comprendre que cette notochorde émet des signaux, appelés <b className={audioProgress >= 0.16 ? 'text-[#1e293b]' : ''}>systèmes sonétiques S-hatch</b>,</Highlighter>
                                    {" "}
                                    <Highlighter min={0.30} max={0.42}>qui incluent des éléments comme la <b className={audioProgress >= 0.30 ? 'text-[#1e293b]' : ''}>40A</b> et la <b className={audioProgress >= 0.30 ? 'text-[#1e293b]' : ''}>40T</b>.</Highlighter>
                                    {" "}
                                    <Highlighter min={0.42} max={0.60}>Ces phénomènes d'induction sont significatifs, notamment en ce qui concerne le <b className={audioProgress >= 0.42 ? 'text-[#1e293b]' : ''}>bêta-carotène</b> et les <b className={audioProgress >= 0.42 ? 'text-[#1e293b]' : ''}>vitamines A</b>,</Highlighter>
                                    {" "}
                                    <Highlighter min={0.60} max={0.80}>qui sont intégrées avec la 40T et sont vitales pour le développement de l'<b className={audioProgress >= 0.60 ? 'text-[#1e293b]' : ''}>œil</b>. L'<b className={audioProgress >= 0.60 ? 'text-[#1e293b]' : ''}>acide rétinoïque</b> est également important à ce stade, impliquant de grands gènes.</Highlighter>
                                </p>

                                <p className="text-[14px] leading-relaxed text-slate-500 font-normal pb-10 font-sans">
                                    <Highlighter min={0.80} max={0.90}>Imaginez un axe central autour duquel se développe le tube neural.</Highlighter>
                                    {" "}
                                    <Highlighter min={0.90} max={1.05}>Cet axe notochordal fournit des informations par un <b className={audioProgress >= 0.90 ? 'text-[#1e293b]' : ''}>champ électromagnétique</b> de position,</Highlighter>
                                    {" "}
                                    <Highlighter min={1.05} max={1.25}>agissant comme un <b className={audioProgress >= 1.05 ? 'text-[#1e293b]' : ''}>GPS</b> pour les cellules environnantes, ce qui entraîne la réaction de diverses <b className={audioProgress >= 1.05 ? 'text-[#1e293b]' : ''}>protéines</b>. Par exemple, les yeux se développeront à un endroit précis, tandis que d'autres</Highlighter>
                                </p>
                            </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-[#FAF6ED] via-[#FAF6ED]/80 to-transparent pointer-events-none" />
                    </div>
                    )}
                </div>

                {/* 8. Bottom Navigation */}
                <nav className="absolute bottom-0 w-full bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 pb-[24px] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] flex justify-between px-2 pt-3 z-40">
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
                </nav>

                </div>

                {/* NEW NAVIGATION UI COMPONENT (Fades in) */}
                {newUIOpacity > 0 && (
                <div className="absolute inset-0 flex flex-col pointer-events-none bg-[#FAF6ED] font-sans" style={{ opacity: newUIOpacity, zIndex: 10 }}>
                    {/* Spacer to push video down, avoiding the absolute Dynamic Island */}
                    <div className="h-[48px] bg-[#FAF6ED] shrink-0" />

                    {/* Navbar Tabs using Exact styling from screenshots */}
                    <div className="w-full flex justify-between px-2 pt-2 bg-[#FAF6ED] pb-3 border-b border-slate-200 shrink-0">
                        <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 transition-colors ${navCategory === 'ectoderme' ? 'bg-[#5A9C51] text-white border-[#4d8645]' : 'bg-[#FAF6ED] text-[#1e293b] border-transparent'}`}>
                            <span className="text-[10px] font-bebas tracking-wide uppercase">L'ECTODERME</span>
                            <span className={`text-[9px] font-semibold mt-0.5 ${navCategory === 'ectoderme' ? 'text-green-100' : 'text-slate-500'}`}>9H 5M</span>
                        </div>
                        <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 transition-colors ${navCategory === 'endoderme' ? 'bg-[#4171B5] text-white border-[#38629c]' : 'bg-[#FAF6ED] text-[#1e293b] border-transparent'}`}>
                            <span className="text-[10px] font-bebas tracking-wide uppercase">L'ENDODERME</span>
                            <span className={`text-[9px] font-semibold mt-0.5 ${navCategory === 'endoderme' ? 'text-blue-100' : 'text-slate-500'}`}>5H 43M</span>
                        </div>
                        <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 transition-colors ${navCategory === 'mesoderme' ? 'bg-[#F27D33] text-white border-[#db712e]' : 'bg-[#FAF6ED] text-[#1e293b] border-transparent'}`}>
                            <span className="text-[10px] font-bebas tracking-wide uppercase">LE MÉSODERME</span>
                            <span className={`text-[9px] font-semibold mt-0.5 ${navCategory === 'mesoderme' ? 'text-orange-100' : 'text-slate-500'}`}>4H 56M</span>
                        </div>
                        <div className={`flex-1 flex flex-col items-center justify-center py-[9px] mx-1 rounded-sm border-b-4 transition-colors ${navCategory === 'oeil' ? 'bg-[#F2B729] text-white border-[#dca625]' : 'bg-[#FAF6ED] text-[#1e293b] border-transparent'}`}>
                            <span className="text-[10px] font-bebas tracking-wide uppercase">L'OEIL</span>
                            <span className={`text-[9px] font-semibold mt-0.5 ${navCategory === 'oeil' ? 'text-yellow-100' : 'text-slate-500'}`}>4H 2M</span>
                        </div>
                    </div>

                    {/* Video Area containing Video Header and Title below */}
                    {/* Container for Video / Audio Dynamic Switch */}
                    <div className="w-full flex flex-col relative shrink-0">

                        {/* 1. EXPANDING VIDEO BLOCK (Fades in, Expands height) */}
                        <div 
                           className="w-[96%] mx-auto relative overflow-hidden flex flex-col justify-end shadow-sm"
                           style={{ height: interpolate(videoExpand, [0, 1], [0, 264]), opacity: videoOpacity }}
                        >
                            {/* Fake Video Player 16:9 */}
                            <div className="w-full bg-slate-800 rounded-[14px] relative overflow-hidden flex flex-col justify-between" style={{ height: 216 }}>
                                {(navCategory === 'endoderme' || navCategory === 'oeil') && (
                                    <Img src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_2.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                )}
                                {navCategory === 'ectoderme' && ectoVideoIndex === 0 && (
                                    <Img src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_2.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                )}
                                {navCategory === 'ectoderme' && ectoVideoIndex === 1 && (
                                    <Img src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_5.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                )}
                                {navCategory === 'ectoderme' && ectoVideoIndex === 2 && (
                                    <Img src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_3.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                )}
                                {navCategory === 'mesoderme' && (
                                    <Img src="https://eqcjgucfpmhvxkckokwb.supabase.co/storage/v1/object/public/schemas/images/schemas/oeil/oeil-4/Oeil_5.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                )}
                                <div className="w-full text-white text-[12px] flex justify-between p-3 z-10 font-sans mt-auto border-t border-white/20 bg-gradient-to-t from-black/60 pt-6">
                                    <span>0:00</span>
                                    <div className="flex-1 px-3 flex items-center">
                                        <div className="w-full h-[6px] bg-white/30 rounded-full relative">
                                            <div className="absolute top-0 left-0 h-full rounded-full w-[10%]" style={{backgroundColor: navCategory === 'ectoderme' ? '#5A9C51' : navCategory === 'endoderme' ? '#4171B5' : navCategory === 'oeil' ? '#F2B729' : '#F27D33'}} />
                                            <div className="w-[14px] h-[14px] rounded-full absolute top-1/2 -translate-y-1/2 -ml-2 shadow border-[3px] border-white" style={{left: '10%', backgroundColor: navCategory === 'ectoderme' ? '#5A9C51' : navCategory === 'endoderme' ? '#4171B5' : navCategory === 'oeil' ? '#F2B729' : '#F27D33'}} />
                                        </div>
                                    </div>
                                    <span>{navCategory === 'ectoderme' ? ECTO_VIDEOS[ectoVideoIndex].duration : navCategory === 'mesoderme' ? "03:43" : navCategory === 'oeil' ? "08:39" : "24:00"}</span>
                                </div>
                                <div className="flex items-center justify-between text-white p-3 z-10 pb-4 h-[44px] bg-gradient-to-t from-black/80">
                                    <div className="flex gap-5 items-center text-white">
                                        <RotateCcw size={16} strokeWidth={2.5}/> 
                                        <Play size={20} fill="white"/> 
                                        <RotateCw size={16} strokeWidth={2.5}/>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <Maximize size={18} strokeWidth={2.5}/>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Middle Controls (Speed, Nav, Cloud) that slide under the video when complete */}
                            <div className="w-full flex justify-between items-center px-4 py-2 border-t border-slate-200 bg-[#FAF6ED]" style={{height: 44}}>
                                <div className="flex gap-2">
                                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded shadow-sm border ${navCategory === 'ectoderme' ? 'border-[#5A9C51]/30 text-[#5A9C51] bg-[#5A9C51]/10' : navCategory === 'endoderme' ? 'border-[#4171B5]/30 text-[#4171B5] bg-[#4171B5]/10' : navCategory === 'oeil' ? 'border-[#F2B729]/30 text-[#F2B729] bg-yellow-50' : 'border-[#F27D33]/30 text-[#F27D33] bg-[#F27D33]/10'}`}>x1</span>
                                    <span className="text-[12px] font-bold px-2.5 py-1 rounded border border-slate-200 text-slate-500 bg-[#FAF6ED]">x1.25</span>
                                </div>
                                <div className="flex border border-slate-200 rounded-[10px] overflow-hidden bg-[#FAF6ED] shadow-sm">
                                    <div className="px-5 py-1.5 border-r border-slate-200 text-slate-400"><ChevronLeft size={18} strokeWidth={2.5}/></div>
                                    <div className="px-5 py-1.5 text-slate-700"><ChevronRight size={18} strokeWidth={2.5}/></div>
                                </div>
                                <div className="p-1.5 border border-slate-200 rounded-full bg-[#FAF6ED] shadow-sm text-slate-500 relative">
                                    {downloadPhase === 0 && <CloudDownload size={18} strokeWidth={2.5} />}
                                    {downloadPhase >= 1 && downloadPhase <= 2 && (
                                        <div className="relative w-[18px] h-[18px] flex items-center justify-center">
                                            <LoaderCircle size={18} strokeWidth={2.5} className="text-slate-400 animate-[spin_2s_linear_infinite]" />
                                        </div>
                                    )}
                                    {downloadPhase === 3 && (() => {
                                        const checkPop = spring({ frame: Math.max(0, frame - 875), fps, config: { damping: 10, mass: 0.5 } });
                                        const checkScale = interpolate(checkPop, [0, 0.5, 1], [0.5, 1.4, 1]);
                                        return <Check size={18} className="text-[#10B981]" strokeWidth={3} style={{ transform: `scale(${checkScale})` }} />;
                                    })()}
                                    {downloadPhase === 4 && <Trash2 size={18} strokeWidth={2.5} className="text-red-500" />}
                                    {downloadPhase === 5 && <CloudDownload size={18} strokeWidth={2.5} className="text-slate-500" />}
                                </div>
                            </div>
                        </div>

                        {/* Title & Camera Icon — tight below controls */}
                        <div className="px-4 py-2 flex justify-between items-center shrink-0" style={{color: navCategory === 'ectoderme' ? '#5A9C51' : navCategory === 'endoderme' ? '#4171B5' : navCategory === 'oeil' ? '#F2B729' : '#F27D33'}}>
                                {/* Title and Time */}
                                <h2 className="font-bebas text-[18px] tracking-wider my-0 leading-none flex items-center gap-3">
                                    {navCategory === 'ectoderme' ? ECTO_VIDEOS[ectoVideoIndex].title : navCategory === 'mesoderme' ? "04- MISE EN PLACE DU MESODERME" : navCategory === 'oeil' ? "04- MISE EN PLACE DE L'OEIL" : "05- RÉVISIONS"}
                                    <span className="text-slate-500 font-sans font-semibold text-[15px] tracking-normal mt-[1px]">
                                        {navCategory === 'ectoderme' ? ECTO_VIDEOS[ectoVideoIndex].duration : navCategory === 'mesoderme' ? "03:43" : navCategory === 'oeil' ? "08:39" : "24:00"}
                                    </span>
                                </h2>
                                {/* Camera Icon */}
                                <div className="p-1.5 border border-slate-200/50 rounded-lg bg-[#FAF6ED] shadow-sm flex items-center justify-center shrink-0">
                                    {(() => {
                                        const isClickingCamera = frame >= 575 && frame <= 595;
                                        const cameraIconScale = isClickingCamera ? interpolate(frame, [575, 580, 595], [1, 1.3, 1]) : 1;
                                        const cameraColor = isClickingCamera ? '#3B82F6' : '#94A3B8';
                                        
                                        if (videoExpand > 0.5) {
                                            return <VideoOff size={18} color={cameraColor} style={{ transform: `scale(${cameraIconScale})` }} />;
                                        }
                                        return <VideoIcon size={18} color={cameraColor} style={{ transform: `scale(${cameraIconScale})` }} />;
                                    })()}
                                </div>
                        </div>
                            
                        {/* AUDIO PLAYER UI (Fades out, Collapses) */}
                        <div style={{ height: interpolate(videoExpand, [0, 1], [56, 0]), opacity: interpolate(videoExpand, [0, 0.2], [1, 0]), overflow: 'hidden' }} className="flex flex-col shrink-0">
                                {/* The pill-shaped player control */}
                                <div className="mx-4 bg-[#FAF6ED] rounded-[24px] border border-slate-200/50 shadow-sm flex items-center px-4 py-1.5 h-[44px] gap-3">
                                    <ChevronLeft size={16} className="text-slate-400" />
                                    <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-[#1e293b] shadow-sm shrink-0">
                                        <Play size={13} fill="white" className="ml-0.5 text-white" />
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400" />
                                    
                                    <span className="text-[11px] font-semibold text-slate-500 ml-1">0:00</span>
                                    <div className="flex-1 h-[4px] bg-slate-200 rounded-full relative mx-0.5">
                                        <div className="absolute top-0 left-0 h-full rounded-full w-[0%]" style={{backgroundColor: navCategory === 'ectoderme' ? '#5A9C51' : navCategory === 'endoderme' ? '#4171B5' : navCategory === 'oeil' ? '#F2B729' : '#F27D33'}} />
                                        <div className="w-[12px] h-[12px] rounded-full shadow border-[2.5px] border-white absolute top-1/2 -translate-y-1/2 -ml-1.5" style={{left: '0%', backgroundColor: navCategory === 'ectoderme' ? '#5A9C51' : navCategory === 'endoderme' ? '#4171B5' : navCategory === 'oeil' ? '#F2B729' : '#F27D33'}} />
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-500">0:00</span>
                                </div>
                        </div>
                    </div>

                    {/* Separator line */}
                    <div className="w-full h-px bg-slate-200/80 shrink-0" />

                    {/* Resumé & Re-transcription interactif Tabs */}
                    <div className="flex justify-center px-4 py-2 bg-[#FAF6ED] shrink-0">
                        <div className="flex bg-[#EFECE6] p-1 rounded-lg border border-slate-200/50">
                            <div className="px-4 py-1.5 text-[14px] bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200/50 text-slate-800 font-semibold ring-1 ring-black/5">
                                Résumé
                            </div>
                            <div className="px-4 py-1.5 text-[14px] text-slate-500 font-medium ml-1">
                                Re-transcription interactive
                            </div>
                        </div>
                    </div>

                    {/* Content exact replica */}
                    <div className="flex-1 px-6 overflow-hidden bg-[#FAF6ED]">
                        {navCategory === 'oeil' && (
                            <p className="text-[17px] leading-[1.8] text-[#4b5563] font-sans pt-2">
                                Cette étape cruciale détaille la formation des vésicules optiques, qui sont les ébauches paires à l'origine de l'œil, au cours de la neurulation. Vous découvrirez comment le développement de la placode optique et les différentes différenciations tissulaires interagissent pour donner naissance aux structures oculaires primitives des systèmes anatomiques.
                            </p>
                        )}
                        {navCategory === 'ectoderme' && (
                            <p className="text-[17px] leading-[1.8] text-[#4b5563] font-sans pt-2">
                                Dans cette introduction à l'embryologie biodynamique, nous plongeons profondément dans le processus de développement humain, mettant en lumière la puissance intrinsèque du fœtus. Les ostéopathes sont encouragés à renoncer à une volonté consciente pour participer activement à ce ballet de croissance dynamique. En explorant les interactions fondamentales, les synchronicités moléculaires et tissulaires...
                            </p>
                        )}
                        {navCategory === 'mesoderme' && (
                            <p className="text-[17px] leading-[1.8] text-[#4b5563] font-sans pt-2">
                                Cette vidéo vous guide à travers le processus fascinant de la mise en place du mésoderme et du rôle crucial de la notochorde dans le développement embryonnaire. Vous apprendrez comment ces structures interagissent au niveau cellulaire, notamment grâce à la ligne primitive et aux cellules en bouteille, entraînant la formation du tissu mésenchymateux primitif. De plus, vous explorerez...
                            </p>
                        )}
                        {navCategory === 'endoderme' && (
                            <p className="text-[17px] leading-[1.8] text-[#4b5563] font-sans pt-2">
                                Cette vidéo aborde la chronologie des systèmes de communication dans le développement embryonnaire, en mettant l'accent sur les cinq phases clés : fécondation, gastrulation, neurulation, métamérisation et délimitation. Vous apprendrez comment les systèmes digestif et circulatoire se développent en interaction, ainsi que le rôle fondamental de la cavité viteline et du blastocèle...
                            </p>
                        )}
                    </div>

                    {/* Bottom Nav */}
                    <nav className="absolute bottom-0 w-full bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 pb-[24px] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] flex justify-between px-2 pt-3 z-40">
                        <div className="flex flex-col items-center flex-1 text-slate-500"><Home size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Accueil</span></div>
                        <div className="flex flex-col items-center flex-1 text-slate-400"><Clock size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Chronolo...</span></div>
                        <div className="flex flex-col items-center flex-1 text-[#F27D33]"><VideoIcon size={22} strokeWidth={2.5} /><span className="text-[10px] font-bold mt-1">Vidéos</span></div>
                        <div className="flex flex-col items-center flex-1 text-slate-400"><Brain size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Assistant ...</span></div>
                        <div className="flex flex-col items-center flex-1 text-[#e11d48]"><LogOut size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Quitter</span></div>
                        <div className="flex flex-col items-center flex-1 text-slate-400">
                            <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-200 overflow-hidden relative flex items-center justify-center bg-[#FAF6ED]">
                                <Img src={staticFile('/icons/flag-fr.svg')} className="min-w-full min-h-full object-cover scale-[1.3]" />
                            </div>
                            <span className="text-[10px] font-medium mt-1 text-slate-300">FR</span>
                        </div>
                    </nav>
                </div>
                )}


                {/* Persistent Dynamic Island & Status Bar Overlay */}
                <div className="absolute top-0 w-full flex justify-between items-start px-6 pt-4 text-black font-semibold text-lg z-[60] pointer-events-none" style={{ fontSize: 16 * phoneScale }}>
                    <span className="mt-1">11:15</span>
                    <div className="w-[120px] h-[32px] bg-black rounded-full relative shadow-inner flex items-center justify-between px-3 mt-0.5" style={{ transform: `scale(${phoneScale})` }}>
                        <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#111]"></div>
                    </div>
                    <div className="flex gap-2 items-center text-black mt-1">
                        <Wifi size={18 * phoneScale} />
                        <BatteryFull size={22 * phoneScale} />
                    </div>
                </div>


                {/* Mouse Cursor INSIDE PHONE for Phase 1 */}
                <div 
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: cursorX,
                        top: cursorY,
                        opacity: pointerOpacity,
                        transform: `scale(${finalCursorScale})`,
                        filter: 'drop-shadow(0px 6px 10px rgba(0,0,0,0.4))',
                        transformOrigin: 'top left'
                    }}
                >
                    <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.77 21.4L11.44 17.14C11.66 16.94 11.95 16.83 12.25 16.83H18.5C19.16 16.83 19.5 16.03 19.03 15.56L6.53 3.06C6.06 2.59 5.5 2.82 5.5 3.21Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Navigation UI Pointer (Fades in) */}
                {showNavPointer && (
                    <div className="absolute z-[100] pointer-events-none drop-shadow-xl" style={{ opacity: pointerEntryOpacity, left: navPointerPos.x, top: navPointerPos.y, transform: `scale(${navPointerScale})`, transformOrigin: 'top left' }}>
                        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.77 21.4L11.44 17.14C11.66 16.94 11.95 16.83 12.25 16.83H18.5C19.16 16.83 19.5 16.03 19.03 15.56L6.53 3.06C6.06 2.59 5.5 2.82 5.5 3.21Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </div>
                )}

                {/* The Hand doing the Swiping */}
                <div 
                    className="absolute z-40 drop-shadow-2xl pointer-events-none"
                    style={{
                        left: handX,
                        top: handYActual,
                        opacity: handOpacity,
                        transform: `translate(-50%, -50%) scale(${handScale})`
                    }}
                >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.9)" stroke="black" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
                    </svg>
                </div>
            </div>
            </div>


            {/* MAGNIFIER EFFECT & VISUAL LINK (WHAOUUU !) */}
            {frame >= 755 && frame < 1020 && (
                <div className="absolute inset-0 z-[100] pointer-events-none overflow-visible">
                     {/* Visual link (Curved dashed line connector) removed for minimalist bubble style */}
                     
                     {/* THE MINIMALIST BUBBLE */}
                     <div className="absolute flex items-center justify-center transform-gpu drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                          style={{ 
                              left: 0, top: 0, 
                              opacity: magOpacity,
                              transform: `translate(${magX}px, ${magY + floatY}px) translate(-50%, -50%) scale(${magScale})`
                          }}>
                          
                          <div className="relative w-[220px] h-[220px] flex items-center justify-center">
                              
                              {/* The Bubble Tail (Curved comic stem pointing LEFT toward the phone) */}
                              <div className="absolute top-[50%] left-[-26px] w-[50px] h-[45px] pointer-events-none -translate-y-1/2">
                                  <svg viewBox="0 0 50 45" fill="rgba(255, 255, 255, 0.95)" className="w-full h-full drop-shadow-[-4px_2px_8px_rgba(0,0,0,0.06)]">
                                      <path d="M 50 5 Q 25 15 0 22 Q 25 30 50 40 Z" />
                                  </svg>
                              </div>
                              
                              {/* The Bubble Body (Squircle / Un peu carré) */}
                              <div className="absolute inset-0 rounded-[40px] bg-white/95 backdrop-blur-xl border border-slate-100" />
                              
                              {/* Soft Inner Shadow for depth */}
                              <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_4px_15px_rgba(255,255,255,1)] pointer-events-none" />

                              {/* The Icons */}
                              <div className="relative z-10 flex items-center justify-center">
                                  {downloadPhase === 0 && <CloudDownload size={100} strokeWidth={2.5} className="text-[#5A9C51]" />}
                                  {downloadPhase >= 1 && downloadPhase <= 2 && (
                                      <div className="relative flex items-center justify-center">
                                          <LoaderCircle size={100} strokeWidth={2.5} className="text-slate-400 animate-[spin_2s_linear_infinite] drop-shadow-sm" />
                                      </div>
                                  )}
                                  {downloadPhase === 3 && (() => {
                                      const checkPop = spring({ frame: Math.max(0, frame - 875), fps, config: { damping: 10, mass: 0.5 } });
                                      const checkScale = interpolate(checkPop, [0, 0.5, 1], [0.5, 1.4, 1]);
                                      return (
                                          <div className="relative flex items-center justify-center">
                                              {/* Confetti Explosion */}
                                              <svg className="absolute pointer-events-none overflow-visible w-[280px] h-[280px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                  {[0,1,2,3,4,5,6,7].map(i => {
                                                      const angle = (i / 8) * Math.PI * 2;
                                                      const dist = checkPop * 120;
                                                      const cx = 140 + Math.cos(angle) * dist;
                                                      const cy = 140 + Math.sin(angle) * dist;
                                                      const scale = interpolate(dist, [0, 80, 120], [0, 2, 0], { extrapolateRight: 'clamp' });
                                                      return <circle key={i} cx={cx} cy={cy} r="8" fill="#10B981" style={{ transform: `scale(${scale})`, transformOrigin: `${cx}px ${cy}px` }} />;
                                                  })}
                                              </svg>
                                              <Check size={100} className="text-[#10B981] drop-shadow-2xl" strokeWidth={3.5} style={{ transform: `scale(${checkScale})` }} />
                                          </div>
                                      );
                                  })()}
                                  {downloadPhase === 4 && <Trash2 size={100} className="text-red-500 drop-shadow-sm" strokeWidth={2.5} />}
                                  {downloadPhase === 5 && <CloudDownload size={100} className="text-slate-400 drop-shadow-sm" strokeWidth={2.5} />}
                              </div>
                          </div>
                     </div>
                </div>
            )}
        </AbsoluteFill>
    );
};
