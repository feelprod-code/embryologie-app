import fs from 'fs';
import path from 'path';

function cleanCaption(text: string): string {
  let cleaned = text;
  const prefixesToRemove = [
    /^(?:Cette\s+|L'\s*|This\s+)?image\s+(?:montre|illustre|repr[ée]sente|d[ée]crit|sch[ée]matise|pr[ée]sente|devrait|est\s+un|est\s+une|introduit|souligne|likely depicts|describes|emphasizes|relates to|concludes)\s+(?:que\s+|qu'\s+|comment\s+)?/i,
    /^(?:Ce\s+|Le\s+)?sch[ée]ma\s+(?:montre|illustre|repr[ée]sente|d[ée]crit|sch[ée]matise|pr[ée]sente|devrait|est|introduit|souligne)\s+(?:que\s+|qu'\s+|comment\s+)?/i,
    /^L'image\s+est\s+plac[ée]e[^\.]*(?:car|puisque)\s+(?:le\s+sch[ée]ma\s+repr[ée]sente|elle\s+illustre|elle\s+semble\s+repr[ée]senter)\s+/i,
    /^L'image\s+est\s+plac[ée]e\s+(?:apr[èe]s\s+la\s+description\s+de\s+|apr[èe]s\s+la\s+phrase\s+qui\s+mentionne\s+|juste\s+apr[èe]s\s+)/i,
    /^Cette\s+section\s+d[ée]crit\s+/i
  ];

  for (const regex of prefixesToRemove) {
    cleaned = cleaned.replace(regex, '');
  }
  
  // Clean up any stray leading words if they were left over
  cleaned = cleaned.replace(/^(?:le|la|les|un|une|des)\s+/i, '');

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned;
}


function main() {
  const injectionsPath = path.join(process.cwd(), 'src', 'data', 'pdfSchemaInjections.json');
  const videoCoursesPath = path.join(process.cwd(), 'src', 'data', 'videoCourses.ts');

  if (!fs.existsSync(injectionsPath)) {
    console.error("No injections found.");
    process.exit(1);
  }

  const injectionsMap = JSON.parse(fs.readFileSync(injectionsPath, 'utf-8'));
  let videoCoursesContent = fs.readFileSync(videoCoursesPath, 'utf-8');
  
  let totalInjected = 0;
  let totalMissing = 0;

  for (const [videoId, injections] of Object.entries(injectionsMap)) {
    const injectionList = injections as Array<any>;
    if (!injectionList || injectionList.length === 0) continue;

    // Isolate the verbatim transcript for this specific video
    const regexSource = `(id:\\s*"${videoId}",[\\s\\S]*?transcriptMarkdown:\\s*\\\`)([\\s\\S]*?)(\\\`\\s*(?:,|\\}))`;
    const videoRegex = new RegExp(regexSource, "g");
    
    const match = videoRegex.exec(videoCoursesContent);
    if (!match) {
        console.log(`[${videoId}] Could not find transcript section in videoCourses.ts!`);
        continue;
    }

    let p1 = match[1];
    let transcriptText = match[2];
    let p3 = match[3];

    let transcriptChanged = false;
    let injectedCount = 0;

    // Process each injection
    for (const inj of injectionList) {
      const anchor = inj.after_text?.trim();
      let schemaTag = inj.schema_tag?.trim();
      const reasoning = inj.reasoning?.trim();

      if (!anchor || !schemaTag) continue;

      // Extract the image filename/path to uniquely identify it so we don't double inject
      const imagePathMatch = schemaTag.match(/\((.*?)\)/);
      const imagePath = imagePathMatch ? imagePathMatch[1] : '';

      // Check if this image was already injected in this transcript (to prevent duplicates)
      if (imagePath && transcriptText.includes(imagePath)) {
          console.log(`[${videoId}] ⏭️ Skipping already injected schema: ${imagePath}`);
          continue;
      }

      // Improve the schema tag to use the reasoning as the alt text (legend)
      if (reasoning && schemaTag.startsWith('![Schéma]')) {
          const cleanedAltText = cleanCaption(reasoning).replace(/"/g, "'");
          schemaTag = schemaTag.replace('![Schéma]', `![${cleanedAltText}]`);
      }

      // Use string matching instead of regex to avoid asterisk escaping issues
      if (!transcriptText.toLowerCase().includes(anchor.toLowerCase())) {
        console.warn(`[${videoId}] \u274c WARNING: Anchor text not found in transcript: "${anchor}"`);
        totalMissing++;
        
        // As a fallback, try just a shorter version of the anchor (last 20 chars)
        if (anchor.length > 20) {
           const shorterAnchor = anchor.slice(-20).trim();
           const shortIndex = transcriptText.toLowerCase().indexOf(shorterAnchor.toLowerCase());
           if (shortIndex !== -1) {
              console.log(`  --> Found with shorter anchor instead: "${shorterAnchor}"`);
              const actualMatch = transcriptText.slice(shortIndex, shortIndex + shorterAnchor.length);
              transcriptText = transcriptText.slice(0, shortIndex) + actualMatch + '\n\n' + schemaTag + '\n\n' + transcriptText.slice(shortIndex + shorterAnchor.length);
              injectedCount++;
              totalInjected++;
              transcriptChanged = true;
              continue;
           }
        }
      } else {
        // We found exactly the text
        const anchorIndex = transcriptText.toLowerCase().indexOf(anchor.toLowerCase());
        const actualMatch = transcriptText.slice(anchorIndex, anchorIndex + anchor.length);
        transcriptText = transcriptText.slice(0, anchorIndex) + actualMatch + '\n\n' + schemaTag + '\n\n' + transcriptText.slice(anchorIndex + anchor.length);
        injectedCount++;
        totalInjected++;
        transcriptChanged = true;
      }
    }

    if (transcriptChanged) {
      console.log(`[${videoId}] ✅ Injected ${injectedCount} schemas into verbatim transcript`);
      
      // We must only replace the specific transcript for this specific video ID.
      // Replacing by doing `videoCoursesContent.replace(videoRegex, ...)` is dangerous if regex matches globally.
      // Instead, we locate the exact substring we extracted and replace it.
      const fullMatchString = p1 + match[2] + p3;
      const replacedString = p1 + transcriptText + p3;
      videoCoursesContent = videoCoursesContent.replace(fullMatchString, replacedString);
    }
  }

  // Save changes
  fs.writeFileSync(videoCoursesPath, videoCoursesContent, 'utf-8');

  console.log(`\\n🎉 Done applying pdf schema injections! total injected: ${totalInjected}, total missing: ${totalMissing}`);
}

main();
