import fs from 'fs';
import path from 'path';

// Clean the caption just like we did for Oeil and Mesoderme
const cleanCaption = (text: string): string => {
  let cleaned = text;
  const prefixesToRemove = [
    /^(?:Cette\s+|L'\s*|This\s+)?image\s+(?:montre|illustre|repr[ée]sente|d[ée]crit|sch[ée]matise|pr[ée]sente|devrait|est\s+un|est\s+une|introduit|souligne|likely depicts|describes|emphasizes|relates to|concludes)\s+(?:que\s+|qu'\s+|comment\s+)?/i,
    /^(?:Ce\s+|Le\s+)?sch[ée]ma\s+(?:montre|illustre|repr[ée]sente|d[ée]crit|sch[ée]matise|pr[ée]sente|devrait|est|introduit|souligne)\s+(?:que\s+|qu'\s+|comment\s+)?/i,
    /^L'image\s+est\s+plac[ée]e[^\.]*(?:car|puisque)\s+(?:le\s+sch[ée]ma\s+repr[ée]sente|elle\s+illustre|elle\s+semble\s+repr[ée]senter)\s+/i,
    /^L'image\s+est\s+plac[ée]e\s+(?:apr[èe]s\s+la\s+description\s+de\s+|apr[èe]s\s+la\s+phrase\s+qui\s+mentionne\s+|juste\s+apr[èe]s\s+)/i,
    /^Cette\s+section\s+d[ée]crit\s+/i,
    /^Ici,?\s*on\s*(parle|voit|observe)[^,]*,\s*/i,
    /^(La mention de|Le terme|Le concept)[^,]*justifie[^,]*illustrant\s*/i,
    /^(Puisque[^,]+,\s+)?une image[^.]+convient ici\.\s*/i
  ];

  for (const regex of prefixesToRemove) {
    cleaned = cleaned.replace(regex, '');
  }
  
  // Clean up any stray leading words if they were left over
  cleaned = cleaned.replace(/^(?:le|la|les|un|une|des)\s+/i, '');

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned.trim();
};

const injectionsFile = path.resolve('src/data/schemaInjections.json');
const coursesFile = path.resolve('src/data/videoCourses.ts');

if (!fs.existsSync(injectionsFile)) {
    console.error(`Cannot find schemaInjections.json at ${injectionsFile}`);
    process.exit(1);
}

if (!fs.existsSync(coursesFile)) {
    console.error(`Cannot find videoCourses.ts at ${coursesFile}`);
    process.exit(1);
}

const injections = JSON.parse(fs.readFileSync(injectionsFile, 'utf-8'));
let coursesContent = fs.readFileSync(coursesFile, 'utf-8');

let replacementCount = 0;

// Iterate through injections looking for ecto- and endo-
for (const [chapterId, schemaList] of Object.entries(injections)) {
    if (!chapterId.startsWith('ecto-') && !chapterId.startsWith('endo-')) {
        continue;
    }

    const category = chapterId.startsWith('ecto-') ? 'ectoderme' : 'endoderme';

    for (const schema of (schemaList as any[])) {
        if (!schema.schema_src || !schema.reasoning) continue;

        const cleanedReasoning = cleanCaption(schema.reasoning);
        
        // Regex to find the image tag for this specific image
        // e.g. ![Alt text](/images/schemas/ectoderme/ecto-03/Ectoderme_1.png)
        // We want to replace the alt text with cleanedReasoning
        
        // Escape the image filename for regex
        const escapedFilename = schema.schema_src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const patternStr = `!\\[([^]+?)\\]\\(\\/images\\/schemas\\/${category}\\/${chapterId}\\/${escapedFilename}\\)`;
        const regex = new RegExp(patternStr, 'g');

        const newMatchLength = (coursesContent.match(regex) || []).length;
        
        if (newMatchLength > 0) {
            coursesContent = coursesContent.replace(regex, (match, currentAlt) => {
                console.log(`\nReplaced in ${chapterId} / ${schema.schema_src}:`);
                console.log(`  OLD: ${currentAlt}`);
                console.log(`  NEW: ${cleanedReasoning}`);
                replacementCount++;
                return `![${cleanedReasoning}](/images/schemas/${category}/${chapterId}/${schema.schema_src})`;
            });
        }
    }
}

if (replacementCount > 0) {
    fs.writeFileSync(coursesFile, coursesContent, 'utf-8');
    console.log(`\n=> Successfully updated ${replacementCount} legends for Ectoderme and Endoderme in videoCourses.ts!`);
} else {
    console.log(`\n=> No legends needed updating (or failed to match regex).`);
}
