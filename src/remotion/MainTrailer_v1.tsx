import { AbsoluteFill, Series } from 'remotion';
import { SequenceA } from './SequenceA';
import { SequenceB } from './SequenceB';
import { SequenceC } from './SequenceC';
import { SequenceD } from './SequenceD';
import { SequenceE } from './SequenceE';
import { SequenceF } from './SequenceF';
import { SequenceG } from './SequenceG';
import { SequenceH } from './SequenceH_v1';
import { SequenceI } from './SequenceI';
import { SequenceJ } from './SequenceJ_v1';
import { SequenceK } from './SequenceK_v1';
import { SequenceL } from './SequenceL';
import { CinematicLogo } from './components/CinematicLogo';

// This component stitches together all sequences so you can watch and scrub the entire trailer on one timeline.
export const MainTrailer_v1: React.FC = () => {
    return (
        <AbsoluteFill className="bg-[#FAF6ED]">
            <Series>
                {/* Sequence 0 : Intro Logo */}
                <Series.Sequence name="0 - Séquence Intro (Logo)" durationInFrames={240}>
                    <CinematicLogo />
                </Series.Sequence>

                {/* Séquence A à J */}
                <Series.Sequence name="1 - Séquence A (Intro)" durationInFrames={350}>
                    <SequenceA />
                </Series.Sequence>
                <Series.Sequence name="2 - Séquence B (Navigation)" durationInFrames={400}>
                    <SequenceB />
                </Series.Sequence>
                <Series.Sequence name="3 - Séquence C (Filtres)" durationInFrames={400}>
                    <SequenceC />
                </Series.Sequence>
                <Series.Sequence name="4 - Séquence D (Modèles 3D)" durationInFrames={306}>
                    <SequenceD />
                </Series.Sequence>
                <Series.Sequence name="5 - Séquence E (Notochorde Scroll)" durationInFrames={860}>
                    <SequenceE />
                </Series.Sequence>
                <Series.Sequence name="6 - Séquence F (Fin UI)" durationInFrames={141}>
                    <SequenceF />
                </Series.Sequence>
                <Series.Sequence name="7 - Séquence G (Outro)" durationInFrames={311}>
                    <SequenceG />
                </Series.Sequence>
                <Series.Sequence name="8 - Séquence H (Transcription détaillée)" durationInFrames={1020}>
                    <SequenceH />
                </Series.Sequence>
                <Series.Sequence name="9 - Séquence I (Sous-titres & Vidéo)" durationInFrames={720}>
                    <SequenceI />
                </Series.Sequence>
                <Series.Sequence name="10 - Séquence J (Chronologie)" durationInFrames={565}>
                    <SequenceJ />
                </Series.Sequence>

                {/* Sequence K : Assistant IA */}
                <Series.Sequence name="11 - Séquence K (Assistant IA)" durationInFrames={1078}>
                    <SequenceK />
                </Series.Sequence>

                {/* Sequence L : Promotion Finale Multi-Ecrans */}
                <Series.Sequence name="12 - Séquence L (Promotion Apple)" durationInFrames={350}>
                    <SequenceL />
                </Series.Sequence>

                {/* Sequence 13 : Outro Logo */}
                <Series.Sequence name="13 - Séquence Outro (Logo)" durationInFrames={240}>
                    <CinematicLogo hideAllText />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
