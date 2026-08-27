import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '..', 'src', 'data');

const files = [
    'videoCourses.ts',
    'videoCourses_en.ts',
    'videoCourses_de.ts',
    'videoCourses_es.ts',
    'videoCourses_it.ts',
    'videoCourses_ja.ts',
    'videoCourses_zh.ts'
];

for (const f of files) {
    const filePath = path.join(dataDir, f);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Fix endo-34 title specifically if corrupted
    content = content.replace(/"title":\s*"#? ?34-? ?Synchronique Globale[\s\S]*?Duodenum[\s\S]*?"shortSummary"/, '"title": "34-Synchronique Globale - Rappel et Intro pour Duodenum",\n        "shortSummary"');
    content = content.replace(/"title":\s*"#? ?34-? ?Global Synchronicity[\s\S]*?Duodenum[\s\S]*?"shortSummary"/, '"title": "34-Global Synchronicity - Recap and Intro to Duodenum",\n        "shortSummary"');
    content = content.replace(/"title":\s*"#? ?34-? ?Globale Synchronizität[\s\S]*?Duodenum[\s\S]*?"shortSummary"/, '"title": "34-Globale Synchronizität - Rückblick und Intro für Duodenum",\n        "shortSummary"');

    // Check for any title spanning multiple lines
    content = content.replace(/"title":\s*"([^"\n]*)\n[\s\S]*?"/g, (match, firstLine) => {
        console.log(`[${f}] Cleaned multiline title: ${firstLine.slice(0, 50)}...`);
        return `"title": "${firstLine.trim()}"`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Sanitized ${f}`);
}
