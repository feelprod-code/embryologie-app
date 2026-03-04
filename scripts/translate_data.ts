import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// IMPORTANT: We need to use dynamic imports to load the data files, 
// OR we can just read them and parse them with regex. 
// BUT the files export pure arrays, so we can require them if we compile them first or use ts-node.
import { videoCourses } from '../src/data/videoCourses';
import { podcastsData } from '../src/data/podcasts';

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("Missing VITE_OPENROUTER_API_KEY in environment");
    process.exit(1);
}

async function translateText(text, targetLang) {
    if (!text || text.trim().length === 0) return text;

    if (targetLang === 'English') {
        targetLang = 'English (UK)'; // to be specific
    }

    const systemPrompt = `You are a professional medical translator. Translate the following French medical and embryology text into ${targetLang}. Preserve all markdown formatting exactly as it is (like #, ##, **, >). ONLY OUTPUT THE TRANSLATED TEXT AND ABSOLUTELY NOTHING ELSE. NO INTRODUCTIONS. NO EXPLANATIONS. NO CODE BLOCKS AROUND IT. Just the plain text.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Embryo App Translator",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            temperature: 0.3
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Error: ${err}`);
    }

    const data = await response.json();
    let translated = data.choices[0].message.content.trim();

    // Remove markdown code block if the LLM adds it
    if (translated.startsWith('```') && translated.endsWith('```')) {
        const lines = translated.split('\n');
        lines.shift();
        lines.pop();
        translated = lines.join('\n');
    }
    return translated;
}


async function processPodcasts() {
    console.log("Processing podcasts...");

    const enData = [];
    const esData = [];

    for (const p of podcastsData) {
        console.log(`Translating podcast: ${p.title}`);
        try {
            // EN
            const enTitle = await translateText(p.title, 'English');
            const enDesc = await translateText(p.description, 'English');
            let enTranscript = null;
            if (p.transcript) {
                enTranscript = await translateText(p.transcript, 'English');
            }

            enData.push({
                ...p,
                title: enTitle,
                description: enDesc,
                transcript: enTranscript || p.transcript
            });

            // ES
            const esTitle = await translateText(p.title, 'Spanish');
            const esDesc = await translateText(p.description, 'Spanish');
            let esTranscript = null;
            if (p.transcript) {
                esTranscript = await translateText(p.transcript, 'Spanish');
            }

            esData.push({
                ...p,
                title: esTitle,
                description: esDesc,
                transcript: esTranscript || p.transcript
            });

        } catch (e) {
            console.error(`Failed to translate podcast ${p.title}:`, e);
            // Fallback to original
            enData.push({ ...p });
            esData.push({ ...p });
        }
    }

    // Write EN
    const enFileStr = `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(enData, null, 4)};\n`;
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_en.ts'), enFileStr);

    // Write ES
    const esFileStr = `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(esData, null, 4)};\n`;
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_es.ts'), esFileStr);

    console.log("Podcasts translated!");
}


async function processVideos() {
    console.log("Processing videos...");

    const enData = [];
    const esData = [];

    for (let i = 0; i < videoCourses.length; i++) {
        const v = videoCourses[i];
        console.log(`Translating video ${i + 1}/${videoCourses.length}: ${v.title}`);

        try {
            // EN
            const enTitle = await translateText(v.title, 'English');
            const enTrans = await translateText(v.transcriptMarkdown, 'English');

            enData.push({
                ...v,
                title: enTitle,
                transcriptMarkdown: enTrans
            });

            // ES
            const esTitle = await translateText(v.title, 'Spanish');
            const esTrans = await translateText(v.transcriptMarkdown, 'Spanish');

            esData.push({
                ...v,
                title: esTitle,
                transcriptMarkdown: esTrans
            });

        } catch (e) {
            console.error(`Failed to translate video ${v.title}:`, e);
            // Fallback
            enData.push({ ...v });
            esData.push({ ...v });
        }
    }

    // Write EN
    const enFileStr = `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(enData, null, 4)};\n`;
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_en.ts'), enFileStr);

    // Write ES
    const esFileStr = `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(esData, null, 4)};\n`;
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_es.ts'), esFileStr);

    console.log("Videos translated!");
}


async function main() {
    await processPodcasts();
    await processVideos();
    console.log("All done!");
}

main().catch(console.error);

