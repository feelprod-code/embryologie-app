import fs from 'fs';
import path from 'path';

// Load the injection plan
const injectionsPath = path.join(process.cwd(), 'src', 'data', 'schemaInjections.json');
if (!fs.existsSync(injectionsPath)) {
  console.error("No injection plan found. Please run plan_schema_injections.ts first.");
  process.exit(1);
}
const injectionsData = JSON.parse(fs.readFileSync(injectionsPath, 'utf-8'));

// Load the video courses file to modify, read it as pure text to allow regex replacements
const videoCoursesPath = path.join(process.cwd(), 'src', 'data', 'videoCourses.ts');
let videoCoursesContent = fs.readFileSync(videoCoursesPath, 'utf-8');

console.log("Starting schema injection into videoCourses.ts...");

let totalInjected = 0;
const missingAnchors: { videoId: string, schema: string, anchor: string }[] = [];

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

for (const [videoId, injections] of Object.entries(injectionsData)) {
  if (!Array.isArray(injections) || injections.length === 0) continue;

  console.log(`\nProcessing Video ID: ${videoId} with ${injections.length} injections...`);

  // We scope our replacements to the specific video objects to avoid accidental 
  // matches across different videos if texts are similar.
  // Actually, we'll try global first, if it fails, we fall back to appending to the end of that specific video's content block.

  for (const injection of injections) {
    const { schema_src, after_text } = injection;
    if (!schema_src) continue;

    // Make sure we have the caption for the alt text
    const captionsDataPath = path.join(process.cwd(), 'src', 'data', 'schemaCaptions.json');
    const captionsData = JSON.parse(fs.readFileSync(captionsDataPath, 'utf-8'));
    const schemasForVideo = captionsData[videoId] || [];
    const schemaObj = schemasForVideo.find((s: any) => s.src === schema_src);
    const caption = schemaObj ? schemaObj.caption : "Schéma explicatif";

    let categoryPrefix = "ectoderme";
    if (videoId.startsWith('meso')) categoryPrefix = "mesoderme";
    if (videoId.startsWith('endo')) categoryPrefix = "endoderme";

    const publicImagePath = `/images/schemas/${categoryPrefix}/${videoId}/${schema_src}`;
    const injectionMarkdown = `\n\n![${caption}](${publicImagePath})\n\n`;

    // Prevent duplicate injections
    if (videoCoursesContent.includes(publicImagePath)) {
      console.log(`  ⏭️ Skipped ${schema_src} (already injected)`);
      continue;
    }

    let injected = false;

    if (after_text) {
      // Escape regex special chars in after_text
      const escapedText = escapeRegExp(after_text);
      
      // We look for the text. It might be at the end of a line or paragraph.
      const searchRegex = new RegExp(`(${escapedText})`, 'g');

      // Perform replacement
      if (searchRegex.test(videoCoursesContent)) {
        videoCoursesContent = videoCoursesContent.replace(searchRegex, `$1${injectionMarkdown}`);
        injected = true;
        totalInjected++;
        // Use a safe substring to prevent crashing on short texts
        const snippet = after_text.length > 30 ? after_text.substring(0, 30) : after_text;
        console.log(`  ✅ Injected ${schema_src} after "${snippet}..."`);
      }
    }

    if (!injected) {
      if (after_text) {
         const snippet = after_text.length > 30 ? after_text.substring(0, 30) : after_text;
         console.warn(`  ❌ Anchor not found for ${schema_src}: "${snippet}..."`);
         missingAnchors.push({ videoId, schema: schema_src, anchor: after_text });
      } else {
         console.warn(`  ⚠️ No anchor provided for ${schema_src}`);
      }
      
      // Fallback: Inject at the very end of the transcriptMarkdown string for that specific video
      // Find the start of this video's block
      const videoBlockRegex = new RegExp(`id:\\s*["']${videoId}["'][\\s\\S]*?transcriptMarkdown:\\s*\`([\\s\\S]*?)\`,`, 'g');
      
      videoCoursesContent = videoCoursesContent.replace(videoBlockRegex, (match, transcriptContent) => {
         // Append the markdown to the end of the transcript content
         injected = true;
         return match.replace(transcriptContent, transcriptContent + injectionMarkdown);
      });

      if (injected) {
        totalInjected++;
        console.log(`  🔄 Fallback: Appended ${schema_src} to the end of the video transcript.`);
      } else {
        console.error(`  🚨 CRITICAL: Could not find video block for ${videoId} to fallback inject ${schema_src}.`);
      }
    }
  }
}

fs.writeFileSync(videoCoursesPath, videoCoursesContent, 'utf-8');

console.log(`\n🎉 Injection complete. Total schemas injected: ${totalInjected}`);

if (missingAnchors.length > 0) {
  console.log(`\n⚠️ ${missingAnchors.length} schemas failed to inject due to missing anchors.`);
  console.log("Saving missing anomalies to missingAnchors.json for manual review...");
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'missingAnchors.json'), JSON.stringify(missingAnchors, null, 2));
}
