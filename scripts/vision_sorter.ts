import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

// Polyfill pour pouvoir exécuter avec ts-node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser Gemini AI avec la clé de Philippe (stockée dans l'environnement)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// Dossiers
const BASE_DIR = '/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder';
const ECTO_DIR = path.join(BASE_DIR, 'Ectoderme');
const ENDO_DIR = path.join(BASE_DIR, 'Endoderme');
const MESO_DIR = path.join(BASE_DIR, 'Mesoderme');
const PODCAST_DIR = path.join(BASE_DIR, 'Podcast_Embryologie');

// Résumés des chapitres par vidéo (pour aider l'IA à choisir)
// Ces descriptions viennent des transcriptions et de ton document mapping_phases.md
const videoContexts = {
  Ectoderme: {
    Video_1: "Phase 1: Formation de l'ectoderme, plaque ectoblastique, orientation céphalo-caudale, ligne primitive, nœud de Hensen, migration cellulaire globale, épiblaste, hypoblaste.",
    Video_2: "Phase 2: Neurulation, allongement du tube neural, fermeture des neuropores (antérieur et postérieur), cellules de la crête neurale, neuroectoblaste, interaction avec la chorde."
  },
  Endoderme: {
    Video_1: "Phase 3 (Début): Délimitation de l'embryon, plicature (latérale et céphalo-caudale), intégration de la vésicule vitelline, formation du tube digestif primitif, intestin antérieur, moyen et postérieur, canal vitellin.",
    Video_2: "Phase 3 (Fin): Développement des bourgeons du système digestif, foie, pancréas, voies respiratoires (trachée, poumons), cloisonnement cloacal."
  },
  Mesoderme: {
    Video_1: "Phase 4 (Début): Paraxial et Somites. Métamérisation, somites (sclérotome, dermomyotome), chorde, mésoderme intermédiaire (cordons néphrogènes, appareil uro-génital).",
    Video_2: "Phase 4 (Fin): Lames latérales (splanchnopleure, somatopleure), coelome intra-embryonnaire, système cardiovasculaire, aorte dorsale, vaisseaux."
  }
};

// Fonction pour convertir une image locale en format pour l'API Gemini
function fileToGenerativePart(filePath: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}

async function analyzeAndMove(folderPath: string, feuillet: 'Ectoderme'|'Endoderme'|'Mesoderme') {
  const vracFolder = fs.readdirSync(folderPath).find(f => f.startsWith('Vracc_'));
  if (!vracFolder) return;
  
  const vracPath = path.join(folderPath, vracFolder);
  const video1Path = path.join(folderPath, 'Video_1');
  const video2Path = path.join(folderPath, 'Video_2');
  
  const files = fs.readdirSync(vracPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  console.log(`\n=== Analyse de ${files.length} images dans ${feuillet} ===`);
  
  let successCount = 0;
  
  for (const file of files) {
    const filePath = path.join(vracPath, file);
    const mimeType = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    try {
      const imagePart = fileToGenerativePart(filePath, mimeType);
      
      const prompt = `Voici un schéma d'embryologie issu du cours sur le feuillet: ${feuillet}.
Regarde attentivement les légendes textuelles écrites sur le schéma et les structures anatomiques dessinées.

Sujets de la Vidéo 1: ${videoContexts[feuillet].Video_1}
Sujets de la Vidéo 2: ${videoContexts[feuillet].Video_2}

Réponds UNIQUEMENT par "Video_1" ou par "Video_2" selon le contenu qui correspond le mieux à ce schéma. Ne justifie pas, donne juste le nom du dossier. S'il y a un doute, choisis ce qui semble le plus proche géométriquement ou temporellement.`;

      const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: [prompt, imagePart]
      });
      
      const choice = response.text.trim().replace(/[^a-zA-Z0-9_]/g, '');
      
      if (choice === 'Video_1') {
        fs.renameSync(filePath, path.join(video1Path, file));
        successCount++;
        console.log(`[${feuillet}] ${file} -> Video_1`);
      } else if (choice === 'Video_2') {
        fs.renameSync(filePath, path.join(video2Path, file));
        successCount++;
        console.log(`[${feuillet}] ${file} -> Video_2`);
      } else {
        console.log(`[${feuillet}] ${file} -> Incertain: ${response.text}`);
      }
      
      // Petit délai pour ne pas taper le rate limit de Gemini 
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (e: any) {
      console.error(`Erreur sur l'image ${file}: ${e.message}`);
    }
  }
  
  console.log(`-> ${successCount}/${files.length} images triées pour ${feuillet}.`);
}

async function run() {
  console.log("Démarrage du Smart Vision Sorter avec Gemini 2.5 Flash...\n");
  
  try {
     await analyzeAndMove(ECTO_DIR, 'Ectoderme');
     await analyzeAndMove(ENDO_DIR, 'Endoderme');
     await analyzeAndMove(MESO_DIR, 'Mesoderme');
     
     console.log("\n✅ Tri automatique par IA terminé avec succès !");
  } catch (e) {
      console.error("Erreur fatale:", e);
  }
}

run();
