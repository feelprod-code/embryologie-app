import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import pLimit from 'p-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("Missing VITE_OPENROUTER_API_KEY or OPENROUTER_API_KEY in environment");
    process.exit(1);
}

// Settings
const BATCH_SIZE = 80;
const CONCURRENCY_LIMIT = 10;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'vtt');
const CACHE_FILE = path.join(process.cwd(), 'scripts', '.vtt_translation_cache.json');
let translationCache: Record<string, string[]> = {};

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

async function translateBatch(texts: string[], targetLang: string, contextId: string = ""): Promise<string[]> {
    if (!texts || texts.length === 0) return [];

    // Some texts might be purely empty/whitespace, we should preserve them but avoid sending empty strings if possible, 
    // actually sending them in JSON array is fine.

    let strictLang = targetLang;
    if (targetLang === 'English') strictLang = 'English (UK)';

    // Simple hash for cache key
    const textsStr = JSON.stringify(texts);
    const cacheKey = `${targetLang}_${Buffer.from(textsStr).toString('base64').substring(0, 50)}_${texts.length}`;

    if (translationCache[cacheKey] && translationCache[cacheKey].length === texts.length) {
        console.log(`✓ Using cached translation for ${targetLang} [${contextId}]`);
        return translationCache[cacheKey];
    }

    // Convert array to object map to force strict key pairing mapping
    const payloadMap: Record<string, string> = {};
    texts.forEach((txt, idx) => {
        payloadMap[`line_${idx}`] = txt;
    });

    const systemPrompt = `You are an expert, professional medical and osteopathic translator specializing in the work of biodynamic embryology.
Translate the values of the following JSON object from French to ${strictLang}.
CRITICAL RULES:
1. Output ONLY a valid JSON object.
2. The output object MUST have exactly the same keys as the input object (line_0, line_1, etc.) and you must translate every single value.
3. Preserve HTML tags like <b> or <i> or formatting exact spacing/newlines if present.
4. Technical terms like "respiration primaire", "mouvement inhérent", "fluide" should be translated accurately to their established osteopathic equivalents.
5. Do NOT include markdown code blocks like \`\`\`json, just output the raw JSON object.`;

    let retries = 3;

    while (retries > 0) {
        try {
            console.log(`> Requesting ${targetLang} translation for [${contextId}] (batch of ${texts.length})...`);
            const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                model: "google/gemini-2.5-flash",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: JSON.stringify(payloadMap) }
                ],
                temperature: 0.1
            }, {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost",
                    "X-Title": "Embryo App VTT Translator"
                },
                timeout: 120000
            });

            let translated = response.data.choices?.[0]?.message?.content?.trim() || "";

            if (translated.startsWith('\`\`\`')) {
                const lines = translated.split('\n');
                if (lines[0].includes('json')) lines.shift();
                if (lines[lines.length - 1].includes('\`\`\`')) lines.pop();
                translated = lines.join('\n').trim();
            }

            const parsed = JSON.parse(translated) as Record<string, string>;

            // Reconstruct array
            const translatedArray: string[] = [];
            for (let i = 0; i < texts.length; i++) {
                const key = `line_${i}`;
                if (parsed[key] === undefined) {
                    throw new Error(`Missing key ${key} in response`);
                }
                translatedArray.push(parsed[key]);
            }

            translationCache[cacheKey] = translatedArray;
            saveCache();
            return translatedArray;
        } catch (error: any) {
            retries--;
            console.error(`X API Error translating ${targetLang} [${contextId}]. Retries left: ${retries}`);
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
            if (retries === 0) return texts; // fallback to original
            await wait(2000);
        }
    }
    return texts;
}

const LANGUAGES = [
    { code: 'it', name: 'Italian' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Simplified Chinese' },
    { code: 'ja', name: 'Japanese' }
];

async function processVTTs() {
    console.log("\n=== PROCESSING VTT FILES ===");
    const vttDir = path.join(__dirname, '../public/vtt');
    const files = fs.readdirSync(vttDir).filter(f => f.endsWith('_fr.vtt'));

    const limit = pLimit(2); // Process 2 files/languages at a time to avoid rate limits

    for (const file of files) {
        const baseId = file.replace('_fr.vtt', '');
        const sourcePath = path.join(vttDir, file);
        const sourceContent = fs.readFileSync(sourcePath, 'utf8');

        // Parse VTT rudimentary
        const lines = sourceContent.split('\n');

        // We will collect blocks. A block is a cue.
        // It has an optional ID line, a timestamp line, and text lines.
        const blocks: { meta: string[], texts: string[] }[] = [];

        let currentBlock: { meta: string[], texts: string[] } | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trimEnd();

            if (line === 'WEBVTT' || line === '') {
                if (currentBlock && (currentBlock.texts.length > 0 || currentBlock.meta.length > 0)) {
                    blocks.push(currentBlock);
                }
                currentBlock = null;
                continue;
            }

            if (!currentBlock) {
                currentBlock = { meta: [], texts: [] };
            }

            if (line.includes('-->')) {
                // If we already had text, this means a new block without an empty line separating them
                if (currentBlock.texts.length > 0) {
                    blocks.push(currentBlock);
                    // The line before this should have been the ID. Let's fix that.
                    const lastTextLine = blocks[blocks.length - 1].texts.pop();
                    currentBlock = { meta: lastTextLine ? [lastTextLine] : [], texts: [] };
                }
                currentBlock.meta.push(line);
            } else if (currentBlock.meta.length === 0 && !line.includes('-->')) {
                // Probably an ID line
                currentBlock.meta.push(line);
            } else {
                // Text line
                currentBlock.texts.push(line);
            }
        }

        if (currentBlock && (currentBlock.texts.length > 0 || currentBlock.meta.length > 0)) {
            blocks.push(currentBlock);
        }

        const validBlocks = blocks.filter(b => b.texts.join('').trim().length > 0);
        const originalTexts = validBlocks.map(b => b.texts.join('\n'));

        const ops = LANGUAGES.map(lang => limit(async () => {
            const targetPath = path.join(vttDir, `${baseId}_${lang.code}.vtt`);
            if (fs.existsSync(targetPath)) {
                console.log(`Skipping ${targetPath}, already exists.`);
                return;
            }

            console.log(`Processing file: ${baseId} -> ${lang.code} (${originalTexts.length} cues)`);

            const batchSize = 40;
            const translatedTexts: string[] = [];

            for (let i = 0; i < originalTexts.length; i += batchSize) {
                const batch = originalTexts.slice(i, i + batchSize);
                const translatedBatch = await translateBatch(batch, lang.name, `${baseId} ${i}-${i + batchSize}`);
                translatedTexts.push(...translatedBatch);
            }

            if (translatedTexts.length !== originalTexts.length) {
                console.error(`Final mismatch for ${baseId} ${lang.code}, skipping file save.`);
                return;
            }

            // Reconstruct VTT
            let targetVtt = 'WEBVTT\n\n';
            let tIdx = 0;

            for (const b of blocks) {
                targetVtt += b.meta.join('\n') + '\n';
                if (b.texts.join('').trim().length === 0) {
                    targetVtt += b.texts.join('\n');
                } else {
                    targetVtt += translatedTexts[tIdx];
                    tIdx++;
                }
                targetVtt += '\n\n';
            }

            fs.writeFileSync(targetPath, targetVtt.trim() + '\n');
            console.log(`Saved ${targetPath}`);
        }));

        await Promise.all(ops);
    }
}

processVTTs().then(() => {
    console.log("VTT TRANSLATION COMPLETED");
}).catch(console.error);
