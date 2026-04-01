import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { AppTimelineDay } from './app-ui/AppTimelineDay';
import { AppChatBot } from './app-ui/AppChatBot';
import { AppPdfExport } from './app-ui/AppPdfExport';
import { Brain } from 'lucide-react';

export const SequenceK: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Dimensions iPhone
    const phoneH = 920; 
    const phoneW = 440;

    // --- NOUVELLE TRANSITION CINÉMATIQUE (OVERLAP TOTAL) ---
    // 1. Titre J sort par la gauche (démarre frame 0)
    const titleJExit = spring({ frame: Math.max(0, frame), fps, config: { damping: 14 } });
    
    // 2. Les téléphones bougent (démarrent frame 10 pour que Phone J reste un peu, puis Phone K entre)
    const phonesAnim = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14 } });
    const phoneJX = interpolate(phonesAnim, [0, 1], [150, 1500]); // iPhone J sort vers la droite
    const phoneKX = interpolate(phonesAnim, [0, 1], [-1500, -250]); // iPhone K entre par la gauche

    // 3. Titre K entre par la droite (staggered, SANS REBOND)
    const smoothSpring = { damping: 20, stiffness: 150 };
    const text1Fly = spring({ frame: Math.max(0, frame - 15), fps, config: smoothSpring });
    const text2Fly = spring({ frame: Math.max(0, frame - 20), fps, config: smoothSpring });
    const text3Fly = spring({ frame: Math.max(0, frame - 25), fps, config: smoothSpring });
    const text4Fly = spring({ frame: Math.max(0, frame - 30), fps, config: smoothSpring });
    
    // --- ANIMATIONS D'EXPORT PDF (FIN DE SCÈNE) ---
    // 4. Sortie de l'iPhone et Entrée du Document PDF (frame 670, juste après le clic 665)
    // Au clic, on switche IMMÉDIATEMENT (stiffness élevé, sans rebond) !
    const switchAnim = spring({ frame: Math.max(0, frame - 670), fps, config: { damping: 20, stiffness: 220 } });
    
    // L'iPhone sort par le bas très vite
    const phoneKYExit = interpolate(switchAnim, [0, 1], [0, 2000]); 
    // Le premier Titre sort par la gauche très vite
    const textKExitX = interpolate(switchAnim, [0, 1], [0, -3000]); 
    const textKExitOpacity = interpolate(switchAnim, [0, 0.2], [1, 0], { extrapolateRight: 'clamp' }); // Fade-out instantané
    
    // Le document PDF monte très vite par le bas EN MÊME TEMPS (remplit le vide laissé par l'iPhone)
    const pdfY = interpolate(switchAnim, [0, 1], [2000, 0]); 

    // Scroll dynamique du PDF façon "découverte rapide" et naturelle
    // Démarrage frame 690, fin frame 1050 (pour un arrêt propre juste avant 1078 / 3:25:01)
    // Distance de -3400px pour descendre vraiment tout en bas
    const pdfScroll = interpolate(frame, [690, 1050], [0, -3400], { 
        extrapolateLeft: 'clamp', 
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.quad) 
    });

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center font-sans overflow-hidden" style={{ perspective: '1500px' }}>
            
            {/* ---------------------------------------------------------------- */}
            {/* ANCIENS ÉLÉMENTS DE LA SÉQUENCE J (Sortent de l'écran)       */}
            {/* ---------------------------------------------------------------- */}
            
            {/* 1. ANCIENS TEXTES (Sortent par la gauche) */}
            <div 
                className="absolute left-[5%] top-1/2 -translate-y-1/2 flex flex-col items-start z-10 w-[50%] pointer-events-none"
                style={{
                    opacity: interpolate(titleJExit, [0, 0.8, 1], [1, 1, 0]), 
                    transform: `translateX(${interpolate(titleJExit, [0, 1], [0, -1000])}px)`
                }}
            >
                <div className="mb-8" style={{ transform: 'rotate(-2deg)' }}>
                    <div className="bg-[#1c2e4a] text-white font-anton text-[45px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white inline-block">
                        RÉVISION CHRONOLOGIQUE
                    </div>
                </div>

                <div>
                    <h2 className="font-bebas text-[#4171B5] text-[130px] leading-[0.85] tracking-wider drop-shadow-sm uppercase">
                        DE J1 À J28
                    </h2>
                </div>

                <div className="mt-6">
                    <div className="font-handwriting text-[#F27D33] text-[75px] font-bold drop-shadow-sm leading-none rotate-[-4deg]">
                        idéal pour mémoriser !
                    </div>
                </div>

                <div className="mt-8 border-l-4 border-slate-300 pl-6">
                    <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug">
                        Retrouvez toutes les phases du développement,<br/>
                        classées jour après jour, semaine après semaine.
                    </p>
                </div>
            </div>

            {/* 2. ANCIEN IPHONE (Sort vers la droite) */}
            <div 
                className="absolute z-20 pointer-events-none"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${phoneJX}px), -50%)`,
                    width: phoneW,
                    height: phoneH
                }}
            >
                <div className="relative w-full h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[45px]" style={{ transformStyle: 'preserve-3d' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                            key={`old-layer-${i}`}
                            className="absolute inset-0 bg-[#1e293b] rounded-[45px] border border-slate-700"
                            style={{ transform: `translateZ(${-i - 1}px)` }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-black rounded-[45px] flex flex-col overflow-hidden" style={{ border: `12px solid #1E293B`, outline: `3px solid #0F172A`, transform: 'translateZ(0px)' }}>
                        <div className="w-full h-full relative rounded-[33px] overflow-hidden bg-white">
                            <div className="absolute inset-0 pb-20 pt-10">
                                <AppTimelineDay activeStageId="j-28" />
                            </div>
                        </div>
                    </div>
                    {/* Masque iPhone et reflets propres J */}
                    <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[140px] h-[26px] bg-black rounded-b-[18px] pointer-events-none z-50 flex items-center justify-center">
                        <div className="w-12 h-1 bg-gray-800 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-blue-900/30 ml-2 border border-blue-800/50" />
                    </div>
                </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* NOUVEAUX ÉLÉMENTS DE LA SÉQUENCE K (Entrent dans l'écran)    */}
            {/* ---------------------------------------------------------------- */}

            {/* 3. NOUVEL IPHONE PRINCIPAL (Entre par la gauche, puis Tombe pour laisser place au PDF) */}
            <div 
                className="absolute z-30"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${phoneKX}px), calc(-50% + ${phoneKYExit}px))`,
                    width: phoneW,
                    height: phoneH
                }}
            >
                {/* Glow de l'IA derrière l'iPhone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#AE7D5C]/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative w-full h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[45px]" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Tranches 3D gris foncé */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                            key={`new-layer-${i}`}
                            className="absolute inset-0 bg-[#1e293b] rounded-[45px] border border-slate-700 pointer-events-none"
                            style={{ transform: `translateZ(${-i - 1}px)` }}
                        />
                    ))}

                    {/* Cadre principal style 'Dark' (Noir/Ardoise) */}
                    <div 
                        className="absolute inset-0 bg-black rounded-[45px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
                        style={{ border: `12px solid #1E293B`, outline: `3px solid #0F172A`, transform: 'translateZ(0px)' }}
                    >
                        <div className="w-full h-full pointer-events-none relative rounded-[33px] overflow-hidden bg-white">
                            {/* Nouvel écran (ChatBot) DIRECT */}
                            <div className="absolute inset-0">
                                <AppChatBot />
                            </div>
                        </div>
                    </div>
                    
                    {/* Masque iPhone et reflets propres */}
                    <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[140px] h-[26px] bg-black rounded-b-[18px] pointer-events-none z-50 flex items-center justify-center">
                        <div className="w-12 h-1 bg-gray-800 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-blue-900/30 ml-2 border border-blue-800/50" />
                    </div>

                    {/* WIDGET BULLE (Style SequenceJ) */}
                    {frame >= 50 && (() => {
                        const popAnim = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 100 } });
                        const pulse = interpolate((frame - 50) % 45, [0, 45], [0, 1]);
                        const magScale = spring({ frame: Math.max(0, frame - 57), fps, config: { damping: 100 } });
                        const floatY = Math.sin((frame - 57) * 0.05) * 5;

                        const targetYBottom = phoneH - 45; 
                        const targetXBottom = phoneW * 0.44; 

                        return (
                            <>
                                {/* EFFET LOUPE SUR L'ICÔNE */}
                                <div 
                                    className="absolute pointer-events-none rounded-full bg-slate-200/50"
                                    style={{
                                        left: targetXBottom,
                                        top: targetYBottom,
                                        width: 54,
                                        height: 54,
                                        transform: `translate(-50%, -50%) scale(${interpolate(popAnim, [0, 1], [1, 1.4])})`,
                                        zIndex: 60
                                    }}
                                />
                                
                                {/* Icône agrandie (Effet loupe) */}
                                <div 
                                    className="absolute pointer-events-none flex items-center justify-center bg-[#FAF8F5] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#1c2e4a]/30"
                                    style={{
                                        left: targetXBottom,
                                        top: targetYBottom,
                                        width: 48,
                                        height: 48,
                                        transform: `translate(-50%, -50%) scale(${interpolate(popAnim, [0, 1], [0.5, 1.5])})`,
                                        zIndex: 62
                                    }}
                                >
                                    <Brain size={26} className="text-[#1c2e4a]" strokeWidth={2.5} />
                                </div>

                                {/* Onde lumineuse autour de l'icône agrandie */}
                                <div 
                                    className="absolute pointer-events-none rounded-full border-2 border-[#AE7D5C]"
                                    style={{
                                        left: targetXBottom,
                                        top: targetYBottom,
                                        width: 48,
                                        height: 48,
                                        transform: `translate(-50%, -50%) scale(${interpolate(pulse, [0, 1], [1.5, 2.5])})`,
                                        opacity: interpolate(pulse, [0, 0.2, 1], [0, 1, 0]),
                                        zIndex: 61
                                    }}
                                />

                                {/* LA BULLE CARRÉE (Style SequenceH/J) */}
                                <div 
                                    className="absolute flex items-center justify-center transform-gpu drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                                    style={{ 
                                        left: -280,
                                        top: targetYBottom - 180,
                                        transform: `translate(0, -50%) translateY(${floatY}px) scale(${magScale})`,
                                        transformOrigin: 'right bottom',
                                        zIndex: 70
                                    }}
                                >
                                    <div className="relative w-[220px] h-[220px] flex items-center justify-center">
                                        
                                        {/* The Bubble Tail (Miroir exact de la SequenceJ) */}
                                        <div className="absolute top-[75%] right-[-35px] w-[50px] h-[45px] pointer-events-none -translate-y-1/2 -scale-x-100 rotate-[-15deg]">
                                            <svg viewBox="0 0 50 45" fill="rgba(255, 255, 255, 0.95)" className="w-full h-full drop-shadow-[-4px_2px_8px_rgba(0,0,0,0.06)]">
                                                <path d="M 50 5 Q 25 15 0 22 Q 25 30 50 40 Z" />
                                            </svg>
                                        </div>
                                        
                                        {/* The Bubble Body (Squircle) */}
                                        <div className="absolute inset-0 rounded-[50px] bg-white text-slate-800 border border-slate-100/50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]" />
                                        
                                        {/* Soft Inner Shadow for depth */}
                                        <div className="absolute inset-0 rounded-[50px] shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] pointer-events-none" />

                                        {/* Content Inside */}
                                        <div className="relative z-10 flex flex-col items-center justify-center p-8">
                                            <Brain size={64} className="text-slate-400 drop-shadow-sm mb-4" strokeWidth={1.5} />
                                            <span className="font-sans font-extrabold text-[#111827] text-[18px] tracking-widest uppercase text-center leading-[1.1]">Assistant<br/>IA</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* 4. NOUVEAUX TEXTES MARKETING (Entrent par la droite) */}
            <div className="absolute left-[61%] top-1/2 -translate-y-1/2 flex flex-col items-start z-10 w-[40%]"
                 style={{ 
                     transform: `translateX(${textKExitX}px)`,
                     opacity: textKExitOpacity
                 }}
            >
                <div 
                    style={{
                        opacity: text1Fly,
                        transform: `translateX(${interpolate(text1Fly, [0, 1], [1500, 0])}px) rotate(-2deg)`
                    }}
                    className="mb-8"
                >
                    <div className="bg-[#1c2e4a] text-white font-anton text-[45px] tracking-wide uppercase px-6 py-2 rounded-xl shadow-lg border-2 border-white inline-block">
                        ASSISTANT I.A.
                    </div>
                </div>

                <div 
                    style={{
                        opacity: text2Fly,
                        transform: `translateX(${interpolate(text2Fly, [0, 1], [1500, 0])}px) scale(${interpolate(text2Fly, [0, 1], [0.8, 1])})`
                    }}
                >
                    <h2 className="font-bebas text-[#4171B5] text-[130px] leading-[0.85] tracking-wider drop-shadow-sm uppercase">
                        VOTRE<br/>
                        ÉTUDIANT
                    </h2>
                </div>

                <div 
                    style={{
                        opacity: text3Fly,
                        transform: `translateX(${interpolate(text3Fly, [0, 1], [1500, 0])}px) rotate(-4deg)`
                    }}
                    className="mt-6"
                >
                    <div className="font-handwriting text-[#F27D33] text-[75px] font-bold drop-shadow-sm leading-none">
                        réponses précises !
                    </div>
                </div>

                <div 
                    style={{
                        opacity: text4Fly,
                        transform: `translateX(${interpolate(text4Fly, [0, 1], [1500, 0])}px)`
                    }}
                    className="mt-8 border-l-4 border-slate-300 pl-6"
                >
                    <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug">
                        Chaque explication est <strong>sourcée</strong><br/>
                        avec <strong className="text-slate-700">références vidéos</strong> et <strong className="text-slate-700">codes couleurs</strong> !
                    </p>
                </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* GROUPE FINAL CENTRÉ : PDF (5) + TITRE (6)                        */}
            {/* ---------------------------------------------------------------- */}
            <div className="absolute inset-0 z-40 flex items-center justify-center gap-24 pointer-events-none">
                
                {/* 5. AFFICHE LE FICHIER PDF A4 (Monte par le bas) */}
                <div 
                    className="h-[85%] rounded-xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-slate-300 relative bg-[#FAF8F5] shrink-0 pointer-events-auto"
                    style={{ 
                        aspectRatio: '1/1.414', 
                        minWidth: '600px',
                        transform: `translateY(${pdfY}px)`,
                        opacity: interpolate(switchAnim, [0, 0.2, 1], [0, 1, 1])
                    }} 
                >
                    <div className="absolute inset-0" style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', height: '125%' }}>
                        <AppPdfExport frameScrollOffset={pdfScroll} />
                    </div>
                </div>

                {/* 6. TITRE POUR LE PDF (Entre par la droite quand le PDF apparaît) */}
                <div className="flex flex-col items-start shrink-0 w-[450px] pointer-events-auto"
                     style={{
                         opacity: interpolate(switchAnim, [0, 0.5, 1], [0, 1, 1]),
                         transform: `translateX(${interpolate(switchAnim, [0, 1], [1500, 0])}px)`
                     }}
                >
                    <div className="mb-6" style={{ transform: 'rotate(-2deg)' }}>
                        <div className="bg-[#1c2e4a] text-white font-anton text-[30px] tracking-wide uppercase px-4 py-2 rounded-xl shadow-lg border-2 border-white inline-block">
                            EXPORTEZ LA SYNTHÈSE
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bebas text-[#9B6B56] text-[90px] leading-[0.85] tracking-wider drop-shadow-sm uppercase">
                            VOTRE<br/>DOCUMENT
                        </h2>
                    </div>

                    <div className="mt-6" style={{ transform: 'rotate(-4deg)' }}>
                        <div className="font-handwriting text-[#F27D33] text-[75px] font-bold drop-shadow-sm leading-none">
                            une trace complète !
                        </div>
                    </div>

                    <div className="mt-8 border-l-4 border-slate-300 pl-6">
                        <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug">
                            Ne perdez jamais le fil de vos recherches.<br/>
                            Conservez le résultat de vos requêtes avec toutes leurs sources vidéo.
                        </p>
                    </div>
                </div>

            </div>

        </AbsoluteFill>
    );
};
