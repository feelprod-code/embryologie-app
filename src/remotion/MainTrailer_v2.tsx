import { AbsoluteFill, Series, Audio, staticFile } from 'remotion';
import { SequenceA } from './SequenceA';
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

// Version V2 : Calée MATHÉMATIQUEMENT sur 120 BPM (1 beat = 15 images, 1 mesure = 60 images)
export const MainTrailer_v2: React.FC = () => {
    return (
        <AbsoluteFill className="bg-[#FAF6ED]">
            {/* MUSIQUE GLOBALE 120 BPM */}
            <Audio src={staticFile("music_120bpm.mp3")} volume={0.8} />

            <Series>
                {/* Sequence 0 : Intro Logo */}
                <Series.Sequence name="0 - Séquence Intro (Logo)" durationInFrames={240}>
                    <CinematicLogo />
                </Series.Sequence>

                {/* Séquence A à J */}
                <Series.Sequence name="1 - Séquence A (Intro)" durationInFrames={240}>
                    <SequenceA />
                </Series.Sequence>
                <Series.Sequence name="2 - Séquence B (Navigation)" durationInFrames={240}>
                    <SequenceB />
                </Series.Sequence>
                <Series.Sequence name="3 - Séquence C (Filtres)" durationInFrames={240}>
                    <SequenceC />
                </Series.Sequence>
                <Series.Sequence name="4 - Séquence D (Modèles 3D)" durationInFrames={300}>
                    <SequenceD />
                </Series.Sequence>
                <Series.Sequence name="5 - Séquence E (Notochorde Scroll)" durationInFrames={420}>
                    <SequenceE />
                </Series.Sequence>
                <Series.Sequence name="6 - Séquence F (Fin UI)" durationInFrames={120}>
                    <SequenceF />
                </Series.Sequence>
                <Series.Sequence name="7 - Séquence G (Outro)" durationInFrames={240}>
                    <SequenceG />
                </Series.Sequence>
                <Series.Sequence name="8 - Séquence H (Transcription détaillée)" durationInFrames={540}>
                    <SequenceH />
                </Series.Sequence>
                <Series.Sequence name="9 - Séquence I (Sous-titres & Vidéo)" durationInFrames={420}>
                    <SequenceI />
                </Series.Sequence>
                <Series.Sequence name="10 - Séquence J (Chronologie)" durationInFrames={300}>
                    <SequenceJ />
                </Series.Sequence>

                {/* Sequence K : Assistant IA */}
                <Series.Sequence name="11 - Séquence K (Assistant IA)" durationInFrames={600}>
                    <SequenceK />
                </Series.Sequence>

                {/* Sequence L : Promotion Finale Multi-Ecrans */}
                <Series.Sequence name="12 - Séquence L (Promotion Apple)" durationInFrames={300}>
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
