import * as fs from 'fs';
import * as path from 'path';
import { cleanTranscript } from '../src/lib/transcriptCleaner.ts'; // You'll need to run this with `npx tsx scripts/cleanTranscriptsCLI.ts`

const ARCHIVE_DIR = path.resolve(process.cwd(), '../VTT_Archives_Cloudflare');

async function processDirectory(dir: string) {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            } else if (entry.isFile() && fullPath.endsWith('.vtt')) {
                let content = fs.readFileSync(fullPath, 'utf-8');

                let cleanedContent = cleanTranscript(content);

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
    console.log(`Starting to clean VTT files in ${ARCHIVE_DIR}...`);
    if (!fs.existsSync(ARCHIVE_DIR)) {
        console.error(`Directory not found: ${ARCHIVE_DIR}`);
        process.exit(1);
    }

    await processDirectory(ARCHIVE_DIR);
    console.log('Finished cleaning transcripts.');
}

main();
