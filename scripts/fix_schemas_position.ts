import fs from 'fs';
import path from 'path';

// Load French Video courses dynamically
import { videoCourses as frCourses } from '../src/data/videoCourses';

const languages = ['en', 'es', 'it', 'de', 'zh', 'ja'];
const dataDir = path.join(process.cwd(), 'src', 'data');

function extractFrenchSchemas(markdown: string) {
    const paragraphs = markdown.split(/\n{2,}/);
    const textParagraphs: string[] = [];
    const schemas: { afterTextIndex: number; url: string; originalLine: string }[] = []; 
    
    for (const p of paragraphs) {
        const trimmed = p.trim();
        if (trimmed.startsWith('![')) {
            const match = trimmed.match(/\((.*?)\)/);
            const url = match ? match[1] : null;
            if (url) {
                schemas.push({
                    afterTextIndex: textParagraphs.length - 1, 
                    url: url,
                    originalLine: trimmed
                });
            }
        } else if (trimmed) {
            textParagraphs.push(trimmed);
        }
    }
    return schemas;
}

function reorderTranslatedSchemas(translatedMarkdown: string, frenchSchemas: any[]) {
    // translatedMarkdown has ACTUAL newlines now, because it's a parsed JSON string!
    const rawParagraphs = translatedMarkdown.split(/\n{2,}/);
    
    const translatedSchemasMap = new Map<string, string>();
    const textParagraphs: string[] = [];
    
    for (const p of rawParagraphs) {
        const trimmed = p.trim();
        if (trimmed.startsWith('![')) {
            const match = trimmed.match(/\((.*?)\)/);
            if (match) {
                translatedSchemasMap.set(match[1], trimmed);
            }
        } else if (trimmed) {
            textParagraphs.push(trimmed);
        }
    }
    
    const finalParagraphs: string[] = [];
    for (let i = 0; i < textParagraphs.length; i++) {
        finalParagraphs.push(textParagraphs[i]);
        
        const relevantSchemas = frenchSchemas.filter(s => s.afterTextIndex === i);
        for (const s of relevantSchemas) {
            if (translatedSchemasMap.has(s.url)) {
                finalParagraphs.push(translatedSchemasMap.get(s.url)!);
                translatedSchemasMap.delete(s.url);
            } else {
                finalParagraphs.push(s.originalLine);
            }
        }
    }
    
    const earlySchemas = frenchSchemas.filter(s => s.afterTextIndex < 0);
    for (const s of earlySchemas.reverse()) {
        if (translatedSchemasMap.has(s.url)) {
            finalParagraphs.unshift(translatedSchemasMap.get(s.url)!);
            translatedSchemasMap.delete(s.url);
        } else {
            finalParagraphs.unshift(s.originalLine);
        }
    }
    
    const lateSchemas = frenchSchemas.filter(s => s.afterTextIndex >= textParagraphs.length);
    for (const s of lateSchemas) {
        if (translatedSchemasMap.has(s.url)) {
            finalParagraphs.push(translatedSchemasMap.get(s.url)!);
            translatedSchemasMap.delete(s.url);
        } else {
            finalParagraphs.push(s.originalLine);
        }
    }
    
    for (const [url, schemaLine] of translatedSchemasMap.entries()) {
        finalParagraphs.push(schemaLine);
    }
    
    return finalParagraphs.join('\n\n');
}

async function main() {
    // 1. Build a map of the French parsed transcripts from the imported courses
    const frMarkdownMap = new Map<string, string>();
    for (const v of frCourses) {
        frMarkdownMap.set(v.id, v.transcriptMarkdown);
    }
    console.log(`Loaded ${frMarkdownMap.size} French parsed video transcripts.`);
    
    // 2. Process each translation
    for (const lang of languages) {
        const targetFile = path.join(dataDir, `videoCourses_${lang}.ts`);
        if (!fs.existsSync(targetFile)) continue;
        
        let targetContent = fs.readFileSync(targetFile, 'utf-8');
        let modifications = 0;
        
        // Extract the JSON array string from the TS file
        // e.g. "export const videoCourses: VideoCourse[] = [\n...];\n"
        const arrayMatch = targetContent.match(/export const videoCourses: (?:VideoCourse\[\]|any) = (\[[\s\S]*\]);\s*$/);
        
        if (!arrayMatch) {
            console.error(`Could not parse JSON array from ${targetFile}`);
            continue;
        }

        const jsonString = arrayMatch[1];
        let translatedData;
        try {
            translatedData = JSON.parse(jsonString);
        } catch (e) {
            console.error(`JSON Parse error in ${lang}:`, e);
            continue;
        }
        
        for (const v of translatedData) {
            const frMarkdown = frMarkdownMap.get(v.id);
            if (!frMarkdown) continue;
            
            const frenchSchemas = extractFrenchSchemas(frMarkdown);
            if (frenchSchemas.length === 0) continue;
            
            const fixedMarkdown = reorderTranslatedSchemas(v.transcriptMarkdown, frenchSchemas);
            
            if (fixedMarkdown !== v.transcriptMarkdown) {
                v.transcriptMarkdown = fixedMarkdown;
                modifications++;
            }
        }
        
        if (modifications > 0) {
            // Reconstruct the TS file
            const newContent = `import type { VideoCourse } from './videoCourses';\n\nexport const videoCourses: VideoCourse[] = ${JSON.stringify(translatedData, null, 4)};\n`;
            fs.writeFileSync(targetFile, newContent, 'utf-8');
            console.log(`✅ Saved ${modifications} fixed schema placements in videoCourses_${lang}.ts`);
        } else {
            console.log(`No schema placement fixes needed for videoCourses_${lang}.ts`);
        }
    }
}

main().catch(console.error);
