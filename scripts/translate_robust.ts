import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import pLimit from 'p-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import source data
import { videoCourses } from '../src/data/videoCourses';
import { podcastsData } from '../src/data/podcasts';

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("Missing VITE_OPENROUTER_API_KEY or OPENROUTER_API_KEY in environment");
    process.exit(1);
}

const CACHE_FILE = path.join(__dirname, 'translation_cache.json');
let translationCache: Record<string, string> = {};

if (fs.existsSync(CACHE_FILE)) {
    try {
        translationCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    } catch (e) {
        console.error("Failed to parse cache", e);
    }
}

function saveCache() {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2));
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function translateText(text: string, targetLang: string, contextId: string = ""): Promise<string> {
    if (!text || text.trim().length === 0) return text;

    // Convert targetLang to more specific variants to help output quality
    let strictLang = targetLang;
    if (targetLang === 'English') strictLang = 'English (UK)';

    // Hash key for cache
    const cacheKey = `${targetLang}_${Buffer.from(text).toString('base64').substring(0, 50)}_${text.length}`;
    if (translationCache[cacheKey]) {
        console.log(`✓ Using cached translation for ${targetLang} [${contextId}]`);
        return translationCache[cacheKey];
    }

    const systemPrompt = `You are an expert, professional medical and osteopathic translator specializing in the work of biodynamic embryology. 
Translate the following French text into ${strictLang}. 
CRITICAL RULES:
1. Preserve ALL markdown formatting exactly as it is (like #, ##, **, >, timestamps like 00:15).
2. DO NOT output any introductions, explanations, or conversational text.
3. DO NOT wrap the output in markdown code blocks unless the original text was inside one.
4. Output ONLY the translated text itself.
5. Technical terms like "respiration primaire", "mouvement inhérent", "fluide" should be translated accurately to their established osteopathic equivalents in the target language.`;

    let retries = 3;

    while (retries > 0) {
        try {
            console.log(`> Requesting ${targetLang} translation for [${contextId}] (length: ${text.length})...`);

            const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                model: "google/gemini-2.5-flash", // Extremely fast & context scalable
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                temperature: 0.2
            }, {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost",
                    "X-Title": "Embryo App Offline Translator"
                },
                timeout: 300000 // 5 minutes timeout for massive transcripts
            });

            let translated = response.data.choices?.[0]?.message?.content?.trim() || "";

            // Strip LLM oversharing markdown fences if they pop up
            if (translated.startsWith('\`\`\`') && translated.endsWith('\`\`\`')) {
                const lines = translated.split('\n');
                lines.shift();
                lines.pop();
                translated = lines.join('\n').trim();
            }

            translationCache[cacheKey] = translated;
            saveCache();
            return translated;

        } catch (error: any) {
            retries--;
            console.error(`X API Error translating ${targetLang} [${contextId}]. Retries left: ${retries}`);
            if (error.response) {
                console.error("Data:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
            if (retries === 0) {
                console.error("!!! FAILED COMPLETELY. Using original text as fallback.");
                return text; // Fallback to original
            }
            await wait(5000); // Wait 5 seconds before retry
        }
    }

    return text;
}

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'it', name: 'Italian' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Simplified Chinese' },
    { code: 'ja', name: 'Japanese' }
];

async function processPodcasts() {
    console.log("\\n=== PROCESSING PODCASTS ===");

    // Initialize target data structures
    const targetData: Record<string, any[]> = {};
    for (const lang of LANGUAGES) {
        targetData[lang.code] = [];
    }

    // Set concurrency limit - e.g. run 2 parallel requests to OPenRouter at once
    const limit = pLimit(2);

    for (const p of podcastsData) {
        console.log(`\\n--- Podcast: ${p.title} ---`);

        // Push original to lists first
        for (const lang of LANGUAGES) {
            targetData[lang.code].push({ ...p });
        }

        // Translate for each language using limit
        const ops = LANGUAGES.map(lang => limit(async () => {
            const idx = targetData[lang.code].length - 1;
            const item = targetData[lang.code][idx];

            item.title = await translateText(p.title, lang.name, `PodcastTitle: ${p.title}`);
            item.description = await translateText(p.description, lang.name, `PodcastDesc: ${p.title}`);
            if (p.transcript) {
                item.transcript = await translateText(p.transcript, lang.name, `PodcastTranscript: ${p.title}`);
            }
        }));

        await Promise.all(ops);
    }

    // Save files
    for (const lang of LANGUAGES) {
        const filePath = path.resolve(__dirname, `../src/data/podcasts_${lang.code}.ts`);
        const fileContent = `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(targetData[lang.code], null, 4)};\n`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`Saved ${filePath}`);
    }
}

async function processVideos() {
    console.log("\\n=== PROCESSING VIDEOS ===");

    const targetData: Record<string, any[]> = {};
    for (const lang of LANGUAGES) {
        targetData[lang.code] = [];
    }

    const limit = pLimit(2);

    for (let i = 0; i < videoCourses.length; i++) {
        const v = videoCourses[i];
        console.log(`\\n-- - Video \${ i+ 1}/\${videoCourses.length}: \${v.title} ---`);

        // Push original 
        for (const lang of LANGUAGES) {
            targetData[lang.code].push({ ...v });
        }

        const ops = LANGUAGES.map(lang => limit(async () => {
            const idx = targetData[lang.code].length - 1;
            const item = targetData[lang.code][idx];

            item.title = await translateText(v.title, lang.name, `VideoTitle: \${v.title}`);
            if (v.shortSummary) {
                item.shortSummary = await translateText(v.shortSummary, lang.name, `VideoShort: \${v.title}`);
            }
            if (v.fullSummary) {
                item.fullSummary = await translateText(v.fullSummary, lang.name, `VideoFull: \${v.title}`);
            }
            if (v.transcriptMarkdown) {
                item.transcriptMarkdown = await translateText(v.transcriptMarkdown, lang.name, `VideoTranscript: \${v.title}`);
            }
        }));

        await Promise.all(ops);
    }

    // Save files
    for (const lang of LANGUAGES) {
        const filePath = path.resolve(__dirname, `../src/data/videoCourses_${lang.code}.ts`);
        const fileContent = `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(targetData[lang.code], null, 4)};\n`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`Saved ${filePath}`);
    }
}

async function main() {
    console.log("Starting secure robust translation phase...");
    await processPodcasts();
    await processVideos();
    console.log("\\n=== COMPLETED SUCCESSFULLY ===");
}

main().catch(err => {
    console.error("FATAL SCRIPT ERROR:", err);
    process.exit(1);
});
