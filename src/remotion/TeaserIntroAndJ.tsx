import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SequenceA } from './SequenceA';
import { SequenceJ } from './SequenceJ';
import { CinematicLogo } from './components/CinematicLogo';

export const TeaserIntroAndJ: React.FC = () => {
    return (
        <AbsoluteFill className="bg-[#FAF6ED]">
            <Series>
                {/* Logo Intro */}
                <Series.Sequence name="Logo Intro" durationInFrames={240}>
                    <CinematicLogo />
                </Series.Sequence>

                {/* Séquence A (Intro) */}
                <Series.Sequence name="Intro App" durationInFrames={350}>
                    <SequenceA />
                </Series.Sequence>

                {/* Séquence 10 (Chronologie) */}
                <Series.Sequence name="Chronologie" durationInFrames={565}>
                    <SequenceJ />
                </Series.Sequence>

                {/* Logo Outro */}
                <Series.Sequence name="Logo Outro" durationInFrames={240}>
                    <CinematicLogo hideAllText />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
