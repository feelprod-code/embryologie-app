import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate, Sequence, Audio, staticFile } from 'remotion';
import { fpsS } from './hooks/useTime';

export const SequenceA_v8: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const text1Scale = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, mass: 0.5, stiffness: 200 } });
    const text1Opac = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const text1Out = interpolate(frame, [80, 90], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    const titleScale = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 14 } });
    const titleOpac = interpolate(frame, [100, 110], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const titleOut = interpolate(frame, [190, 205], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    const quoteScale = spring({ frame: Math.max(0, frame - 215), fps, config: { damping: 14 } });
    const quoteOpac = interpolate(frame, [215, 225], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    return (
        <AbsoluteFill className="bg-[#FAF6ED] flex items-center justify-center">
            {/* Claviers Audio Sound Design */}
            <Sequence name="Sfx Typewriter 1" from={fpsS(15, fps)} durationInFrames={fpsS(60, fps)}>
                <Audio src={staticFile('typewriter.wav')} volume={0.5} />
            </Sequence>
            <Sequence name="Sfx Typewriter 2" from={fpsS(100, fps)} durationInFrames={fpsS(80, fps)}>
                <Audio src={staticFile('typewriter.wav')} volume={0.6} />
            </Sequence>

            {/* MESSAGE 1 */}
            {frame >= 15 && frame < 90 && (
                <div 
                    className="absolute flex items-center justify-center w-full"
                    style={{
                        opacity: text1Opac * text1Out,
                        transform: `scale(${interpolate(text1Scale, [0, 1], [0.9, 1])})`
                    }}
                >
                    <div className="font-bebas text-slate-800 text-[120px] tracking-wider uppercase drop-shadow-sm text-center">
                        UN NOUVEAU MOYEN
                        <br />
                        <span className="text-[#F27D33]">D'APPRENDRE</span>
                    </div>
                </div>
            )}

            {/* TITLE 2 */}
            {frame >= 100 && frame <= 210 && (
                <div 
                    className="absolute flex flex-col items-center justify-center w-full"
                    style={{
                        opacity: titleOpac * titleOut,
                        transform: `scale(${interpolate(titleScale, [0, 1], [0.9, 1])})`
                    }}
                >
                    <div className="font-handwriting text-[#5A9C51] text-[60px] font-bold drop-shadow-sm leading-none rotate-[-2deg] -mb-4">
                        Toute la plateforme centralisée
                    </div>
                    <div className="font-bebas text-slate-800 text-[140px] tracking-widest uppercase drop-shadow-md text-center mt-6 leading-[0.9]">
                        EMBRYOLOGIE
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4171B5] to-[#5A9C51]">
                            L'APP FeelProd
                        </span>
                    </div>
                </div>
            )}

            {/* QUOTE 3 */}
            {frame >= 215 && (
                <div 
                    className="absolute flex flex-col items-center justify-center w-full px-20 text-center"
                    style={{
                        opacity: quoteOpac,
                        transform: `scale(${interpolate(quoteScale, [0, 1], [0.95, 1])})`
                    }}
                >
                    <div className="font-serif text-slate-600 italic text-[50px] font-medium leading-[1.3] max-w-[800px]">
                        "Une immersion visuelle et sonore dans la conception du corps humain."
                    </div>
                </div>
            )}
        </AbsoluteFill>
    );
};
