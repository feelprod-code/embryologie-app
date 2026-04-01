import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Img } from 'remotion';

// Import local des mocks UI
import { MockSMS } from './app-ui-mocks/MockSMS';
import { MockAuthForm } from './app-ui-mocks/MockAuthForm';
import { MockOTP } from './app-ui-mocks/MockOTP';
import { MockPaywall } from './app-ui-mocks/MockPaywall';
import { MockAppDiscovery } from './app-ui-mocks/MockAppDiscovery';

export const SequenceTutorial: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 9 Etapes => de 0 à 8
    const currentStepIndex = 
        frame >= 860 ? 8 :
        frame >= 780 ? 7 : 
        frame >= 700 ? 6 : 
        frame >= 500 ? 5 : 
        frame >= 400 ? 4 : 
        frame >= 300 ? 3 : 
        frame >= 220 ? 2 : 
        frame >= 100 ? 1 : 0;

    const steps = [
        { title: "RÉCEPTION DU LIEN", sub: "1. OUVERTURE", desc: "Cliquez sur le lien reçu par SMS ou email. L'application est directement accessible sur ordinateur, tablette et mobile." },
        { title: "VOS COORDONNÉES", sub: "2. INSCRIPTION", desc: "Renseignez simplement vos informations personnelles pour créer votre compte." },
        { title: "VOS IDENTIFIANTS", sub: "3. ENVOI", desc: "Vous recevez ensuite instantanément votre mot de passe unique par message ou email." },
        { title: "MOT DE PASSE REÇU", sub: "3. CONFIRMATION", desc: "Votre accès étudiant est généré. Vous avez bien reçu vos identifiants dans votre boite mail." },
        { title: "CONNEXION SÉCURISÉE", sub: "4. ESPACE PERSONNEL", desc: "Saisissez votre mot de passe pour vous connecter à la plateforme." },
        { title: "DÉCOUVERTE LIBRE", sub: "5. BIENVENUE", desc: "Explorez l'accueil, les podcasts et la chronologie librement avant d'aller plus loin." },
        { title: "VOTRE SOUSCRIPTION", sub: "6. DÉBLOCAGE", desc: "Vous y retrouverez l'offre vidéo détaillée. Laissez-vous guider pour y accéder." },
        { title: "PAIEMENT LIBRE", sub: "7. RÈGLEMENT", desc: "Réglez en toute sérénité avec la méthode de votre choix (Apple Pay, CB...). C'est 100% sécurisé." },
        { title: "C'EST PARTI !", sub: "8. VALIDATION", desc: "Votre règlement est validé ! Votre plateforme vidéo immersive est maintenant totalement ouverte." }
    ];

    const currentStep = steps[currentStepIndex];
    const stepStartTimes = [0, 100, 220, 300, 400, 500, 700, 780, 860];
    const stepStartTime = stepStartTimes[currentStepIndex];
    // frame relative a l'etape courante pour le declenchement precis
    const relativeFrame = frame - stepStartTime;

    const textFade = spring({ frame: relativeFrame, fps, config: { damping: 15 }});
    const textSlide = interpolate(textFade, [0, 1], [30, 0]);
    const textOpacity = interpolate(textFade, [0, 1], [0, 1]);

    const isContinuingImage = currentStepIndex === 1;
    const imageFadeIn = spring({ frame: frame - (isContinuingImage ? 0 : stepStartTime), fps, config: { damping: 15 }});
    const mockupOpacity = isContinuingImage ? 1 : interpolate(imageFadeIn, [0, 1], [0, 1]);
    const mockupSlide = isContinuingImage ? 0 : interpolate(imageFadeIn, [0, 1], [20, 0]);

    const desktopFade = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 15 }});
    const tabletteFade = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 15 }});

    // Flash de transition entre l'étape 0 et 1 (clic à la frame 97, cut à 100)
    const flashOpacity = currentStepIndex <= 1 
        ? interpolate(frame, [97, 100, 103], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : 0;

    const renderContent = () => {
        switch (currentStepIndex) {
            case 0:
                // Device intro
                return (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute right-[0%] top-[25%] w-[65%] shadow-2xl rounded-2xl overflow-hidden border-[4px] border-slate-800"
                             style={{ opacity: interpolate(desktopFade, [0, 1], [0, 1]), transform: `translateX(${interpolate(desktopFade, [0, 1], [20, 0])}px)` }}
                        >
                             <Img src={staticFile('FINAL/DEKSTOP.png')} className="w-full h-auto object-cover" />
                        </div>
                        <div className="absolute left-[5%] bottom-[20%] w-[45%] shadow-xl rounded-2xl overflow-hidden border-[4px] border-slate-800"
                             style={{ opacity: interpolate(tabletteFade, [0, 1], [0, 1]), transform: `translateX(${interpolate(tabletteFade, [0, 1], [-20, 0])}px)` }}
                        >
                             <Img src={staticFile('FINAL/TABLETTE.png')} className="w-full h-auto object-cover" />
                        </div>
                        <div className="absolute z-10 w-[32%] aspect-[9/19] shadow-2xl rounded-[30px] overflow-hidden border-[6px] border-slate-800 bg-white"
                             style={{ opacity: mockupOpacity, transform: `translateY(${mockupSlide}px)`, left: `30%` }}
                        >
                             {/* Contenu mobile */}
                             <MockSMS frame={relativeFrame} />
                        </div>
                    </div>
                );
            case 1:
                return <MockAuthForm frame={relativeFrame} />;
            case 2:
                // Reception OTP via fake email/sms screen
                return <MockSMS frame={relativeFrame} clickTarget="notification" bgImage="FINAL/2.png" />;
            case 3:
                // VOS IDENTIFIANTS: Mail de réception avec numéros de code (Image 2) + Vignette Verte à l'Extérieur
                const checkScale = interpolate(spring({ frame: relativeFrame, fps, config: { damping: 12 } }), [0, 1], [0, 1]);
                
                return (
                    <div className="w-full h-full relative bg-white rounded-[24px] overflow-visible">
                        {/* L'image de l'iPhone (Mail) est clippée */}
                        <div className="absolute inset-0 rounded-[24px] overflow-hidden">
                            <Img src={staticFile('FINAL/2.png')} className="absolute inset-0 w-full h-full object-cover" />
                            <div 
                                className="absolute inset-0 mix-blend-overlay pointer-events-none"
                                style={{ 
                                    backgroundColor: '#22c55e', 
                                    opacity: interpolate(spring({ frame: relativeFrame, fps, config: { damping: 20 } }), [0, 0.5, 1], [0, 0.3, 0])
                                }}
                            />
                        </div>

                        {/* Bannière de succès "chic" verte à l'extérieur de l'iPhone, plus grande */}
                        {/* Bannière de succès "chic" verte à l'extérieur de l'iPhone, plus grande et vers le bas pour ne pas chevaucher le titre */}
                        <div 
                            className="absolute right-[110%] top-[65%] flex flex-col items-center justify-center gap-4 bg-white text-[#2e7d32] border-[3px] border-[#a5d6a7] p-8 rounded-[36px] shadow-[0_30px_70px_rgba(34,197,94,0.25)] w-[500px]"
                            style={{ 
                                opacity: spring({ frame: Math.max(0, relativeFrame - 5), fps, config: { damping: 14 } }),
                                transform: `scale(${interpolate(spring({ frame: relativeFrame, fps, config: { damping: 12 } }), [0, 1], [0.8, 1])})`
                            }}
                        >
                            <div className="flex items-center gap-6 w-full">
                                <div className="w-20 h-20 bg-[#4caf50] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg" style={{ transform: `scale(${checkScale})` }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-[34px] leading-tight text-slate-800">Code réceptionné !</span>
                                    <span className="font-medium text-[22px] text-slate-500 leading-tight mt-1">Vos accès sont désormais disponibles.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return <MockOTP frame={relativeFrame} />;
            case 5:
                return <MockAppDiscovery frame={relativeFrame} />;
            case 6:
                return <MockPaywall frame={relativeFrame} />;
            case 7:
                return <Img src={staticFile('FINAL/CB 1.png')} className="w-full h-full object-cover" />;
            case 8:
                return <Img src={staticFile('FINAL/6.png')} className="w-full h-full object-cover" />;
            default:
                return null;
        }
    }

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center font-sans overflow-hidden">
            
            {/* TEXT SECTION - LEFT */}
            <div className="absolute top-1/2 left-16 flex flex-col z-20 p-8 w-[40%] text-left -translate-y-1/2"
                 style={{ opacity: textOpacity, transform: `translateY(${textSlide}px)` }}
            >
                <div className="font-handwriting text-[#5A9C51] text-[65px] font-bold drop-shadow-sm leading-none rotate-[-3deg] mb-2">
                    {currentStep.sub}
                </div>
                <h2 className="font-bebas text-[#4171B5] text-[90px] leading-[0.95] tracking-wider drop-shadow-sm uppercase">
                    {currentStep.title}
                </h2>
                <p className="font-sans text-[26px] text-slate-500 font-medium leading-snug mt-6 border-l-4 border-[#F27D33] pl-6">
                    {currentStep.desc}
                </p>
                
                {/* Dots indicator */}
                <div className="flex gap-2 mt-8">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-8 bg-[#4171B5]' : 'w-2 bg-slate-300'}`} />
                    ))}
                </div>
            </div>

            {/* VISUALS SECTION - RIGHT */}
            <div className="absolute right-[5%] w-[50%] h-full flex items-center justify-center z-10 py-12">
                {currentStepIndex === 0 ? (
                     renderContent()
                ) : (
                    <div 
                        className="relative w-[45%] lg:w-[40%] aspect-[9/19] rounded-[30px] min-h-[60%] max-h-[85%] shadow-2xl border-[6px] border-slate-800 bg-white overflow-visible"
                        style={{
                            opacity: mockupOpacity,
                            transform: `translateY(${mockupSlide}px)`
                        }}
                    >
                         {/* Wrapper for phone screen to clip backgrounds but allow outer popups via portals or absolute positioning outwards if needed. 
                             Wait, if the popup is inside MockSMS, it will still be inside renderContent. We must NOT clip renderContent. 
                             Instead, MockSMS itself should have the overflow-hidden for the background. */}
                         <div className="w-full h-full relative rounded-[24px]">   
                              {renderContent()}
                         </div>
                    </div>
                )}
            </div>

            {/* Flash Overlay pour la transition douce du clic (frame 97) au changement d'écran (frame 100) */}
            <div 
                className="absolute inset-0 bg-white z-[100] pointer-events-none mix-blend-screen" 
                style={{ opacity: flashOpacity }} 
            />
            
        </AbsoluteFill>
    );
};

