import React from 'react';
import { AbsoluteFill, Video, staticFile } from 'remotion';


export const SequenceF: React.FC = () => {
    // Lecture immersive en plein écran
    return (
        <AbsoluteFill className="bg-black">
            <Video 
                src={staticFile("5-Influence Notochorde.m4v")} 
                className="w-full h-full object-cover" 
                startFrom={190} // Transition douce de SequenceE
            />
        </AbsoluteFill>
    );
};
