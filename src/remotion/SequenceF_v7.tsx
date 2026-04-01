import React from 'react';
import { AbsoluteFill, Video, staticFile } from 'remotion';

export const SequenceF_v7: React.FC = () => {
    // Lecture immersive en plein écran avec flou de fond (9:16)
    return (
        <AbsoluteFill className="bg-black">
            {/* Flou vidéo de fond pour habiller le 9:16 car la vidéo source est en 16:9 */}
            <Video 
                src={staticFile("5-Influence Notochorde.m4v")} 
                className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[60px] scale-110" 
                startFrom={190}
            />
            {/* Vidéo principale formatée correctement au centre */}
            <Video 
                src={staticFile("5-Influence Notochorde.m4v")} 
                className="absolute inset-0 w-full h-full object-contain z-10" 
                startFrom={190} 
            />
        </AbsoluteFill>
    );
};
