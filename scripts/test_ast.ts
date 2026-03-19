import fs from 'fs';
const esContent = fs.readFileSync('src/data/videoCourses_es.ts', 'utf-8');
const match = /("id":\s*"ecto-04",[\s\S]*?"transcriptMarkdown":\s*")(.*?)(")/.exec(esContent);
if(match) {
    const md = match[2];
    console.log("ES transcript contains literal \\n\\n?", md.includes('\\n\\n'));
    console.log("ES transcript contains literal \\n?", md.includes('\\n'));
}

import { videoCourses as frCourses } from '../src/data/videoCourses';
const fr = frCourses.find(v => v.id === 'ecto-04');
if (fr) {
    const p = fr.transcriptMarkdown.split(/\n{2,}/);
    console.log("FR paragraphs:", p.length);
    p.forEach((paragraph, i) => {
        if(paragraph.trim().startsWith('![')) {
            console.log(`FR Schema at ${i}:`, paragraph.trim().substring(0, 50));
        }
    });

    const textP = [];
    const frSchemas = [];
    for(const pa of p) {
        if(pa.trim().startsWith('![')) {
             frSchemas.push({after: textP.length - 1});
        } else if(pa.trim()) {
             textP.push(pa.trim());
        }
    }
    console.log("FR schemas detailed:", frSchemas);
    console.log("Total text paragraphs in FR:", textP.length);
}
