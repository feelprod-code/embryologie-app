import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// IMPORTANT: We need to use dynamic imports to load the data files, 
// OR we can just read them and parse them with regex. 
// BUT the files export pure arrays, so we can require them if we compile them first or use ts-node.
import { videoCourses } from '../src/data/videoCourses';
import { podcastsData } from '../src/data/podcasts';

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("Missing VITE_OPENROUTER_API_KEY or OPENROUTER_API_KEY in environment");
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
    const itData = [];
    const deData = [];
    const zhData = [];
    const jaData = [];

    for (const p of podcastsData) {
        console.log(`Translating podcast: ${p.title}`);
        try {
            // EN
            const enTitle = await translateText(p.title, 'English');
            const enDesc = await translateText(p.description, 'English');
            let enTranscript = p.transcript ? await translateText(p.transcript, 'English') : null;
            enData.push({ ...p, title: enTitle, description: enDesc, transcript: enTranscript || p.transcript });

            // ES
            const esTitle = await translateText(p.title, 'Spanish');
            const esDesc = await translateText(p.description, 'Spanish');
            let esTranscript = p.transcript ? await translateText(p.transcript, 'Spanish') : null;
            esData.push({ ...p, title: esTitle, description: esDesc, transcript: esTranscript || p.transcript });

            // IT
            const itTitle = await translateText(p.title, 'Italian');
            const itDesc = await translateText(p.description, 'Italian');
            let itTranscript = p.transcript ? await translateText(p.transcript, 'Italian') : null;
            itData.push({ ...p, title: itTitle, description: itDesc, transcript: itTranscript || p.transcript });

            // DE
            const deTitle = await translateText(p.title, 'German');
            const deDesc = await translateText(p.description, 'German');
            let deTranscript = p.transcript ? await translateText(p.transcript, 'German') : null;
            deData.push({ ...p, title: deTitle, description: deDesc, transcript: deTranscript || p.transcript });

            // ZH
            const zhTitle = await translateText(p.title, 'Simplified Chinese');
            const zhDesc = await translateText(p.description, 'Simplified Chinese');
            let zhTranscript = p.transcript ? await translateText(p.transcript, 'Simplified Chinese') : null;
            zhData.push({ ...p, title: zhTitle, description: zhDesc, transcript: zhTranscript || p.transcript });

            // JA
            const jaTitle = await translateText(p.title, 'Japanese');
            const jaDesc = await translateText(p.description, 'Japanese');
            let jaTranscript = p.transcript ? await translateText(p.transcript, 'Japanese') : null;
            jaData.push({ ...p, title: jaTitle, description: jaDesc, transcript: jaTranscript || p.transcript });

        } catch (e) {
            console.error(`Failed to translate podcast ${p.title}:`, e);
            // Fallback to original
            enData.push({ ...p }); esData.push({ ...p }); itData.push({ ...p }); deData.push({ ...p }); zhData.push({ ...p }); jaData.push({ ...p });
        }
    }

    // Write all
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_en.ts'), `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(enData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_es.ts'), `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(esData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_it.ts'), `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(itData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_de.ts'), `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(deData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_zh.ts'), `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(zhData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/podcasts_ja.ts'), `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(jaData, null, 4)};\n`);

    console.log("Podcasts translated!");
}


async function processVideos() {
    console.log("Processing videos...");

    const enData = [];
    const esData = [];
    const itData = [];
    const deData = [];
    const zhData = [];
    const jaData = [];

    for (let i = 0; i < videoCourses.length; i++) {
        const v = videoCourses[i];
        console.log(`Translating video ${i + 1}/${videoCourses.length}: ${v.title}`);

        try {
            // EN
            const enTitle = await translateText(v.title, 'English');
            const enTrans = await translateText(v.transcriptMarkdown, 'English');
            enData.push({ ...v, title: enTitle, transcriptMarkdown: enTrans });

            // ES
            const esTitle = await translateText(v.title, 'Spanish');
            const esTrans = await translateText(v.transcriptMarkdown, 'Spanish');
            esData.push({ ...v, title: esTitle, transcriptMarkdown: esTrans });

            // IT
            const itTitle = await translateText(v.title, 'Italian');
            const itTrans = await translateText(v.transcriptMarkdown, 'Italian');
            itData.push({ ...v, title: itTitle, transcriptMarkdown: itTrans });

            // DE
            const deTitle = await translateText(v.title, 'German');
            const deTrans = await translateText(v.transcriptMarkdown, 'German');
            deData.push({ ...v, title: deTitle, transcriptMarkdown: deTrans });

            // ZH
            const zhTitle = await translateText(v.title, 'Simplified Chinese');
            const zhTrans = await translateText(v.transcriptMarkdown, 'Simplified Chinese');
            zhData.push({ ...v, title: zhTitle, transcriptMarkdown: zhTrans });

            // JA
            const jaTitle = await translateText(v.title, 'Japanese');
            const jaTrans = await translateText(v.transcriptMarkdown, 'Japanese');
            jaData.push({ ...v, title: jaTitle, transcriptMarkdown: jaTrans });

        } catch (e) {
            console.error(`Failed to translate video ${v.title}:`, e);
            // Fallback
            enData.push({ ...v }); esData.push({ ...v }); itData.push({ ...v }); deData.push({ ...v }); zhData.push({ ...v }); jaData.push({ ...v });
        }
    }

    // Write all
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_en.ts'), `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(enData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_es.ts'), `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(esData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_it.ts'), `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(itData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_de.ts'), `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(deData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_zh.ts'), `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(zhData, null, 4)};\n`);
    fs.writeFileSync(path.resolve(__dirname, '../src/data/videoCourses_ja.ts'), `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(jaData, null, 4)};\n`);

    console.log("Videos translated!");
}


async function main() {
    await processPodcasts();
    await processVideos();
    console.log("All done!");
}

main().catch(console.error);

