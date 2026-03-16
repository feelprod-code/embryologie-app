import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { videoCourses } from '../src/data/videoCourses';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenRouter API Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_NAME = 'google/gemini-2.5-flash';

async function callOpenRouterVision(base64Image: string, mimeType: string, prompt: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Map folder names to categoryId in DB
const folderToCategoryMap: Record<string, string> = {
  'Ectoderme': 'ectoderme',
  'Endoderme': 'endoderme',
  'Mesoderme': 'mesoderme',
  'Phase_4': 'phase4' // au cas où
};

async function analyzeAndMoveDirectly(targetFolder: string) {
  const folderName = path.basename(targetFolder);
  const categoryId = folderToCategoryMap[folderName] || folderName.toLowerCase();
  
  // Find all videos for this category
  const categoryVideos = videoCourses.filter(v => v.categoryId === categoryId);
  if (categoryVideos.length === 0) {
    console.error(`Aucune vidéo trouvée pour la catégorie: ${categoryId}`);
    return;
  }
  
  console.log(`\n=== Analyse pour le dossier ${folderName} (Trouvé ${categoryVideos.length} vidéos correspondantes) ===`);
  
  // Prepare context string for prompt
  let videosContext = "Voici la liste des vidéos et leurs textes :\n\n";
  categoryVideos.forEach(v => {
    videosContext += `ID-VIDEO: ${v.id}\nTITRE: ${v.title}\nTEXTE: ${v.transcriptMarkdown?.substring(0, 500)}...\n\n`;
  });
  
  // Create mapping object
  const mappingResults: Record<string, string> = {};
  
  // Read all valid images
  const files = fs.readdirSync(targetFolder).filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));
  console.log(`Génération du mapping pour ${files.length} images...`);
  
  let successCount = 0;
  
  for (const file of files) {
    const filePath = path.join(targetFolder, file);
    const mimeType = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    try {
      const base64Image = fs.readFileSync(filePath).toString("base64");
      
      const prompt = `Voici un schéma du cours de médecine "${folderName}".
Regarde attentivement les légendes textuelles et le dessin du schéma.

${videosContext}

TA MISSION :
Indique à quelle "ID-VIDEO" ce schéma appartient. Le schéma doit illustrer le contenu textuel de cette vidéo.
Si tu penses qu'il correspond à la vidéo qui a l'ID "ecto-12", réponds JUSTE "ecto-12".
Réponds UNIQUEMENT avec l'ID de la vidéo exacte, sans aucun autre texte, ni point final. Si tu hésites, choisis l'ID qui te semble le plus logique chronologiquement ou sémantiquement.`;

      console.log(`Analyse de l'image : ${file}...`);
      const responseText = await callOpenRouterVision(base64Image, mimeType, prompt);
      const choiceID = responseText.trim().replace(/[^a-zA-Z0-9_-]/g, '');
      
      const validVideo = categoryVideos.find(v => v.id === choiceID);
      
      if (validVideo) {
        console.log(`   -> Associé à la vidéo: ${choiceID} ✅`);
        mappingResults[file] = choiceID;
        successCount++;
        
        // Move file physically into the sub-folder
        const destDir = path.join(targetFolder, choiceID);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.renameSync(filePath, path.join(destDir, file));
        
      } else {
        console.log(`   -> ⚠️ L'IA a répondu un ID invalide ou introuvable : "${responseText}" ("${choiceID}") pour l'image ${file}`);
        // On le laisse à la racine
        mappingResults[file] = "Uncertain";
      }
      
      // Delay to avoid rate limits
      await new Promise(r => setTimeout(r, 600));
      
    } catch (e: any) {
      console.error(`Erreur sur l'image ${file}: ${e.message}`);
    }
  }
  
  // Sauvegarde le fichier de mapping dans le dossier
  const mappingPath = path.join(targetFolder, `mapping_${folderName}.json`);
  fs.writeFileSync(mappingPath, JSON.stringify(mappingResults, null, 2));
  
  console.log(`\n-> Terminé ! ${successCount}/${files.length} images triées physiquement dans 51 dossiers.`);
  console.log(`-> Un fichier ${mappingPath} a également été généré pour l'application.`);
}

async function run() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: npx tsx scripts/vision_mapper_51.ts <TargetFolder>");
    process.exit(1);
  }

  const targetFolder = args[0];

  if (!OPENROUTER_API_KEY) {
    console.error("ERREUR: OPENROUTER_API_KEY non trouvée dans l'environnement !");
    process.exit(1);
  }

  try {
     await analyzeAndMoveDirectly(targetFolder);
  } catch (e) {
      console.error("Erreur fatale:", e);
  }
}

run();
