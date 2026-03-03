const fs = require('fs');

let content = fs.readFileSync('src/data/videoCourses.ts', 'utf8');

// 1. Remove all cloudflareId: "..." occurrences
content = content.replace(/,\s*cloudflareId:\s*"[^"]*"/g, '');
content = content.replace(/cloudflareId:\s*"[^"]*",\s*/g, '');

fs.writeFileSync('src/data/videoCourses.ts', content);
console.log("Removed all cloudflareId injections");
