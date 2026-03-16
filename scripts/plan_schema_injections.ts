import fs from 'fs';
import path from 'path';

// Read videoCourses dynamically because of ts-node import resolution issues with large TS files
const videoCoursesPath = path.join(process.cwd(), 'src', 'data', 'videoCourses.ts');
const videoCoursesContent = fs.readFileSync(videoCoursesPath, 'utf-8');

// Quick and dirty parser just to extract the content strings if normal import fails, or we can use ts-node
import { videoCourses } from '../src/data/videoCourses';
const schemaCaptionsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'schemaCaptions.json'), 'utf-8'));
const MODEL = "google/gemini-2.5-flash"; // Fast and large context

// Type for the schema captions input
type SchemaCaptionsMap = Record<string, { src: string; caption: string }[]>;

function getOpenRouterHeaders() {
  return {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Embryologie App",
    "Content-Type": "application/json"
  };
}

async function analyzeVideoTranscript(
  videoId: string,
  transcript: string,
  schemas: { src: string; caption: string }[]
): Promise<any> {
  const schemaListStr = schemas.map((s, i) => `[ID: ${i}] Fichier: ${s.src} | Légende/Sujet: ${s.caption}`).join('\n');

  const prompt = `Tu es un expert en embryologie et en traitement de texte Markdown.
Je vais te donner :
1. La retranscription complète d'une vidéo de cours (en texte Markdown).
2. Une liste de schémas (nom du fichier et légende) qui illustrent cette vidéo.

TA MISSION :
Pour chaque schéma, détermine l'emplacement EXACT dans le texte où ce schéma doit être affiché pour illustrer le propos du conférencier.
Le schéma doit être injecté juste APRÈS un paragraphe précis (qui se termine par un passage de texte spécifique).

CONTRAINTES CRITIQUES :
1. Le texte repère ("after_text") DOIT être une phrase ou fin de phrase EXACTE tirée du texte source. Ne modifie pas la ponctuation, n'invente pas de texte.
2. Essaie de répartir les schémas logiquement. Souvent les schémas apparaissent dans l'ordre chronologique de la retranscription.
3. Le texte repère doit faire entre 30 et 100 caractères pour être sûr qu'il est unique dans le texte.
4. Réponds UNIQUEMENT avec un objet JSON strict, sans bloc de code Markdown, sans aucun texte avant ou après.

FORMAT DE RÉPONSE JSON ATTENDU :
{
  "injections": [
    {
      "schema_src": "nom_du_fichier.jpeg",
      "after_text": "les 5 ou 6 derniers mots exacts du paragraphe précédant l'insertion voulue.",
      "reasoning": "une courte phrase expliquant pourquoi cette image va ici"
    }
  ]
}

TEXTE DE LA VIDÉO (ID: ${videoId}) :
\`\`\`markdown
${transcript}
\`\`\`

LISTE DES SCHÉMAS À PLACER :
${schemaListStr}

Génère ton JSON maintenant :`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: getOpenRouterHeaders(),
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      console.error(`Error from OpenRouter for ${videoId}: ${response.status} ${response.statusText}`);
      const errText = await response.text();
      console.error(errText);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    // In case the model still outputs markdown ticks despite json_mode:
    const cleanContent = content.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error(`Failed to analyze ${videoId}:`, error);
    return null;
  }
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("Please set OPENROUTER_API_KEY environment variable.");
    process.exit(1);
  }

  const captionsMap: SchemaCaptionsMap = schemaCaptionsData;
  const resultsData: Record<string, any> = {};
  const outputPath = path.join(process.cwd(), 'src', 'data', 'schemaInjections.json');
  
  // Load the French translations to get the actual transcript texts
  const translationsPath = path.join(process.cwd(), 'src', 'locales', 'fr.json');
  const translationsContent = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));

  console.log(`Starting semantic injection planning for ${Object.keys(captionsMap).length} videos...`);

  // Define videos to process (can un-comment slice for testing)
  // const videoIdsToProcess = Object.keys(captionsMap).slice(0, 3);
  const videoIdsToProcess = Object.keys(captionsMap);

  for (const videoId of videoIdsToProcess) {
    const schemas = captionsMap[videoId];
    if (!schemas || schemas.length === 0) continue;

    // Use the natively imported videoCourses array
    const course = videoCourses.find(v => v.id === videoId);
    if (!course) {
       console.warn(`No course object found for ${videoId}, skipping.`);
       continue;
    }
    
    // The transcript is stored in course.transcriptMarkdown
    const contentText = course.transcriptMarkdown || "";
    if (!contentText) {
        console.warn(`No transcript found for video ${videoId}, skipping.`);
        continue;
    }

    console.log(`[${videoId}] Analyzing ${schemas.length} schemas against transcript...`);
    const injectionPlan = await analyzeVideoTranscript(videoId, contentText, schemas);

    if (injectionPlan && injectionPlan.injections) {
      resultsData[videoId] = injectionPlan.injections;
      console.log(`[${videoId}] ✅ Successfully mapped ${injectionPlan.injections.length} schemas.`);
    } else {
      console.warn(`[${videoId}] ❌ Failed to generate or parse injection plan.`);
    }

    // Save progressively
    fs.writeFileSync(outputPath, JSON.stringify(resultsData, null, 2));

    // Wait a bit to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log(`\nDone! Injection plan saved to ${outputPath}`);
}

main().catch(console.error);
