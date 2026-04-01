import { AbsoluteFill, Series, useVideoConfig } from 'remotion';
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
import { fpsS } from './hooks/useTime';

// Version V6 : Sans musique globale, avec bruitages de clics
export const MainTrailer_v6: React.FC = () => {
    const { fps } = useVideoConfig();
    return (
        <AbsoluteFill className="bg-[#FAF6ED]">
            {/* L'ancienne MUSIQUE GLOBALE 120 BPM est gardée, mais on pourra la recréer sur mesure ensuite */}

            <Series>
                {/* 0 - Intro coupée pour s'emboîter parfaitement avec la V3 */}
                {/* Icône de l'intro de 74 à 392 */}
                <Series.Sequence name="0 - Séquence Intro (Logo)" durationInFrames={fpsS(238, fps)}>
                    <CinematicLogo />
                </Series.Sequence>

                {/* 1 - Séquence A V3 : Accélérée et sonorisée ! */}
                {/* Clic à 464 (relatif 72 à 60fps, ou 36 à 30fps base) ; Séquence s'arrête à 724 */}
                <Series.Sequence name="1 - Séquence A (Intro Acceleree)" durationInFrames={fpsS(166, fps)}>
                    <SequenceA_v3 />
                </Series.Sequence>

                {/* --- Séquence B (Navigation) --- */}
                {/* Restauré à 400 frames (base 30fps) pour ne pas couper le contenu */}
                <Series.Sequence name="2 - Séquence B (Navigation)" durationInFrames={fpsS(400, fps)}>
                    <SequenceB />
                </Series.Sequence>
                <Series.Sequence name="3 - Séquence C (Filtres)" durationInFrames={fpsS(400, fps)}>
                    <SequenceC />
                </Series.Sequence>
                <Series.Sequence name="4 - Séquence D (Modèles 3D)" durationInFrames={fpsS(306, fps)}>
                    <SequenceD />
                </Series.Sequence>
                <Series.Sequence name="5 - Séquence E (Notochorde Scroll)" durationInFrames={fpsS(420, fps)}>
                    <SequenceE />
                </Series.Sequence>
                <Series.Sequence name="6 - Séquence F (Fin UI)" durationInFrames={fpsS(120, fps)}>
                    <SequenceF />
                </Series.Sequence>
                <Series.Sequence name="7 - Séquence G (Outro)" durationInFrames={fpsS(450, fps)}>
                    <SequenceG />
                </Series.Sequence>
                <Series.Sequence name="8 - Séquence H (Transcription détaillée)" durationInFrames={fpsS(540, fps)}>
                    <SequenceH />
                </Series.Sequence>
                <Series.Sequence name="9 - Séquence I (Sous-titres & Vidéo)" durationInFrames={fpsS(720, fps)}>
                    <SequenceI />
                </Series.Sequence>
                <Series.Sequence name="10 - Séquence J (Chronologie)" durationInFrames={fpsS(300, fps)}>
                    <SequenceJ />
                </Series.Sequence>

                {/* Sequence K : Assistant IA */}
                <Series.Sequence name="11 - Séquence K (Assistant IA)" durationInFrames={fpsS(600, fps)}>
                    <SequenceK />
                </Series.Sequence>

                {/* Sequence L : Promotion Finale Multi-Ecrans */}
                <Series.Sequence name="12 - Séquence L (Promotion Apple)" durationInFrames={fpsS(300, fps)}>
                    <SequenceL />
                </Series.Sequence>

                {/* Sequence 13 : Outro Logo */}
                <Series.Sequence name="13 - Séquence Outro (Logo)" durationInFrames={fpsS(240, fps)}>
                    <CinematicLogo hideAllText />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
