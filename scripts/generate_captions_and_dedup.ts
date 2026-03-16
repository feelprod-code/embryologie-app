import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import dotenv from 'dotenv';
// @ts-ignore
import pLimit from 'p-limit'; // Using standard import, if it fails we can fallback to chunking

dotenv.config();

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'schemas');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'schemaCaptions.json');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Please set OPENROUTER_API_KEY in .env");
  process.exit(1);
}

const schemasData: Record<string, { src: string; caption: string }[]> = {};

function getFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function generateCaption(base64Image: string, mimeType: string): Promise<string> {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Génère une légende TRES COURTE (1 à 4 mots maximum) et ultra-précise décrivant ce schéma d'embryologie/anatomie. Donne JUSTE la légende, sans point final, sans aucun autre commentaire. Exemples: 'Tensegrité', 'Cellule Eucaryote', 'Tube neural', 'Tissu épithélial'."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${mimeType};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 20
            })
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            return "Schéma Anatomique";
        }

        const data = await response.json();
        const caption = data.choices[0]?.message?.content?.trim() || "Schéma Anatomique";
        return caption.replace(/^["']|["']$/g, '').replace(/\.$/, '');
    } catch (e) {
        console.error(`Fetch error:`, e);
        return "Schéma Anatomique";
    }
}

async function processImages() {
  const categories = fs.readdirSync(PUBLIC_DIR).filter(f => !f.startsWith('.'));
  
  let totalImages = 0;
  let deletedCount = 0;
  let tasks: (() => Promise<void>)[] = [];

  for (const category of categories) {
    const categoryPath = path.join(PUBLIC_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const videoIds = fs.readdirSync(categoryPath).filter(f => !f.startsWith('.'));
    
    for (const videoId of videoIds) {
      const videoPath = path.join(categoryPath, videoId);
      if (!fs.statSync(videoPath).isDirectory()) continue;

      const files = fs.readdirSync(videoPath).filter(f => f.match(/\.(png|jpe?g)$/i)).sort();
      
      const seenHashes = new Set<string>();
      schemasData[videoId] = [];

      for (const file of files) {
        const filePath = path.join(videoPath, file);
        const hash = getFileHash(filePath);

        if (seenHashes.has(hash)) {
          console.log(`🗑️ Doublon supprimé : ${filePath}`);
          fs.unlinkSync(filePath);
          deletedCount++;
        } else {
          seenHashes.add(hash);
          totalImages++;
          
          tasks.push(async () => {
             const base64 = fs.readFileSync(filePath, 'base64');
             const ext = path.extname(file).toLowerCase();
             const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
             
             console.log(`🤖 Génération de légende pour ${videoId}/${file}...`);
             const caption = await generateCaption(base64, mime);
             
             schemasData[videoId].push({
                 src: file,
                 caption: caption
             });
          });
        }
      }
    }
  }

  console.log(`Total d'images uniques à analyser : ${totalImages}. Lancement en parallèle...`);
  
  // Exécuter par lots de 15 requêtes simultanées pour éviter les rate limits, 
  // via un simple chunking pour éviter d'importer p-limit qui peut être ESModule only
  const chunkSize = 15;
  for (let i = 0; i < tasks.length; i += chunkSize) {
      const chunk = tasks.slice(i, i + chunkSize);
      await Promise.all(chunk.map(fn => fn()));
  }

  // Sort arrays by original filename again so it looks correct
  for (const videoId in schemasData) {
      schemasData[videoId].sort((a, b) => a.src.localeCompare(b.src, undefined, {numeric: true, sensitivity: 'base'}));
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(schemasData, null, 2), 'utf-8');
  console.log('✅ Traitement terminé ! Fichier écrit dans :', OUTPUT_FILE);
  console.log(`Doublons supprimés : ${deletedCount}`);
}

processImages().catch(console.error);
