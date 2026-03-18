import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/videoCourses.ts');
const fileContent = fs.readFileSync(filePath, 'utf-8');

const matches = Array.from(fileContent.matchAll(/!\[(.*?)\]\((.*?)\)/g));

console.log("ALL LEGENDS:");
const legends = matches.map(m => m[1]);
// keep only unique legends for brevity
[...new Set(legends)].forEach(l => console.log(l));
