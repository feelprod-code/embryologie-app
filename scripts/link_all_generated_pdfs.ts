import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const publicDir = path.join(appDir, 'public', 'pdfs');

const files = [
    'videoCourses.ts',
    'videoCourses_en.ts',
    'videoCourses_es.ts',
    'videoCourses_it.ts',
    'videoCourses_de.ts',
    'videoCourses_zh.ts',
    'videoCourses_ja.ts'
];

for (const f of files) {
    const filePath = path.join(appDir, 'src', 'data', f);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Get all pdf files in public/pdfs/
    for (const cat of ['ectoderme', 'mesoderme', 'endoderme', 'oeil']) {
        const catDir = path.join(publicDir, cat);
        if (!fs.existsSync(catDir)) continue;
        const pdfFiles = fs.readdirSync(catDir).filter(x => x.endsWith('.pdf'));

        for (const pdfName of pdfFiles) {
            const numMatch = pdfName.match(/^(\d+)/);
            if (!numMatch) continue;
            const num = parseInt(numMatch[1], 10);

            // Match course entry in TS
            const regex = new RegExp(`(id:\\s*['"]${cat.slice(0, 4)}-${num}['"][\\s\\S]*?)(isGlobalPdf:\\s*true|pdfUrl:\\s*['"][^'"]*['"]|duration:\\s*['"][^'"]*['"])`, 'g');
            
            const pdfUrl = `/pdfs/${cat}/${encodeURIComponent(pdfName)}`;
            // Replace or inject pdfUrl
            content = content.replace(
                new RegExp(`id:\\s*['"]${cat.slice(0, 4)}-${num}['"]([\\s\\S]*?)duration:\\s*['"]([^'"]*)['"]`, 'g'),
                (match, p1, p2) => {
                    if (match.includes('pdfUrl:')) {
                        return match.replace(/pdfUrl:\s*['"][^'"]*['"]/, `pdfUrl: '${pdfUrl}'`);
                    }
                    return `${match},\n    pdfUrl: '${pdfUrl}'`;
                }
            );
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated pdfUrls in ${f}`);
}

console.log("All videoCourses datasets updated with newly generated A4 PDFs!");
