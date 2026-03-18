import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/videoCourses.ts');
const fileContent = fs.readFileSync(filePath, 'utf-8');

const matches = Array.from(fileContent.matchAll(/!\[(.*?)\]\((.*?)\)/g));

const keywords = ['image', 'représent', 'illustr', 'montr', 'schéma', 'semble'];

console.log("Legends to review:");
matches.forEach(match => {
    const legend = match[1];
    const lower = legend.toLowerCase();
    
    if (keywords.some(k => lower.includes(k))) {
        console.log(`- ${legend}`);
    }
});
