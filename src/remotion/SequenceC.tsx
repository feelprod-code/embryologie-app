import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate, Img, staticFile, Sequence, Audio } from 'remotion';
import { Play, BookOpen, Home, Clock, VideoIcon, Brain, LogOut } from 'lucide-react';
import { fpsS } from './hooks/useTime';

const LANGUAGE_DATA = [
    { code: 'FR', label: 'Français', flagId: 'fr', 
      phil: "C'est un véritable plaisir partagé. Pour commencer, est-ce que tu peux nous expliquer ce concept fondamental de la ligne médiane ?",
      marc: "Absolument. La ligne médiane n'est pas qu'une construction anatomique abstraite. C'est le point de référence central autour duquel tout le développement embryonnaire s'organise et se déploie.",
      phil2: "C'est fascinant. Pouvons-nous explorer les axes de symétrie plus en détail ?",
      marc2: "Oui, la chronologie des symétries bilaterales est un marqueur très fort que nous allons étudier rigoureusement dans ce chapitre.",
      phil3: "Parfait ! Je suis vraiment impatient d'arriver à la démonstration en 3 dimensions de ce concept.",
      marc3: "Nous allons y venir juste après cette introduction théorique."
    },
    { code: 'EN', label: 'English', flagId: 'gb', 
      phil: "It is a true shared pleasure. To begin, could you explain to us this fundamental concept of the midline?",
      marc: "Absolutely. The midline is not just an abstract anatomical construct. It is the central reference point around which all embryonic development organizes and unfolds.",
      phil2: "It's fascinating. Can we explore the axes of symmetry in more detail?",
      marc2: "Yes, the chronology of bilateral symmetries is a very strong marker that we will study rigorously in this chapter.",
      phil3: "Perfect! I'm really looking forward to the 3D demonstration of this concept.",
      marc3: "We will get to that right after this theoretical introduction."
    },
    { code: 'ES', label: 'Español', flagId: 'es', 
      phil: "Es un verdadero placer compartido. Para empezar, ¿podrías explicarnos este concepto fundamental de la línea media?",
      marc: "Absolutamente. La línea media no es solo un constructo anatómico abstracto. Es el punto de referencia central alrededor del cual todo el desarrollo embrionario se organiza y se despliega.",
      phil2: "Es fascinante. ¿Podemos explorar los ejes de simetría con más detalle?",
      marc2: "Sí, la cronología de las simetrías bilaterales es un marcador muy fuerte que estudiaremos rigurosamente en este capítulo.",
      phil3: "¡Perfecto! Tengo muchas ganas de ver la demostración en 3D de este concepto.",
      marc3: "Llegaremos a eso justo después de esta introducción teórica."
    },
    { code: 'IT', label: 'Italiano', flagId: 'it', 
      phil: "È un vero piacere condiviso. Per cominciare, potresti spiegarci questo concetto fondamentale della linea mediana?",
      marc: "Assolutamente. La linea mediana non è solo un costrutto anatomico astratto. È il punto di riferimento centrale attorno al quale si organizza e si sviluppa tutto lo sviluppo embrionale.",
      phil2: "È affascinante. Possiamo esplorare più in dettaglio gli assi di simmetria?",
      marc2: "Sì, la cronologia delle simmetrie bilaterali è un marcatore molto forte che studieremo rigorosamente in questo capitolo.",
      phil3: "Perfetto! Non vedo l'ora di vedere la dimostrazione 3D di questo concetto.",
      marc3: "Ci arriveremo subito dopo questa introduzione teorica."
    },
    { code: 'DE', label: 'Deutsch', flagId: 'de', 
      phil: "Es ist eine wahre gemeinsame Freude. Könnten Sie uns zu Beginn dieses grundlegende Konzept der Mittellinie erklären?",
      marc: "Absolut. Die Mittellinie ist nicht nur ein abstraktes anatomisches Konstrukt. Sie ist der zentrale Bezugspunkt, um den sich die gesamte Embryonalentwicklung organisiert und entfaltet.",
      phil2: "Das ist faszinierend. Können wir die Symmetrieachsen genauer untersuchen?",
      marc2: "Ja, die Chronologie der bilateralen Symmetrien ist ein sehr starker Indikator, den wir in diesem Kapitel gründlich studieren werden.",
      phil3: "Perfekt! Ich freue mich wirklich auf die 3D-Demonstration dieses Konzepts.",
      marc3: "Wir kommen gleich nach dieser theoretischen Einführung dazu."
    },
    { code: 'ZH', label: '中文', flagId: 'cn', 
      phil: "这真是一份共同的快乐。首先，您能向我们解释一下这个关于中线的基本概念吗？",
      marc: "绝对可以。中线不仅仅是一个抽象的解剖结构。它是所有胚胎发育组织和展开的中心参考点。",
      phil2: "这太令人着迷了。我们能更详细地探讨一下对称轴吗？",
      marc2: "是的，双侧对称的年代学是一个非常强烈的标记，我们将要在本章中严格研究。",
      phil3: "完美！我真的很期待看到这个概念的3D演示。",
      marc3: "在理论介绍之后我们马上就会讲到那一点。"
    },
    { code: 'JA', label: '日本語', flagId: 'jp', 
      phil: "本当に共有する喜びです。まず始めに、正中線というこの基本的な概念について説明していただけますか？",
      marc: "もちろんです。正中線は単なる抽象的な解剖学的構造ではありません。それはすべての胚発生が組織化され展開する中心的な基準点なのです。",
      phil2: "魅力的ですね。対称軸についてもう少し詳しく調べることはできますか？",
      marc2: "はい、左右対称性の年代順は非常に強力な指標であり、この章で厳密に研究していきます。",
      phil3: "完璧です！この概念の3Dデモンストレーションを本当に楽しみにしています。",
      marc3: "この理論的な紹介のすぐ後でそれについて説明します。"
    }
];

export const SequenceC: React.FC<{ layoutFormat?: '16:9' | '9:16' | '1:1', alternate?: boolean }> = ({ layoutFormat = '16:9', alternate = false }) => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // --- TIMINGS --- // 400 frames (6.6 seconds)
    
    // 1. Sequence B's left text fading OUT
    const textOutProgress = spring({ frame: frame - 10, fps, config: { damping: 14 } });

    // 2. iPhone moves from RIGHT (450) to CENTER (0)
    const move1 = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 1.2 } });

    // 3. Magical Language vertical sidebar appears inside the phone at bottom right!
    const sidebarAppear = spring({ frame: frame - 50, fps, config: { damping: 14, mass: 0.8 } });

    // 4. Endless Auto-scroll overlapping previous state
    const scrollY = interpolate(frame, [0, 400], [-350, -850], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    
    const activeBlock = scrollY > -450 ? 2 : 
                        scrollY > -600 ? 3 : 
                        scrollY > -720 ? 4 : 
                        scrollY > -800 ? 5 : 
                        scrollY > -880 ? 6 : 
                        scrollY > -960 ? 7 : 
                        scrollY > -1040 ? 8 : 
                        scrollY > -1120 ? 9 : 
                        scrollY > -1200 ? 10 : 11;

    // 5. Language iterations (cycles through 0 to 6)
    // Runs across the center-hold period gracefully
    const langIndexRaw = Math.floor(interpolate(frame, [70, 220], [0, 7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    const langIndex = Math.min(6, Math.max(0, langIndexRaw));
    const currentLang = LANGUAGE_DATA[langIndex];

    // 6. iPhone moves from CENTER (0) towards LEFT (-450)
    const move2 = spring({ frame: frame - 260, fps, config: { damping: 14, mass: 1.2 } });

    // 7. Final Right Text fades in purely horizontally to stay strictly centered vertically
    const rightTextProgress = spring({ frame: frame - 280, fps, config: { damping: 14 } });


    // --- 3D & POSITIONS ---
    let globalScale = 1;
    let currentTranslateX = 450 - (move1 * 700) - (move2 * 200);
    let currentTranslateY = 0;

    const currentRotY = -35 + (move1 * 35) + (move2 * 35);
    const currentRotX = interpolate(move1, [0, 1], [15, 6]) + interpolate(move2, [0, 1], [0, 9]);
    const currentRotZ = 5 - (move1 * 5) - (move2 * 5);

    const translateZ = interpolate(move1, [0, 1], [100, 200]) + interpolate(move2, [0, 1], [0, -100]); // Zooms in when centered

    if (layoutFormat === '9:16') {
        globalScale = 0.9;
        currentTranslateX = 0;
        currentTranslateY = alternate ? -350 : 350; 
    } else if (layoutFormat === '1:1') {
        globalScale = 0.8;
        currentTranslateX = alternate ? -250 : 250;
        currentTranslateY = 0;
    }

    // Timestamp logic continuing from B
    const transcriptPlaybackPct = interpolate(frame, [0, 400], [54.0, 56.5], { extrapolateLeft: 'clamp', extrapolateRight: 'extend' });
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

    // Dynamic Classes for Outgoing Text
    let textAOutClasses = "absolute left-[2%] top-1/2 transform -translate-y-1/2 flex flex-col items-start justify-center w-[55%] z-0 p-8 gap-4 pointer-events-none";
    let textAOutTransform = `translateY(-50%) translateX(${interpolate(textOutProgress, [0, 1], [0, -300])}px)`;
    
    if (layoutFormat === '9:16') {
        textAOutClasses = `absolute ${alternate ? 'bottom-[10%]' : 'top-[5%]'} left-1/2 flex flex-col items-center justify-center w-[90%] z-0 p-8 gap-4 text-center pointer-events-none`;
        textAOutTransform = `translateX(-50%) translateY(${interpolate(textOutProgress, [0, 1], [0, alternate ? 200 : -200])}px)`;
    } else if (layoutFormat === '1:1') {
        textAOutClasses = `absolute ${alternate ? 'right-[2%]' : 'left-[5%]'} top-1/2 flex flex-col ${alternate ? 'items-start' : 'items-end'} justify-center w-[45%] z-0 p-4 gap-2 pointer-events-none`;
        textAOutTransform = `translateY(-50%) translateX(${interpolate(textOutProgress, [0, 1], [0, alternate ? 200 : -200])}px)`;
    }

    // Dynamic Classes for Language Dropdown Center Text
    let langContainerClasses = "absolute top-1/2 -translate-y-[60%] left-[52%] z-0 flex flex-col items-start justify-center";
    if (layoutFormat === '9:16') {
        langContainerClasses = `absolute ${alternate ? 'bottom-[20%]' : 'top-[20%]'} left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 flex flex-col items-center justify-center w-[90%]`;
    } else if (layoutFormat === '1:1') {
        langContainerClasses = `absolute top-1/2 -translate-y-[60%] ${alternate ? 'right-[5%]' : 'left-[5%]'} z-0 flex flex-col items-center justify-center w-[45%]`;
    }

    // Dynamic Classes for Final Right side text
    let textInClasses = "absolute left-[38%] top-1/2 flex flex-col items-center justify-center w-[60%] z-0 p-8 gap-1 text-center";
    let textInTransform = `translateY(-50%) translateX(${interpolate(rightTextProgress, [0, 1], [50, 0])}px)`;

    if (layoutFormat === '9:16') {
        textInClasses = `absolute ${alternate ? 'bottom-[5%]' : 'top-[5%]'} left-1/2 flex flex-col items-center justify-center w-[90%] z-0 p-4 gap-2 text-center pointer-events-none`;
        textInTransform = `translateX(-50%) translateY(${interpolate(rightTextProgress, [0, 1], [alternate ? -50 : 50, 0])}px)`;
    } else if (layoutFormat === '1:1') {
        textInClasses = `absolute ${alternate ? 'right-[2%]' : 'left-[5%]'} top-1/2 flex flex-col ${alternate ? 'items-start' : 'items-end'} justify-center w-[45%] z-0 p-4 gap-2 ${alternate ? 'text-left' : 'text-right'} pointer-events-none`;
        textInTransform = `translateY(-50%) translateX(${interpolate(rightTextProgress, [0, 1], [alternate ? -50 : 50, 0])}px)`;
    }

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center font-sans overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* The Text from Sequence B sliding OUT left */}
            <div 
                className={textAOutClasses}
                style={{
                    opacity: interpolate(textOutProgress, [0, 0.5], [1, 0]), 
                    transform: textAOutTransform
                }}
            >
                <div className={`font-handwriting text-[#5A9C51] font-bold drop-shadow-sm leading-none rotate-[-3deg] mb-2 ${layoutFormat === '9:16' ? 'text-[50px] text-center' : 'text-[70px]'}`}>
                    La preuve par le texte...
                </div>
            </div>

            {/* DYNAMIC GIANT LANGUAGE TITLES ON THE RIGHT WHEN PHONE IS CENTERED */}
            <div 
                className={langContainerClasses}
                style={{
                    opacity: interpolate(move2, [0, 0.2], [1, 0], { extrapolateRight: 'clamp' }), 
                }}
            >
                {LANGUAGE_DATA.map((lang, idx) => {
                    const isVisible = idx === langIndex;
                    const localStart = 70 + (idx * (150 / 7)); 
                    const localFrame = frame - localStart;
                    const popScale = interpolate(localFrame, [0, 8], [0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    const popOp = interpolate(localFrame, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    const yDrift = interpolate(localFrame, [0, 25], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

                    if (!isVisible) return null;

                    return (
                        <div key={idx} className="flex flex-col items-center" style={{ opacity: popOp, transform: `scale(${popScale}) translateY(${yDrift}px)` }}>
                            <div className={`font-bebas text-[#4171B5] opacity-35 leading-[0.8] tracking-widest uppercase m-0 drop-shadow-2xl select-none ${layoutFormat === '9:16' ? 'text-[150px]' : layoutFormat === '1:1' ? 'text-[140px]' : 'text-[200px]'}`}>
                                {lang.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3D Scene Wrapper (The iPhone) */}
            <div 
                className="relative flex items-center justify-center w-[380px] h-[820px] z-10"
                style={{ 
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    transform: `scale(${globalScale}) translateX(${currentTranslateX}px) translateY(${currentTranslateY}px) translateZ(${translateZ}px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) rotateZ(${currentRotZ}deg)`
                }}
            >
                {thicknessLayers}

                <div 
                    className="absolute inset-0 bg-[#FAF6ED] rounded-[55px] overflow-hidden transform-gpu flex flex-col pt-12"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 shadow-inner flex items-center justify-between px-3">
                        <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#111]"></div>
                    </div>

                    {/* Transcript View (Always active in Seq C) */}
                    <div className="relative flex-1 bg-[#FAF6ED] flex flex-col pb-[15px] z-30 min-h-0 overflow-hidden">
                        
                        {/* Top Sticky Header */}
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
                            
                            <div className="w-full mt-5 py-3 bg-[#EFE8D8] text-[#8E5A3E] rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 outline-none">
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
                                <div className="p-3 -mx-3 border bg-transparent border-transparent">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">0:09</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed">
                                        Bonjour à tous et bienvenue sur le podcast des techniques douces tissulaires, aujourd'hui orienté vers l'embryologie biodynamique.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl transition-colors duration-500 bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">0:49</span>
                                    </div>
                                    <p className="text-[#333] font-medium text-[14px] leading-relaxed">
                                        Bonjour Guillaume.
                                    </p>
                                </div>
                                
                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 2 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">0:52</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.phil}
                                    </p>
                                </div>
                                
                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 3 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">1:15</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.marc}
                                    </p>
                                </div>

                                {/* Continuous Filler Text translated seamlessly! */}
                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 4 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">1:22</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.phil2}
                                    </p>
                                </div>

                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 5 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">1:45</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.marc2}
                                    </p>
                                </div>

                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 6 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">2:10</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.phil3}
                                    </p>
                                </div>

                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 7 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">2:25</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.marc3}
                                    </p>
                                </div>

                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 8 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">2:42</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.phil}
                                    </p>
                                </div>

                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 9 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">2:55</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.marc}
                                    </p>
                                </div>

                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 10 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Philippe Guillaume</span>
                                        <span className="text-slate-400 text-[11px] font-medium">3:22</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.phil2}
                                    </p>
                                </div>

                                <div className={`transition-colors duration-500 rounded-xl p-3 -mx-3 ${activeBlock === 11 ? 'bg-orange-50/70 border-orange-100' : 'bg-transparent border-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#8E5A3E] text-[13px]">Marc Damoiseaux</span>
                                        <span className="text-slate-400 text-[11px] font-medium">3:45</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed transition-opacity duration-200">
                                        {currentLang.marc2}
                                    </p>
                                </div>

                            </div>
                            
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                        </div>
                        
                        {/* ========================================================= */}
                        {/* THE LANGUAGE SWITCHER DROPDOWN INSIDE THE PHONE */}
                        {/* ========================================================= */}
                        <div 
                            className="absolute right-3 bottom-[10px] py-1 rounded-[18px] bg-[#FAF6ED]/95 backdrop-blur-xl shadow-2xl border border-slate-200/60 flex flex-col pointer-events-none overflow-hidden z-40 transform-gpu"
                            style={{
                                transform: `translateY(${interpolate(sidebarAppear, [0, 1], [40, 0])}px) scale(${sidebarAppear})`,
                                opacity: sidebarAppear,
                                width: '150px',
                                transformOrigin: 'bottom right'
                            }}
                        >
                            {LANGUAGE_DATA.map((lang, i) => {
                                const isActive = i === langIndexRaw;
                                return (
                                    <div key={i} className={`flex items-center gap-3 px-4 py-3 transition-colors duration-300 ${isActive ? 'bg-[#F27D33] shadow-md scale-100 z-10' : 'bg-transparent'}`}>
                                        <div className="w-[20px] h-[20px] overflow-hidden rounded-full shadow-[0_0_0_0.5px_rgba(0,0,0,0.1)] bg-[#FAF6ED] flex-shrink-0 flex items-center justify-center">
                                            <Img src={staticFile(`/icons/flag-${lang.flagId}.svg`)} className="min-w-full min-h-full object-cover scale-[1.3]" />
                                        </div>
                                        <span 
                                            className={`font-sans text-[14px] font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-700'}`}
                                        >
                                            {lang.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="border-t border-slate-200 bg-slate-50/90 flex justify-between px-2 pt-2 pb-6 shrink-0 relative z-20">
                        {/* Empty placeholders to keep FR on the right side with exact grid alignment */}
                        <div className="flex flex-col items-center flex-1 opacity-0"><Home size={22} strokeWidth={2.5} /><span className="text-[10px] font-bold mt-1">Accueil</span></div>
                        <div className="flex flex-col items-center flex-1 opacity-0"><Clock size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Chronolo...</span></div>
                        <div className="flex flex-col items-center flex-1 opacity-0"><VideoIcon size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Vidéos</span></div>
                        <div className="flex flex-col items-center flex-1 opacity-0"><Brain size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Assistant ...</span></div>
                        <div className="flex flex-col items-center flex-1 opacity-0"><LogOut size={22} strokeWidth={2} /><span className="text-[10px] font-medium mt-1">Quitter</span></div>
                        <div className="flex flex-col items-center flex-1 text-slate-800">
                            <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-300 overflow-hidden relative shadow-sm">
                                <div className="absolute inset-0 bg-blue-600 w-1/3"></div>
                                <div className="absolute inset-0 bg-white left-1/3 w-1/3"></div>
                                <div className="absolute inset-0 bg-red-600 left-2/3 w-1/3"></div>
                            </div>
                            <span className="text-[10px] font-bold mt-1 text-slate-800">FR</span>
                        </div>
                    </div>
                </div>

                {/* iPhone Black Outline Overlay */}
                <div className="absolute inset-0 rounded-[55px] pointer-events-none z-[100]" style={{ boxShadow: `inset 0 0 0 14px black` }} />

            </div>

            {/* Final Right side text fading in ALWAYS perfectly centered vertically AND horizontally relative to the void! */}
            <div 
                className={textInClasses}
                style={{
                    opacity: rightTextProgress, 
                    transform: textInTransform
                }}
            >
                <div className={`font-handwriting text-[#5A9C51] font-bold drop-shadow-sm leading-none rotate-[-3deg] -mb-2 ${layoutFormat === '9:16' ? 'text-[50px] text-center' : layoutFormat === '1:1' ? 'text-[60px]' : 'text-[70px] ml-4'}`}>
                    Et ce n'est pas tout...
                </div>
                <h2 className={`font-bebas text-[#4171B5] leading-[0.9] tracking-tight drop-shadow-md uppercase ${layoutFormat === '9:16' ? 'text-[85px]' : layoutFormat === '1:1' ? 'text-[95px]' : 'text-[115px]'}`}>
                    7 LANGUES<br />INCLUSES
                </h2>
                <div className={`font-anton text-white bg-[#F27D33] tracking-wide uppercase rounded-xl shadow-lg border-2 border-white mt-1 rotate-[1deg] ${layoutFormat === '9:16' ? 'text-[28px] px-4 py-2' : layoutFormat === '1:1' ? 'text-[30px] px-5 py-2' : 'text-[35px] px-6 py-2'}`}>
                    TRADUCTION IMMÉDIATE
                </div>
                <p className={`font-sans text-slate-500 font-medium leading-snug mt-3 px-6 ${layoutFormat === '9:16' ? 'text-[18px]' : layoutFormat === '1:1' ? 'text-[20px]' : 'text-[26px]'}`}>
                    Brisez les barrières de la langue. Toutes les retranscriptions sont traduites en <b>Anglais, Espagnol, Italien, Allemand, Chinois et Japonais</b> d'un simple clic.
                </p>
            </div>
            {/* SOUND DESIGN: CLICS LANGUES */}
            {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                const localStart = 70 + (idx * (150 / 7)); 
                return (
                    <Sequence name="Bruitage - click.wav" key={`lang-click-${idx}`} from={fpsS(localStart, realFps)} durationInFrames={fpsS(15, realFps)}>
                        <Audio src={staticFile('click.wav')} volume={0.6} />
                    </Sequence>
                );
            })}
            
        </AbsoluteFill>
    );
};
