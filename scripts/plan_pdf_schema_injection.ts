import fs from 'fs';
import path from 'path';

// Quick and dirty parser just to extract the content strings if normal import fails, or we can use ts-node
import { videoCourses } from '../src/data/videoCourses';
const MODEL = "google/gemini-2.5-flash"; // Fast and large context

function getOpenRouterHeaders() {
  return {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Embryologie App",
    "Content-Type": "application/json"
  };
}

async function analyzePdfAgainstTranscript(
  videoId: string,
  transcript: string,
  pdfSummary: string
): Promise<any> {

  // Extract all the images from the pdfSummary
  const imageRegex = /!\[.*?\]\([^)]+\)/g;
  const images = pdfSummary.match(imageRegex);

  if (!images || images.length === 0) {
    return { injections: [] };
  }

  const prompt = `Tu es un expert en embryologie et en traitement de texte Markdown.
Je vais te donner :
1. La retranscription complète VERBATIM audio d'une vidéo de cours (en texte Markdown).
2. Un résumé de cette même vidéo tiré d'un PDF, qui contient des marqueurs d'images sous forme \`![Légende](/images/...)\`.

TA MISSION :
Pour chaque image trouvée dans le résumé PDF, détermine l'emplacement EXACT dans la retranscription VERBATIM (1) où cette image doit être insérée.
Les deux textes parlent de la même chose mais le résumé PDF est plus synthétique. Tu dois trouver le paragraphe dans la retranscription verbatim qui correspond le mieux au contexte de l'image.

CONTRAINTES CRITIQUES :
1. Le texte repère ("after_text") DOIT être une phrase ou fin de phrase EXACTE tirée de la retranscription verbatim. Ne modifie pas la ponctuation, n'invente pas de texte.
2. Le "after_text" est la chaîne de caractère exacte après laquelle l'image sera insérée.
3. Le texte repère doit faire entre 30 et 100 caractères pour être sûr qu'il est unique dans le texte.
4. Réponds UNIQUEMENT avec un objet JSON strict, sans bloc de code Markdown, sans aucun texte avant ou après.

FORMAT DE RÉPONSE JSON ATTENDU :
{
  "injections": [
    {
      "schema_tag": "![Légende exacte](/images/path.png)",
      "after_text": "les 5 ou 6 derniers mots exacts du paragraphe précédant l'insertion voulue.",
      "reasoning": "une courte phrase expliquant pourquoi cette image va ici"
    }
  ]
}

RETRANSCRIPTION VERBATIM DE LA VIDÉO (ID: ${videoId}) :
\`\`\`markdown
${transcript}
\`\`\`

RÉSUMÉ PDF CONTENANT LES IMAGES :
\`\`\`markdown
${pdfSummary}
\`\`\`

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

  const oeilParsed = JSON.parse(fs.readFileSync('scripts/pdfs_cours/oeil_parsed.json', 'utf-8'));
  const mesoParsed = JSON.parse(fs.readFileSync('scripts/pdfs_cours/meso_parsed.json', 'utf-8'));

  const resultsData: Record<string, any> = {};
  const outputPath = path.join(process.cwd(), 'src', 'data', 'pdfSchemaInjections.json');

  console.log('Starting PDF schema injection mapping...');

  // Build the Map
  const mapData: Record<string, string> = {};

  // Oeil
  const oeilMap: Record<string, string> = {
    "oeil-2": "2 - APPROCHE CONCEPTUELLE DU COUR",
    "oeil-3": "3 - ORIGINE V3 - cavité amniotique - LCR - zone B",
    "oeil-4": "4 - Mise en place de l’oeil",
    "oeil-5": "5 - Influence de la notochorde", 
    "oeil-7": "7- Formation de la placode optique",
    "oeil-8": "8- Origine de la rétine et du",
    "oeil-1": "1- ébauche optique à J21",
    "oeil-9": "9- Les différentes couches de l’oeil.",
    "oeil-10": "10- Rappel du mouvement développemental",
    "oeil-12": "12- L’impermanence",
    "oeil-13": "13- L’axe cranien-primitif",
    "oeil-14": "14- Les différentes couches de l’oeil (2)",
    "oeil-15": "15- Les Les crêtes neurales",
    "oeil-16": "16- Mémoires",
    "oeil-17": [
        "17- L’oeil et le mouvement de corticalisation", 
        "1- Expansion", 
        "2- Flexion céphalique", 
        "3- Flexion cervical", 
        "4- Flexion pontique", 
        "5- Télé-encéphalisation"
    ].map(k => oeilParsed[k]).join('\n\n'),
    "oeil-19": "19- Lignes de force électrique",
    "oeil-20": "20- L’oeil et le développement du crane",
    "oeil-21": "21- Le ligament lilequist’s",
    "oeil-23": "23- ANATOMIE",
    "oeil-24": "24- LE MONDE DE L’INTENTION",
    "oeil-26": "26- NEUROPHYSIO INTRO ZONE DE LA CHRISTAGALI",
    "oeil-27": "27- LES PHOTORECEPTEURS",
    "oeil-28": "28- LE CORPS GENOUILLE LATERAL",
    "oeil-31": "31- EPIPHYSE - HYPOPHYSE",
    "oeil-32": "32- INFLUENCES SUR L’OEIL"
  };

  for (const [vId, keyOrContent] of Object.entries(oeilMap)) {
      if (vId === "oeil-17") {
         mapData[vId] = keyOrContent;
      } else {
         mapData[vId] = oeilParsed[keyOrContent];
      }
  }

  // Meso
  const vuePost = mesoParsed["VUE POST"] || "";
  const mesoContentMap: Record<string, string> = {
    "meso-16": mesoParsed["3 SYSTEMES VEINEUX"] || "",
    "meso-21": vuePost.includes("LE FOIE") ? vuePost.split("LE FOIE")[0].trim() : "",
    "meso-24": "LE FOIE\n" + (vuePost.includes("LE FOIE") && vuePost.includes("LE SYSTEME REINAL") ? vuePost.split("LE FOIE")[1].split("LE SYSTEME REINAL")[0].trim() : ""),
    "meso-27": "LE SYSTEME REINAL\n" + (vuePost.includes("LE SYSTEME REINAL") && vuePost.includes("L’APPAREIL GENITAL  5eme semaine ?") ? vuePost.split("LE SYSTEME REINAL")[1].split("L’APPAREIL GENITAL  5eme semaine ?")[0].trim() : ""),
    "meso-31": "L’APPAREIL GENITAL  5eme semaine ?\n" + (vuePost.includes("L’APPAREIL GENITAL  5eme semaine ?") && vuePost.includes("L’APPAREIL GENITAL MASCULIN") ? vuePost.split("L’APPAREIL GENITAL  5eme semaine ?")[1].split("L’APPAREIL GENITAL MASCULIN")[0].trim() : ""),
    "meso-32": "L’APPAREIL GENITAL MASCULIN\n" + (vuePost.includes("L’APPAREIL GENITAL MASCULIN") && vuePost.includes("L’APPAREIL GENITAL FEMININ") ? vuePost.split("L’APPAREIL GENITAL MASCULIN")[1].split("L’APPAREIL GENITAL FEMININ")[0].trim() : ""),
    "meso-33": "L’APPAREIL GENITAL FEMININ\n" + (vuePost.includes("L’APPAREIL GENITAL FEMININ") ? vuePost.split("L’APPAREIL GENITAL FEMININ")[1].trim() : ""),
    "meso-34": mesoParsed["VOIE GENITALES INFERIEURES"] || "",
    "meso-35": mesoParsed["NEUROPORE POSTERIEUR et formation neurulation 2nd"] || "",
    "meso-38": mesoParsed["RESUME DE LA CINETIQUE EMBRYONNAIRE"] || "",
    "meso-41": mesoParsed["APPAREIL LOCOMOTEUR"] || "",
    "meso-42": mesoParsed["MEP Notochorde induit la MEP du TN qui se met en place petit a petit sur l’axe L,"] || "",
    "meso-43": mesoParsed["LES COTES J 35 a 45"] || "",
    "meso-44": mesoParsed["LES EXTREMITES"] || ""
  };

  for (const [vId, content] of Object.entries(mesoContentMap)) {
      if (content) {
         mapData[vId] = content;
      }
  }

  const videoIdsToProcess = Object.keys(mapData);

  for (const videoId of videoIdsToProcess) {
    const pdfSummary = mapData[videoId];
    if (!pdfSummary) continue;

    // Check if there are actually images in this PDF summary
    const imageRegex = /!\[.*?\]\([^)]+\)/g;
    const images = pdfSummary.match(imageRegex);
    if (!images || images.length === 0) {
      console.log(`[${videoId}] No images in PDF summary, skipping.`);
      continue;
    }

    const course = videoCourses.find(v => v.id === videoId);
    if (!course) {
       console.warn(`No course object found for ${videoId}, skipping.`);
       continue;
    }
    
    // The verbatim transcript is stored in course.transcriptMarkdown
    const contentText = course.transcriptMarkdown || "";
    if (!contentText) {
        console.warn(`No verbatim transcript found for video ${videoId}, skipping.`);
        continue;
    }

    console.log(`[${videoId}] Analyzing ${images.length} schemas against verbatim transcript...`);
    const injectionPlan = await analyzePdfAgainstTranscript(videoId, contentText, pdfSummary);

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

  console.log(`\nDone! PDF Injection plan saved to ${outputPath}`);
}

main().catch(console.error);
