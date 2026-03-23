import * as fs from 'fs';
import * as path from 'path';
import { cleanTranscript } from '../src/lib/transcriptCleaner.ts'; // You'll need to run this with `npx tsx scripts/cleanTranscriptsCLI.ts`

const ARCHIVE_DIR = path.resolve(process.cwd(), '../VTT_Archives_Cloudflare');
const PUBLIC_VTT_DIR = path.resolve(process.cwd(), './public/vtt');

async function processDirectory(dir: string) {
    try {
        if (!fs.existsSync(dir)) {
            console.log(`Directory not found, skipping: ${dir}`);
            return;
        }
        
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            } else if (entry.isFile() && fullPath.endsWith('.vtt')) {
                let content = fs.readFileSync(fullPath, 'utf-8');

                let cleanedContent = cleanTranscript(content);

                // Additional targeted cleanup for 'oeil' variants that bypass the word boundary 
                // but we do this inside cleanTranscript already. We can add a fallback here.
                cleanedContent = cleanedContent.replace(/\boeuil\b/gi, 'œil')
                                               .replace(/\bOeuil\b/g, 'Œil');

                if (content !== cleanedContent) {
                    console.log(`Cleaned: ${fullPath}`);
                    fs.writeFileSync(fullPath, cleanedContent, 'utf-8');
                }
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }
}

async function main() {
    console.log(`Starting to clean VTT files...`);
    
    console.log(`=> Cleaning ${ARCHIVE_DIR}...`);
    await processDirectory(ARCHIVE_DIR);

    console.log(`=> Cleaning ${PUBLIC_VTT_DIR}...`);
    await processDirectory(PUBLIC_VTT_DIR);

    console.log('Finished cleaning transcripts.');
}

main();
