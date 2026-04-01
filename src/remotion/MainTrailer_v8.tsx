import { AbsoluteFill, Series, useVideoConfig } from 'remotion';
import { SequenceA as SequenceA_v8 } from './SequenceA';
import { SequenceB as SequenceB_v8 } from './SequenceB';
import { SequenceC as SequenceC_v8 } from './SequenceC';
import { SequenceD } from './SequenceD';
import { SequenceE as SequenceE_v8 } from './SequenceE';
import { SequenceE_Zoom_v8 } from './SequenceE_Zoom_v8';
import { SequenceG as SequenceG_v8 } from './SequenceG';
import { SequenceH } from './SequenceH_v2';
import { SequenceI } from './SequenceI';
import { SequenceJ as SequenceJ_v7 } from './SequenceJ';
import { SequenceK_v7 } from './SequenceK_v7';
import { SequenceL as SequenceL_v7 } from './SequenceL';
import { CinematicLogo as CinematicLogo_v7 } from './components/CinematicLogo';
import { fpsS } from './hooks/useTime';

// Version Carrée (1:1) V8
export const MainTrailer_v8: React.FC = () => {
    const { fps } = useVideoConfig();
    return (
        <AbsoluteFill className="bg-[#FAF6ED]">
            {/* L'ancienne MUSIQUE GLOBALE 120 BPM est gardée, mais on pourra la recréer sur mesure ensuite */}

            <Series>
                {/* 0 - Intro coupée pour s'emboîter parfaitement avec la V3 */}
                {/* Icône de l'intro de 74 à 392 */}
                <Series.Sequence name="0 - Séquence Intro (Logo)" durationInFrames={fpsS(238, fps)}>
                    <CinematicLogo_v7 />
                </Series.Sequence>

                {/* 1 - Séquence A V8 : Split screen intro */}
                <Series.Sequence name="1 - Séquence A (Intro)" durationInFrames={fpsS(320, fps)}>
                    <SequenceA_v8 />
                </Series.Sequence>

                {/* --- Séquence B V8 (Retranscriptions) --- */}
                <Series.Sequence name="2 - Séquence B (Retranscriptions)" durationInFrames={fpsS(400, fps)}>
                    <SequenceB_v8 />
                </Series.Sequence>
                
                {/* --- Séquence C V8 (Langues) --- */}
                <Series.Sequence name="3 - Séquence C (Langues)" durationInFrames={fpsS(400, fps)}>
                    <SequenceC_v8 />
                </Series.Sequence>
                <Series.Sequence name="4 - Séquence D (Modèles 3D)" durationInFrames={fpsS(306, fps)}>
                    <SequenceD />
                </Series.Sequence>
                <Series.Sequence name="5 - Séquence E (Notochorde Scroll)" durationInFrames={fpsS(420, fps)}>
                    <SequenceE_v8 />
                </Series.Sequence>
                
                {/* --- CHUNK RE-ADDED: frames 499 to 669 from OLD sequence E, right at 1:04:19 --- */}
                <Series.Sequence name="6 - Séquence E Zoom (Fin V1 - Format Carré)" durationInFrames={fpsS(170, fps)}>
                    <SequenceE_Zoom_v8 />
                </Series.Sequence>
                
                <Series.Sequence name="7 - Séquence G (Outro Format Carré)" durationInFrames={fpsS(479, fps)}>
                    <SequenceG_v8 />
                </Series.Sequence>
                
                <Series.Sequence name="8 - Séquence H (Transcription détaillée)" durationInFrames={fpsS(540, fps)}>
                    <SequenceH />
                </Series.Sequence>
                <Series.Sequence name="9 - Séquence I (Sous-titres & Vidéo)" durationInFrames={fpsS(420, fps)}>
                    <SequenceI />
                </Series.Sequence>
                <Series.Sequence name="10 - Séquence J (Chronologie)" durationInFrames={fpsS(300, fps)}>
                    <SequenceJ_v7 />
                </Series.Sequence>

                {/* Sequence K : Assistant IA */}
                <Series.Sequence name="11 - Séquence K (Assistant IA)" durationInFrames={fpsS(600, fps)}>
                    <SequenceK_v7 />
                </Series.Sequence>

                {/* Sequence L : Promotion Finale Multi-Ecrans */}
                <Series.Sequence name="12 - Séquence L (Promotion Apple)" durationInFrames={fpsS(300, fps)}>
                    <SequenceL_v7 />
                </Series.Sequence>

                {/* Sequence 13 : Outro Logo */}
                <Series.Sequence name="13 - Séquence Outro (Logo)" durationInFrames={fpsS(240, fps)}>
                    <CinematicLogo_v7 hideAllText />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
