const fs = require('fs');
const frContent = fs.readFileSync('videoCourses.ts', 'utf-8');
const jaContent = fs.readFileSync('videoCourses_ja.ts', 'utf-8');

const id = "ecto-08";
const frBlock = frContent.split(`id: "${id}"`)[1].split(`transcriptMarkdown:`)[0];
const jaBlock = jaContent.split(`"id": "${id}"`)[1].split(`"transcriptMarkdown":`)[0];

const frShort = frBlock.match(/shortSummary:\s*"([^"]*)"/)[1];
const jaShortMatch = jaBlock.match(/shortSummary["']?:\s*"([^"]*)"/);

console.log("frShort:", frShort.substring(0, 20));
console.log("jaShort:", jaShortMatch ? jaShortMatch[1].substring(0, 20) : null);
console.log("Equal?", frShort === (jaShortMatch ? jaShortMatch[1] : null));

