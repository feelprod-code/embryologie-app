import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Video, staticFile, Sequence, Audio } from 'remotion';
import { fpsS } from '../hooks/useTime';

export const CinematicLogo: React.FC<{ hidePresente?: boolean; hideAllText?: boolean }> = ({ hidePresente = false, hideAllText = false }) => {
    const actualFrame = useCurrentFrame();
    const { fps: realFps } = useVideoConfig();
    const frame = actualFrame * (30 / realFps);
    const fps = 30;

    // The logo stays on screen the entire time.
    const logoScale = interpolate(frame, [0, 180], [0.95, 1.02], { extrapolateRight: 'clamp' });

    // Texts fade in softly
    const textOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    
    // Very subtle y-movement for texts
    const textY = spring({
        fps,
        frame: frame - 10,
        config: { damping: 20, mass: 2 }
    });

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex flex-col items-center justify-center font-sans">
            
            {/* TEXTES */}
            {!hideAllText && (
                <div 
                    className="absolute top-[8%] w-full text-center z-20 flex flex-col items-center"
                    style={{ opacity: textOpacity, transform: `translateY(${interpolate(textY, [0, 1], [-20, 0])}px)` }}
                >
                    <h2 className="text-[#0a192f] font-bebas tracking-widest text-[50px] leading-[1] opacity-70 mb-8">
                        TECHNIQUES DOUCES TISSULAIRES
                        {!hidePresente && <span className="text-[#9B6B56] ml-3">PRÉSENTE</span>}
                    </h2>
                    
                    <div className="flex flex-col items-center mt-2">
                        <h1 className="text-[#1c2e4a] font-anton tracking-widest text-[130px] leading-[0.85] uppercase drop-shadow-sm">
                            L'EMBRYOLOGIE
                        </h1>
                        <h1 className="text-[#F2A374] font-anton tracking-widest text-[120px] leading-[0.85] uppercase mt-3 drop-shadow-sm">
                            BIODYNAMIQUE
                        </h1>
                        <h3 className="text-[#4171B5] font-medium tracking-[0.3em] text-[35px] mt-8 uppercase opacity-90">
                            de Marc Damoiseaux
                        </h3>
                    </div>
                </div>
            )}

            {/* SOUND EFFECTS */}
            {!hideAllText && (
                <>
                    {/* Bruitage pour l'apparition de l'icône chinoise à la frame 74 (60fps) = 37 (30fps) */}
                    <Sequence name="Bruitage - click.wav" from={fpsS(37, realFps)}>
                        {/* ⚠️ FeelProd : Remplace 'click.wav' par un 'woosh.wav' pour l'apparition de l'icône */}
                        <Audio src={staticFile('click.wav')} volume={0.6} />
                    </Sequence>

                    {/* BRUITAGE DES TITRES A 1.52s (~ frame 45 at 30fps, ~ frame 91 at 60fps) */}
                    <Sequence name="Bruitage - click.wav" from={fpsS(45, realFps)}>
                        {/* ⚠️ FeelProd : Remplace 'click.wav' par ton bruitage épique 'impact.mp3' */}
                        <Audio src={staticFile('click.wav')} volume={1} />
                    </Sequence>
                </>
            )}

            {/* LOGO ENTIER (Diminué et placé en dessous) - Apparition à 74 (60fps) = 37 (30fps) */}
            <Sequence from={fpsS(37, realFps)}>
                <div 
                    className="absolute z-0 pointer-events-none" 
                    style={{ 
                        left: '50%', 
                        top: '490px', 
                        width: '550px', 
                        height: '550px', 
                        transform: `translate(-50%, 0) scale(${logoScale})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Video 
                        src={staticFile('WUWAI ANIM.MP4')} 
                        muted={true}
                        playbackRate={1.5}
                        style={{ 
                            maskImage: 'radial-gradient(circle at center, black 45%, transparent 70%)',
                            WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 70%)',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            </Sequence>

            
        </AbsoluteFill>
    );
};
