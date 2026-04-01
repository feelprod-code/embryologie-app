import { AbsoluteFill, Series, useVideoConfig } from 'remotion';
import { getSequenceDurationFrames, TIMELINE } from './config/timelineConfig';

import { SequenceA_v3 } from './SequenceA_v3';
import { SequenceB } from './SequenceB';
import { SequenceC } from './SequenceC';
import { SequenceD } from './SequenceD';
import { SequenceE } from './SequenceE';
import { SequenceF } from './SequenceF';
import { SequenceG } from './SequenceG';
import { SequenceH } from './SequenceH_v2';
import { SequenceI } from './SequenceI';
import { SequenceJ } from './SequenceJ_v2';
import { SequenceK } from './SequenceK_v2';
import { SequenceL } from './SequenceL';
import { CinematicLogo } from './components/CinematicLogo';

export const MainTrailer_9_16: React.FC = () => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill className="bg-[#FAF6ED]">
            {/* Version 9:16 : Pilotée par le log de montage timelineConfig.ts */}
            <Series>
                {/* 0 - Intro */}
                <Series.Sequence name={TIMELINE[0].name} durationInFrames={getSequenceDurationFrames('Intro', fps)}>
                    <CinematicLogo />
                </Series.Sequence>

                {/* 1 - Séquence A V3 : Adaptée au Vertical via les props */}
                <Series.Sequence name={TIMELINE[1].name} durationInFrames={getSequenceDurationFrames('SeqA_v3', fps)}>
                    {/* alternate={false} : L'iPhone en haut, le texte en bas */}
                    <SequenceA_v3 layoutFormat="9:16" alternate={false} />
                </Series.Sequence>

                {/* --- Séquences B à L --- */}
                {/* 
                  Note : Au fur et à mesure que les séquences seront refactorisées pour accepter 
                  layoutFormat et alternate, on pourra jouer avec ces variables pour dynamiser le rendu.
                */}
                <Series.Sequence name={TIMELINE[2].name} durationInFrames={getSequenceDurationFrames('SeqB', fps)}>
                    {/* TODO: ajouter layoutFormat="portrait" quand elle sera prête */}
                    <SequenceB />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[3].name} durationInFrames={getSequenceDurationFrames('SeqC', fps)}>
                    <SequenceC />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[4].name} durationInFrames={getSequenceDurationFrames('SeqD', fps)}>
                    <SequenceD />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[5].name} durationInFrames={getSequenceDurationFrames('SeqE', fps)}>
                    <SequenceE />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[6].name} durationInFrames={getSequenceDurationFrames('SeqF', fps)}>
                    <SequenceF />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[7].name} durationInFrames={getSequenceDurationFrames('SeqG', fps)}>
                    <SequenceG />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[8].name} durationInFrames={getSequenceDurationFrames('SeqH', fps)}>
                    <SequenceH />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[9].name} durationInFrames={getSequenceDurationFrames('SeqI', fps)}>
                    <SequenceI />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[10].name} durationInFrames={getSequenceDurationFrames('SeqJ', fps)}>
                    <SequenceJ />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[11].name} durationInFrames={getSequenceDurationFrames('SeqK', fps)}>
                    <SequenceK />
                </Series.Sequence>

                <Series.Sequence name={TIMELINE[12].name} durationInFrames={getSequenceDurationFrames('SeqL', fps)}>
                    <SequenceL />
                </Series.Sequence>

                {/* 13 - Outro */}
                <Series.Sequence name={TIMELINE[13].name} durationInFrames={getSequenceDurationFrames('Outro', fps)}>
                    <CinematicLogo hideAllText />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
