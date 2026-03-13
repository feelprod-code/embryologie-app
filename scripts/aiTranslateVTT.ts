import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenAI } from '@google/genai';
import { parseVTT, stringifyVTT, VTTBlock } from './vttParser.ts'; // assuming you install `npm install openai` and run via tsx
import * as dotenv from 'dotenv';

// Load environment variables (from Cerveau_Ecosysteme or similar)
const envConfig = dotenv.config({ path: path.resolve(process.cwd(), '../Cerveau_Ecosysteme/.env') });

// Priority to the .env file over the dirty mac shell environment
const finalApiKey = (envConfig.parsed && envConfig.parsed.GEMINI_API_KEY)
    ? envConfig.parsed.GEMINI_API_KEY
    : process.env.GEMINI_API_KEY || "dummy";

const ai = new GoogleGenAI({ apiKey: finalApiKey });


// Delay utility for rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateTextBlocks(texts: string[], targetLang: string): Promise<string[]> {
    const systemPrompt = `Tu es un traducteur expert mondial en ostéopathie biodynamique, embryologie, et médecine. 
Ta mission est de traduire ces blocs de sous-titres du français vers le ${targetLang}.
C'est un cours de haut niveau. Utilise les termes académiques et médicaux exacts (ex: viscérocrâne, mécanisme crânio-sacré, ligne médiane, fulcrum, etc.).
Garde le ton pédagogique but très clinique.
Ne modifie surtout pas le nombre d'éléments dans le tableau JSON. Chaque index du tableau traduit doit correspondre à l'index d'origine.
Réponds UNIQUEMENT avec du JSON valide au format: { "translations": ["trad1", "trad2", ...] } sans aucun markdown ni texte avant ou après.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Lightning fast, free tier available
            contents: JSON.stringify(texts),
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.1,
                responseMimeType: "application/json",
            }
        });

        const resultString = response.text || '{"translations": []}';

        // Fallback parsing just in case
        let parsed;
        try {
            parsed = JSON.parse(resultString.replace(/^```json/, '').replace(/```$/, '').trim());
        } catch (e) {
            console.error("Failed to parse JSON directly, returning original texts.");
            return texts;
        }

        if (Array.isArray(parsed)) return parsed;
        if (parsed.translations && Array.isArray(parsed.translations)) return parsed.translations;

        return Object.values(parsed) as string[];

    } catch (error) {
        console.error("Erreur lors de la traduction :", error);
        throw error;
    }
}

async function translateVTTFile(sourcePath: string, targetPath: string, targetLang: string = "japonais") {
    console.log(`Lecture de ${sourcePath}...`);
    const content = fs.readFileSync(sourcePath, 'utf8');
    const blocks = parseVTT(content);

    console.log(`${blocks.length} blocs de sous-titres trouvés.`);

    // To avoid hitting API limits and context overflow, we chunk the blocks.
    // 30 blocks at a time is usually safe for maintaining context while keeping the JSON short.
    const CHUNK_SIZE = 30;
    const translatedBlocks: VTTBlock[] = [];

    for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
        const chunk = blocks.slice(i, i + CHUNK_SIZE);
        const textsToTranslate = chunk.map(b => b.text);

        process.stdout.write(`Traduction des blocs ${i + 1} à ${Math.min(i + CHUNK_SIZE, blocks.length)} vers ${targetLang}... `);

        try {
            const translatedTexts = await translateTextBlocks(textsToTranslate, targetLang);

            if (translatedTexts.length !== chunk.length) {
                console.warn(`\n⚠️ Attention: Mismatch de longueur ! Attendu ${chunk.length}, reçu ${translatedTexts.length}.`);
                // Fallback: keep original text softly if things break
                chunk.forEach((b, idx) => {
                    translatedBlocks.push({ ...b, text: translatedTexts[idx] || b.text });
                });
            } else {
                chunk.forEach((b, idx) => {
                    translatedBlocks.push({ ...b, text: translatedTexts[idx] });
                });
            }

            console.log("✅ Fait.");
            // Small pause to respect rate limits
            await delay(1000);

        } catch (e) {
            console.error("\n❌ Échec sur ce chunk. On garde le texte original pour ce segment.");
            chunk.forEach(b => translatedBlocks.push(b));
        }
    }

    const outputVtt = stringifyVTT(translatedBlocks);
    fs.writeFileSync(targetPath, outputVtt, 'utf8');
    console.log(`Fichier traduit sauvegardé dans : ${targetPath}`);
}

// === CLI EXECUTION ===
async function main() {
    const dir = path.resolve(process.cwd(), './public/vtt');

    if (!finalApiKey) {
        console.error("ERREUR: GEMINI_API_KEY introuvable dans l'environnement ni dans ../Cerveau_Ecosysteme/.env");
        process.exit(1);
    }

    // Languages to translate to
    const targetLanguages = [
        { suffix: '_en.vtt', name: "anglais" },
        { suffix: '_es.vtt', name: "espagnol" },
        { suffix: '_de.vtt', name: "allemand" },
        { suffix: '_it.vtt', name: "italien" },
        { suffix: '_ja.vtt', name: "japonais" },
        { suffix: '_zh.vtt', name: "chinois mandarin" },
    ];

    if (!fs.existsSync(dir)) {
        console.error(`Le dossier ${dir} n'existe pas.`);
        process.exit(1);
    }

    const files = fs.readdirSync(dir);
    const frFiles = files.filter(f => f.endsWith('_fr.vtt'));

    if (frFiles.length === 0) {
        console.error("Aucun fichier _fr.vtt trouvé.");
        process.exit(1);
    }

    console.log(`\n🚀 Lancement de la traduction IA pour ${frFiles.length} fichiers source...`);

    for (const file of frFiles) {
        const sourcePath = path.join(dir, file);
        const baseHash = file.replace('_fr.vtt', '');

        for (const lang of targetLanguages) {
            const targetPath = path.join(dir, `${baseHash}${lang.suffix}`);

            console.log(`\n⏳ Traitement de : ${file}`);
            console.log(`🎯 Cible  : ${path.basename(targetPath)} (Langue: ${lang.name})`);

            try {
                await translateVTTFile(sourcePath, targetPath, lang.name);
            } catch (err) {
                console.error(`❌ Erreur fatale sur ${file} en ${lang.name}:`, err);
            }
        }
    }

    console.log("\n✅ Traduction de masse terminée !");
}

main();
