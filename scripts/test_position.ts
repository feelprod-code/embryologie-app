import fs from 'fs';
const text = fs.readFileSync('src/data/videoCourses.ts', 'utf-8');
const match = /(id:\s*["']ecto-03["'],[\s\S]*?transcriptMarkdown:\s*`)([\s\S]*?)(`\s*(?:,|\}))/.exec(text);
if(match) {
   const md = match[2];
   const paragraphs = md.split(/\n{2,}/);
   console.log("Total paragraphs:", paragraphs.length);
   paragraphs.forEach((p, i) => {
      if(p.trim().startsWith('![')) {
          console.log("Image at index", i, p.trim().substring(0, 40));
      }
   });
}
