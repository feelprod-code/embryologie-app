import { AbsoluteFill, Series, Audio, staticFile } from 'remotion';
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

// Version V3 : Montage compressé et recalibré selon le Picture Lock 
// (Arrivée du plan "Écoutons Marc" à la frame 287 = 9s17f)
export const MainTrailer_v3: React.FC = () => {
    return (
        <AbsoluteFill className="bg-[#FAF6ED]">
            {/* L'ancienne MUSIQUE GLOBALE 120 BPM est gardée, mais on pourra la recréer sur mesure ensuite */}
            <Audio src={staticFile("music_120bpm.mp3")} volume={0.8} />

            <Series>
                {/* 0 - Intro coupée pour s'emboîter parfaitement avec la V3 */}
                {/* Durée = 213 frames (7 secondes et 3 frames à 30fps) */}
                <Series.Sequence name="0 - Séquence Intro (Logo)" durationInFrames={213}>
                    <CinematicLogo />
                </Series.Sequence>

                {/* 1 - Séquence A V3 : Accélérée et sonorisée ! */}
                {/* L'animation finit à la frame 36, et on la laisse respirer jusqu'à 9s20f (77 frames au total) */}
                <Series.Sequence name="1 - Séquence A (Intro Acceleree)" durationInFrames={77}>
                    <SequenceA_v3 />
                </Series.Sequence>

                {/* --- Séquence B (Navigation accélérée) --- */}
                {/* 213 + 77 = 290 (9s20f). Séquence B dure 147 frames pour finir vers 14s17f (437 frames). */}
                <Series.Sequence name="2 - Séquence B (Navigation)" durationInFrames={147}>
                    <SequenceB />
                </Series.Sequence>
                <Series.Sequence name="3 - Séquence C (Filtres)" durationInFrames={141}>
                    <SequenceC />
                </Series.Sequence>
                <Series.Sequence name="4 - Séquence D (Modèles 3D)" durationInFrames={168}>
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
