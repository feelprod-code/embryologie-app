import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Load the source arrays directly
import { videoCourses as frVideos } from '../src/data/videoCourses';
import { videoCourses as enVideos } from '../src/data/videoCourses_en';
import { videoCourses as esVideos } from '../src/data/videoCourses_es';
import { videoCourses as itVideos } from '../src/data/videoCourses_it';
import { videoCourses as deVideos } from '../src/data/videoCourses_de';
import { videoCourses as zhVideos } from '../src/data/videoCourses_zh';
import { videoCourses as jaVideos } from '../src/data/videoCourses_ja';

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
    console.error("Please provide GOOGLE_API_KEY or GEMINI_API_KEY environment variable.");
    process.exit(1);
}

const targetLangs = {
    'en': { name: 'English', data: enVideos },
    'es': { name: 'Spanish', data: esVideos },
    'it': { name: 'Italian', data: itVideos },
    'de': { name: 'German', data: deVideos },
    'zh': { name: 'Chinese (Simplified)', data: zhVideos },
    'ja': { name: 'Japanese', data: jaVideos }
};

async function translateBatch(items: any[], targetLangName: string) {
    if (!items || items.length === 0) return [];
    console.log(`Translating batch of ${items.length} items to ${targetLangName}...`);
    
    const itemsToTranslate = items.map(item => ({
        id: item.id,
        shortSummary: item.shortSummary || "",
        fullSummary: item.fullSummary || ""
    }));

    const prompt = `Translate the following JSON array of osteopathy and embryology course summaries from French to ${targetLangName}.
CRITICAL INSTRUCTION: Ensure the translation uses precise and accurate medical and osteopathic terminology, staying faithful to the original French text.
Preserve the exact formatting and JSON structure. Return ONLY a valid JSON array of objects with the exact same 'id' and the translated 'shortSummary' and 'fullSummary' fields. Do not include markdown code block syntax like \`\`\`json.

Input:
${JSON.stringify(itemsToTranslate, null, 2)}`;
    
    const postData = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 60000 // 60 seconds
    };

    return new Promise<any[]>((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.candidates && parsed.candidates.length > 0 && parsed.candidates[0].content && parsed.candidates[0].content.parts.length > 0) {
                        let result = parsed.candidates[0].content.parts[0].text.trim();
                        if (result.startsWith('```json')) result = result.substring(7);
                        if (result.startsWith('```')) result = result.substring(3);
                        if (result.endsWith('```')) result = result.substring(0, result.length - 3);
                        resolve(JSON.parse(result.trim()));
                    } else {
                        reject(new Error('Unexpected API response: ' + data.substring(0, 200)));
                    }
                } catch (e: any) {
                    reject(e);
                }
            });
        });
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function wait(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

async function run() {
    for (const [code, langContext] of Object.entries(targetLangs)) {
        console.log(`\n============== PROCESSING ${code.toUpperCase()} ==============`);
        
        const targetData = langContext.data;
        const tasks: any[] = [];
        const taskRefs: any[] = []; // Keep references to the actual objects
        
        for (const frVideo of frVideos) {
            const targetVideo = targetData.find(v => v.id === frVideo.id);
            if (!targetVideo) continue;
            
            // If the target summary matches the French summary exactly, it needs translation
            if (targetVideo.shortSummary === frVideo.shortSummary || targetVideo.fullSummary === frVideo.fullSummary) {
                // Ignore if both are completely empty
                if (!frVideo.shortSummary && !frVideo.fullSummary) continue;
                
                tasks.push({
                    id: frVideo.id,
                    shortSummary: frVideo.shortSummary,
                    fullSummary: frVideo.fullSummary
                });
                taskRefs.push(targetVideo);
            }
        }
        
        if (tasks.length > 0) {
            console.log(`Found ${tasks.length} untranslated summaries. Translating...`);
            
            const batchSize = 10;
            let modified = false;
            
            for (let i = 0; i < tasks.length; i += batchSize) {
                const batch = tasks.slice(i, i + batchSize);
                const batchRefs = taskRefs.slice(i, i + batchSize);
                
                let retries = 3;
                while (retries > 0) {
                    try {
                        const translatedItems = await translateBatch(batch, langContext.name);
                        
                        // Apply translations
                        for (let j = 0; j < translatedItems.length; j++) {
                            const translated = translatedItems[j];
                            const ref = batchRefs.find(r => r.id === translated.id);
                            if (ref) {
                                ref.shortSummary = translated.shortSummary;
                                ref.fullSummary = translated.fullSummary;
                                modified = true;
                            }
                        }
                        break;
                    } catch(e: any) {
                        retries--;
                        console.error("Batch error:", e.message, "Retries left:", retries);
                        if (retries === 0) throw e;
                        await wait(5000);
                    }
                }
                if (i + batchSize < tasks.length) await wait(2000);
            }
            
            if (modified) {
                const filePath = path.resolve(__dirname, `../src/data/videoCourses_${code}.ts`);
                const content = `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(targetData, null, 4)};\n`;
                fs.writeFileSync(filePath, content);
                console.log(`Saved translations for ${code}`);
            }
        } else {
            console.log(`All summaries already translated for ${code}.`);
        }
    }
}

run().catch(console.error);
