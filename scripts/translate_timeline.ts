import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import pLimit from 'p-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { detailedStages, StageDataV2 } from '../src/data/embryologie';

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

    let strictLang = targetLang;
    if (targetLang === 'English') strictLang = 'English (UK)';

    const cacheKey = `${targetLang}_${Buffer.from(text).toString('base64').substring(0, 50)}_${text.length}`;
    if (translationCache[cacheKey]) {
        console.log(`✓ Using cached translation for ${targetLang} [${contextId}]`);
        return translationCache[cacheKey];
    }

    const systemPrompt = `You are an expert, professional medical and osteopathic translator specializing in the work of biodynamic embryology. 
Translate the following French text into ${strictLang}. 
CRITICAL RULES:
1. Preserve ALL markdown formatting exactly as it is.
2. DO NOT output any introductions, explanations, or conversational text.
3. DO NOT wrap the output in markdown code blocks unless the original text was inside one.
4. Output ONLY the translated text itself.
5. Technical terms like "respiration primaire", "mouvement inhérent", "fluide" should be translated accurately to their established osteopathic equivalents in the target language.`;

    let retries = 3;

    while (retries > 0) {
        try {
            console.log(`> Requesting ${targetLang} translation for [${contextId}]...`);
            const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                model: "google/gemini-2.5-flash",
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
                timeout: 60000
            });

            let translated = response.data.choices?.[0]?.message?.content?.trim() || "";

            if (translated.startsWith('\`\`\`') && translated.endsWith('\`\`\`')) {
                const lines = translated.split('\\n');
                lines.shift();
                lines.pop();
                translated = lines.join('\\n').trim();
            }

            translationCache[cacheKey] = translated;
            saveCache();
            return translated;
        } catch (error: any) {
            retries--;
            console.error(`X API Error translating ${targetLang} [${contextId}]. Retries left: ${retries}`);
            if (retries === 0) return text;
            await wait(2000);
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

async function processTimeline() {
    console.log("\\n=== PROCESSING TIMELINE ===");

    const targetData: Record<string, StageDataV2[]> = {};
    for (const lang of LANGUAGES) {
        targetData[lang.code] = [];
    }

    const limit = pLimit(3);

    for (let i = 0; i < detailedStages.length; i++) {
        const stage = detailedStages[i];
        console.log(`\\n--- Stage ${i + 1}/${detailedStages.length}: ${stage.id} ---`);

        // Push deep copies to avoid mutation sharing
        for (const lang of LANGUAGES) {
            targetData[lang.code].push(JSON.parse(JSON.stringify(stage)));
        }

        const ops = LANGUAGES.map(lang => limit(async () => {
            const item = targetData[lang.code][i];

            item.dayLabel = await translateText(stage.dayLabel, lang.name, `DayLabel: ${stage.id}`);
            item.period = await translateText(stage.period, lang.name, `Period: ${stage.id}`);
            item.title = await translateText(stage.title, lang.name, `Title: ${stage.id}`);
            item.generalDescription = await translateText(stage.generalDescription, lang.name, `GenDesc: ${stage.id}`);

            // Events
            for (let e = 0; e < stage.events.length; e++) {
                const event = stage.events[e];
                item.events[e].movement = await translateText(event.movement, lang.name, `EventMovement:${e} ${stage.id}`);
                item.events[e].description = await translateText(event.description, lang.name, `EventDesc:${e} ${stage.id}`);
            }

            // Practical Integration
            if (stage.practicalIntegration && item.practicalIntegration) {
                const pr = stage.practicalIntegration;
                item.practicalIntegration.fulcrums = await translateText(pr.fulcrums, lang.name, `PrFulcrums: ${stage.id}`);
                item.practicalIntegration.generalPalpation = await translateText(pr.generalPalpation, lang.name, `PrPalpation: ${stage.id}`);
                item.practicalIntegration.therapistPosture = await translateText(pr.therapistPosture, lang.name, `PrPosture: ${stage.id}`);
                item.practicalIntegration.psychosomatic = await translateText(pr.psychosomatic, lang.name, `PrPsycho: ${stage.id}`);

                if (pr.layerPerceptions && item.practicalIntegration.layerPerceptions) {
                    for (let j = 0; j < pr.layerPerceptions.length; j++) {
                        item.practicalIntegration.layerPerceptions[j].perception = await translateText(pr.layerPerceptions[j].perception, lang.name, `PrLayerPerc:${j} ${stage.id}`);
                    }
                }
            }

        }));

        await Promise.all(ops);
    }

    // Save files
    for (const lang of LANGUAGES) {
        const filePath = path.resolve(__dirname, `../src/data/embryologie_${lang.code}.ts`);
        const fileContent = `import type { StageDataV2 } from './embryologie';\n\nconst colors = \`\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\`;\n\nexport const detailedStages: StageDataV2[] = ${JSON.stringify(targetData[lang.code], null, 4)};\n`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`Saved ${filePath}`);
    }
}

async function main() {
    await processTimeline();
    console.log("\\n=== TIMELINE TRANSLATION COMPLETED SUCCESSFULLY ===");
}

main().catch(err => {
    console.error("FATAL SCRIPT ERROR:", err);
    process.exit(1);
});
