import React from 'react';
import { Brain, MousePointer2, Download, PlayCircle, Shield, X, LogOut, Video, Clock, Home, Loader2, ArrowRight } from 'lucide-react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export const AppChatBot: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 1. Apparition de la question utilisateur (f=90)
    const userMessageAnim = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 14 } });
    
    // 2. Le loader apparaît à f=120, et disparaît à f=170
    const loaderOpacity = interpolate(frame, [120, 130, 160, 170], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const loaderAnimY = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 14 } });
    
    // 3. La réponse finale apparaît à f=190
    const responseAnim = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 14 } });

    // 4. On scroll pour un effet marketing (moins rapide)
    const scrollY = interpolate(frame, [230, 800], [0, -4621], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // 5. Curseur de souris (apparaît et va vers le bouton, juste avant la fin du scroll)
    const cursorMove = spring({ frame: Math.max(0, frame - 810), fps, config: { damping: 14, stiffness: 120 } });
    
    // 6. Survol (Hover) = changement de couleur direct (dès que la souris est dessus)
    const isHovered = frame >= 825;

    // 7. Clic rapide
    const cursorClick = spring({ frame: Math.max(0, frame - 835), fps, config: { damping: 100, stiffness: 400 } });

    return (
        <div className="w-full h-full bg-[#FAF8F5] flex flex-col relative font-sans text-slate-800">
            {/* Header */}
            <div className="flex-none z-30 w-full pt-12 pb-4 px-6 flex items-center justify-between bg-[#FAF8F5]">
                <div className="w-6" />
                <span className="font-bebas font-normal text-[26px] tracking-widest text-[#1c2e4a] ml-16 pt-1">
                    EMBRYO AI
                </span>
                <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center bg-white/60 rounded-full border border-slate-200/60 p-0.5 shadow-sm">
                        <span className="px-[14px] py-[3px] text-[10px] font-bold text-slate-500 tracking-wide">FAST</span>
                        <span className="px-[14px] py-[3px] bg-[#9B6B56] text-white text-[10px] font-bold tracking-wide rounded-full shadow-sm">DEEP</span>
                    </div>
                    <X size={20} className="text-[#a0aec0] ml-1" />
                </div>
            </div>

            {/* Messages Area */}
            <div 
                className="flex-1 px-6 overflow-hidden relative z-10"
                style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                }}
            >
                <div 
                    className="flex flex-col pt-4 pb-[800px] w-full gap-6"
                    style={{ transform: `translateY(${scrollY}px)` }}
                >
                    {/* Assistant Welcome Message */}
                    <div className="flex justify-start">
                        <div className="max-w-[85%] bg-white rounded-3xl rounded-tl-md p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
                            <p className="text-[#4A5568] leading-relaxed mb-4 text-[17px]">
                                Bonjour ! Je suis Embryo AI, votre assistant dédié au cours d'embryologie de Marc Damoiseaux.
                            </p>
                            <p className="text-[#4A5568] leading-relaxed text-[17px]">
                                Posez-moi vos questions sur les <strong className="text-[#1c2e4a] font-semibold">cascades cinétiques</strong>, les <strong className="text-[#1c2e4a] font-semibold">feuillets</strong> ou la <strong className="text-[#1c2e4a] font-semibold">pratique biodynamique</strong>.
                            </p>
                        </div>
                    </div>

                    {/* User Message */}
                    <div 
                        className="flex justify-end pt-4"
                        style={{ 
                            opacity: userMessageAnim, 
                            transform: `translateY(${10 - userMessageAnim * 10}px) scale(${0.9 + userMessageAnim * 0.1})`,
                            transformOrigin: 'bottom right'
                        }}
                    >
                        <div className="bg-[#1e293b] text-white rounded-[24px] px-6 py-4 shadow-sm">
                            <p className="text-[17px] font-medium">
                                Le LCR
                            </p>
                        </div>
                    </div>
                    
                    {/* Zone d'affichage alternée: Loader PUIS Réponse */}
                    <div className="relative w-full">
                        {/* 1) Assistant Loading Reply */}
                        <div 
                            className="absolute top-0 left-0 w-full flex justify-start pt-2"
                            style={{ 
                                opacity: loaderOpacity, 
                                transform: `translateY(${10 - loaderAnimY * 10}px)`,
                                pointerEvents: loaderOpacity > 0 ? 'auto' : 'none'
                            }}
                        >
                            <div className="w-[90%] bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
                                <Loader2 size={24} className="text-slate-400/50 animate-spin flex-shrink-0" />
                                <span className="text-[#64748b] text-[14px] font-bold tracking-wide uppercase pt-1 leading-snug">
                                    RECHERCHE DANS LES COURS DE MARC DAMOISEAUX...
                                </span>
                            </div>
                        </div>

                        {/* 2) Assistant Final Long Response */}
                        <div 
                            className="w-full flex justify-start pt-2"
                            style={{ 
                                opacity: responseAnim, 
                                transform: `translateY(${10 - responseAnim * 10}px)` 
                            }}
                        >
                            <div className="max-w-[95%] bg-white rounded-3xl rounded-tl-md p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-6">
                                
                                {/* CAUTION: Introduction paragraph before the main TITLE */}
                                <div>
                                    <p className="text-[#4A5568] text-[16.5px] leading-relaxed">
                                        Bonjour ! Le Liquide Céphalo-Rachidien (LCR) est en effet un sujet fascinant et central en embryologie biodynamique. Voici une explication structurée, en nous basant prioritairement sur les enseignements de Marc Damoiseaux.
                                    </p>
                                </div>

                                {/* L'ORIGINE AMNIOTIQUE */}
                                <div>
                                    <h4 className="font-bebas text-[#1c2e4a] text-[24px] tracking-wide mb-5">LE LIQUIDE CÉPHALO-RACHIDIEN (LCR) EN EMBRYOLOGIE BIODYNAMIQUE</h4>
                                    
                                    <h5 className="font-bebas text-[#4A5568] text-[19px] tracking-wide mb-3">L'ORIGINE AMNIOTIQUE : LE LCR PRIMITIF</h5>
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        L'un des points fondamentaux enseignés par Marc Damoiseaux est que l'origine du LCR est à chercher bien avant la formation des plexus choroïdes.
                                    </p>
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Le tout premier LCR est en réalité le <strong className="text-[#1c2e4a] font-semibold text-[17px]">liquide amniotique primitif</strong>. Dès le 7ème jour, lors de la nidation et de l'apparition de la <strong className="text-[#1c2e4a] font-semibold text-[17px]">cavité amniotique</strong> par exsudat, le fluide qui la remplit constituera la source directe du LCR.
                                    </p>
                                    
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Source: Jours 5 à 8 - L'Éclosion et la Nidation
                                    </p>

                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Ce liquide va être "capturé" à l'intérieur de l'embryon lors du processus de <strong className="text-[#1c2e4a] font-semibold text-[17px]">neurulation</strong>. Lorsque l'ectoderme se creuse pour former la gouttière neurale puis le tube neural, il incorpore ce liquide amniotique primitif.
                                    </p>
                                    
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Comme le précise Marc Damoiseaux : "Au-dessus de cette plaque neurale, nous trouverons plus tard le <strong className="text-[#1c2e4a] font-semibold text-[17px]">liquide céphalo-rachidien primitif</strong>, issu de la cavité amniotique. (...) Le <strong className="text-[#1c2e4a] font-semibold text-[17px]">système ventriculaire</strong> et ce liquide au centre de soi ne sont autres que du liquide amniotique."
                                    </p>

                                    <div className="bg-[#60995c] rounded-[18px] py-1 px-3 flex items-center gap-2 text-white shadow-sm mb-2 w-fit">
                                        <PlayCircle size={16} className="flex-shrink-0" />
                                        <span className="font-bold text-[12px] leading-tight pt-[1px] pr-1">L'Ectoderme • 14 - Implantation et Cavité Amniotique</span>
                                    </div>
                                </div>

                                {/* L'HÉRITAGE FLUIDIQUE */}
                                <div className="mt-2">
                                    <h5 className="font-bebas text-[#1c2e4a] text-[19px] tracking-wide mb-3">L'HÉRITAGE FLUIDIQUE : LA ZONE B ET L'ÉQUILIBRE DES PRESSIONS</h5>
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Cette origine commune crée un lien indissociable entre le liquide <em className="italic">à l'intérieur</em> du système nerveux (le LCR intra-crânien et intra-spinal) et le champ fluidique qui reste <em className="italic">à l'extérieur</em> du corps physique, qui est la trace énergétique de la cavité amniotique originelle, appelée la <strong className="text-[#1c2e4a] font-semibold text-[17px]">Zone B</strong>.
                                    </p>
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        L'embryon, puis le fœtus, baigne dans cette "poche des eaux", créant une information de <strong className="text-[#1c2e4a] font-semibold text-[17px]">pression interne et externe</strong> constante et cruciale pour son développement.
                                    </p>

                                    <div className="bg-[#60995c] rounded-[18px] py-1 px-3 flex items-center gap-2 text-white shadow-sm mb-5 w-fit">
                                        <PlayCircle size={16} className="flex-shrink-0" />
                                        <span className="font-bold text-[12px] leading-tight pt-[1px] pr-1">L'Ectoderme • 14 - Implantation et Cavité Amniotique</span>
                                    </div>

                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        En pratique clinique, cette double notion de LCR est fondamentale. Une technique comme la <strong className="text-[#1c2e4a] font-semibold text-[17px]">CV4 (compression du 4ème ventricule)</strong> vise précisément à rééquilibrer les flux et les pressions entre le <strong className="text-[#1c2e4a] font-semibold text-[17px]">LCR intra-crânien</strong> et le <strong className="text-[#1c2e4a] font-semibold text-[17px]">LCR extra-crânien (Zone B)</strong>. Le but est de restaurer une harmonie entre le microcosme (l'individu) et son environnement fluidique originel.
                                    </p>

                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Source: Jours 21 à 22 - Neurulation, Oeil et Cœur
                                    </p>
                                </div>

                                {/* MIDDLE SECTION (ROLE CLINIQUE) */}
                                <div>
                                    <h4 className="font-bebas text-[#1c2e4a] text-[24px] tracking-wide mb-5">RÔLE CLINIQUE ET PHYSIOLOGIQUE</h4>
                                    
                                    <h5 className="font-bebas text-[#1c2e4a] text-[19px] tracking-wide mb-3">LE "CONTRÔLEUR" DU CORPS</h5>
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Sur le plan physiologique, Marc Damoiseaux décrit le LCR comme le <strong className="text-[#1c2e4a] font-semibold text-[17px]">"contrôleur"</strong> qui assure l'équilibre moléculaire et hormonal spécifique du corps. Sa fabrication se fait via les <strong className="text-[#1c2e4a] font-semibold text-[17px]">plexus choroïdes</strong> et sa résorption par les <strong className="text-[#1c2e4a] font-semibold text-[17px]">granulations de Pacchioni</strong> dans le système veineux.
                                    </p>
                                    
                                    {/* BUTTON (ORANGE) */}
                                    <div className="bg-[#EB7E31] rounded-[18px] py-1 px-3 flex items-center gap-2 text-white shadow-sm mb-5 w-fit">
                                        <PlayCircle size={16} className="flex-shrink-0" />
                                        <span className="font-bold text-[12px] leading-tight pt-[1px] pr-1">Le Mésoderme • 19 - Le Systeme Veineux : Notes</span>
                                    </div>
                                </div>

                                {/* POTENCY SECTION */}
                                <div>
                                    <h5 className="font-bebas text-[#1c2e4a] text-[19px] tracking-wide mb-3 uppercase">Le véhicule de la "Potency" (Hors du cours de<br/>Damoiseaux)</h5>
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        Dans une vision biodynamique plus large, notamment influencée par les travaux de Sutherland et Jealous, le LCR est le véhicule de <strong className="text-[#1c2e4a] font-semibold text-[17px]">l'intelligence du Souffle de Vie</strong>. Sa fluctuation rythmique, la "Marée" (Tide), transporte une force thérapeutique organisatrice appelée la "Potency". Un praticien en biodynamie "écoute" cette fluctuation pour percevoir l'état de santé du système et accompagner sa réorganisation vers son plan de santé originel ("Blueprint").
                                    </p>
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6] mb-5">
                                        La qualité de la fluctuation du LCR informe le praticien sur les fulcrums (points d'appui) autour desquels la force de vie s'organise ou est entravée.
                                    </p>
                                </div>

                                {/* RÉSUMÉ SECTION */}
                                <div>
                                    <h5 className="font-bebas text-[#1c2e4a] text-[24px] tracking-wide mb-5">EN RÉSUMÉ POUR LA PRATIQUE</h5>
                                    
                                    <ul className="space-y-6">
                                        <li className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-[10px] flex-shrink-0" />
                                            <p className="text-[16.5px] leading-[1.6] text-[#4A5568]">
                                                <strong className="text-[#1c2e4a] font-semibold text-[17px]">Origine Fondamentale</strong> L'origine première du LCR est le <strong className="text-[#1c2e4a] font-semibold text-[17px]">liquide de la cavité amniotique</strong>, qui apparaît vers J7. Cette connexion ne doit jamais être oubliée.
                                            </p>
                                        </li>
                                        
                                        <li className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-[10px] flex-shrink-0" />
                                            <p className="text-[16.5px] leading-[1.6] text-[#4A5568]">
                                                <strong className="text-[#1c2e4a] font-semibold text-[17px]">Double Compartiment</strong> Pensez toujours au LCR en deux parties : <strong className="text-[#1c2e4a] font-semibold text-[17px]">intra-neural</strong> (dans les ventricules et le canal spinal) et <strong className="text-[#1c2e4a] font-semibold text-[17px]">extra-corporel</strong> (l'espace fluidique de la Zone B). Le but thérapeutique est souvent de rétablir la communication et l'équilibre entre les deux.
                                            </p>
                                        </li>

                                        <li className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-[10px] flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-[16.5px] leading-[1.6] text-[#4A5568] mb-4">
                                                    <strong className="text-[#1c2e4a] font-semibold text-[17px]">Qualité Tissulaire</strong> La qualité de la peau (<strong className="text-[#1c2e4a] font-semibold text-[17px]">ectoderme</strong>) est directement liée à la qualité du LCR, car ils partagent tous deux l'information du liquide amniotique primitif. Agir sur l'un peut influencer l'autre.
                                                </p>
                                                <div className="bg-[#60995c] rounded-[18px] py-1 px-3 flex items-center gap-2 text-white shadow-sm mb-2 w-fit">
                                                    <PlayCircle size={16} className="flex-shrink-0" />
                                                    <span className="font-bold text-[12px] leading-tight pt-[1px] pr-1">L'Ectoderme • 35 - La Plaque Neurale</span>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-[10px] flex-shrink-0" />
                                            <p className="text-[16.5px] leading-[1.6] text-[#4A5568]">
                                                <strong className="text-[#1c2e4a] font-semibold text-[17px]">L'Intelligence du LCR</strong> Plus qu'un simple fluide, c'est un milieu intelligent qui transporte le "plan de santé" originel. Accompagner sa fluctuation est un acte thérapeutique puissant pour permettre au corps de se réorganiser de l'intérieur.
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                                
                                {/* CONCLUSION */}
                                <div className="mt-4">
                                    <p className="text-[#4A5568] text-[16.5px] leading-[1.6]">
                                        J'espère que cette synthèse vous éclaire sur la place centrale qu'occupe le LCR dans notre approche. N'hésitez pas si vous avez d'autres questions
                                    </p>
                                </div>

                                {/* BOUTON PDF ORIGINAL AVEC CURSEUR */}
                                <div className="flex justify-end mt-4 mb-2">
                                    <div className="relative inline-block mt-4 mb-6">
                                        
                                        <div 
                                            className="relative flex items-center gap-2 font-bold text-[14px] uppercase tracking-[0.15em] pt-1 px-4 py-2 rounded-xl transition-colors w-fit"
                                            style={{ 
                                                backgroundColor: isHovered ? '#9B6B56' : 'transparent',
                                                color: isHovered ? '#FFFFFF' : '#9B6B56'
                                            }}
                                        >
                                            <Download size={18} strokeWidth={2} className="mb-0.5" />
                                            PDF
                                        </div>

                                        {/* Curseur de Souris relatif au bouton (garantit le clic parfait sur "PDF") */}
                                        <div 
                                            className="absolute z-50 pointer-events-none"
                                            style={{
                                                left: interpolate(cursorMove, [0, 1], [300, 35]), // Centre basique du petit bouton
                                                top: interpolate(cursorMove, [0, 1], [300, 10]), 
                                                opacity: interpolate(cursorMove, [0, 0.2, 1], [0, 1, 1])
                                            }}
                                        >
                                            <div className="relative" style={{ transform: `scale(${interpolate(cursorClick, [0, 0.5, 1], [1, 0.8, 1])})` }}>
                                                <MousePointer2 size={40} className="text-slate-800 absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" fill="white" strokeWidth={1.5} />
                                                
                                                {/* Animation de l'onde de choc du Clic */}
                                                <div 
                                                    className="absolute left-[-16px] top-[-16px] w-[70px] h-[70px] rounded-full border-[3px] border-[#9B6B56]"
                                                    style={{
                                                        opacity: interpolate(cursorClick, [0, 0.3, 1], [0, 1, 0]),
                                                        transform: `scale(${interpolate(cursorClick, [0, 1], [0.1, 2.5])})`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <div className="absolute bottom-[90px] left-0 right-0 px-6 z-20">
                <div className="relative flex items-center shadow-lg rounded-[24px] bg-white border border-slate-100 p-2">
                    <input
                        type="text"
                        placeholder="Posez votre question sur l'embryologie..."
                        className="w-full bg-transparent px-4 py-3 text-[16px] text-slate-800 focus:outline-none placeholder:text-slate-300 font-medium"
                        disabled
                    />
                    <button className="w-11 h-11 bg-[#Ccb4a7] text-white rounded-[18px] flex items-center justify-center shadow-sm">
                        <ArrowRight size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 h-[85px] bg-[#FAF8F5] border-t border-slate-200/60 flex items-center justify-between px-6 pb-4 pt-2 z-30">
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <Home size={24} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium">Accueil</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <Clock size={24} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium">Chronolo...</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <Video size={24} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium">Vidéos</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Brain size={26} strokeWidth={2.5} className="text-[#1c2e4a]" />
                    <span className="text-[10px] font-bold text-[#1c2e4a]">Assistant ...</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <LogOut size={24} strokeWidth={1.5} className="text-red-500" />
                    <span className="text-[10px] font-medium text-red-500">Quitter</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <Shield size={24} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium">Admin</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex overflow-hidden border border-slate-300">
                        <div className="w-1/3 h-full bg-blue-600" />
                        <div className="w-1/3 h-full bg-white" />
                        <div className="w-1/3 h-full bg-red-600" />
                    </div>
                    <span className="text-[10px] font-medium">FR</span>
                </div>
            </div>
        </div>
    );
};
