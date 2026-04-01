// timelineConfig.ts
// Ce fichier agit comme un "Log de montage" centralisé.
// Il gère la durée de chaque séquence indépendamment de la musique.
// Base 60 images par seconde (fps).
// On a augmenté la durée de chaque séquence de ~1 à 2 secondes par rapport à la V6 
// pour garantir une transition fluide et retrouver la lenteur/ambiance de la V1.

import { fpsS } from '../hooks/useTime';

export type SequenceId = 
  | 'Intro' 
  | 'SeqA_v3' 
  | 'SeqB' 
  | 'SeqC' 
  | 'SeqD' 
  | 'SeqE' 
  | 'SeqF' 
  | 'SeqG' 
  | 'SeqH' 
  | 'SeqI' 
  | 'SeqJ' 
  | 'SeqK' 
  | 'SeqL' 
  | 'Outro';

export interface SequenceConfig {
  id: SequenceId;
  name: string;
  durationInSeconds: number; // Exprimé en secondes pour plus de clarté
}

export const TIMELINE: SequenceConfig[] = [
  { id: 'Intro',   name: '0 - Séquence Intro (Logo)', durationInSeconds: 5 },       // 300 frames @60fps (était 238)
  { id: 'SeqA_v3', name: '1 - Séquence A (Intro)',    durationInSeconds: 4 },       // 240 frames @60fps (était 166 - trop rapide)
  { id: 'SeqB',    name: '2 - Séquence B (Nav)',      durationInSeconds: 8 },       // 480 frames @60fps (était 400)
  { id: 'SeqC',    name: '3 - Séquence C (Filtres)',  durationInSeconds: 8 },       // 480 frames @60fps (était 400)
  { id: 'SeqD',    name: '4 - Séquence D (3D)',       durationInSeconds: 6.5 },     // 390 frames @60fps (était 306)
  { id: 'SeqE',    name: '5 - Séquence E (Noto)',     durationInSeconds: 8.5 },     // 510 frames @60fps (était 420)
  { id: 'SeqF',    name: '6 - Séquence F (Fin UI)',   durationInSeconds: 4 },       // 240 frames @60fps (était 120 - quasi invisible)
  { id: 'SeqG',    name: '7 - Séquence G (Outro)',    durationInSeconds: 8.5 },     // 510 frames @60fps (était 450)
  { id: 'SeqH',    name: '8 - Séquence H (Transcription)', durationInSeconds: 10 },   // 600 frames @60fps (était 540)
  { id: 'SeqI',    name: '9 - Séquence I (Sous-titres)', durationInSeconds: 12 },   // 720 frames @60fps (était déjà 12)
  { id: 'SeqJ',    name: '10 - Séquence J (Chrono)',  durationInSeconds: 6 },       // 360 frames @60fps (était 300)
  { id: 'SeqK',    name: '11 - Séquence K (Chatbot)', durationInSeconds: 10 },      // 600 frames @60fps (était 600)
  { id: 'SeqL',    name: '12 - Séquence L (Apple)',   durationInSeconds: 6 },       // 360 frames @60fps (était 300)
  { id: 'Outro',   name: '13 - Séquence Outro (Logo)',durationInSeconds: 5 },       // 300 frames @60fps (était 240)
];

export const TOTAL_DURATION_SECONDS = TIMELINE.reduce((acc, seq) => acc + seq.durationInSeconds, 0);

// Utilitaire pour convertir directement ce tableau dans les props <Series.Sequence> de Remotion
// On injecte le fps du contexte Remotion pour avoir toujours le compte exact de frames
export const getSequenceDurationFrames = (id: SequenceId, fps: number): number => {
  const seq = TIMELINE.find((s) => s.id === id);
  if (!seq) throw new Error(`Sequence '${id}' non trouvée dans timelineConfig.ts`);
  return fpsS(seq.durationInSeconds * 60, fps); // fpsS est optimisé pour 60fps base
};

export const getTotalDurationFrames = (fps: number): number => {
  return fpsS(TOTAL_DURATION_SECONDS * 60, fps);
};

