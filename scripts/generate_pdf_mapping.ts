import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const publicDir = path.join(appDir, 'public', 'pdfs');

const mapping: Record<string, string> = {
    'ecto-53': '/pdfs/cours_complets/L-Ectoderme-Recueil-Integral.pdf',
    'meso-48': '/pdfs/cours_complets/Le-Mesoderme-Recueil-Integral.pdf',
    'endo-42': '/pdfs/cours_complets/L-Endoderme-Recueil-Integral.pdf',
    'oeil-33': '/pdfs/cours_complets/L-Oeil-Recueil-Integral.pdf'
};

for (const cat of ['ectoderme', 'mesoderme', 'endoderme', 'oeil']) {
    const catDir = path.join(publicDir, cat);
    if (!fs.existsSync(catDir)) continue;

    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.pdf'));
    for (const f of files) {
        const numMatch = f.match(/^(\d+)/);
        if (!numMatch) continue;
        const num = parseInt(numMatch[1], 10);
        const prefix = cat.slice(0, 4);
        const courseId = `${prefix}-${num}`;
        mapping[courseId] = `/pdfs/${cat}/${encodeURIComponent(f)}`;
    }
}

const outPath = path.join(appDir, 'src', 'data', 'pdfFileMapping.json');
fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2), 'utf8');
console.log(`Successfully mapped ${Object.keys(mapping).length} course PDFs to src/data/pdfFileMapping.json!`);
