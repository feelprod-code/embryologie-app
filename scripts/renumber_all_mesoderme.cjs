const fs = require('fs');
const path = require('path');

const files = [
    'src/data/videoCourses.ts',
    'src/data/videoCourses_en.ts',
    'src/data/videoCourses_es.ts',
    'src/data/videoCourses_it.ts',
    'src/data/videoCourses_de.ts',
    'src/data/videoCourses_zh.ts',
    'src/data/videoCourses_ja.ts',
];

for (const relPath of files) {
    const fullPath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // We locate each mesoderme item
    // Matches { ... id: "meso-...", categoryId: "mesoderme", ... title: "...", ... }
    // A safe regex parser for course items:
    let mesoCount = 0;
    
    // We can match all id: "meso-XX" blocks
    content = content.replace(/\{\s*id:\s*['"]meso-\d+['"][\s\S]*?categoryId:\s*['"]mesoderme['"][\s\S]*?title:\s*['"]([^'"]+)['"]/g, (match, currentTitle) => {
        mesoCount++;
        const newNum = mesoCount;
        const newId = `meso-${String(newNum).padStart(2, '0')}`;
        
        // Clean title: remove old leading numbers e.g. "3-Introduction..." -> "2. Introduction..."
        // If it was the terminal master PDF
        if (match.includes('isGlobalPdf') || currentTitle.includes('Recueil') || currentTitle.includes('Support')) {
            const cleanTitle = `${newNum}. Support Intégral — Recueil PDF Global (01 à ${newNum - 1})`;
            let updated = match.replace(/id:\s*['"]meso-\d+['"]/, `id: "${newId}"`);
            updated = updated.replace(/title:\s*['"][^'"]+['"]/, `title: "${cleanTitle}"`);
            return updated;
        }

        let cleanTitleBody = currentTitle.replace(/^\d+[.\-\s_:]*/, '').trim();
        cleanTitleBody = cleanTitleBody.replace(/^_/, '').trim();
        const newTitle = `${newNum}. ${cleanTitleBody}`;

        let updated = match.replace(/id:\s*['"]meso-\d+['"]/, `id: "${newId}"`);
        updated = updated.replace(/title:\s*['"][^'"]+['"]/, `title: "${newTitle}"`);
        return updated;
    });

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Renumbered ${mesoCount} mesoderme courses in ${relPath}`);
}
