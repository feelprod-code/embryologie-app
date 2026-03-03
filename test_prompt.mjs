import fs from 'fs';
import { videoCourses } from './src/data/videoCourses.ts';
import { podcasts } from './src/data/podcasts.ts';

let prompt = "CONTEXTE COMPLÉMENTAIRE (TRANSCRIPTIONS DU COURS):\n";
for (let c of videoCourses) {
    if (c.transcriptMarkdown) {
        prompt += `\n--- SOURCE: ${c.title} (${c.categoryId}) ---\n`;
        prompt += c.transcriptMarkdown;
    }
}
prompt += "\n\nCONTEXTE DES PODCASTS:\n";
for (let p of podcasts) {
    prompt += `\n--- SOURCE PODCAST: ${p.title} ---\n`;
    prompt += p.transcript;
}

const numTokensApprox = prompt.split(/\s+/).length * 1.33; 
// 1 token = ~0.75 words, so words * 1.33 is a good approximation

console.log(`Le prompt additionnel ferait environ ${Math.round(numTokensApprox)} tokens.`);
console.dir({ maxLength: prompt.length });
