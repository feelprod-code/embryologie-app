import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read cache
const cachePath = path.resolve(__dirname, 'translation_cache.json');
let cache: Record<string, string> = {};
if (fs.existsSync(cachePath)) {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
}

function getCachedTranslation(text: string | undefined, targetLang: string) {
    if (!text || text.trim() === '') return text;
    let strictLang = targetLang;
    if (targetLang === 'English') strictLang = 'English (UK)';
    const cacheKey = `${strictLang}_${Buffer.from(text).toString('base64').substring(0, 50)}_${text.length}`;
    if (cache[cacheKey]) {
        return cache[cacheKey];
    }
    return text; // Fallback to original
}

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'it', name: 'Italian' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Simplified Chinese' },
    { code: 'ja', name: 'Japanese' }
];

import { videoCourses } from '../src/data/videoCourses';
import { podcastsData } from '../src/data/podcasts';

function processVideos() {
    for (const lang of LANGUAGES) {
        const targetData = videoCourses.map(v => {
            return {
                ...v,
                title: getCachedTranslation(v.title, lang.name),
                transcriptMarkdown: getCachedTranslation(v.transcriptMarkdown, lang.name)
            };
        });

        const filePath = path.resolve(__dirname, `../src/data/videoCourses_${lang.code}.ts`);
        const fileContent = `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(targetData, null, 4)};\n`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`Generated ${filePath}`);
    }
}

function processPodcasts() {
    for (const lang of LANGUAGES) {
        const targetData = podcastsData.map(p => {
            return {
                ...p,
                title: getCachedTranslation(p.title, lang.name),
                description: getCachedTranslation(p.description, lang.name),
                transcript: p.transcript ? getCachedTranslation(p.transcript, lang.name) : undefined
            };
        });

        const filePath = path.resolve(__dirname, `../src/data/podcasts_${lang.code}.ts`);
        const fileContent = `import type { PodcastItem } from './podcasts';\n\nexport const podcastsData: PodcastItem[] = ${JSON.stringify(targetData, null, 4)};\n`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`Generated ${filePath}`);
    }
}

processVideos();
processPodcasts();
